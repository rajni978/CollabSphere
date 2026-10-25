
import { useState } from "react";
import API_URL from "../../../lib/api";
import ReactMarkdown from "react-markdown";
import "./AIAssistant.css";



const AI_ACTIONS = [
  {
    id: "explain",
    label: "Explain Notes",
    description: "Understand technical notes in simple English",
    placeholder: "Paste your project notes here...",
    field: "content",
  },
  {
    id: "improve",
    label: "Improve Notes",
    description: "Get suggestions to improve your notes",
    placeholder: "Paste the notes you want to improve...",
    field: "content",
  },
  {
    id: "docs",
    label: "Generate Docs",
    description: "Generate documentation from your code",
    placeholder: "Paste your code here...",
    field: "code",
  },
  {
    id: "readme",
    label: "Generate README",
    description: "Create a README.md for your project",
    placeholder: "Enter your project description and/or code...",
    field: "description",
  },
];

export default function AIAssistant() {
  const [activeAction, setActiveAction] = useState("explain");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCopyResponse() {
  try {
    await navigator.clipboard.writeText(result);
  } catch {
    setError("Could not copy the response. Please copy it manually.");
  }
}

  const selectedAction = AI_ACTIONS.find(
    (action) => action.id === activeAction
  );

  async function handleGenerate() {
    setError("");
    setResult("");

    if (!content.trim() && activeAction !== "readme") {
      setError("Please enter some content first.");
      return;
    }

    if (
      activeAction === "readme" &&
      !content.trim() &&
      !description.trim()
    ) {
      setError("Please enter a project description or code.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again to use the AI assistant.");
      return;
    }

    const payload =
      activeAction === "explain" || activeAction === "improve"
        ? { content }
        : activeAction === "docs"
          ? { code: content }
          : { description, code: content };

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/gemini/${activeAction}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI request failed.");
      }

      setResult(data.result || "The AI returned an empty response.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleActionChange(actionId) {
    setActiveAction(actionId);
    setContent("");
    setDescription("");
    setResult("");
    setError("");
  }

  return (
    <section className="ai-assistant">
      <div className="ai-assistant-header">
        <div>
          <span className="ai-eyebrow">POWERED BY GEMINI</span>
          <h2>AI Assistant</h2>
          <p>Your AI partner for notes, code, and documentation.</p>
        </div>
        <div className="ai-header-icon" aria-hidden="true">
          ✦
        </div>
      </div>

      <div className="ai-action-grid">
        {AI_ACTIONS.map((action) => (
          <button
            type="button"
            key={action.id}
            className={`ai-action-card ${
              activeAction === action.id ? "active" : ""
            }`}
            onClick={() => handleActionChange(action.id)}
          >
            <span className="ai-action-title">{action.label}</span>
            <span className="ai-action-description">
              {action.description}
            </span>
          </button>
        ))}
      </div>

      <div className="ai-input-section">
        <label htmlFor="ai-content">
          {activeAction === "readme"
            ? "Code overview (optional)"
            : selectedAction.label}
        </label>

        {activeAction === "readme" && (
          <>
            <label htmlFor="ai-description">Project description</label>
            <textarea
              id="ai-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does your project do?"
              rows={3}
            />
          </>
        )}

        <textarea
          id="ai-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={selectedAction.placeholder}
          rows={7}
        />

        {error && <p className="ai-error" role="alert">{error}</p>}

        <button
          type="button"
          className="ai-generate-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : `✦ ${selectedAction.label}`}
        </button>
      </div>

       
      {(loading || result) && (
        <div className="ai-result">
          <div className="ai-result-header">
            <h3>AI Response</h3>

            {!loading && result && (
              <button
                type="button"
                className="ai-copy-button"
                onClick={handleCopyResponse}
              >
                Copy Response
              </button>
            )}
          </div>

          {loading ? (
            <p>Gemini is working on your request...</p>
          ) : (
            <div className="ai-markdown">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

    </section>
  );
}
