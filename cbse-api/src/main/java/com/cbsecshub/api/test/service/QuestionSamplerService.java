package com.cbsecshub.api.test.service;

import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.content.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Samples questions for a test session with 40/40/20 difficulty distribution.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class QuestionSamplerService {

    private final QuestionRepository questionRepository;

    public List<Question> sample(List<Long> topicIds, int count) {
        int easyTarget   = (int) Math.round(count * 0.40);
        int mediumTarget = (int) Math.round(count * 0.40);
        int hardTarget   = count - easyTarget - mediumTarget;

        List<Question> easy   = fetchAndShuffle(topicIds, List.of(1));
        List<Question> medium = fetchAndShuffle(topicIds, List.of(2));
        List<Question> hard   = fetchAndShuffle(topicIds, List.of(3));

        List<Question> result = new ArrayList<>();
        result.addAll(take(easy,   easyTarget,   medium, hard));
        result.addAll(take(medium, mediumTarget,  easy,   hard));
        result.addAll(take(hard,   hardTarget,    easy,   medium));

        // Shuffle the final list to avoid grouping by difficulty
        Collections.shuffle(result);
        return result.subList(0, Math.min(count, result.size()));
    }

    private List<Question> fetchAndShuffle(List<Long> topicIds, List<Integer> weights) {
        List<Question> questions = questionRepository.findByTopicIdsAndDifficultyWeights(topicIds, weights);
        fisherYatesShuffle(questions);
        return questions;
    }

    /** Fisher-Yates shuffle in-place */
    private void fisherYatesShuffle(List<Question> list) {
        Random rng = new Random();
        for (int i = list.size() - 1; i > 0; i--) {
            int j = rng.nextInt(i + 1);
            Question tmp = list.get(i);
            list.set(i, list.get(j));
            list.set(j, tmp);
        }
    }

    /** Take up to `needed` from primary; fill deficit from fallback1 then fallback2 */
    private List<Question> take(List<Question> primary, int needed,
                                 List<Question> fallback1, List<Question> fallback2) {
        List<Question> result = new ArrayList<>(primary.subList(0, Math.min(needed, primary.size())));
        int deficit = needed - result.size();
        if (deficit > 0 && !fallback1.isEmpty()) {
            int take = Math.min(deficit, fallback1.size());
            result.addAll(fallback1.subList(0, take));
            fallback1.subList(0, take).clear();
            deficit -= take;
        }
        if (deficit > 0 && !fallback2.isEmpty()) {
            int take = Math.min(deficit, fallback2.size());
            result.addAll(fallback2.subList(0, take));
            fallback2.subList(0, take).clear();
        }
        if (result.size() < needed) {
            log.warn("QuestionSampler: requested {} but only {} available", needed, result.size());
        }
        return result;
    }
}
