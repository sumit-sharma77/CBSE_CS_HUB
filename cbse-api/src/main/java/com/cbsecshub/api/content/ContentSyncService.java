package com.cbsecshub.api.content;

import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.content.repository.QuestionRepository;
import com.cbsecshub.api.content.repository.TopicRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Reads all JSON question files from classpath:assets/content/** /*.json
 * and upserts questions into the database on application startup.
 * Idempotent: uses INSERT ... ON CONFLICT DO NOTHING via existsBySourceFileAndLocalId.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ContentSyncService {

    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final ObjectMapper objectMapper;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void syncContent() {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources;
        try {
            resources = resolver.getResources("classpath*:assets/content/**/*.json");
        } catch (IOException e) {
            log.warn("ContentSync: no content files found in classpath — {}", e.getMessage());
            return;
        }

        int inserted = 0;
        int skipped = 0;
        int files = 0;

        for (Resource resource : resources) {
            files++;
            String sourceFile = extractSourcePath(resource);
            try {
                List<Map<String, Object>> rawQuestions = objectMapper.readValue(
                    resource.getInputStream(), new TypeReference<>() {}
                );
                for (Map<String, Object> raw : rawQuestions) {
                    String localId = String.valueOf(raw.get("id"));
                    if (questionRepository.existsBySourceFileAndLocalId(sourceFile, localId)) {
                        skipped++;
                        continue;
                    }
                    Question question = mapToQuestion(raw, sourceFile);
                    if (question != null) {
                        questionRepository.save(question);
                        inserted++;
                    }
                }
            } catch (IOException e) {
                log.error("ContentSync: failed to parse file {} — {}", sourceFile, e.getMessage());
            }
        }

        log.info("ContentSync: inserted={}, skipped={}, files={}", inserted, skipped, files);
    }

    private String extractSourcePath(Resource resource) {
        try {
            String uri = resource.getURI().toString();
            int idx = uri.indexOf("assets/content/");
            return idx >= 0 ? uri.substring(idx) : resource.getFilename();
        } catch (IOException e) {
            return resource.getFilename();
        }
    }

    @SuppressWarnings("unchecked")
    private Question mapToQuestion(Map<String, Object> raw, String sourceFile) {
        try {
            String localId = String.valueOf(raw.get("id"));
            String text = String.valueOf(raw.get("question"));
            Object optionsRaw = raw.get("options");
            String correctOptionId = String.valueOf(raw.get("correctAnswer"));
            int difficultyWeight = raw.containsKey("difficulty")
                ? parseDifficulty(String.valueOf(raw.get("difficulty")))
                : 1;

            // Resolve topic from source path
            Long topicId = resolveTopicId(sourceFile);
            if (topicId == null) {
                log.warn("ContentSync: cannot resolve topic for sourceFile={}", sourceFile);
                return null;
            }

            String optionsJson = objectMapper.writeValueAsString(optionsRaw);

            Question q = new Question();
            q.setTopicId(topicId);
            q.setQuestionText(text);
            q.setType("MCQ");
            q.setOptionsJson(optionsJson);
            q.setCorrectOptionId(correctOptionId);
            q.setDifficultyWeight(difficultyWeight);
            q.setSourceFile(sourceFile);
            q.setLocalId(localId);
            return q;
        } catch (Exception e) {
            log.warn("ContentSync: skipping question due to mapping error — {}", e.getMessage());
            return null;
        }
    }

    private int parseDifficulty(String difficulty) {
        return switch (difficulty.toLowerCase()) {
            case "easy"   -> 1;
            case "medium" -> 2;
            case "hard"   -> 3;
            default       -> 1;
        };
    }

    private Long resolveTopicId(String sourceFile) {
        String lower = sourceFile.toLowerCase();
        String topicName = null;

        if (lower.contains("sql-aggregate"))          topicName = "SQL Aggregate Functions";
        else if (lower.contains("sql-group-by"))      topicName = "SQL GROUP BY";
        else if (lower.contains("sql-joins"))         topicName = "SQL Joins";
        else if (lower.contains("sql-keys"))          topicName = "SQL Keys & Constraints";
        else if (lower.contains("sql-order-by"))      topicName = "SQL ORDER BY";
        else if (lower.contains("sql-select"))        topicName = "SQL SELECT";
        else if (lower.contains("sql-where"))         topicName = "SQL WHERE";
        else if (lower.contains("sql"))               topicName = "Class 12 SQL";
        else if (lower.contains("py-conditions") || lower.contains("conditions")) topicName = "Python Conditions";
        else if (lower.contains("py-dictionaries") || lower.contains("dictionaries")) topicName = "Python Dictionaries";
        else if (lower.contains("py-functions") || lower.contains("functions")) topicName = "Python Functions";
        else if (lower.contains("py-lists") || lower.contains("lists"))         topicName = "Python Lists";
        else if (lower.contains("py-loops") || lower.contains("loops"))         topicName = "Python Loops";
        else if (lower.contains("py-mixed") || lower.contains("mixed"))         topicName = "Python Mixed";
        else if (lower.contains("py-strings") || lower.contains("strings"))     topicName = "Python Strings";
        else if (lower.contains("py-variables") || lower.contains("variables")) topicName = "Python Variables";
        else if (lower.contains("python") && lower.contains("12"))              topicName = "Class 12 Python";
        else if (lower.contains("python") && lower.contains("11"))              topicName = "Class 11 Python";
        else if (lower.contains("computer"))                                     topicName = "Class 11 Computer Fundamentals";
        else if (lower.contains("python"))                                       topicName = "Class 12 Python";

        if (topicName == null) return null;
        final String name = topicName;
        return topicRepository.findByName(name).map(t -> t.getId()).orElse(null);
    }
}
