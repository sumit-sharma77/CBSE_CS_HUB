package com.cbsecshub.api.content.controller;

import com.cbsecshub.api.content.entity.Question;
import com.cbsecshub.api.content.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionRepository questionRepository;

    @GetMapping
    public List<Question> getByIds(@RequestParam List<Long> ids) {
        return questionRepository.findAllById(ids);
    }
}
