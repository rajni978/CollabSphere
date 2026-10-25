
import multer from "multer";
import path from "node:path";

const allowedExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".js", ".jsx", ".ts", ".tsx",
  ".html", ".css", ".json",
  ".md", ".txt", ".py", ".java",
  ".c", ".cpp", ".sql",
]);

const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "text/plain",
  "text/markdown",
  "text/html",
  "text/css",
  "text/javascript",
  "application/javascript",
  "application/json",
  "application/typescript",
  "application/xml",
  "text/x-python",
  "text/x-java-source",
  "text/x-c",
  "text/x-c++",
  "application/sql",
]);

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.has(extension) &&
    (allowedMimeTypes.has(file.mimetype) ||
      file.mimetype === "application/octet-stream")
  ) {
    return callback(null, true);
  }

  return callback(
    new Error("Unsupported file type. Please upload a supported image or code file.")
  );
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default upload;
