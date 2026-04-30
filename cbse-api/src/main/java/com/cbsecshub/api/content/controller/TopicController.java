package com.cbsecshub.api.content.controller;

import com.cbsecshub.api.content.entity.Topic;
import com.cbsecshub.api.content.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicRepository topicRepository;

    @GetMapping
    public List<Topic> getAll() {
        return topicRepository.findAll();
    }
}
