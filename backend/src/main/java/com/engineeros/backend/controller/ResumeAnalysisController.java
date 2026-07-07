package com.engineeros.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.engineeros.backend.entity.ResumeAnalysis;
import com.engineeros.backend.service.ResumeAnalysisService;

@RestController
@RequestMapping("/api/resume-analyzer")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/analyze")
    public ResumeAnalysis analyzeResume(@RequestBody AnalysisRequest request) {
        return resumeAnalysisService.analyzeResume(request.getResumeText(), request.getJobDescription());
    }

    @GetMapping
    public List<ResumeAnalysis> getAllAnalyses() {
        return resumeAnalysisService.getAllAnalyses();
    }

    @GetMapping("/{id}")
    public ResumeAnalysis getAnalysisById(@PathVariable Long id) {
        return resumeAnalysisService.getAnalysisById(id)
                .orElseThrow(() -> new RuntimeException("Resume analysis not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteAnalysis(@PathVariable Long id) {
        resumeAnalysisService.deleteAnalysis(id);
    }

    // DTO class for receiving analysis requests
    public static class AnalysisRequest {
        private String resumeText;
        private String jobDescription;

        public AnalysisRequest() {
        }

        public String getResumeText() {
            return resumeText;
        }

        public void setResumeText(String resumeText) {
            this.resumeText = resumeText;
        }

        public String getJobDescription() {
            return jobDescription;
        }

        public void setJobDescription(String jobDescription) {
            this.jobDescription = jobDescription;
        }
    }
}
