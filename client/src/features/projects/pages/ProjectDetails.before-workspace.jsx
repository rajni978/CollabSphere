import API_URL from "../../../lib/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ProjectFiles from "../components/ProjectFiles";
import ContributionAnalytics from "../components/ContributionAnalytics";
import ProjectSharing from "../components/ProjectSharing";
import "./ProjectDetail.css";


function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");


  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");
  const [noteSuccess, setNoteSuccess] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);


  // Gemini AI state
const [aiResults, setAiResults] = useState({});
const [aiLoading, setAiLoading] = useState({});
const [aiErrors, setAiErrors] = useState({});

const [readmeResult, setReadmeResult] = useState("");
const [readmeLoading, setReadmeLoading] = useState(false);
const [readmeError, setReadmeError] = useState("");


const [memberEmail, setMemberEmail] = useState("");
const [memberLoading, setMemberLoading] = useState(false);
const [memberSuccess, setMemberSuccess] = useState("");
const [memberError, setMemberError] = useState("");

const [editingNoteId, setEditingNoteId] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [editContent, setEditContent] = useState("");


  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load project.");
        }

        setProject(data.project);
      } catch (error) {
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

 

  // Fetch saved notes whenever the project changes
  useEffect(() => {
    const fetchNotes = async () => {
      setNotesLoading(true);
      setNotesError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/projects/${id}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load notes.");
        }
        console.log("Fetched notes:", data.notes);
        setNotes(data.notes || []);
      } catch (error) {
        setNotesError(error.message || "Failed to load notes.");
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [id, navigate]);

  // Edit project
  const handleEditClick = () => {
    setEditName(project.name);
    setEditDescription(project.description);
    setIsEditing(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
            description: editDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update project.");
      }

      setProject(data.project);
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  };

  // Delete project
  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project.");
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  };


const handleAddMember = async (e) => {
  e.preventDefault();

  setMemberSuccess("");
  setMemberError("");
  setMemberLoading(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/projects/${id}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: memberEmail.trim().toLowerCase(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add collaborator.");
    }

    setProject((previous) => ({
      ...previous,
      members: [...(previous.members || []), data.member],
    }));

    setMemberEmail("");
    setMemberSuccess(`${data.member.name} added successfully!`);
  } catch (error) {
    setMemberError(error.message || "Something went wrong.");
  } finally {
    setMemberLoading(false);
  }
};


  // Save a new Markdown note
  const handleSaveNote = async (e) => {
    e.preventDefault();

    setNotesError("");
    setNoteSuccess("");
    setIsSavingNote(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/${id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save note.");
      }

      setNotes((previousNotes) => [
        data.note,
        ...previousNotes,
      ]);

      setNoteTitle("");
      setNoteContent("");
      setNoteSuccess("Note saved successfully!");
    } catch (error) {
      setNotesError(error.message || "Failed to save note.");
    } finally {
      setIsSavingNote(false);
    }
  };


  const handleUpdateNote = async (noteId) => {
    setNotesError("");
    setNoteSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note.");
      }

      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note._id === noteId ? data.note : note
        )
      );

      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
      setNoteSuccess(data.message || "Note updated successfully!");
    } catch (error) {
      setNotesError(error.message || "Failed to update note.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setNotesError("");
    setNoteSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/projects/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note.");
      }

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== noteId)
      );

      setNoteSuccess(data.message || "Note deleted successfully!");
    } catch (error) {
      setNotesError(error.message || "Failed to delete note.");
    }
  };



  const handleNoteAI = async (note, action) => {
    const key = `${note._id}-${action}`;

    setAiLoading((previous) => ({
      ...previous,
      [key]: true,
    }));

    setAiErrors((previous) => ({
      ...previous,
      [key]: "",
    }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/gemini/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: note.content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gemini request failed.");
      }

      setAiResults((previous) => ({
        ...previous,
        [key]: data.result,
      }));
    } catch (error) {
      setAiErrors((previous) => ({
        ...previous,
        [key]: error.message || "Something went wrong.",
      }));
    } finally {
      setAiLoading((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };


  const handleGenerateReadme = async () => {
    setReadmeLoading(true);
    setReadmeError("");
    setReadmeResult("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/gemini/readme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: project.name,
          description: project.description,
          notes: notes.map((note) => ({
            title: note.title,
            content: note.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate README.");
      }

      setReadmeResult(data.result || "No README content was returned.");
    } catch (error) {
      setReadmeError(error.message || "Could not generate README.");
    } finally {
      setReadmeLoading(false);
    }
  };



  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  
return (
  <main className="project-details-page ">
    <div className="project-details-container">
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* Workspace Header */}
      <header className="workspace-header">
        <div className="workspace-title-row">
          <div className="workspace-project-icon">CS</div>

          <div className="workspace-title-content">
            <p className="workspace-breadcrumb">
              CollabSphere / Projects / {project.name}
            </p>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>
        </div>

        <div className="workspace-header-actions">
          <span className="workspace-status">Project Workspace</span>
          <button
            type="button"
            onClick={() => setActiveTab("members")}
          >
            👥 Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
          >
            ⚙ Settings
          </button>
        </div>
      </header>

      {/* Sharing stays available in the workspace */}
      <div className="workspace-sharing">
        <ProjectSharing projectId={id} project={project} />
      </div>

      {/* Workspace Navigation */}
      <nav
        className="workspace-tabs"
        aria-label="Project workspace navigation"
      >
        {[
          { id: "overview", label: "Overview", icon: "⌂" },
          { id: "files", label: "Files", icon: "▤" },
          { id: "notes", label: "Notes", icon: "▧" },
          { id: "members", label: "Members", icon: "♧" },
          { id: "ai", label: "AI Assistant", icon: "✧" },
          { id: "settings", label: "Settings", icon: "⚙" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`workspace-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
            {tab.id === "files" && (
              <span className="workspace-tab-count">Browse</span>
            )}
          </button>
        ))}
      </nav>

      {/* Overview */}
      {activeTab === "overview" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">YOUR WORKSPACE</p>
              <h2>Project Overview</h2>
              <p>
                Manage your project, collaborate with members,
                and organize your development work.
              </p>
            </div>
            <button
              type="button"
              className="workspace-primary-button"
              onClick={() => setActiveTab("files")}
            >
              Browse Files →
            </button>
          </div>

          <div className="workspace-overview-grid">
            <button
              type="button"
              className="workspace-feature-card"
              onClick={() => setActiveTab("files")}
            >
              <span className="workspace-feature-icon">▤</span>
              <h3>Project Files</h3>
              <p>Upload, browse, preview, and explain your files.</p>
              <span>Open Files →</span>
            </button>

            <button
              type="button"
              className="workspace-feature-card"
              onClick={() => setActiveTab("notes")}
            >
              <span className="workspace-feature-icon">▧</span>
              <h3>Documentation</h3>
              <p>Write Markdown notes and maintain project knowledge.</p>
              <span>Open Notes →</span>
            </button>

            <button
              type="button"
              className="workspace-feature-card"
              onClick={() => setActiveTab("members")}
            >
              <span className="workspace-feature-icon">♧</span>
              <h3>Team Members</h3>
              <p>View contributors and manage project collaboration.</p>
              <span>View Members →</span>
            </button>

            <button
              type="button"
              className="workspace-feature-card"
              onClick={() => setActiveTab("ai")}
            >
              <span className="workspace-feature-icon">✧</span>
              <h3>Gemini AI</h3>
              <p>Generate a README and work with AI-powered tools.</p>
              <span>Open AI Assistant →</span>
            </button>
          </div>

          <div className="workspace-overview-bottom">
            <div className="workspace-info-card">
              <h3>About this project</h3>
              <p>{project.description || "No description provided."}</p>
              <span>
                Created{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            
<div className="workspace-info-card workspace-quick-actions">
  <h3>Quick Actions</h3>

  <button
    type="button"
    className="workspace-action-button"
    onClick={() => setActiveTab("notes")}
  >
    <span>＋</span> Create documentation
  </button>

  <button
    type="button"
    className="workspace-action-button"
    onClick={() => setActiveTab("members")}
  >
    <span>＋</span> Add a collaborator
  </button>

  <button
    type="button"
    className="workspace-action-button"
    onClick={() => setActiveTab("settings")}
  >
    <span>✎</span> Edit project details
  </button>
</div>

          </div>

          <div className="workspace-analytics">
            <ContributionAnalytics projectId={id} />
          </div>
        </section>
      )}

      {/* Files */}
      {activeTab === "files" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">PROJECT RESOURCES</p>
              <h2>Files</h2>
              <p>
                Upload files, preview content, and use AI to understand code.
              </p>
            </div>
          </div>

          <ProjectFiles />
        </section>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">PROJECT DOCUMENTATION</p>
              <h2>Notes & Documentation</h2>
              <p>
                Create Markdown documentation, edit saved notes,
                and ask Gemini to explain or improve them.
              </p>
            </div>
          </div>

          <section className="notes-section">
            <h2>Create a Note</h2>

            <form onSubmit={handleSaveNote} className="note-form">
              <label htmlFor="noteTitle">Note Title</label>
              <input
                id="noteTitle"
                type="text"
                placeholder="e.g. Authentication API"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
              />

              <label htmlFor="noteContent">Note Content (Markdown)</label>
              <textarea
                id="noteContent"
                rows={7}
                placeholder={"# My Notes\n\n- First task\n- Second task\n\n**Important:** Add details here."}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                required
              />

              <button type="submit" disabled={isSavingNote}>
                {isSavingNote ? "Saving..." : "Save Note"}
              </button>
            </form>

            {noteSuccess && (
              <p className="note-success">{noteSuccess}</p>
            )}

            {notesError && (
              <p className="note-error">{notesError}</p>
            )}

            <div className="saved-notes">
              <h3>Saved Notes ({notes.length})</h3>

              {notesLoading ? (
                <p>Loading notes...</p>
              ) : notes.length === 0 ? (
                <p>No notes yet. Create your first note above!</p>
              ) : (
                notes.map((note) => (
                  <article className="note-card" key={note._id}>
                    {editingNoteId === note._id ? (
                      <>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Note title"
                        />

                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Note content"
                          rows={5}
                        />

                        <button
                          type="button"
                          onClick={() => handleUpdateNote(note._id)}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(null);
                            setEditTitle("");
                            setEditContent("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h4>{note.title}</h4>

                        <div className="markdown-content">
                          <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>

                        <div className="note-meta">
                          <span>
                            By: {note.author?.name || "Unknown author"}
                          </span>
                          <span>
                            Created:{" "}
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="note-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(note._id);
                              setEditTitle(note.title);
                              setEditContent(note.content);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note._id)}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="note-ai-actions">
                          <button
                            type="button"
                            onClick={() => handleNoteAI(note, "explain")}
                            disabled={Boolean(
                              aiLoading[`${note._id}-explain`]
                            )}
                          >
                            {aiLoading[`${note._id}-explain`]
                              ? "Explaining..."
                              : "Explain Note"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNoteAI(note, "improve")}
                            disabled={Boolean(
                              aiLoading[`${note._id}-improve`]
                            )}
                          >
                            {aiLoading[`${note._id}-improve`]
                              ? "Reviewing..."
                              : "Suggest Improvements"}
                          </button>
                        </div>

                        {["explain", "improve"].map((action) => {
                          const key = `${note._id}-${action}`;

                          return (
                            <div key={key}>
                              {aiErrors[key] && (
                                <p className="note-error">{aiErrors[key]}</p>
                              )}

                              {aiResults[key] && (
                                <div className="note-ai-result">
                                  <h5>
                                    {action === "explain"
                                      ? "AI Explanation"
                                      : "AI Improvement Suggestions"}
                                  </h5>
                                  <ReactMarkdown>
                                    {aiResults[key]}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      )}

      {/* Members */}
      {activeTab === "members" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">COLLABORATION</p>
              <h2>Members & Contributors</h2>
              <p>Manage the people collaborating on this project.</p>
            </div>
          </div>

          <section className="collaborators-section">
            <h2>Invite a Collaborator</h2>
            <p>
              Invite a registered CollabSphere user to collaborate on this
              project.
            </p>

            <form onSubmit={handleAddMember} className="collaborator-form">
              <label htmlFor="memberEmail">Collaborator Email</label>
              <input
                id="memberEmail"
                type="email"
                placeholder="Enter registered user's email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={memberLoading}>
                {memberLoading ? "Adding..." : "Add Collaborator"}
              </button>
            </form>

            {memberSuccess && (
              <p className="member-success">{memberSuccess}</p>
            )}

            {memberError && (
              <p className="member-error">{memberError}</p>
            )}

            <h3>
              Current Members ({project.members?.length || 0})
            </h3>

            {project.members?.length > 0 ? (
              <ul>
                {project.members.map((member) => (
                  <li key={member._id || member.id || member}>
                    <strong>{member.name || "Unknown user"}</strong>
                    <br />
                    <span>{member.email || "Email unavailable"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No collaborators added yet.</p>
            )}
          </section>

          <ContributionAnalytics projectId={id} />
        </section>
      )}

      {/* AI Assistant */}
      {activeTab === "ai" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">GEMINI INTEGRATION</p>
              <h2>AI Assistant</h2>
              <p>
                Generate a README using your project description
                and saved notes.
              </p>
            </div>
          </div>

          <section className="workspace-ai-card">
            <div className="workspace-ai-icon">✧</div>
            <h3>Generate Project README</h3>
            <p>
              Gemini will use your project name, description, and
              saved notes to generate README content.
            </p>

            <button
              type="button"
              className="workspace-primary-button"
              onClick={handleGenerateReadme}
              disabled={readmeLoading}
            >
              {readmeLoading ? "Generating README..." : "Generate README"}
            </button>

            {readmeError && (
              <p className="note-error">{readmeError}</p>
            )}

            {readmeResult && (
              <div className="workspace-readme-result">
                <h3>Generated README</h3>
                <div className="markdown-content">
                  <ReactMarkdown>{readmeResult}</ReactMarkdown>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(readmeResult)
                      .catch(() => {
                        setReadmeError(
                          "Could not copy the README. Please copy it manually."
                        );
                      });
                  }}
                >
                  Copy README
                </button>
              </div>
            )}
          </section>
        </section>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <section className="workspace-panel">
          <div className="workspace-section-heading">
            <div>
              <p className="workspace-eyebrow">PROJECT CONFIGURATION</p>
              <h2>Project Settings</h2>
              <p>Update project details or delete this project.</p>
            </div>
          </div>

          {isEditing ? (
            <form
              onSubmit={handleUpdateProject}
              className="edit-project-form"
            >
              <label htmlFor="editName">Project Name</label>
              <input
                id="editName"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <label htmlFor="editDescription">Project Description</label>
              <textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                rows={4}
              />

              <div className="project-actions">
                <button type="submit">Save Changes</button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="workspace-settings-card">
              <h3>General</h3>
              <p>
                <strong>Project name:</strong> {project.name}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {project.description || "No description"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </p>

              <div className="project-actions">
                <button type="button" onClick={handleEditClick}>
                  Edit Project Details
                </button>

                <button
                  type="button"
                  className="delete-project-button"
                  onClick={handleDeleteProject}
                >
                  Delete Project
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  </main>
);

}

export default ProjectDetails;

