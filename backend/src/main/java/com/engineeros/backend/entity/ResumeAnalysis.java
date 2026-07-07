package com.engineeros.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(columnDefinition = "TEXT")
    private String skillsIdentified; // Comma-separated or serialized

    @Column(columnDefinition = "TEXT")
    private String improvements; // Newline-separated or markdown

    @Column(columnDefinition = "TEXT")
    private String bulletPointRewrites; // Newline-separated or markdown

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    public ResumeAnalysis() {
    }

    public Long getId() {
        return id;
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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getSummaryFeedback() {
        return summaryFeedback;
    }

    public void setSummaryFeedback(String summaryFeedback) {
        this.summaryFeedback = summaryFeedback;
    }

    public String getSkillsIdentified() {
        return skillsIdentified;
    }

    public void setSkillsIdentified(String skillsIdentified) {
        this.skillsIdentified = skillsIdentified;
    }

    public String getImprovements() {
        return improvements;
    }

    public void setImprovements(String improvements) {
        this.improvements = improvements;
    }

    public String getBulletPointRewrites() {
        return bulletPointRewrites;
    }

    public void setBulletPointRewrites(String bulletPointRewrites) {
        this.bulletPointRewrites = bulletPointRewrites;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
