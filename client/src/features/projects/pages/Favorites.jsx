
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../lib/api";
import AppSidebar from "../components/AppSidebar";
import "./Favorites.css";

const FAVORITES_KEY = "collabsphere_favorites";

export default function Favorites({ onLogout }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    } catch {
      return [];
    }
  });
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
          headers: { Authorization: `Bearer ${token}` },
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

        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message || "Could not load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate, onLogout]);

  const toggleFavorite = (projectId) => {
    setFavoriteIds((previous) => {
      const next = previous.includes(projectId)
        ? previous.filter((id) => id !== projectId)
        : [...previous, projectId];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const favoriteProjects = projects.filter((project) =>
    favoriteIds.includes(project._id)
  );

  return (
    <div className="dashboard">
      <AppSidebar active="Favorites" onLogout={onLogout} />

      <main className="dashboard-main favorites-main">
        <header className="favorites-header">
          <div>
            <p className="favorites-eyebrow">YOUR WORKSPACE</p>
            <h1>Favorite Projects</h1>
            <p>Keep your most important projects close at hand.</p>
          </div>
          <span className="favorites-count">
            {favoriteProjects.length} saved
          </span>
        </header>

        {loading ? (
          <p className="favorites-message">Loading projects...</p>
        ) : error ? (
          <p className="favorites-error" role="alert">{error}</p>
        ) : favoriteProjects.length === 0 ? (
          <section className="favorites-empty">
            <div className="favorites-empty-icon">☆</div>
            <h2>No favorites yet</h2>
            <p>Save projects here by selecting the star on a project card.</p>
            <button type="button" onClick={() => navigate("/projects")}>
              Browse My Projects
            </button>
          </section>
        ) : (
          <section className="favorites-grid">
            {favoriteProjects.map((project) => (
              <article className="favorites-card" key={project._id}>
                <div className="favorites-card-top">
                  <span className="favorites-project-icon">▣</span>
                  <button
                    type="button"
                    className="favorites-star is-favorite"
                    aria-label={`Remove ${project.name} from favorites`}
                    title="Remove from favorites"
                    onClick={() => toggleFavorite(project._id)}
                  >
                    ★
                  </button>
                </div>

                <h2>{project.name}</h2>
                <p className="favorites-description">
                  {project.description || "No description provided."}
                </p>

                <div className="favorites-card-footer">
                  <span>Saved project</span>
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
