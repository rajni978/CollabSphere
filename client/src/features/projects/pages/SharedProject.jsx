
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API_URL from "../../../lib/api";

export default function SharedProject() {
  const { shareToken } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedProject = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/projects/public/${encodeURIComponent(shareToken)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load shared project.");
        }

        setProject(data.project);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedProject();
  }, [shareToken]);

  if (loading) {
    return <main className="shared-project-page"><p>Loading shared project...</p></main>;
  }

  if (error || !project) {
    return (
      <main className="shared-project-page">
        <h1>Project unavailable</h1>
        <p>{error || "This shared project could not be found."}</p>
        <Link to="/">Go to CollabSphere</Link>
      </main>
    );
  }

  return (
    <main className="shared-project-page">
      <header className="shared-project-header">
        <Link to="/" className="shared-project-brand">CollabSphere</Link>
        <span>Shared project</span>
      </header>

      <section className="shared-project-card">
        <p className="shared-project-label">PUBLIC PROJECT</p>
        <h1>{project.name}</h1>
        <p className="shared-project-description">{project.description}</p>
        {project.createdAt && (
          <p className="shared-project-date">
            Created on{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        )}
      </section>

      <footer className="shared-project-footer">
        Shared with CollabSphere
      </footer>
    </main>
  );
}
