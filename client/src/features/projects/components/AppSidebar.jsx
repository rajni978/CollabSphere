
import { useNavigate } from "react-router-dom";
import "./AppSidebar.css";

const navigationItems = [
  { label: "Dashboard", icon: "▦", path: "/dashboard" },
  { label: "My Projects", icon: "▣", path: "/projects" },
  { label: "Shared with Me", icon: "♧", path: "/shared-with-me" },
 
];

function AppSidebar({ active = "Dashboard", onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="app-sidebar">
      <h2 className="app-sidebar-brand">
        <span className="app-sidebar-logo">C</span>
        CollabSphere
      </h2>

      <p className="app-sidebar-label">WORKSPACE</p>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`app-sidebar-link ${
              active === item.label ? "active" : ""
            }`}
            aria-current={active === item.label ? "page" : undefined}
            onClick={() => navigate(item.path)}
          >
            <span className="app-sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="app-sidebar-bottom">
        <button
          type="button"
          className="app-sidebar-link app-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="app-sidebar-icon" aria-hidden="true">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
