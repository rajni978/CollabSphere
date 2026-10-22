import API_URL from "../../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({onLogout}) {
  const navigate = useNavigate();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [notesCount, setNotesCount] = useState(0);
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(true);

  const [activities, setActivities] = useState([]);
const [isFetchingActivities, setIsFetchingActivities] = useState(false);

  const userId = localStorage.getItem("userId");

const ownedProjects = projects.filter(
  (project) =>
    String(project.owner?._id || project.owner) === userId
);

const collaboratorCount = new Set(
  ownedProjects.flatMap((project) =>
    (project.members || []).map((member) =>
      String(member?._id || member)
    )
  )
).size;

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
         `${API_URL}/api/projects` ,
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

  useEffect(() => {
  const fetchNotesCount = async () => {
    try {
      const token = localStorage.getItem("token");

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

      setNotesCount(data.count);
    } catch (error) {
      console.error("Fetch notes count error:", error);
    }
  };

  fetchNotesCount();
}, []);

useEffect(() => {

  const fetchActivities = async() => {

    const token = localStorage.getItem("token");

    if(!token || projects.length ===0){
      setActivities([]);
      setIsFetchingActivities(false);
      return;
    }

    setIsFetchingActivities(true);


    try {
      const results = await Promise.all(
        projects.map(async (project) => {
          const response = await fetch(
           `${API_URL}/api/projects/${project._id}/activities` ,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch project activity.");
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

      setActivities(allActivities.slice(0, 5));
    } catch (error) {
      console.error("Fetch activities error:", error);
    } finally {
      setIsFetchingActivities(false);
    }
  };

  fetchActivities();

},[projects]);

  // Create a new project
  const handleCreateProject = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects`,
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





  return (


    <div className="dashboard">

      {/* Sidebar */}

      <aside className="sidebar">
  <h2 className="sidebar-brand">CollabSphere</h2>

  <nav>
    <button
      className="nav-link active"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </button>

    <button
      className="nav-link"
      onClick={() => navigate("/projects")}
    >
      My Projects
    </button>
  </nav>

  <button className="logout-btn" onClick={handleLogout}>
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
            <h2>{ownedProjects.length}</h2>

          </article>

        <article className="stat-card">
  <span>Collaborators</span>
  <h2>{collaboratorCount}</h2>
</article>

          <article className="stat-card">
            <span>Shared Notes</span>
            <h2>{notesCount}</h2>
          </article>
        </section>

        <section className="projects-section">
  <h2>Your Projects</h2>

  {isFetchingProjects ? (
    <p>Loading projects...</p>
  ) : ownedProjects.length === 0 ? (
    <div className="empty-state">
      <h3>No projects yet</h3>
      <p>Create your first project to get started.</p>
      <button
        className="create-project-btn"
        onClick={() => setShowProjectForm(true)}
      >
        + Create Project
      </button>
    </div>
  ) : (
    <div className="project-list">
      {ownedProjects.map((project) => (
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

<section className="activity-section">
  <h2>Recent Activity</h2>

  {isFetchingActivities ? (
    <p>Loading activity...</p>
  ) : activities.length === 0 ? (
    <div className="empty-state">
      <h3>No recent activity</h3>
      <p>Project updates will appear here when available.</p>
    </div>
  ) : (
    <div className="activity-list">
      {activities.map((activity) => (
        <article className="activity-item" key={activity._id}>
          <div className="activity-dot" />

          <div className="activity-content">
            <p>{activity.description}</p>

            <span>
              {activity.user?.name || "A team member"} ·{" "}
              {new Date(activity.createdAt).toLocaleString()}
            </span>
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

export default Dashboard;

