
import API_URL from "../../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectDetail.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load project.");
        }

        setProject(data.project);
      } catch (err) {
        setError(err.message || "Unable to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return <main className="project-details-page"><p>Loading project...</p></main>;
  }

  if (error || !project) {
    return (
      <main className="project-details-page  workspace-page">
        <p>{error || "Project not found."}</p>
        <button type="button" onClick={() => navigate("/projects")}>
          Back to My Projects
        </button>
      </main>
    );
  }

  return (
    <main className="project-details-page">
      <div className="project-details-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/projects")}
        >
          ← Back to My Projects
        </button>

        <header className="workspace-header">
          <div className="workspace-title-row">
            <div className="workspace-project-icon">CS</div>
            <div className="workspace-title-content">
              <p className="workspace-breadcrumb">
                CollabSphere / Projects / {project.name}
              </p>
              <h1>{project.name}</h1>
              <p>{project.description || "No description provided."}</p>
            </div>
          </div>
          <span className="workspace-status">Project Details</span>
        </header>

        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">PROJECT SUMMARY</p>
              <h2>About this project</h2>
              <p>
                Review your project information before opening the workspace.
              </p>
            </div>
          </div>

          <div className="workspace-settings-card">
            <h3>Project Information</h3>
            <p>
              <strong>Name:</strong> {project.name}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {project.description || "No description provided."}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "Not available"}
            </p>
            <p>
              <strong>Collaborators:</strong>{" "}
              {project.members?.length || 0}
            </p>

            <button
              type="button"
              className="workspace-primary-button"
              onClick={() => navigate(`/projects/${id}/workspace`)}
            >
              Open Workspace →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProjectDetails;
