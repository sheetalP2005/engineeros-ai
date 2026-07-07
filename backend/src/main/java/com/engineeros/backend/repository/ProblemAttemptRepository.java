package com.engineeros.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.engineeros.backend.entity.ProblemAttempt;

public interface ProblemAttemptRepository extends JpaRepository<ProblemAttempt, Long> {

    Optional<ProblemAttempt> findByProblemIdAndUserId(Long problemId, Long userId);

    List<ProblemAttempt> findByUserId(Long userId);
}