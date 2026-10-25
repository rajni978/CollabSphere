
import { useEffect, useState } from "react";
import API_URL from "../../../lib/api";
import "./ProjectSharing.css";

export default function ProjectSharing({ projectId, project }) {
  const [shareToken, setShareToken] = useState(
    project?.isPublic ? project?.shareToken || "" : ""
  );
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    setShareToken(
      project?.isPublic ? project?.shareToken || "" : ""
    );
  }, [project?.isPublic, project?.shareToken]);

  const handleEnableSharing = async () => {
    setShareLoading(true);
    setShareError("");
    setShareMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/share`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not enable sharing.");
      }

      setShareToken(data.shareToken);
      setShareMessage("Public sharing enabled!");
    } catch (error) {
      setShareError(error.message || "Could not enable sharing.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleDisableSharing = async () => {
    setShareLoading(true);
    setShareError("");
    setShareMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/share`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not disable sharing.");
      }

      setShareToken("");
      setShareMessage("Public sharing has been disabled.");
    } catch (error) {
      setShareError(error.message || "Could not disable sharing.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    const link = `${window.location.origin}/shared/${shareToken}`;

    try {
      await navigator.clipboard.writeText(link);
      setShareMessage("Share link copied to clipboard!");
      setShareError("");
    } catch {
      setShareError("Could not copy the link. Please copy it manually.");
    }
  };

  const shareLink = shareToken
    ? `${window.location.origin}/shared/${shareToken}`
    : "";

  return (
    <section className="project-sharing-section">
      <div className="project-sharing-heading">
        <div>
          <h2>Public Project Sharing</h2>
          <p>
            Share your project overview with anyone using a public link.
          </p>
        </div>
        <span className={`sharing-status ${shareToken ? "sharing-enabled" : ""}`}>
          {shareToken ? "Public" : "Private"}
        </span>
      </div>

      {!shareToken ? (
        <button
          type="button"
          onClick={handleEnableSharing}
          disabled={shareLoading}
        >
          {shareLoading ? "Enabling..." : "Generate Share Link"}
        </button>
      ) : (
        <div className="project-sharing-link-area">
          <label htmlFor="projectShareLink">Your shareable link</label>
          <input
            id="projectShareLink"
            type="text"
            value={shareLink}
            readOnly
            onFocus={(event) => event.target.select()}
          />

          <div className="project-sharing-actions">
            <button
              type="button"
              onClick={handleCopyShareLink}
              disabled={shareLoading}
            >
              Copy Link
            </button>

            <button
              type="button"
              className="disable-sharing-button"
              onClick={handleDisableSharing}
              disabled={shareLoading}
            >
              {shareLoading ? "Please wait..." : "Disable Sharing"}
            </button>
          </div>
        </div>
      )}

      {shareMessage && (
        <p className="sharing-success" role="status">{shareMessage}</p>
      )}

      {shareError && (
        <p className="sharing-error" role="alert">{shareError}</p>
      )}

      <p className="sharing-note">
        Public visitors can see the project name and description. Your private
        notes, collaborator details, and files are not included in this page.
      </p>
    </section>
  );
}
