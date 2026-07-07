package com.engineeros.backend.service;

import com.engineeros.backend.config.CurrentUserService;
import com.engineeros.backend.entity.Problem;
import com.engineeros.backend.entity.ProblemAttempt;
import com.engineeros.backend.entity.User;
import com.engineeros.backend.repository.ProblemAttemptRepository;
import com.engineeros.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProblemAttemptService {

    private final ProblemAttemptRepository problemAttemptRepository;
    private final ProblemRepository problemRepository;
    private final CurrentUserService currentUserService;

    public ProblemAttemptService(ProblemAttemptRepository problemAttemptRepository,
                                  ProblemRepository problemRepository,
                                  CurrentUserService currentUserService) {
        this.problemAttemptRepository = problemAttemptRepository;
        this.problemRepository = problemRepository;
        this.currentUserService = currentUserService;
    }

    public ProblemAttempt recordAttempt(Long problemId, String status, String notes) {
        User currentUser = currentUserService.getCurrentUser();

        return problemAttemptRepository.findByProblemIdAndUserId(problemId, currentUser.getId())
                .map(existing -> {
                    existing.setStatus(status);
                    existing.setNotes(notes);
                    existing.setAttemptedAt(LocalDateTime.now());
                    return problemAttemptRepository.save(existing);
                })
                .orElseGet(() -> {
                    Problem problem = problemRepository.findById(problemId)
                            .orElseThrow(() -> new RuntimeException("Problem not found with id: " + problemId));

                    ProblemAttempt attempt = new ProblemAttempt();
                    attempt.setProblem(problem);
                    attempt.setUser(currentUser);
                    attempt.setStatus(status);
                    attempt.setNotes(notes);
                    attempt.setAttemptedAt(LocalDateTime.now());

                    return problemAttemptRepository.save(attempt);
                });
    }

    public List<ProblemAttempt> getAllAttempts() {
        User currentUser = currentUserService.getCurrentUser();
        return problemAttemptRepository.findByUserId(currentUser.getId());
    }
}