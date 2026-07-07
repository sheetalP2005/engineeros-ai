package com.engineeros.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engineeros.backend.entity.Problem;
import com.engineeros.backend.entity.ProblemAttempt;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    public interface ProblemAttemptRepository extends JpaRepository<ProblemAttempt, Long> {
    Optional<ProblemAttempt> findByProblemId(Long problemId);
}
    
}
