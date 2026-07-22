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

## 📄 License

This project is open source and available under the [MIT License](LICENSE).