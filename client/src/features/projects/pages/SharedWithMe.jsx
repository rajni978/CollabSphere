
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../lib/api";
import AppSidebar from "../components/AppSidebar";
import "./SharedWithMe.css";

export default function SharedWithMe({ onLogout }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            onLogout?.();
            return;
          }

          throw new Error(data.message || "Failed to load projects.");
        }

      const currentUserId = String(localStorage.getItem("userId") || "");

const sharedProjects = (data.projects || []).filter((project) => {
  const ownerId = String(project.owner?._id || project.owner || "");

  const isMember = (project.members || []).some((member) => {
    const memberId = String(member?._id || member || "");
    return memberId === currentUserId;
  });

  return (
    currentUserId !== "" &&
    isMember &&
    ownerId !== currentUserId
  );
});

setProjects(sharedProjects);
      } catch (err) {
        setError(err.message || "Could not load shared projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate, onLogout]);

  return (
    <div className="dashboard">
      <AppSidebar active="Shared with Me" onLogout={onLogout} />

      <main className="dashboard-main shared-with-me-main">
        <header className="shared-with-me-header">
          <div>
            <p className="shared-with-me-eyebrow">WORKSPACE</p>
            <h1>Shared with Me</h1>
            <p>Projects other people have invited you to collaborate on.</p>
          </div>
          <span className="shared-with-me-count">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </header>

        {loading ? (
          <p className="shared-with-me-message">Loading shared projects...</p>
        ) : error ? (
          <p className="shared-with-me-error" role="alert">{error}</p>
        ) : projects.length === 0 ? (
          <section className="shared-with-me-empty">
            <div className="shared-with-me-empty-icon">♧</div>
            <h2>No shared projects yet</h2>
            <p>When someone adds you as a project collaborator, it will appear here.</p>
            <button type="button" onClick={() => navigate("/projects")}>
              Browse My Projects
            </button>
          </section>
        ) : (
          <section className="shared-with-me-grid">
            {projects.map((project) => (
              <article className="shared-with-me-card" key={project._id}>
                <div className="shared-with-me-card-top">
                  <span className="shared-with-me-project-icon">▣</span>
                  <span className="shared-with-me-badge">Shared</span>
                </div>

                <h2>{project.name}</h2>
                <p className="shared-with-me-description">
                  {project.description || "No description provided."}
                </p>

                <div className="shared-with-me-card-footer">
                  <span>
                    Updated{" "}
                    {project.updatedAt
                      ? new Date(project.updatedAt).toLocaleDateString()
                      : "recently"}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    Open project →
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
