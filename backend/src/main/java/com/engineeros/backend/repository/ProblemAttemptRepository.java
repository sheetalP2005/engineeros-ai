package com.engineeros.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.engineeros.backend.entity.ProblemAttempt;

public interface ProblemAttemptRepository extends JpaRepository<ProblemAttempt, Long> {
}