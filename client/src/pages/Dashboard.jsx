
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({onLogout}) {
  const navigate = useNavigate();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [isFetchingProjects, setIsFetchingProjects] = useState(true);

  // Fetch the logged-in user's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {

        setIsFetchingProjects(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }

          throw new Error(
            data.message || "Failed to fetch projects."
          );
        }

        setProjects(data.projects || []);
      } catch (error) {
        setMessage(
          error.message || "Could not load projects."
        );
      }finally{
        setIsFetchingProjects(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  // Create a new project
  const handleCreateProject = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: projectName,
            description: projectDescription,
          }),
        }
      );

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

  // Log out
  const handleLogout = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  // Open project details
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };


const myProjects = projects.filter(
  (project) =>
    String(project.owner?._id || project.owner) ===
    localStorage.getItem("userId")
);

const sharedProjects = projects.filter(
  (project) =>
    String(project.owner?._id || project.owner) !==
    localStorage.getItem("userId")
);

const filteredMyProjects = myProjects.filter((project) =>
  project.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredSharedProjects = sharedProjects.filter((project) =>
  project.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (

    
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-brand">CollabSphere</h2>

        <nav>
          <a href="#dashboard" className="nav-link active">
            Dashboard
          </a>

          <a href="#projects" className="nav-link">
            My Projects
          </a>

          <a href="#notes" className="nav-link">
            Notes
          </a>

          <a href="#settings" className="nav-link">
            Settings
          </a>
        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main dashboard */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your developer workspace.</p>
          </div>

          <button
            className="create-project-btn"
            onClick={() =>
              setShowProjectForm((previous) => !previous)
            }
          >
            + New Project
          </button>
        </header>

        {/* Success and error messages */}
        {message && (
          <p className="status-message" role="status">
            {message}
          </p>
        )}

        {/* Create project form */}
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

        {/* Welcome section */}
        <section className="welcome-card" id="dashboard">
          <h2>Build something amazing together.</h2>

          <p>
            Create projects, share ideas, and collaborate
            with developers in one workspace.
          </p>
        </section>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <article className="stat-card">
            <span>My Projects</span>
            <h2>{projects.length}</h2>
          </article>

          <article className="stat-card">
            <span>Collaborators</span>
            <h2>0</h2>
          </article>

          <article className="stat-card">
            <span>Shared Notes</span>
            <h2>0</h2>
          </article>
        </section>


{/* My Projects */}
<section className="projects-section" id="projects">
  <h2>My Projects</h2>

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
      <h3>
        {myProjects.length === 0
          ? "No projects yet"
          : "No matching projects found"}
      </h3>
      <p>
        {myProjects.length === 0
          ? "Create your first project to get started."
          : "Try searching with a different project name."}
      </p>

      {myProjects.length === 0 && (
        <button onClick={() => setShowProjectForm(true)}>
          Create a project
        </button>
      )}
    </div>
  ) : (
    <div className="project-list">
      {filteredMyProjects.map((project) => (
        <article
          className="stat-card project-card"
          key={project._id}
          onClick={() => handleProjectClick(project._id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleProjectClick(project._id);
            }
          }}
        >
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span>View details →</span>
        </article>
      ))}
    </div>
  )}
</section>

{/* Shared With Me */}
<section className="projects-section">
  <h2>Shared With Me</h2>

  {isFetchingProjects ? (
    <p>Loading shared projects...</p>
  ) : filteredSharedProjects.length === 0 ? (
    <div className="empty-state">
      <h3>
        {sharedProjects.length === 0
          ? "No shared projects yet"
          : "No matching projects found"}
      </h3>
      <p>
        {sharedProjects.length === 0
          ? "Projects other developers share with you will appear here."
          : "Try searching with a different project name."}
      </p>
    </div>
  ) : (
    <div className="project-list">
      {filteredSharedProjects.map((project) => (
        <article
          className="stat-card project-card"
          key={project._id}
          onClick={() => handleProjectClick(project._id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleProjectClick(project._id);
            }
          }}
        >
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <span>Shared project · View details →</span>
        </article>
      ))}
    </div>
  )}
</section>

      </main>
    </div>
  );
}

export default Dashboard;

