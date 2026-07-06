package com.engineeros.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engineeros.backend.entity.ProblemAttempt;
import com.engineeros.backend.service.ProblemAttemptService;

@RestController
@RequestMapping("/api/attempts")
public class ProblemAttemptController {

    private final ProblemAttemptService problemAttemptService;

    public ProblemAttemptController(ProblemAttemptService problemAttemptService) {
        this.problemAttemptService = problemAttemptService;
    }

    @PostMapping
    public ProblemAttempt recordAttempt(@RequestBody Map<String, String> body) {
        Long problemId = Long.valueOf(body.get("problemId"));
        String status = body.get("status");
        String notes = body.get("notes");
        return problemAttemptService.recordAttempt(problemId, status, notes);
    }

    @GetMapping
    public List<ProblemAttempt> getAllAttempts() {
        return problemAttemptService.getAllAttempts();
    }
}