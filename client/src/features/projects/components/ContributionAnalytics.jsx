
import { useEffect, useState } from "react";
import API_URL from "../../../lib/api";
import "./ContributionAnalytics.css";

function ContributionAnalytics({ projectId }) {
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/projects/${projectId}/analytics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load contribution analytics."
          );
        }

        setAnalytics(data.analytics || []);
        setSummary(data.summary || null);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchAnalytics();
    }
  }, [projectId]);

  if (loading) {
    return (
      <section className="contribution-analytics">
        <h2>Contribution Analytics</h2>
        <p>Loading analytics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="contribution-analytics">
        <h2>Contribution Analytics</h2>
        <p className="analytics-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="contribution-analytics">
      <h2>Contribution Analytics</h2>
      <p className="analytics-description">
        See how each collaborator contributes to this project.
      </p>

      {summary && (
        <div className="analytics-summary">
          <article className="analytics-card">
            <span>Total Contributions</span>
            <strong>{summary.totalContributions ?? 0}</strong>
          </article>

          <article className="analytics-card">
            <span>Notes Created</span>
            <strong>{summary.notesCreated ?? 0}</strong>
          </article>

          <article className="analytics-card">
            <span>Notes Updated</span>
            <strong>{summary.notesUpdated ?? 0}</strong>
          </article>

          <article className="analytics-card">
            <span>Files Uploaded</span>
            <strong>{summary.filesUploaded ?? 0}</strong>
          </article>
        </div>
      )}

      <h3>Collaborator Contributions</h3>

      {analytics.length === 0 ? (
        <p>No contribution data available yet.</p>
      ) : (
        <div className="analytics-table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Collaborator</th>
                <th>Notes Created</th>
                <th>Notes Updated</th>
                <th>Files Uploaded</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {analytics.map((item) => (
                <tr key={item.user._id}>
                  <td>
                    <strong>{item.user.name || "Unknown user"}</strong>
                    <small>{item.user.email || ""}</small>
                  </td>
                  <td>{item.notesCreated ?? 0}</td>
                  <td>{item.notesUpdated ?? 0}</td>
                  <td>{item.filesUploaded ?? 0}</td>
                  <td>
                    <strong>{item.totalContributions ?? 0}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ContributionAnalytics;
