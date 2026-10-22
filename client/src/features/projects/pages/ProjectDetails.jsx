
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./ProjectDetail.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


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
          `http://localhost:5000/api/projects/${id}`,
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
          `http://localhost:5000/api/projects/${id}/notes`,
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
        `http://localhost:5000/api/projects/${id}`,
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
        `http://localhost:5000/api/projects/${id}`,
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
      `http://localhost:5000/api/projects/${id}/members`,
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
        `http://localhost:5000/api/projects/${id}/notes`,
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
        `http://localhost:5000/api/projects/notes/${noteId}`,
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
        `http://localhost:5000/api/projects/notes/${noteId}`,
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
        `http://localhost:5000/api/gemini/${action}`,
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
    <main className="project-details-page">
      <div className="project-details-container">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

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

            <label htmlFor="editDescription">
              Project Description
            </label>
            <textarea
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              rows="4"
            />

            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <section className="project-details-card">
            <h1>{project.name}</h1>

            <p className="project-description">
              {project.description}
            </p>

            <p className="project-created-date">
              Created on:{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>

            <div className="project-actions">
              <button onClick={handleEditClick}>
                Edit Project
              </button>

              <button
                type="button"
                className="delete-project-button"
                onClick={handleDeleteProject}
              >
                Delete Project
              </button>
            </div>
          </section>
        )}


{/* Project Collaborators section */}
<section className="collaborators-section">
  <h2>Project Collaborators</h2>

  <p>Invite a registered CollabSphere user to collaborate on this project.</p>

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

  <h3>Current Members</h3>

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


        {/* Markdown Notes section */}
        <section className="notes-section">
          <h2>Project Notes</h2>

          <p>
            Write project documentation, task lists, and technical notes
            using Markdown.
          </p>

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

            <label htmlFor="noteContent">
              Note Content (Markdown)
            </label>

            <textarea
              id="noteContent"
              rows="7"
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
            disabled={Boolean(aiLoading[`${note._id}-explain`])}
          >
            {aiLoading[`${note._id}-explain`]
              ? "Explaining..."
              : "Explain Note"}
          </button>

          <button
            type="button"
            onClick={() => handleNoteAI(note, "improve")}
            disabled={Boolean(aiLoading[`${note._id}-improve`])}
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

        
      </div>
    </main>
  );
}

export default ProjectDetails;

