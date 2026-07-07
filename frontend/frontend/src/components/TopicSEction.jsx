import { useState } from "react";

function difficultyClass(difficulty) {
  const d = difficulty?.toLowerCase();
  if (d === "easy") return "difficulty-tag difficulty-tag--easy";
  if (d === "medium") return "difficulty-tag difficulty-tag--medium";
  if (d === "hard") return "difficulty-tag difficulty-tag--hard";
  return "difficulty-tag";
}

function statusClass(status) {
  if (status === "SOLVED") return "status-select status-select--solved";
  if (status === "ATTEMPTED") return "status-select status-select--attempted";
  return "status-select";
}

function TopicSection({ topic, problems, statusMap, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const solvedCount = problems.filter((p) => statusMap[p.id] === "SOLVED").length;
  const percent = Math.round((solvedCount / problems.length) * 100);

  return (
    <div className="topic-section">
      <button className="topic-section__header" onClick={() => setOpen(!open)}>
        <span>{open ? "▾" : "▸"} {topic}</span>
        <span className="topic-section__count">{solvedCount}/{problems.length} solved</span>
      </button>

      <div style={{ padding: "0 20px" }}>
        <div className="dim-bar">
          <div className="dim-bar__fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {open && (
        <div className="topic-section__body">
          {problems.map((problem) => (
            <div className="problem-row" key={problem.id}>
              <a href={problem.url} target="_blank" rel="noreferrer">
                {problem.title}
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className={difficultyClass(problem.difficulty)}>
                  {problem.difficulty}
                </span>
                <select
                  className={statusClass(statusMap[problem.id])}
                  value={statusMap[problem.id] || "NOT_STARTED"}
                  onChange={(e) => onStatusChange(problem.id, e.target.value)}
                >
                  <option value="NOT_STARTED">Not started</option>
                  <option value="ATTEMPTED">Attempted</option>
                  <option value="SOLVED">Solved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopicSection;