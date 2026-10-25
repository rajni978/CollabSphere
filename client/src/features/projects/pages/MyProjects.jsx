
import API_URL from "../../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import "./Dashboard.css";

function MyProjects({ onLogout }) {
  console.log("MyProjects component is running");
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch projects.");
        }

        setProjects(data.projects || []);
      } catch (error) {
        setMessage(error.message || "Unable to load projects.");
      } finally {
        setIsFetchingProjects(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const userId = localStorage.getItem("userId");

  const myProjects = projects.filter(
    (project) => String(project.owner?._id || project.owner) === userId
  );
  console.log("Projects from API:", projects);
console.log("Logged-in user ID:", userId);
console.log("My projects:", myProjects);



  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMyProjects = myProjects.filter((project) =>
    project.name?.toLowerCase().includes(normalizedSearch)
  );

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

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
        throw new Error(data.message || "Failed to create project.");
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
      setMessage(error.message || "Unable to create project.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="dashboard">
   

<AppSidebar active="My Projects" onLogout={handleLogout} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Projects</h1>
           <p>Manage your projects, track progress, and organize your work.</p>
          </div>

          <button
            className="create-project-btn"
            onClick={() => setShowProjectForm((previous) => !previous)}
          >
            + New Project
          </button>
        </header>

        {message && (
          <p className="status-message" role="status">
            {message}
          </p>
        )}

        {showProjectForm && (
          <section className="project-form-card">
            <h2>Create a New Project</h2>
            <p>Create a project in your workspace.</p>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
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

        <section className="projects-section">
          <h2>Your Projects ({myProjects.length})</h2>

          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {isFetchingProjects ? (
            <p>Loading projects...</p>
          ) : filteredMyProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>
                {searchTerm
                  ? "Try another search term."
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
              {filteredMyProjects.map((project) => (
             
<article className="stat-card project-card" key={project._id}>
  <h3>{project.name}</h3>
  <p>{project.description || "No description provided."}</p>

  <div className="project-card-actions">
    <button
      type="button"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      View Details
    </button>

    <button
      type="button"
      onClick={() =>
        navigate(`/projects/${project._id}/workspace`)
      }
    >
      Open Workspace →
    </button>
  </div>
</article>

              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyProjects;
