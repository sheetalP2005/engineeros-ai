import { useState } from "react";
import ProblemList from "./components/ProblemList";
import Notes from "./components/Notes";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import AuthScreen from "./components/AuthScreen";
import { isLoggedIn, logout, getUsername } from "./api/auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [activeTab, setActiveTab] = useState("problems");

  if (!loggedIn) {
    return <AuthScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  function handleLogout() {
    logout();
    setLoggedIn(false);
  }

  return (
    <div className="page">
      <header className="title-block">
        <div>
          <h1>EngineerOS AI</h1>
          <p>DSA Tracker — Sheet 01</p>
        </div>
        <div className="title-block__meta">
          <div>Rev. 2026.07</div>
          <div>210 problems</div>
        </div>
      </header>

      <div className="logout-bar">
        <span>Logged in as {getUsername()}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "problems" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("problems")}
        >
          Problems
        </button>
        <button
          className={`tab ${activeTab === "notes" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
        <button
          className={`tab ${activeTab === "resume" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("resume")}
        >
          Resume Analyzer
        </button>
      </div>

      {activeTab === "problems" ? (
        <ProblemList />
      ) : activeTab === "notes" ? (
        <Notes />
      ) : (
        <ResumeAnalyzer />
      )}
    </div>
  );
}

export default App;