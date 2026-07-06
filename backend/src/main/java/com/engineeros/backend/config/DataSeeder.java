package com.engineeros.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.engineeros.backend.entity.Problem;
import com.engineeros.backend.repository.ProblemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class DataSeeder implements CommandLineRunner {

    private  final ProblemRepository problemRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(ProblemRepository problemRepository, ObjectMapper objectMapper) {
        this.problemRepository = problemRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() > 0) {
            System.out.println("Problems already seeded, skipping.");
            return;
        }

        ClassPathResource resource = new ClassPathResource("problems_seed.json");
        List<Problem> problems = objectMapper.readValue(
                resource.getInputStream(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, Problem.class)
        );

        problemRepository.saveAll(problems);
        System.out.println("Seeded " + problems.size() + " problems.");
    }
}