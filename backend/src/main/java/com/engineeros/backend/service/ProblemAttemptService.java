package com.engineeros.backend.service;

import com.engineeros.backend.entity.Problem;
import com.engineeros.backend.entity.ProblemAttempt;
import com.engineeros.backend.repository.ProblemAttemptRepository;
import com.engineeros.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProblemAttemptService {

    private final ProblemAttemptRepository problemAttemptRepository;
    private final ProblemRepository problemRepository;

    public ProblemAttemptService(ProblemAttemptRepository problemAttemptRepository,
                                  ProblemRepository problemRepository) {
        this.problemAttemptRepository = problemAttemptRepository;
        this.problemRepository = problemRepository;
    }

    public ProblemAttempt recordAttempt(Long problemId, String status, String notes) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));

        ProblemAttempt attempt = new ProblemAttempt();
        attempt.setProblem(problem);
        attempt.setStatus(status);
        attempt.setNotes(notes);
        attempt.setAttemptedAt(LocalDateTime.now());

        return problemAttemptRepository.save(attempt);
    }

    public List<ProblemAttempt> getAllAttempts() {
        return problemAttemptRepository.findAll();
    }
}