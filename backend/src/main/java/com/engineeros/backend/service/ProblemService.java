package com.engineeros.backend.service;

import com.engineeros.backend.entity.Problem;
import com.engineeros.backend.repository.ProblemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public Problem createProblem(Problem problem) {
        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    public Problem updateProblem(Long id, Problem updatedProblem) {
        Problem existing = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));

        existing.setTitle(updatedProblem.getTitle());
        existing.setDifficulty(updatedProblem.getDifficulty());
        existing.setTopic(updatedProblem.getTopic());
        existing.setUrl(updatedProblem.getUrl());

        return problemRepository.save(existing);
    }

    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }
}