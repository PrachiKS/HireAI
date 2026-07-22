# 🤖 HireAI — AI-Powered Job Board Platform

A **production-ready full stack job board** built with the MERN Stack featuring **8 AI-powered features** for both Job Seekers and Recruiters. Powered by Groq Llama AI with strict role-based access control.

---

## 🚀 Live Demo

| | URL |
|--|-----|
| 🌐 **Frontend** | [hire-ai-green.vercel.app](https://hire-ai-green.vercel.app) |
| ⚙️ **Backend API** | [hireai-api.onrender.com](https://hireai-api.onrender.com) |
| 💻 **GitHub** | [github.com/PrachiKS/HireAI](https://github.com/PrachiKS/HireAI) |

---

## 📌 Project Overview

HireAI is a complete two-sided job platform where:

**Job Seekers** can:
- Browse and search job listings with advanced filters
- Apply to jobs with cover letters
- Track all applications in a personal dashboard
- Use AI tools to review resume, generate cover letters, check job match score and prepare for interviews

**Recruiters** can:
- Post and manage job listings
- View and manage applicants per job
- Update application status (Pending → Shortlisted → Hired)
- Use AI tools to write job descriptions, evaluate candidates, shortlist resumes and generate interview questions

---

## 🤖 AI Features (Powered by Groq Llama AI)

### For Job Seekers
| Feature | What It Does |
|---------|-------------|
| 📄 **AI Resume Reviewer** | Scores resume out of 100, gives ATS score, strengths, weaknesses and improvement suggestions |
| ✍️ **AI Cover Letter Generator** | Generates professional cover letter for any job in seconds |
| 🎯 **AI Job Match Score** | Calculates % match between candidate skills and job requirements |
| ❓ **AI Interview Prep** | Generates technical, behavioral and system design questions with hints |

### For Recruiters
| Feature | What It Does |
|---------|-------------|
| ✍️ **AI Job Description Writer** | Generates complete JD from job title, skills and experience |
| 📊 **AI Candidate Evaluator** | Scores and evaluates candidates against job requirements |
| 🏆 **AI Resume Shortlister** | Ranks multiple candidates by fit for a role |
| ❓ **AI Interview Questions** | Generates screening, technical, practical, behavioral and cultural questions |

---

## ✨ Key Features

### 🔐 Authentication & Security
- JWT authentication with **refresh token** system (15 min access + 7 day refresh)
- Password hashing with **bcryptjs** (salt rounds: 12)
- Input validation using **express-validator**
- API **rate limiting** (10 auth attempts per 15 minutes)
- Security headers using **Helmet.js**
- **Role-based access control** (Job Seeker / Recruiter / Admin)
- Supports both cookie and Authorization header token

### 💼 Jobs System
- Full CRUD for job listings (Recruiter only)
- Advanced search by keyword, location, type, experience
- Sort by latest, popular, featured
- Pagination with total count
- View count tracking per job
- Featured job badges

### 📋 Applications System
- One-click apply with cover letter
- Duplicate application prevention (MongoDB unique index)
- Application status tracking: Pending → Reviewed → Shortlisted → Rejected → Hired
- Withdraw pending applications
- Recruiters can update application status

### 📊 Dual Dashboard
- **Job Seeker Dashboard** — Stats cards, application tracker, profile tab
- **Recruiter Dashboard** — Post jobs, manage listings, view applicants, update status

### 🤖 AI Integration
- **Groq Llama AI** (llama-3.3-70b-versatile model)
- Structured JSON prompt engineering for consistent outputs
- Role-based AI feature separation
- All AI routes secured with JWT middleware

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js 18 | UI framework |
| React Router DOM | Client-side routing |
| Context API | Global state management |
| Bootstrap 5 | Responsive styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |
| express-validator | Input validation |
| node-fetch | Groq API calls |

### AI & DevOps
| Tool | Purpose |
|------|---------|
| Groq API | LLM inference (Llama 3.3) |
| MongoDB Atlas | Cloud database |
| Render.com | Backend hosting |
| Vercel | Frontend hosting |
| GitHub | Version control with feature branches |

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Public |
| POST | `/api/v1/auth/login` | Public |
| POST | `/api/v1/auth/logout` | Authenticated |
| GET | `/api/v1/auth/me` | Authenticated |

### Job Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/jobs` | Public |
| GET | `/api/v1/jobs/:id` | Public |
| GET | `/api/v1/jobs/featured` | Public |
| POST | `/api/v1/jobs` | Recruiter |
| PUT | `/api/v1/jobs/:id` | Recruiter |
| DELETE | `/api/v1/jobs/:id` | Recruiter |

### Application Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/applications/apply/:jobId` | Job Seeker |
| GET | `/api/v1/applications/my` | Job Seeker |
| GET | `/api/v1/applications/check/:jobId` | Job Seeker |
| DELETE | `/api/v1/applications/withdraw/:id` | Job Seeker |
| GET | `/api/v1/applications/job/:jobId` | Recruiter |
| PUT | `/api/v1/applications/status/:id` | Recruiter |

### AI Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/ai/review-resume` | Job Seeker |
| POST | `/api/v1/ai/cover-letter` | Job Seeker |
| POST | `/api/v1/ai/match-score` | Job Seeker |
| POST | `/api/v1/ai/interview-questions` | Job Seeker |
| POST | `/api/v1/ai/write-job-description` | Recruiter |
| POST | `/api/v1/ai/evaluate-candidate` | Recruiter |
| POST | `/api/v1/ai/shortlist-candidates` | Recruiter |
| POST | `/api/v1/ai/recruiter-questions` | Recruiter |

---

## 📁 Project Structure

```
HireAI/
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Register, login, logout, getMe
│   │   ├── jobController.js         # Job CRUD + advanced search
│   │   ├── applicationController.js # Apply, track, withdraw
│   │   └── aiController.js          # 8 AI features using Groq
│   ├── models/
│   │   ├── User.js                  # User schema (seeker/recruiter/admin)
│   │   ├── Job.js                   # Job schema with applications ref
│   │   └── Application.js           # Application schema with status
│   ├── routes/
│   │   ├── auth.js                  # Auth routes with rate limiting
│   │   ├── jobs.js                  # Job routes
│   │   ├── applications.js          # Application routes
│   │   └── ai.js                    # AI routes with RBAC
│   ├── middleware/
│   │   └── verifyToken.js           # JWT + role verification
│   ├── seeds/
│   │   ├── seedJobs.js              # Sample job data
│   │   └── seedUsers.js             # Sample user data
│   └── index.js                     # Express server entry point
│
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.jsx            # Responsive navbar with auth state
        ├── pages/
        │   ├── Home.jsx              # Landing page
        │   ├── Jobs.jsx              # Job listing with search + filters
        │   ├── JobDetail.jsx         # Single job + apply button
        │   ├── Login.jsx             # Login form
        │   ├── Register.jsx          # Register with role selection
        │   ├── Dashboard.jsx         # Job seeker dashboard
        │   ├── RecruiterDashboard.jsx # Recruiter dashboard
        │   └── AITools.jsx           # 8 AI tools UI
        ├── context/
        │   └── AuthContext.js        # Global auth state
        └── utils/
            └── config.js             # API URLs (dev/prod)
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/PrachiKS/HireAI.git
cd HireAI/backend

# Install dependencies
npm install

# Create .env file and add:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
# JWT_SECRET_KEY=your_jwt_secret
# JWT_REFRESH_KEY=your_refresh_secret
# NODE_ENV=development
# GROQ_API_KEY=your_groq_api_key

# Seed the database
node seeds/seedJobs.js
node seeds/seedUsers.js

# Start backend
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | prachi@test.com | Test@1234 |
| Recruiter | om@gmail.com | Omkar@123 |

---

## 🔒 Security Architecture

```
Request → verifyToken → verifyRole → Resource Ownership Check → Controller
```

- **Layer 1** — JWT token validation (cookie or Authorization header)
- **Layer 2** — Role-based middleware (verifyJobSeeker / verifyRecruiter)
- **Layer 3** — Resource ownership check (recruiters manage only their jobs)

---

## 🤖 AI Architecture

```
Frontend Input → Backend → Prompt Engineering → Groq Llama API → Parse JSON → UI Display
```

All AI prompts use structured JSON format instructions for consistent, parseable responses.

---

## 🌿 Git Workflow

Feature branch workflow used throughout:

```
main (stable)
├── feature/auth-backend
├── feature/jobs-backend
├── feature/applications
├── feature/user-dashboard
├── feature/recruiter-dashboard
├── feature/ai-features
└── feature/ai-ui
```

---

## 👩‍💻 Developer

**Prachi Sonawane**
- 📧 prachiksonawane25@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/prachisonawane)
- 💻 [GitHub](https://github.com/PrachiKS)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).