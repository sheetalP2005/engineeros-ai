import { useState } from "react";
import { login, register } from "../api/auth";

function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (mode === "login") {
      login(username, password)
        .then(() => onLoginSuccess())
        .catch((err) => setError(err.message));
    } else {
      register(username, password)
        .then(() => {
          setInfo("Account created — you can log in now.");
          setMode("login");
        })
        .catch((err) => setError(err.message));
    }
  }

  return (
    <div className="auth-screen">
      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
      <p>EngineerOS AI — DSA Tracker</p>

      {error && <div className="auth-error">{error}</div>}
      {info && <div style={{ color: "var(--color-solved)", fontFamily: "var(--font-mono)", fontSize: "12px", marginBottom: "12px" }}>{info}</div>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
      </form>

      <button
        className="switch-link"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError(null);
          setInfo(null);
        }}
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default AuthScreen;