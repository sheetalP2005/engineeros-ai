import { useState, useEffect } from "react";
import { getAllAnalyses, analyzeResume, deleteAnalysis } from "../api/resumeAnalyzer";

function ResumeAnalyzer() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState("summary");

  // Form inputs
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Loaded/current analysis result
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  function loadHistory() {
    setHistoryLoading(true);
    getAllAnalyses()
      .then((data) => {
        setAnalyses(data);
        if (data.length > 0 && !selectedAnalysis) {
          // Auto-select the most recent analysis by default
          setSelectedAnalysis(data[0]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setHistoryLoading(false));
  }

  function handleAnalyze(e) {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);
    analyzeResume(resumeText, jobDescription)
      .then((result) => {
        setSelectedAnalysis(result);
        setResumeText("");
        setJobDescription("");
        loadHistory();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this analysis record?")) return;

    deleteAnalysis(id)
      .then(() => {
        if (selectedAnalysis && selectedAnalysis.id === id) {
          setSelectedAnalysis(null);
        }
        loadHistory();
      })
      .catch((err) => setError(err.message));
  }

  function getScoreColorClass(score) {
    if (score >= 80) return "text-[#57D9A3]"; // Solved (Green)
    if (score >= 60) return "text-[#FFD166]"; // Attempted (Yellow)
    return "text-[#FF8A3D]"; // Accent (Orange/Red)
  }

  function getScoreBorderClass(score) {
    if (score >= 80) return "border-[#57D9A3]";
    if (score >= 60) return "border-[#FFD166]";
    return "border-[#FF8A3D]";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar - History */}
      <div className="md:col-span-1 border border-[rgba(220,238,255,0.15)] bg-[rgba(18,53,84,0.25)] p-4 flex flex-col gap-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400 border-b border-[rgba(220,238,255,0.1)] pb-2 mb-1">
          Analysis History
        </h3>

        {historyLoading ? (
          <p className="font-mono text-xs text-neutral-400">Loading history...</p>
        ) : analyses.length === 0 ? (
          <p className="font-mono text-xs text-neutral-400">No previous analyses found.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {analyses.map((an) => {
              const date = new Date(an.createdAt).toLocaleDateString();
              const isSelected = selectedAnalysis && selectedAnalysis.id === an.id;
              return (
                <div
                  key={an.id}
                  onClick={() => setSelectedAnalysis(an)}
                  className={`p-3 border transition-all cursor-pointer flex justify-between items-center ${
                    isSelected
                      ? "border-[#FF8A3D] bg-[rgba(255,138,61,0.06)]"
                      : "border-[rgba(220,238,255,0.15)] hover:border-[rgba(220,238,255,0.3)] bg-[rgba(18,53,84,0.15)]"
                  }`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-mono text-xs text-neutral-300 truncate">
                      {an.resumeText.substring(0, 30)}...
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{date}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-2 shrink-0">
                    <span className={`font-mono font-bold text-xs ${getScoreColorClass(an.score)}`}>
                      {an.score}%
                    </span>
                    <button
                      onClick={(e) => handleDelete(an.id, e)}
                      className="text-neutral-400 hover:text-[#FF8A3D] transition-colors p-1"
                      title="Delete Analysis"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setSelectedAnalysis(null)}
          className="mt-2 text-center font-mono text-xs uppercase tracking-wider border border-[rgba(220,238,255,0.25)] py-2 text-neutral-300 hover:text-white hover:border-neutral-300 transition-all cursor-pointer"
        >
          + New Analysis
        </button>
      </div>

      {/* Main panel */}
      <div className="md:col-span-2 flex flex-col gap-6">
        {error && (
          <div className="p-3 border border-[#FF8A3D] bg-[rgba(255,138,61,0.06)] text-neutral-200 font-mono text-xs">
            Error: {error}
          </div>
        )}

        {/* INPUT FORM (when no selected analysis exists or adding new) */}
        {!selectedAnalysis ? (
          <form className="note-form" onSubmit={handleAnalyze}>
            <h3 className="font-display font-semibold text-lg border-b border-[rgba(220,238,255,0.1)] pb-2 mb-2">
              Analyze New Resume
            </h3>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
                Resume Content *
              </label>
              <textarea
                required
                placeholder="Paste the full text of your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                className="w-full bg-[#16406A] border border-[rgba(220,238,255,0.25)] text-[#DCEEFF] p-3 text-sm focus:outline-none focus:border-[#FF8A3D]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
                Target Job Description (Optional)
              </label>
              <textarea
                placeholder="Paste the target job description to match keywords and requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                className="w-full bg-[#16406A] border border-[rgba(220,238,255,0.25)] text-[#DCEEFF] p-3 text-sm focus:outline-none focus:border-[#FF8A3D]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !resumeText.trim()}
              className="mt-2 font-mono text-xs uppercase tracking-wider py-3 bg-[#FF8A3D] text-[#0B2942] font-semibold hover:bg-opacity-90 transition-all disabled:bg-neutral-500 cursor-pointer w-full text-center"
            >
              {loading ? "Analyzing Resume..." : "Run AI Analysis"}
            </button>
          </form>
        ) : (
          /* RESULT DISPLAY SCREEN */
          <div className="border border-[rgba(220,238,255,0.2)] bg-[rgba(18,53,84,0.3)] p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-[rgba(220,238,255,0.15)] pb-4">
              <h3 className="font-display font-semibold text-lg">
                Resume Analysis
              </h3>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="font-mono text-[11px] uppercase tracking-wider border border-[rgba(220,238,255,0.25)] px-3 py-1.5 text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                Back to Form
              </button>
            </div>

            {/* Score & Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-[rgba(22,64,106,0.3)] border border-[rgba(220,238,255,0.1)] p-4">
              <div className="col-span-1 flex flex-col items-center justify-center text-center p-2 border-r border-[rgba(220,238,255,0.1)] sm:h-full">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getScoreBorderClass(selectedAnalysis.score)}`}>
                  <span className={`text-2xl font-bold font-mono ${getScoreColorClass(selectedAnalysis.score)}`}>
                    {selectedAnalysis.score}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 mt-2 uppercase tracking-widest">
                  Overall Score
                </span>
              </div>
              <div className="col-span-1 sm:col-span-3 flex flex-col gap-2 p-2">
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-300">
                  AI Feedback Summary
                </h4>
                <p className="text-sm text-neutral-100 leading-relaxed">
                  {selectedAnalysis.summaryFeedback}
                </p>
              </div>
            </div>

            {/* Result Tabs */}
            <div className="flex border-b border-[rgba(220,238,255,0.15)] gap-2">
              <button
                onClick={() => setActiveResultTab("summary")}
                className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeResultTab === "summary"
                    ? "border-[#FF8A3D] text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Keywords & Skills
              </button>
              <button
                onClick={() => setActiveResultTab("improvements")}
                className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeResultTab === "improvements"
                    ? "border-[#FF8A3D] text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Improvements
              </button>
              <button
                onClick={() => setActiveResultTab("rewrites")}
                className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeResultTab === "rewrites"
                    ? "border-[#FF8A3D] text-white"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                STAR Rewrites
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[220px]">
              {/* KEYWORDS TAB */}
              {activeResultTab === "summary" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h5 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-2">
                      Skills Identified in Resume
                    </h5>
                    {selectedAnalysis.skillsIdentified ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.skillsIdentified.split(", ").map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-mono bg-[#16406A] border border-[rgba(220,238,255,0.2)] text-neutral-200 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-neutral-400">
                        No specific tech keywords identified.
                      </p>
                    )}
                  </div>

                  {selectedAnalysis.jobDescription && (
                    <div className="border-t border-[rgba(220,238,255,0.1)] pt-4 mt-2">
                      <h5 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-2">
                        Job Description Keyword Match
                      </h5>
                      <p className="text-xs text-neutral-400 mb-3">
                        The keywords below were identified in the target job description. Add the missing ones to increase search relevance.
                      </p>
                      
                      {/* We display missing skills as improvement points inside improvements, but here we can split matching vs missing */}
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-[#57D9A3] mb-1.5">Matching:</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedAnalysis.skillsIdentified && selectedAnalysis.jobDescription ? (
                              // Filter TECH_KEYWORDS that are in both
                              // For demonstration, match logic extracts keywords from both and intersects
                              selectedAnalysis.skillsIdentified.split(", ")
                                .filter(s => selectedAnalysis.jobDescription.toLowerCase().includes(s.toLowerCase()))
                                .map((s, idx) => (
                                  <span key={idx} className="text-xs font-mono bg-[rgba(87,217,163,0.1)] border border-[#57D9A3] text-[#57D9A3] px-2 py-1 rounded">
                                    {s}
                                  </span>
                                ))
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-1">
                          <div className="text-[10px] uppercase font-mono tracking-wider text-[#FF8A3D] mb-1.5">Missing from Resume:</div>
                          <div className="flex flex-wrap gap-2">
                            {/* We can scan the JD for skills and subtract the found ones */}
                            {selectedAnalysis.jobDescription ? (
                              // Parse JD for matching tech keywords
                              // This is simple client side extraction mimicking the backend
                              ["java", "python", "javascript", "typescript", "c++", "golang", "go", "rust", "ruby", "kotlin", "swift", "php", "sql", "html", "css",
                              "spring", "spring boot", "django", "flask", "fastapi", "express", "node.js", "node", "nest.js", "laravel", "rails", "asp.net",
                              "react", "angular", "vue", "next.js", "nuxt", "svelte", "jquery", "tailwind", "bootstrap",
                              "postgresql", "mysql", "mongodb", "redis", "cassandra", "dynamodb", "sqlite", "oracle", "sql server",
                              "docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "git", "github", "gitlab", "terraform", "ansible", "ci/cd",
                              "graphql", "rest", "rest api", "soap", "grpc", "microservices", "serverless",
                              "machine learning", "ml", "artificial intelligence", "ai", "deep learning", "nlp", "tensorflow", "pytorch",
                              "agile", "scrum", "jira", "junit", "testing", "selenium", "pytest", "mocha", "jest",
                              "algorithms", "data structures", "system design", "oop", "object-oriented", "mvc"]
                                .filter(s => selectedAnalysis.jobDescription.toLowerCase().includes(s.toLowerCase()) && 
                                  (!selectedAnalysis.skillsIdentified || !selectedAnalysis.skillsIdentified.toLowerCase().includes(s.toLowerCase())))
                                .map((s, idx) => (
                                  <span key={idx} className="text-xs font-mono bg-[rgba(255,138,61,0.1)] border border-[#FF8A3D] text-[#FF8A3D] px-2 py-1 rounded">
                                    {s}
                                  </span>
                                ))
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IMPROVEMENTS TAB */}
              {activeResultTab === "improvements" && (
                <div className="flex flex-col gap-2">
                  <h5 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-2">
                    Actionable Recommendations
                  </h5>
                  <div className="font-body text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                    {selectedAnalysis.improvements}
                  </div>
                </div>
              )}

              {/* REWRITES TAB */}
              {activeResultTab === "rewrites" && (
                <div className="flex flex-col gap-3">
                  <h5 className="font-mono text-xs uppercase tracking-wider text-neutral-300 mb-1">
                    STAR Bullet Point Optimizer
                  </h5>
                  <p className="text-xs text-neutral-400 mb-2">
                    Here are suggested rewrites for weak phrasing detected in your resume, structured to showcase action, task, and quantifiable results.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    {selectedAnalysis.bulletPointRewrites ? (
                      selectedAnalysis.bulletPointRewrites.split("\n\n").map((rewriteBlock, idx) => {
                        // Split original vs suggested rewrite
                        const lines = rewriteBlock.split("\n");
                        const origLine = lines.find(l => l.startsWith("**Original:**")) || "";
                        const suggLine = lines.find(l => l.startsWith("**Suggested STAR Rewrite:**")) || "";
                        
                        return (
                          <div key={idx} className="border border-[rgba(220,238,255,0.1)] bg-[rgba(22,64,106,0.2)] p-3">
                            <div className="text-xs text-neutral-400 mb-1">
                              {origLine.replace("**Original:**", "Original phrasing:")}
                            </div>
                            <div className="text-sm text-neutral-200 border-l-2 border-[#57D9A3] pl-3 mt-1.5 font-sans leading-relaxed">
                              {/* Remove markdown markers just in case, but formatting bold text is fine */}
                              {suggLine.replace("**Suggested STAR Rewrite:**", "").trim().split("**").map((part, index) => 
                                index % 2 === 1 ? <strong key={index} className="text-[#57D9A3]">{part}</strong> : part
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs font-mono text-neutral-400">No rewrites generated.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
