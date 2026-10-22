# CollabSphere — Full-Stack Project Collaboration Platform

CollabSphere is a full-stack web application designed to help users organize projects, collaborate with others, manage notes, and track recent project activity through a centralized dashboard.

Built with React, Node.js, Express, and MongoDB, the project demonstrates full-stack development, REST API integration, authentication, database management, and deployment.

## Live Demo

- **Frontend:** https://collab-sphere-three-lyart.vercel.app
- **Backend:** https://collabsphere-f0p9.onrender.com
- **GitHub Repository:** https://github.com/rajni978/CollabSphere

## Features

- **Authentication:** User registration and login.
- **Project Management:** Create and manage projects from a centralized dashboard.
- **Collaboration:** Work with project collaborators.
- **My Projects:** Access and organize your projects.
- **Notes Management:** Create and manage project-related notes.
- **Recent Activity:** View recent project activity in the dashboard.
- **AI Integration:** Gemini API integration for AI-powered functionality.
- **Responsive Interface:** A dashboard designed to work across different screen sizes.
- **REST API:** Backend endpoints for communication between the frontend and server.
- **Cloud Database:** MongoDB Atlas integration for persistent data storage.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- React Router
- CSS
- Axios or Fetch for API communication, depending on the implemented service

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Google Gemini API

### Tools and Deployment
- Git and GitHub
- MongoDB Atlas
- Render

## Project Structure

```text
CollabSphere/
├── client/
│   └── src/
│       ├── features/
│       │   └── projects/
│       │       ├── components/
│       │       └── pages/
│       ├── services/
│       └── App.jsx
│
├── server/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── middleware/
│       └── modules/
│           ├── activity/
│           ├── ai/
│           ├── auth/
│           ├── notes/
│           └── projects/
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Git
- A MongoDB Atlas database or another compatible MongoDB instance
- A Gemini API key if you want to use the AI functionality

### 1. Clone the repository

```bash
git clone https://github.com/rajni978/CollabSphere.git
cd CollabSphere
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables required by your application.

Typical configuration includes:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact environment variable names expected by your current backend code. Keep all secrets private and never commit your `.env` file.

Start the backend:

```bash
npm run dev
```

The local backend runs on port `5000` when configured with the default port shown above.

### 3. Set up the frontend

Open a second terminal:

```bash
cd CollabSphere/client
npm install
npm run dev
```

Open the local frontend URL displayed by Vite in your terminal, usually `http://localhost:5173`.

Ensure the frontend API configuration points to your local backend while developing locally.

### 4. Build the frontend for production

From the `client` directory, run:

```bash
npm run build
```

The production build is generated in the `client/dist` directory.

## API and Database

The backend uses Express to expose REST APIs and Mongoose to interact with MongoDB.

The application organizes backend functionality into modules for:

- Authentication
- Projects
- Notes
- AI integration
- Recent activity

MongoDB Atlas provides the cloud database, while Render hosts the backend service.

## Security

- Store credentials and API keys in environment variables.
- Keep `.env` files out of version control.
- Use authentication middleware to protect private routes.
- Configure database network access carefully.
- Never expose database credentials in frontend code or public repositories.

## What I Learned

Building CollabSphere helped me gain practical experience with:

- Developing a React application with reusable components.
- Building and integrating REST APIs using Node.js and Express.
- Connecting a backend to MongoDB Atlas.
- Organizing backend code into modular features.
- Implementing authentication and protected routes.
- Debugging frontend and backend integration issues.
- Deploying a full-stack application and troubleshooting production database connectivity.
- Using Git and GitHub to manage and publish code.

## Future Improvements

Potential enhancements include:

- Automated testing for frontend and backend workflows.
- Improved project permissions and collaboration controls.
- Enhanced activity filtering and notifications.
- Additional accessibility and performance improvements.

## Author

**Rajni Khairwar**

BCA Student | Aspiring Full-Stack Developer

- GitHub: https://github.com/rajni978
- LinkedIn: https://www.linkedin.com/in/rajni-khairwar-914bb5376/

---

If you find this project interesting, feel free to explore the repository and share feedback.
