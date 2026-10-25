
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

const features = [
  {
    icon: "⌘",
    title: "Project Collaboration",
    description: "Create projects, invite teammates, and organize your development work.",
  },
  {
    icon: "▤",
    title: "Markdown Notes",
    description: "Write, save, and improve project documentation with AI.",
  },
  {
    icon: "▣",
    title: "File Upload & Preview",
    description: "Upload project files, preview code, and explore your work.",
  },
  {
    icon: "✧",
    title: "AI-Powered Tools",
    description: "Explain code, improve notes, and generate documentation with Gemini.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <nav className="landing-navbar">
        <Link to="/" className="landing-brand">
          <span className="landing-logo">✦</span>
          <span>CollabSphere</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-actions">
          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="landing-signup-btn"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="landing-hero" id="about">
        <div className="landing-hero-content">
          <span className="landing-eyebrow">
            ✨ AI-powered collaboration for developers
          </span>

          <h1>
            Build, Collaborate
            <br />
            and Create <span>with AI.</span>
          </h1>

          <p>
            A smarter workspace for developers to manage projects,
            collaborate with teams, write documentation, and turn
            ideas into better software with AI.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-primary-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started <span>→</span>
            </button>

            <a className="landing-secondary-btn" href="#features">
              Explore Features
            </a>
          </div>

          <div className="landing-trust-note">
            <span className="landing-trust-dot" />
            One workspace. Your team. Smarter development.
          </div>
        </div>

        <div className="landing-hero-visual" aria-label="Developer workspace preview">
          <div className="landing-orb landing-orb-one" />
          <div className="landing-orb landing-orb-two" />

          <div className="landing-code-window">
            <div className="landing-window-header">
              <div className="landing-window-dots">
                <span />
                <span />
                <span />
              </div>
              <span>project.js</span>
              <span className="landing-window-status">AI ready</span>
            </div>

            <div className="landing-code-content">
              <div className="landing-code-line">
                <span>01</span> <span className="code-purple">const</span> project = {"{"}
              </div>
              <div className="landing-code-line">
                <span>02</span> &nbsp; name: <span className="code-green">"CollabSphere"</span>,
              </div>
              <div className="landing-code-line">
                <span>03</span> &nbsp; collaboration: <span className="code-blue">true</span>,
              </div>
              <div className="landing-code-line">
                <span>04</span> &nbsp; poweredBy: <span className="code-green">"Gemini AI"</span>
              </div>
              <div className="landing-code-line">
                <span>05</span> {"}"};
              </div>
              <div className="landing-code-spacer" />
              <div className="landing-code-line">
                <span>06</span> <span className="code-purple">await</span> buildSomethingGreat();
              </div>
            </div>
          </div>

          <div className="landing-floating-card landing-ai-card">
            <span className="landing-floating-icon">✧</span>
            <div>
              <strong>AI Assistant</strong>
              <small>Ready to help you build</small>
            </div>
            <span className="landing-online-dot" />
          </div>

          <div className="landing-floating-card landing-team-card">
            <div className="landing-avatar-stack">
              <span>R</span>
              <span>N</span>
              <span>K</span>
            </div>
            <div>
              <strong>Better together</strong>
              <small>Team collaboration</small>
            </div>
          </div>

          <div className="landing-visual-caption">
            <span>✦</span> Your ideas, organized and AI-enhanced.
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-heading">
          <span>BUILT FOR YOUR WORKFLOW</span>
          <h2>Everything your team needs to build better</h2>
          <p>
            From project planning to AI-powered documentation,
            keep your development workflow in one place.
          </p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature, index) => (
            <article className="landing-feature-card" key={feature.title}>
              <div className={`landing-feature-icon feature-icon-${index}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <a href="#how-it-works">
                Explore feature <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-how-it-works" id="how-it-works">
        <div>
          <span className="landing-section-label">A SIMPLER WORKFLOW</span>
          <h2>Less switching. More building.</h2>
          <p>
            Bring your projects, team discussions, notes, files,
            and AI assistance into a single developer workspace.
          </p>
        </div>

        <button
          className="landing-primary-btn"
          onClick={() => navigate("/signup")}
        >
          Start building <span>→</span>
        </button>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-brand">
          <span className="landing-logo">✦</span>
          <span>CollabSphere</span>
        </Link>
        <p>Built for developers who create together.</p>
        <span>AI-powered developer collaboration platform</span>
      </footer>
    </main>
  );
}
