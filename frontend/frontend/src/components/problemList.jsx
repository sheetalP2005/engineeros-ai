import { useState, useEffect } from "react";
import { getAllProblems } from "../api/problems";
import { getAllAttempts, recordAttempt } from "../api/attempts";
import TopicSection from "./TopicSection";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllProblems(), getAllAttempts()])
      .then(([problemsData, attemptsData]) => {
        setProblems(problemsData);
        const map = {};
        attemptsData.forEach((attempt) => {
          map[attempt.problem.id] = attempt.status;
        });
        setStatusMap(map);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusChange(problemId, newStatus) {
    setStatusMap((prev) => ({ ...prev, [problemId]: newStatus }));
    recordAttempt(problemId, newStatus, "").catch((err) => setError(err.message));
  }

  if (loading) return <p style={{ fontFamily: "var(--font-mono)" }}>Loading...</p>;
  if (error) return <p style={{ color: "var(--color-accent)" }}>Error: {error}</p>;

  const grouped = {};
  problems.forEach((p) => {
    if (!grouped[p.topic]) grouped[p.topic] = [];
    grouped[p.topic].push(p);
  });

  const totalSolved = Object.values(statusMap).filter((s) => s === "SOLVED").length;
  const overallPercent = Math.round((totalSolved / problems.length) * 100) || 0;

  return (
    <div>
      <div className="dim-bar__label">
        <span>Overall progress</span>
        <span>{totalSolved}/{problems.length}</span>
      </div>
      <div className="dim-bar">
        <div className="dim-bar__fill" style={{ width: `${overallPercent}%` }} />
      </div>

      {Object.entries(grouped).map(([topic, topicProblems]) => (
        <TopicSection
          key={topic}
          topic={topic}
          problems={topicProblems}
          statusMap={statusMap}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}

export default ProblemList;