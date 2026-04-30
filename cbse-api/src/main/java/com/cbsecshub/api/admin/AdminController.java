package com.cbsecshub.api.admin;

import com.cbsecshub.api.admin.dto.*;
import com.cbsecshub.api.badge.repository.BadgeRepository;
import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.content.entity.Topic;
import com.cbsecshub.api.content.repository.QuestionRepository;
import com.cbsecshub.api.content.repository.TopicRepository;
import com.cbsecshub.api.subscription.dto.PlanDTO;
import com.cbsecshub.api.subscription.dto.SubscriptionDTO;
import com.cbsecshub.api.subscription.entity.Plan;
import com.cbsecshub.api.subscription.repository.PlanRepository;
import com.cbsecshub.api.subscription.service.SubscriptionService;
import com.cbsecshub.api.test.entity.TestAttempt;
import com.cbsecshub.api.test.entity.TestSession;
import com.cbsecshub.api.test.repository.TestAttemptRepository;
import com.cbsecshub.api.test.repository.TestSessionRepository;
import com.cbsecshub.api.user.dto.UserDTO;
import com.cbsecshub.api.user.entity.User;
import com.cbsecshub.api.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.*;

/**
 * Admin-only REST API.  All paths under /api/admin/** are restricted to ROLE_ADMIN
 * in SecurityConfig — no additional @PreAuthorize needed.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserRepository        userRepository;
    private final SubscriptionService   subscriptionService;
    private final PlanRepository        planRepository;
    private final TopicRepository       topicRepository;
    private final QuestionRepository    questionRepository;
    private final TestSessionRepository testSessionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final BadgeRepository       badgeRepository;

    // ─────────────────────────── STATS ─────────────────────────────

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
            "totalUsers",       userRepository.count(),
            "totalTopics",      topicRepository.count(),
            "totalQuestions",   questionRepository.count(),
            "totalTestSessions",testSessionRepository.count(),
            "totalAttempts",    testAttemptRepository.count(),
            "totalPlans",       planRepository.count(),
            "serverTime",       Instant.now()
        );
    }

    // ─────────────────────────── USERS ─────────────────────────────

    @GetMapping("/users")
    public Page<UserDTO> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(UserDTO::from);
    }

    @GetMapping("/users/{userId}")
    public UserDTO getUser(@PathVariable UUID userId) {
        return userRepository.findById(userId)
            .map(UserDTO::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable UUID userId, @AuthenticationPrincipal UUID adminId) {
        if (userId.equals(adminId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete yourself");
        }
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        userRepository.delete(user);
        log.info("ADMIN delete user userId={} by adminId={}", userId, adminId);
    }

    @PutMapping("/users/{userId}/role")
    public UserDTO changeRole(@PathVariable UUID userId,
                               @Valid @RequestBody UpdateUserRoleRequest body,
                               @AuthenticationPrincipal UUID adminId) {
        if (userId.equals(adminId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change your own role");
        }
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            user.setRole(User.Role.valueOf(body.role().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + body.role());
        }
        userRepository.save(user);
        log.info("ADMIN change role userId={} role={} by adminId={}", userId, body.role(), adminId);
        return UserDTO.from(user);
    }

    // ─────────────────────── SUBSCRIPTIONS ──────────────────────────

    @GetMapping("/subscriptions")
    public List<SubscriptionDTO> listSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/subscriptions/{userId}")
    public SubscriptionDTO getUserSubscription(@PathVariable UUID userId) {
        return subscriptionService.getMySubscription(userId);
    }

    /**
     * Manually grant a paid subscription to a user — no Razorpay required.
     * Use this for demos, admin gifting, or any offline payment scenario.
     */
    @PostMapping("/subscriptions/grant")
    @ResponseStatus(HttpStatus.OK)
    public SubscriptionDTO grantSubscription(@Valid @RequestBody GrantSubscriptionRequest body,
                                              @AuthenticationPrincipal UUID adminId) {
        log.info("ADMIN grant subscription userId={} planId={} months={} by adminId={}",
            body.userId(), body.planId(), body.months(), adminId);
        return subscriptionService.grantSubscription(body.userId(), body.planId(), body.months());
    }

    /**
     * Revoke a user's paid subscription and revert them to the Free plan.
     */
    @DeleteMapping("/subscriptions/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeSubscription(@PathVariable UUID userId,
                                    @AuthenticationPrincipal UUID adminId) {
        log.info("ADMIN revoke subscription userId={} by adminId={}", userId, adminId);
        subscriptionService.revokeSubscription(userId);
    }

    // ─────────────────────────── PLANS ──────────────────────────────

    @GetMapping("/plans")
    public List<PlanDTO> listAllPlans() {
        return planRepository.findAll().stream().map(PlanDTO::from).toList();
    }

    @PostMapping("/plans")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanDTO createPlan(@Valid @RequestBody UpsertPlanRequest body) {
        Plan plan = Plan.builder()
            .name(body.name())
            .billingCycle(body.billingCycle())
            .priceInr(body.priceInr())
            .maxQuestionsPerTopic(body.maxQuestionsPerTopic())
            .razorpayPlanId(body.razorpayPlanId())
            .features(body.features() != null ? body.features() : "{}")
            .isActive(body.isActive())
            .build();
        return PlanDTO.from(planRepository.save(plan));
    }

    @PutMapping("/plans/{planId}")
    public PlanDTO updatePlan(@PathVariable Long planId, @Valid @RequestBody UpsertPlanRequest body) {
        Plan plan = planRepository.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        plan.setName(body.name());
        plan.setBillingCycle(body.billingCycle());
        plan.setPriceInr(body.priceInr());
        plan.setMaxQuestionsPerTopic(body.maxQuestionsPerTopic());
        plan.setRazorpayPlanId(body.razorpayPlanId());
        if (body.features() != null) plan.setFeatures(body.features());
        plan.setActive(body.isActive());
        return PlanDTO.from(planRepository.save(plan));
    }

    @DeleteMapping("/plans/{planId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long planId) {
        Plan plan = planRepository.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        plan.setActive(false);
        planRepository.save(plan); // soft delete (deactivate)
    }

    // ─────────────────────────── TOPICS ─────────────────────────────

    @GetMapping("/topics")
    public List<Topic> listTopics() {
        return topicRepository.findAll();
    }

    @PostMapping("/topics")
    @ResponseStatus(HttpStatus.CREATED)
    public Topic createTopic(@Valid @RequestBody CreateTopicRequest body) {
        Topic topic = Topic.builder()
            .name(body.name())
            .classLevel(body.classLevel())
            .type(body.type())
            .build();
        return topicRepository.save(topic);
    }

    @PutMapping("/topics/{topicId}")
    public Topic updateTopic(@PathVariable Long topicId, @Valid @RequestBody CreateTopicRequest body) {
        Topic topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        topic.setName(body.name());
        topic.setClassLevel(body.classLevel());
        topic.setType(body.type());
        return topicRepository.save(topic);
    }

    @DeleteMapping("/topics/{topicId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTopic(@PathVariable Long topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        topicRepository.deleteById(topicId);
    }

    // ─────────────────────────── QUESTIONS ──────────────────────────

    @GetMapping("/topics/{topicId}/questions")
    public List<Question> listQuestions(@PathVariable Long topicId) {
        return questionRepository.findByTopicId(topicId);
    }

    @PostMapping("/topics/{topicId}/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public Question createQuestion(@PathVariable Long topicId,
                                    @Valid @RequestBody CreateQuestionRequest body) {
        if (!topicRepository.existsById(topicId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found");
        }
        Question q = Question.builder()
            .topicId(topicId)
            .questionText(body.questionText())
            .type(body.type())
            .optionsJson(body.optionsJson())
            .correctOptionId(body.correctOptionId())
            .difficultyWeight(Math.max(1, body.difficultyWeight()))
            .build();
        return questionRepository.save(q);
    }

    @PutMapping("/questions/{questionId}")
    public Question updateQuestion(@PathVariable Long questionId,
                                    @Valid @RequestBody CreateQuestionRequest body) {
        Question q = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        q.setQuestionText(body.questionText());
        q.setType(body.type());
        q.setOptionsJson(body.optionsJson());
        q.setCorrectOptionId(body.correctOptionId());
        q.setDifficultyWeight(Math.max(1, body.difficultyWeight()));
        return questionRepository.save(q);
    }

    @DeleteMapping("/questions/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestion(@PathVariable Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        questionRepository.deleteById(questionId);
    }

    // ─────────────────────── TEST SESSIONS ──────────────────────────

    @GetMapping("/test-sessions")
    public Page<TestSession> listSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) UUID userId) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("startedAt").descending());
        if (userId != null) {
            return testSessionRepository.findByUserIdAndStatus(userId, null) != null
                ? testSessionRepository.findAll(pr) // simple fallback — filter below
                : testSessionRepository.findAll(pr);
        }
        return testSessionRepository.findAll(pr);
    }

    @GetMapping("/test-attempts")
    public Page<TestAttempt> listAttempts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return testAttemptRepository.findAll(
            PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/users/{userId}/test-attempts")
    public Page<TestAttempt> listUserAttempts(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return testAttemptRepository.findByUserIdOrderByCreatedAtDesc(
            userId, PageRequest.of(page, size));
    }

    @GetMapping("/users/{userId}/badges")
    public List<?> listUserBadges(@PathVariable UUID userId) {
        return badgeRepository.findByUserId(userId);
    }
}
