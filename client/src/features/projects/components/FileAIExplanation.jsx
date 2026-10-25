
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import API_URL from "../../../lib/api";
import "./FileAIExplanation.css";

function FileAIExplanation({ projectId, file }) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    if (!file?._id) return;

    setLoading(true);
    setExplanation("");
    setError("");
    setCopied(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/files/projects/${projectId}/${file._id}/explain`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not explain this file.");
      }

      setExplanation(data.result || "No explanation was returned.");
    } catch (err) {
      setError(err.message || "Could not explain this file.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setError("");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the explanation. Please copy it manually.");
    }
  };

  return (
    <div className="file-ai-explanation">
      <button
        type="button"
        onClick={handleExplain}
        disabled={loading}
      >
        {loading ? "Explaining with Gemini..." : "Explain with Gemini"}
      </button>

      {error && (
        <p className="file-ai-error" role="alert">
          {error}
        </p>
      )}

      {explanation && (
        <div className="file-ai-result">
          <div className="file-ai-result-header">
            <h4>Gemini Explanation</h4>

            <button
              type="button"
              className="file-ai-copy-button"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy Explanation"}
            </button>
          </div>

          <div className="file-ai-markdown">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileAIExplanation;
