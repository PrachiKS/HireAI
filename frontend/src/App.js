import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import './components/Navbar.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AITools from './pages/AITools'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetail />} />
        <Route path='/jobseeker/dashboard' element={<JobSeekerDashboard />} />
        <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
        <Route path='/ai-tools' element={<AITools />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App