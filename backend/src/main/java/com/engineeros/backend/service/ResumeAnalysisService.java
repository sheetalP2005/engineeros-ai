package com.engineeros.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.engineeros.backend.config.CurrentUserService;
import com.engineeros.backend.entity.ResumeAnalysis;
import com.engineeros.backend.entity.User;
import com.engineeros.backend.repository.ResumeAnalysisRepository;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final CurrentUserService currentUserService;

    // A comprehensive set of technical keywords to check for matching
    private static final Set<String> TECH_KEYWORDS = new HashSet<>(Arrays.asList(
        "java", "python", "javascript", "typescript", "c++", "golang", "go", "rust", "ruby", "kotlin", "swift", "php", "sql", "html", "css",
        "spring", "spring boot", "django", "flask", "fastapi", "express", "node.js", "node", "nest.js", "laravel", "rails", "asp.net",
        "react", "angular", "vue", "next.js", "nuxt", "svelte", "jquery", "tailwind", "bootstrap",
        "postgresql", "mysql", "mongodb", "redis", "cassandra", "dynamodb", "sqlite", "oracle", "sql server",
        "docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "git", "github", "gitlab", "terraform", "ansible", "ci/cd",
        "graphql", "rest", "rest api", "soap", "grpc", "microservices", "serverless",
        "machine learning", "ml", "artificial intelligence", "ai", "deep learning", "nlp", "tensorflow", "pytorch",
        "agile", "scrum", "jira", "junit", "testing", "selenium", "pytest", "mocha", "jest",
        "algorithms", "data structures", "system design", "oop", "object-oriented", "mvc"
    ));

    private static final String[] WEAK_VERBS = {
        "worked on", "helped", "responsible for", "assisted", "did", "handled", "part of", "made sure"
    };

    public ResumeAnalysisService(ResumeAnalysisRepository resumeAnalysisRepository, CurrentUserService currentUserService) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.currentUserService = currentUserService;
    }

    public List<ResumeAnalysis> getAllAnalyses() {
        User currentUser = currentUserService.getCurrentUser();
        return resumeAnalysisRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    public Optional<ResumeAnalysis> getAnalysisById(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        return resumeAnalysisRepository.findByIdAndUserId(id, currentUser.getId());
    }

    public void deleteAnalysis(Long id) {
        User currentUser = currentUserService.getCurrentUser();
        ResumeAnalysis existing = resumeAnalysisRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Analysis not found with id: " + id));
        resumeAnalysisRepository.delete(existing);
    }

    public ResumeAnalysis analyzeResume(String resumeText, String jobDescription) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("Resume text cannot be empty.");
        }

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setResumeText(resumeText);
        analysis.setJobDescription(jobDescription);

        // Standardize texts for matching
        String resumeLower = resumeText.toLowerCase();
        String jdLower = jobDescription != null ? jobDescription.toLowerCase() : "";

        // 1. Evaluate section completeness
        List<String> foundSections = new ArrayList<>();
        List<String> missingSections = new ArrayList<>();
        checkSection(resumeLower, "experience|work experience|employment history", "Experience", foundSections, missingSections);
        checkSection(resumeLower, "education|academic background", "Education", foundSections, missingSections);
        checkSection(resumeLower, "projects|personal projects|academic projects", "Projects", foundSections, missingSections);
        checkSection(resumeLower, "skills|technical skills|skills summary", "Skills", foundSections, missingSections);
        checkSection(resumeLower, "summary|professional summary|about me|objective", "Summary", foundSections, missingSections);

        int sectionScore = foundSections.size() * 10; // Max 50 points

        // 2. Skill/Keyword Extraction and Matching
        Set<String> resumeSkills = extractKeywords(resumeLower);
        Set<String> jdSkills = extractKeywords(jdLower);

        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        if (!jdSkills.isEmpty()) {
            for (String skill : jdSkills) {
                if (resumeSkills.contains(skill)) {
                    matchingSkills.add(skill);
                } else {
                    missingSkills.add(skill);
                }
            }
        } else {
            // If no job description is provided, matching skills are simply all tech keywords found
            matchingSkills.addAll(resumeSkills);
        }

        int skillScore = 0;
        if (!jdSkills.isEmpty()) {
            skillScore = (int) (((double) matchingSkills.size() / jdSkills.size()) * 40); // Max 40 points
        } else {
            // General technical density score
            skillScore = Math.min(40, resumeSkills.size() * 4);
        }

        // 3. Readability & Action verbs check
        List<String> improvementsList = new ArrayList<>();
        int formattingModifier = 10;

        // Check weak action verbs
        int weakVerbCount = 0;
        for (String weak : WEAK_VERBS) {
            if (resumeLower.contains(weak)) {
                weakVerbCount++;
            }
        }
        if (weakVerbCount > 0) {
            formattingModifier -= Math.min(5, weakVerbCount);
            improvementsList.add("Replace weak verbs (e.g. 'helped', 'worked on') with strong action verbs (e.g. 'engineered', 'led', 'designed').");
        }

        // Check word count
        String[] words = resumeText.trim().split("\\s+");
        if (words.length < 200) {
            formattingModifier -= 5;
            improvementsList.add("Resume is too short (" + words.length + " words). Expand on your project details and experience to hit at least 300 words.");
        } else if (words.length > 1500) {
            formattingModifier -= 2;
            improvementsList.add("Resume is quite long (" + words.length + " words). Keep it concise and try to limit to 1-2 pages.");
        }

        // Section issues
        for (String missing : missingSections) {
            improvementsList.add("Add a '" + missing + "' section to organize your resume properly.");
        }

        // Missing skills improvement
        if (!missingSkills.isEmpty()) {
            String missingSkillsStr = missingSkills.stream().limit(5).collect(Collectors.joining(", "));
            improvementsList.add("Incorporate missing target keywords matching the job description: " + missingSkillsStr + ".");
        }

        // Check quantifiable metrics
        Pattern numberPattern = Pattern.compile("\\b(\\d+%|\\$\\d+|\\d+x)\\b|percent|million|billion");
        Matcher numberMatcher = numberPattern.matcher(resumeText);
        if (!numberMatcher.find()) {
            formattingModifier -= 3;
            improvementsList.add("Include quantifiable metrics (e.g., 'improved page load by 35%', 'reduced cost by $12K') to demonstrate impact.");
        }

        // Total score calculation
        int finalScore = Math.max(0, Math.min(100, sectionScore + skillScore + formattingModifier));
        analysis.setScore(finalScore);

        // Store comma separated list of skills identified
        analysis.setSkillsIdentified(String.join(", ", resumeSkills));

        // Format summary feedback
        StringBuilder summaryFeedback = new StringBuilder();
        if (finalScore >= 80) {
            summaryFeedback.append("Excellent resume! It is well-structured, incorporates technical keywords effectively, and has clear impact metrics. ");
        } else if (finalScore >= 60) {
            summaryFeedback.append("Good start. The resume has solid content but can be significantly optimized for searchability and impact. ");
        } else {
            summaryFeedback.append("Needs improvement. The structure, technical depth, or formatting is lacking for top-tier engineering roles. ");
        }
        
        if (!jdSkills.isEmpty()) {
            int pct = (int) (((double) matchingSkills.size() / jdSkills.size()) * 100);
            summaryFeedback.append("Your resume matches ").append(pct).append("% of the target job description requirements.");
        } else {
            summaryFeedback.append("Consider aligning your resume with a specific job description for standard ATS matching metrics.");
        }
        analysis.setSummaryFeedback(summaryFeedback.toString());

        // Save improvements as bullet points
        analysis.setImprovements(improvementsList.isEmpty() 
            ? "No major issues found. Your resume looks highly optimized!" 
            : improvementsList.stream().map(i -> "• " + i).collect(Collectors.joining("\n")));

        // Generate bullet point rewrites using the STAR method
        List<String> rewrites = generateBulletPointRewrites(resumeText);
        analysis.setBulletPointRewrites(String.join("\n\n", rewrites));

        // Save and link to current user
        analysis.setUser(currentUserService.getCurrentUser());
        analysis.setCreatedAt(LocalDateTime.now());

        return resumeAnalysisRepository.save(analysis);
    }

    private void checkSection(String text, String regex, String sectionName, List<String> found, List<String> missing) {
        Pattern pattern = Pattern.compile("\\b(" + regex + ")\\b", Pattern.CASE_INSENSITIVE);
        if (pattern.matcher(text).find()) {
            found.add(sectionName);
        } else {
            missing.add(sectionName);
        }
    }

    private Set<String> extractKeywords(String text) {
        Set<String> matched = new HashSet<>();
        if (text == null || text.trim().isEmpty()) {
            return matched;
        }
        for (String keyword : TECH_KEYWORDS) {
            // Use word boundaries or special handling for programming symbols like C++ or .NET
            String regex;
            if (keyword.equals("c++")) {
                regex = "\\bc\\+\\+";
            } else if (keyword.equals("node.js")) {
                regex = "\\bnode\\.js\\b";
            } else if (keyword.equals("next.js")) {
                regex = "\\bnext\\.js\\b";
            } else if (keyword.equals("nest.js")) {
                regex = "\\bnest\\.js\\b";
            } else if (keyword.equals("nuxt")) {
                regex = "\\bnuxt\\b";
            } else if (keyword.equals("asp.net")) {
                regex = "\\basp\\.net\\b";
            } else if (keyword.equals("ci/cd")) {
                regex = "\\bci/cd\\b";
            } else {
                regex = "\\b" + Pattern.quote(keyword) + "\\b";
            }
            Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            if (pattern.matcher(text).find()) {
                matched.add(keyword);
            }
        }
        return matched;
    }

    private List<String> generateBulletPointRewrites(String resumeText) {
        List<String> rewrites = new ArrayList<>();
        
        // Scan the resume text for bullet points starting with weak verbs or simple sentences
        String[] lines = resumeText.split("\\r?\\n");
        int count = 0;
        
        for (String line : lines) {
            String trimmed = line.trim();
            // Look for bullet style lines
            if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
                String lineContent = trimmed.replaceAll("^[-*•]\\s*", "").trim();
                String lineLower = lineContent.toLowerCase();
                
                String matchingWeak = null;
                for (String weak : WEAK_VERBS) {
                    if (lineLower.startsWith(weak)) {
                        matchingWeak = weak;
                        break;
                    }
                }
                
                if (matchingWeak != null && count < 3) {
                    // Try to suggest a rewrite based on content
                    String suggestion = getSTARRewrite(lineContent, matchingWeak);
                    if (suggestion != null) {
                        rewrites.add("**Original:** \"" + lineContent + "\"\n**Suggested STAR Rewrite:** " + suggestion);
                        count++;
                    }
                }
            }
        }
        
        // Default suggestions if no weak bullets were parsed
        if (rewrites.isEmpty()) {
            rewrites.add("**Original:** \"Worked on a React dashboard to display metrics.\"\n**Suggested STAR Rewrite:** \"**Engineered** a real-time React dashboard with glassmorphic visuals, improving user engagement metric visualization efficiency by **25%**.\"");
            rewrites.add("**Original:** \"Responsible for writing SQL queries and fixing backend bugs.\"\n**Suggested STAR Rewrite:** \"**Optimized** relational database performance in PostgreSQL, refactoring slow queries to **reduce API latency by 40%**.\"");
        }
        
        return rewrites;
    }

    private String getSTARRewrite(String original, String weakVerb) {
        // Find simple topics inside original text to customize suggestion
        String originalLower = original.toLowerCase();
        if (originalLower.contains("react") || originalLower.contains("frontend") || originalLower.contains("ui") || originalLower.contains("web")) {
            return "**Spearheaded** the development of responsive frontend interfaces using **React and Tailwind CSS**, resulting in a **15% increase in user retention**.";
        }
        if (originalLower.contains("api") || originalLower.contains("backend") || originalLower.contains("database") || originalLower.contains("sql") || originalLower.contains("spring")) {
            return "**Architected and optimized** secure REST APIs utilizing **Spring Boot**, reducing server-side response times by **30%** via database index adjustments.";
        }
        if (originalLower.contains("test") || originalLower.contains("bug") || originalLower.contains("quality")) {
            return "**Automated** comprehensive integration testing processes using **JUnit and Mockito**, achieving **92% code coverage** and decreasing production defects by **20%**.";
        }
        // Generic rewrite fallback
        return "**Executed and delivered** critical feature components, collaborating with cross-functional teams to **streamline workflow processes by 12%**.";
    }
}
