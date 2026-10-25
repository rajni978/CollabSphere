import API_URL from "../../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AIAssistant from "../components/AIAssistant";
import "./Dashboard.css";

const FAVORITES_KEY = "collabsphere_favorites";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);
  const [activities, setActivities] = useState([]);
  const [isFetchingActivities, setIsFetchingActivities] = useState(false);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Rajni";

  // Show only projects owned by the logged-in user.
  const ownedProjects = projects.filter(
    (project) =>
      String(project.owner?._id || project.owner) === userId
  );

  // Search and sort projects so the dashboard can show a small preview.
  const filteredProjects = [...ownedProjects]
    .filter((project) =>
      `${project.name || ""} ${project.description || ""}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.updatedAt || b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });

  const recentProjects = filteredProjects.slice(0, 3);

  const collaboratorCount = new Set(
    ownedProjects.flatMap((project) =>
      (project.members || []).map((member) =>
        String(member?._id || member)
      )
    )
  ).size;

  // Load projects.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsFetchingProjects(true);

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
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
            onLogout();
            return;
          }

          throw new Error(
            data.message || "Failed to fetch projects."
          );
        }

        setProjects(data.projects || []);
      } catch (error) {
        setMessage(error.message || "Could not load projects.");
      } finally {
        setIsFetchingProjects(false);
      }
    };

    fetchProjects();
  }, [navigate, onLogout]);

  // Load the notes count.
  useEffect(() => {
    const fetchNotesCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/projects/notes-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch notes count."
          );
        }

        setNotesCount(data.count ?? 0);
      } catch (error) {
        console.error("Fetch notes count error:", error);
      }
    };

    fetchNotesCount();
  }, []);

  // Load recent activity from the user's projects.
  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem("token");

      if (!token || projects.length === 0) {
        setActivities([]);
        setIsFetchingActivities(false);
        return;
      }

      setIsFetchingActivities(true);

      try {
        const results = await Promise.all(
          projects.map(async (project) => {
            const response = await fetch(
              `${API_URL}/api/projects/${project._id}/activities`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error(
                "Failed to fetch project activity."
              );
            }

            const data = await response.json();
            return data.activities || [];
          })
        );

        const allActivities = results.flat();

        allActivities.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setActivities(allActivities.slice(0, 3));
      } catch (error) {
        console.error("Fetch activities error:", error);
      } finally {
        setIsFetchingActivities(false);
      }
    };

    fetchActivities();
  }, [projects]);

  // Create a project.
  const handleCreateProject = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        throw new Error(
          data.message || "Failed to create project."
        );
      }

      setProjects((previousProjects) => [
        data.project,
        ...previousProjects,
      ]);

      setProjectName("");
      setProjectDescription("");
      setShowProjectForm(false);
      setMessage("Project created successfully!");
    } catch (error) {
      setMessage(
        error.message || "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    window.location.replace("/");
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="dashboard">
      <AppSidebar
        active="Dashboard"
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-header">
          <div className="dashboard-search">
            <input
              type="search"
              placeholder="Search projects..."
              aria-label="Search projects"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="dashboard-user">
        <button
  type="button"
  className="notification-icon"
  aria-label="Notifications"
  title="Notifications"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </svg>
</button>

            <span className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </span>

            <span>{userName}⌄</span>
          </div>
        </header>

        {/* Welcome section */}
        <section className="dashboard-welcome">
          <div>
            <h1>Welcome back {userName}!</h1>
            <p>Here's what's happening with your projects.</p>
          </div>

          <button
            type="button"
            className="create-project-btn"
            onClick={() =>
              setShowProjectForm((previous) => !previous)
            }
            aria-expanded={showProjectForm}
          >
            {showProjectForm
              ? "− Close Form"
              : "+ New Project"}
          </button>
        </section>

        {message && (
          <p className="status-message" role="status">
            {message}
          </p>
        )}

        {/* Create-project form */}
        {showProjectForm && (
          <section className="project-form-card">
            <h2>Create a New Project</h2>
            <p>Create a project in your workspace.</p>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
                required
              />

              <textarea
                placeholder="Describe your project"
                rows="3"
                value={projectDescription}
                onChange={(event) =>
                  setProjectDescription(event.target.value)
                }
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </section>
        )}

        {/* Statistics */}
        <section className="stats-grid">
          <article className="stat-card">
            <span>Total Projects</span>
            <h2>{ownedProjects.length}</h2>
          </article>

          <article className="stat-card">
            <span>Collaborators</span>
            <h2>{collaboratorCount}</h2>
          </article>

          <article className="stat-card">
            <span>Notes</span>
            <h2>{notesCount}</h2>
          </article>
        </section>

        {/* Recent projects */}
        <section className="projects-section">
          <div className="projects-heading">
            <div>
              <h2>Recent Projects</h2>
              <p className="section-subtitle">
                Pick up where you left off.
              </p>
            </div>

            <button
              type="button"
              className="view-all-btn"
              onClick={() => navigate("/projects")}
            >
              View All →
            </button>
          </div>

          {isFetchingProjects ? (
            <p>Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <h3>
                {searchTerm
                  ? "No matching projects"
                  : "No projects yet"}
              </h3>

              <p>
                {searchTerm
                  ? "Try another project name or description."
                  : "Create your first project to get started."}
              </p>

              {!searchTerm && (
                <button
                  className="create-project-btn"
                  onClick={() => setShowProjectForm(true)}
                >
                  + Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="project-list">
              {recentProjects.map((project) => (
                <article
                  className="stat-card project-card"
                  key={project._id}
                  onClick={() =>
                    handleProjectClick(project._id)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      handleProjectClick(project._id);
                    }
                  }}
                >
                  <div className="project-card-top">
                    <div
                      className="project-folder"
                      aria-hidden="true"
                    >
                      📁
                    </div>

              
                  </div>

                  <h3>{project.name}</h3>

                  <p>
                    {project.description ||
                      "No description provided."}
                  </p>

                  <span>View details →</span>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="activity-section">
          <div className="activity-heading">
            <div>
              <h2>Recent Activity</h2>
              <p className="section-subtitle">
                The latest updates across your projects.
              </p>
            </div>
          </div>

          {isFetchingActivities ? (
            <p>Loading activity...</p>
          ) : activities.length === 0 ? (
            <div className="empty-state">
              <h3>No recent activity</h3>
              <p>
                Project updates will appear here when available.
              </p>
            </div>
          ) : (
            <div className="activity-list">
              {activities.map((activity) => (
                <article
                  className="activity-item"
                  key={activity._id}
                >
                  <div className="activity-dot" />

                  <div className="activity-content">
                    <p>{activity.description}</p>
                    <span>
                      {activity.user?.name || "A team member"} ·{" "}
                      {new Date(
                        activity.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Collapsible AI Assistant */}
        <details className="dashboard-ai-panel">
          <summary>
            <span
              className="ai-summary-icon"
              aria-hidden="true"
            >
              ✦
            </span>

            <span className="ai-summary-copy">
              <strong>AI Assistant</strong>
              <small>
                Explain notes, improve writing, and generate
                documentation.
              </small>
            </span>

            <span className="ai-summary-action">
              Open assistant{" "}
              <span aria-hidden="true">⌄</span>
            </span>
          </summary>

          <div className="dashboard-ai-content">
            <AIAssistant />
          </div>
        </details>
      </main>
    </div>
  );
}

export default Dashboard;