import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../lib/api";
import "./AuthPage.css";

export default function AuthPage({ initialMode = "login", onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password } : { name, email, password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        onLogin?.();
        navigate("/dashboard");
      } else {
        setMessage("Registration successful! You can now log in.");
        setIsLogin(true);
        setName("");
        setPassword("");
      }

      setEmail("");
    } catch (error) {
      setMessage(error.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="auth-page">
    <section className="auth-layout">
      {/* Left: Login form */}
      <div className="auth-form-panel">
        <div className="brand">
          <div className="brand-icon">C</div>
          <h1>CollabSphere</h1>
        </div>

        <div className="auth-heading">
          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p>
            {isLogin
              ? "Login to your account"
              : "Join your team and start collaborating"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create account"}
          </button>
        </form>

        {message && (
          <p className="status-message" role="status">
            {message}
          </p>
        )}

        <p className="auth-switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>

      {/* Right: Promotional panel */}
      <aside className="auth-promo-panel">
        <div className="promo-decoration promo-decoration-top" />
        <div className="promo-decoration promo-decoration-bottom" />

        <div className="promo-content">
          <span className="promo-eyebrow">BUILD TOGETHER</span>
          <h2>Join CollabSphere</h2>
          <p>
            Collaborate, document and build amazing projects with the power of AI.
          </p>

          <ul className="promo-features">
            <li>
              <span className="promo-feature-icon">✦</span>
              <span>Create and manage projects</span>
            </li>
            <li>
              <span className="promo-feature-icon">♧</span>
              <span>Collaborate with team members</span>
            </li>
            <li>
              <span className="promo-feature-icon">✧</span>
              <span>Use AI to explain code and generate documentation</span>
            </li>
            <li>
              <span className="promo-feature-icon">↗</span>
              <span>Share your work with the community</span>
            </li>
          </ul>
        </div>

        <div className="promo-footer">
          <span className="promo-status-dot" />
          A better way to build together
        </div>
      </aside>
    </section>
  </main>
);
}