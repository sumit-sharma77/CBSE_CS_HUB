package com.cbsecshub.api.test.service;

import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.content.repository.QuestionRepository;
import com.cbsecshub.api.leaderboard.service.LeaderboardService;
import com.cbsecshub.api.test.dto.*;
import com.cbsecshub.api.test.entity.TestAttempt;
import com.cbsecshub.api.test.entity.TestSession;
import com.cbsecshub.api.test.repository.TestAttemptRepository;
import com.cbsecshub.api.test.repository.TestSessionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TestService {

    private final TestSessionRepository sessionRepository;
    private final TestAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final QuestionSamplerService sampler;
    private final ScoringService scoringService;
    private final BadgeAndProgressService badgeService;
    private final LeaderboardService leaderboardService;
    private final ObjectMapper objectMapper;

    private static final Map<String, int[]> MODE_CONFIG = Map.of(
        "QUICK",    new int[]{10, 600},
        "STANDARD", new int[]{25, 1800},
        "FULL",     new int[]{50, 3600}
    );

    @Transactional
    public Map<String, Object> createSession(UUID userId, CreateTestSessionRequest req) {
        String modeUpper = req.mode().toUpperCase();
        int[] config = MODE_CONFIG.get(modeUpper);
        if (config == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid test mode: " + req.mode());
        }
        int questionCount    = config[0];
        int timeLimitSeconds = config[1];

        List<Question> questions = sampler.sample(req.topicIds(), questionCount);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Not enough questions available for selected topics");
        }

        List<Long> questionIds = questions.stream().map(Question::getId).collect(Collectors.toList());
        TestSession session = TestSession.builder()
            .userId(userId)
            .topicIdsJson(toJson(req.topicIds()))
            .questionIdsJson(toJson(questionIds))
            .mode(TestSession.Mode.valueOf(modeUpper))
            .questionCount(questionCount)
            .timeLimitSeconds(timeLimitSeconds)
            .startedAt(Instant.now())
            .status(TestSession.Status.IN_PROGRESS)
            .build();
        session = sessionRepository.save(session);

        return Map.of(
            "sessionId",         session.getId(),
            "questionCount",     questionCount,
            "timeLimitSeconds",  timeLimitSeconds,
            "startedAt",         session.getStartedAt(),
            "questionIds",       questionIds
        );
    }

    public Map<String, Object> getSession(UUID userId, UUID sessionId) {
        TestSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Instant now = Instant.now();
        long elapsedSeconds = ChronoUnit.SECONDS.between(session.getStartedAt(), now);
        long remainingSeconds = session.getTimeLimitSeconds() - elapsedSeconds;

        if (remainingSeconds <= 0 && session.getStatus() == TestSession.Status.IN_PROGRESS) {
            session.setStatus(TestSession.Status.EXPIRED);
            session.setSubmittedAt(now);
            sessionRepository.save(session);
        }

        List<Long> questionIds = fromJson(session.getQuestionIdsJson(), new TypeReference<>() {});

        return Map.of(
            "sessionId",        session.getId(),
            "status",           session.getStatus(),
            "remainingSeconds", Math.max(remainingSeconds, 0),
            "questionIds",      questionIds,
            "answers",          session.getAnswersJson() != null
                ? fromJson(session.getAnswersJson(), new TypeReference<Map<String, String>>() {})
                : Map.of()
        );
    }

    @Transactional
    public TestResultDTO submitTest(UUID userId, UUID sessionId, SubmitTestRequest req) {
        // Idempotency guard
        if (attemptRepository.existsBySessionId(sessionId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Test session already submitted");
        }

        TestSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (session.getStatus() == TestSession.Status.SUBMITTED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already submitted");
        }

        Instant now = Instant.now();
        int timeTaken = (int) ChronoUnit.SECONDS.between(session.getStartedAt(), now);

        // Load questions in the original order
        List<Long> questionIds = fromJson(session.getQuestionIdsJson(), new TypeReference<>() {});
        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> questionMap = questions.stream()
            .collect(Collectors.toMap(Question::getId, q -> q));
        List<Question> orderedQuestions = questionIds.stream()
            .map(questionMap::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        Map<String, String> answers = req.answers() != null ? req.answers() : Map.of();

        // Score
        ScoringService.ScoreResult score = scoringService.score(orderedQuestions, answers);

        // Percentile
        BigDecimal percentile = calculatePercentile(session, score.rawScore());

        // Save attempt
        TestAttempt attempt = TestAttempt.builder()
            .userId(userId)
            .sessionId(sessionId)
            .topicIdsJson(session.getTopicIdsJson())
            .mode(session.getMode().name())
            .questionCount(score.correctCount() + score.incorrectCount() + score.skippedCount())
            .correctCount(score.correctCount())
            .incorrectCount(score.incorrectCount())
            .skippedCount(score.skippedCount())
            .rawScore(score.rawScore())
            .maxScore(score.maxScore())
            .weightedScore(score.weightedScore())
            .percentileRank(percentile)
            .timeTakenSeconds(timeTaken)
            .build();
        attempt = attemptRepository.save(attempt);

        // Update session
        session.setStatus(TestSession.Status.SUBMITTED);
        session.setSubmittedAt(now);
        session.setAnswersJson(toJson(answers));
        sessionRepository.save(session);

        // Award badges + update leaderboard (async-friendly, errors don't fail submission)
        try {
            badgeService.processAttempt(userId, attempt);
            leaderboardService.recordAttempt(userId, session.getTopicIdsJson(), score.rawScore());
        } catch (Exception e) {
            log.warn("Post-submit processing error for userId={}: {}", userId, e.getMessage());
        }

        // Build result with per-question details
        List<QuestionResultDTO> questionResults = buildQuestionResults(orderedQuestions, answers);

        return new TestResultDTO(
            sessionId,
            session.getMode().name(),
            orderedQuestions.size(),
            score.correctCount(),
            score.incorrectCount(),
            score.skippedCount(),
            score.rawScore(),
            score.maxScore(),
            score.weightedScore(),
            percentile,
            timeTaken,
            attempt.getCreatedAt(),
            questionResults
        );
    }

    public Page<TestAttempt> getHistory(UUID userId, Pageable pageable) {
        return attemptRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public TestResultDTO getResult(UUID userId, UUID sessionId) {
        TestAttempt attempt = attemptRepository.findBySessionId(sessionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Result not found"));
        TestSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        List<Long> questionIds = fromJson(session.getQuestionIdsJson(), new TypeReference<>() {});
        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> qMap = questions.stream().collect(Collectors.toMap(Question::getId, q -> q));
        List<Question> ordered = questionIds.stream().map(qMap::get).filter(Objects::nonNull).collect(Collectors.toList());
        Map<String, String> answers = session.getAnswersJson() != null
            ? fromJson(session.getAnswersJson(), new TypeReference<>() {}) : Map.of();
        return new TestResultDTO(
            sessionId, session.getMode().name(), ordered.size(),
            attempt.getCorrectCount(), attempt.getIncorrectCount(), attempt.getSkippedCount(),
            attempt.getRawScore(), attempt.getMaxScore(), attempt.getWeightedScore(),
            attempt.getPercentileRank(), attempt.getTimeTakenSeconds(), attempt.getCreatedAt(),
            buildQuestionResults(ordered, answers)
        );
    }

    private BigDecimal calculatePercentile(TestSession session, int rawScore) {
        try {
            Instant since = Instant.now().minus(30, ChronoUnit.DAYS);
            String topicIds = session.getTopicIdsJson();
            String mode = session.getMode().name();
            long countBelow = attemptRepository.countScoresBelow(topicIds, mode, since, rawScore);
            long total = attemptRepository.countTotal(topicIds, mode, since);
            if (total == 0) return BigDecimal.valueOf(100);
            double percentile = (double) countBelow / total * 100.0;
            return BigDecimal.valueOf(percentile).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            log.warn("Percentile calculation failed: {}", e.getMessage());
            return null;
        }
    }

    private List<QuestionResultDTO> buildQuestionResults(List<Question> questions, Map<String, String> answers) {
        return questions.stream().map(q -> {
            String selected = answers.get(q.getId().toString());
            boolean isCorrect = q.getCorrectOptionId().equals(selected);
            return new QuestionResultDTO(
                q.getId(), q.getQuestionText(), q.getOptionsJson(),
                q.getCorrectOptionId(), selected, isCorrect,
                q.getDifficultyWeight() != null ? q.getDifficultyWeight() : 1
            );
        }).collect(Collectors.toList());
    }

    private <T> String toJson(T obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { throw new RuntimeException("JSON serialization failed", e); }
    }

    private <T> T fromJson(String json, TypeReference<T> type) {
        try { return objectMapper.readValue(json, type); }
        catch (Exception e) { throw new RuntimeException("JSON deserialization failed", e); }
    }
}
