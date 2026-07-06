package com.engineeros.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engineeros.backend.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    
}