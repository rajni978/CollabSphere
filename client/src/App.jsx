import { useState } from "react";
import "./App.css";
import Dashboard from "./features/projects/pages/Dashboard";
import ProjectDetails from "./features/projects/pages/ProjectDetails";
import MyProjects from "./features/projects/pages/MyProjects";
import SharedProject from "./features/projects/pages/SharedProject";
import LandingPage from "./features/home/pages/LandingPage";
import AuthPage from "./features/auth/pages/AuthPage";
import SharedWithMe from "./features/projects/pages/SharedWithMe";
import Favorites from "./features/projects/pages/Favorites";
import ProjectWorkspace from "./features/projects/pages/ProjectWorkspace";


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleLogin = () => setIsAuthenticated(true);

const handleLogout = () => {
  localStorage.removeItem("token");
  setIsAuthenticated(false);
  console.log("Logout: token removed, authentication set to false");
};

  
return (
  <Routes>
    <Route
      path="/"
      element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <LandingPage />
        )
      }
    />

    <Route
      path="/login"
      element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <AuthPage initialMode="login" onLogin={handleLogin} />
        )
      }
    />

    <Route
      path="/signup"
      element={
        isAuthenticated ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <AuthPage initialMode="signup" onLogin={handleLogin} />
        )
      }
    />

    <Route
      path="/dashboard"
      element={
        isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
  path="/projects/:id/workspace"
  element={
    isAuthenticated ? (
      <ProjectWorkspace />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

    <Route
      path="/projects/:id"
      element={
        isAuthenticated ? (
          <ProjectDetails />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    <Route
      path="/projects"
      element={
        isAuthenticated ? (
          <MyProjects onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    
<Route
  path="/shared-with-me"
  element={
    isAuthenticated ? (
      <SharedWithMe onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>


<Route
  path="/favorites"
  element={
    isAuthenticated ? (
      <Favorites onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>



    <Route
      path="/shared/:shareToken"
      element={<SharedProject />}
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
