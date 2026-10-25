import FileAIExplanation from "./FileAIExplanation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../../../lib/api";
import "./ProjectFiles.css";


function ProjectFiles() {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFiles = async () => {
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/files/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load project files.");
      }

      setFiles(data.files || []);
    } catch (err) {
      setError(err.message || "Could not load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [id]);

  const handleUpload = async (event) => {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem("file");
    const file = input?.files?.[0];

    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The maximum file size is 5 MB.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/files/projects/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "File upload failed.");
      }

      setFiles((previous) => [data.file, ...previous]);
      setSelectedFile(data.file);
      setSuccess("File uploaded successfully!");
      input.value = "";
    } catch (err) {
      setError(err.message || "Could not upload the file.");
    } finally {
      setUploading(false);
    }
  };

  const isImage = (file) => file.mimeType?.startsWith("image/");

  const isTextFile = (file) =>
    file.mimeType?.startsWith("text/") ||
    /\.(js|jsx|ts|tsx|json|html|css|md|txt|py|java|c|cpp|sql)$/i.test(
      file.originalName || ""
    );

  return (
    <section className="project-files-section">
      <h2>Project Files</h2>
      <p>Upload and share project images and code files with collaborators.</p>

      <form className="project-file-upload-form" onSubmit={handleUpload}>
        <label htmlFor="project-file">Choose a file (maximum 5 MB)</label>

        <input
          id="project-file"
          name="file"
          type="file"
          accept="image/*,.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.py,.java,.c,.cpp,.sql"
          required
          onChange={() => {
            setError("");
            setSuccess("");
          }}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {error && <p className="project-files-error">{error}</p>}
      {success && <p className="project-files-success">{success}</p>}

      <div className="project-files-list">
        <h3>Uploaded Files ({files.length})</h3>

        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                <button
                  type="button"
                  className="project-file-select"
                  onClick={() => setSelectedFile(file)}
                >
                  {file.originalName}
                </button>
                <span>
                  {" "}· {(file.size / 1024).toFixed(1)} KB
                </span>
                <span>
                  {" "}· {file.uploadedBy?.name || "Unknown uploader"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedFile && (
        <div className="project-file-preview">
          <h3>{selectedFile.originalName}</h3>

          {isImage(selectedFile) ? (
            <a
              href={selectedFile.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={selectedFile.fileUrl}
                alt={selectedFile.originalName}
                className="project-file-preview-image"
              />
            </a>
          ) : isTextFile(selectedFile) ? (
            <p>
              <a
                href={selectedFile.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open or download file
              </a>
              {" "}to view its contents.
            </p>
          ) : (
            <p>Preview is not available for this file type.</p>
          )}

                  {!isImage(selectedFile) && isTextFile(selectedFile) && (
          <FileAIExplanation
            projectId={id}
            file={selectedFile}
          />
        )}

          <button
            type="button"
            onClick={() => setSelectedFile(null)}
          >
            Close Preview
          </button>
        </div>
      )}
    </section>
  );
}

export default ProjectFiles;
