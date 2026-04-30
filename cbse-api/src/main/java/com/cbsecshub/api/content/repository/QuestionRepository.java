package com.cbsecshub.api.content.repository;

import com.cbsecshub.api.content.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    boolean existsBySourceFileAndLocalId(String sourceFile, String localId);

    List<Question> findByTopicId(Long topicId);

    List<Question> findByTopicIdAndDifficultyWeightIn(Long topicId, List<Integer> difficultyWeights);

    long countByTopicId(Long topicId);

    @Query("SELECT q FROM Question q WHERE q.topicId IN :topicIds AND q.difficultyWeight IN :weights")
    List<Question> findByTopicIdsAndDifficultyWeights(
        @Param("topicIds") List<Long> topicIds,
        @Param("weights") List<Integer> weights
    );
}
