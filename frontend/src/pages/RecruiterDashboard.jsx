import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { JOBS_URL, APPLICATIONS_URL, AUTH_URL } from '../utils/config'
import './RecruiterDashboard.css'

const RecruiterDashboard = () => {
  const { user, dispatch } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostJob, setShowPostJob] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')
  const [postSuccess, setPostSuccess] = useState('')

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full Time',
    salary: '',
    experience: '',
    description: '',
    requirements: '',
    skills: '',
    benefits: '',
    featured: false,
    deadline: ''
  })

  // ✅ Fetch recruiter's jobs
  const fetchMyJobs = useCallback(async () => {
    try {
      const res = await fetch(`${JOBS_URL}/recruiter/myjobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) setJobs(data.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Fetch applications for a job
  const fetchJobApplications = useCallback(async (jobId) => {
    try {
      const res = await fetch(`${APPLICATIONS_URL}/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) setApplications(data.data)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'recruiter' && user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchMyJobs()
  }, [user, navigate, fetchMyJobs])

  // ✅ Handle job form change
  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setJobForm({ ...jobForm, [e.target.name]: value })
  }

  // ✅ Post new job
  const handlePostJob = async (e) => {
    e.preventDefault()
    setPosting(true)
    setPostError('')
    setPostSuccess('')

    try {
      const jobData = {
        ...jobForm,
        requirements: jobForm.requirements.split('\n').filter(r => r.trim()),
        skills: jobForm.skills.split(',').map(s => s.trim()).filter(s => s),
        benefits: jobForm.benefits.split('\n').filter(b => b.trim())
      }

      const res = await fetch(JOBS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(jobData)
      })

      const data = await res.json()

      if (data.success) {
        setPostSuccess('Job posted successfully! 🎉')
        setJobForm({
          title: '', company: '', location: '', type: 'Full Time',
          salary: '', experience: '', description: '', requirements: '',
          skills: '', benefits: '', featured: false, deadline: ''
        })
        fetchMyJobs()
        setTimeout(() => {
          setShowPostJob(false)
          setPostSuccess('')
        }, 2000)
      } else {
        setPostError(data.message)
      }
    } catch (err) {
      setPostError('Failed to post job. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  // ✅ Delete job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return

    try {
      const res = await fetch(`${JOBS_URL}/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setJobs(jobs.filter(job => job._id !== jobId))
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ✅ Update application status
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const res = await fetch(`${APPLICATIONS_URL}/status/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) {
        setApplications(applications.map(app =>
          app._id === applicationId ? { ...app, status } : app
        ))
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch (err) {
      console.log(err)
    } finally {
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status__pending'
      case 'reviewed': return 'status__reviewed'
      case 'shortlisted': return 'status__shortlisted'
      case 'rejected': return 'status__rejected'
      case 'hired': return 'status__hired'
      default: return 'status__pending'
    }
  }

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0),
    featured: jobs.filter(j => j.featured).length
  }

  if (!user) return null

  return (
    <div className='dashboard__page'>

      {/* ─── Sidebar ─── */}
      <div className='dashboard__sidebar'>
        <div className='dashboard__profile'>
          <div className='profile__avatar'>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h3>{user.username}</h3>
          <p>{user.email}</p>
          <span className='profile__role'>🏢 Recruiter</span>
        </div>

        <nav className='dashboard__nav'>
          <button
            className={`nav__item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('jobs'); setSelectedJob(null) }}
          >
            💼 My Jobs
          </button>
          <button
            className={`nav__item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📋 Applications
          </button>
          <button
            className={`nav__item ${showPostJob ? 'active' : ''}`}
            onClick={() => setShowPostJob(true)}
          >
            ➕ Post New Job
          </button>
        </nav>

        <div className='dashboard__sidebar-footer'>
          <Link to='/jobs' className='browse__btn'>
            🔍 Browse Jobs
          </Link>
          <button className='logout__btn' onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className='dashboard__main'>

        {/* ─── Stats ─── */}
        <div className='dashboard__stats'>
          <div className='stat__card'>
            <span className='stat__icon'>💼</span>
            <div>
              <h3>{stats.totalJobs}</h3>
              <p>Total Jobs</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>✅</span>
            <div>
              <h3>{stats.activeJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>📋</span>
            <div>
              <h3>{stats.totalApplications}</h3>
              <p>Applications</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>⭐</span>
            <div>
              <h3>{stats.featured}</h3>
              <p>Featured Jobs</p>
            </div>
          </div>
        </div>

        {/* ─── Post New Job Form ─── */}
        {showPostJob && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>Post New Job</h2>
              <button
                className='close__btn'
                onClick={() => setShowPostJob(false)}
              >
                ✕ Close
              </button>
            </div>

            {postSuccess && (
              <div className='post__success'>{postSuccess}</div>
            )}
            {postError && (
              <div className='post__error'>{postError}</div>
            )}

            <form className='job__form' onSubmit={handlePostJob}>
              <div className='form__row'>
                <div className='form__group'>
                  <label>Job Title *</label>
                  <input
                    type='text'
                    name='title'
                    placeholder='e.g. Junior React Developer'
                    value={jobForm.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className='form__group'>
                  <label>Company *</label>
                  <input
                    type='text'
                    name='company'
                    placeholder='e.g. TechCorp India'
                    value={jobForm.company}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className='form__row'>
                <div className='form__group'>
                  <label>Location *</label>
                  <input
                    type='text'
                    name='location'
                    placeholder='e.g. Pune / Remote'
                    value={jobForm.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className='form__group'>
                  <label>Job Type *</label>
                  <select
                    name='type'
                    value={jobForm.type}
                    onChange={handleFormChange}
                  >
                    <option value='Full Time'>Full Time</option>
                    <option value='Part Time'>Part Time</option>
                    <option value='Internship'>Internship</option>
                    <option value='Remote'>Remote</option>
                    <option value='Contract'>Contract</option>
                  </select>
                </div>
              </div>

              <div className='form__row'>
                <div className='form__group'>
                  <label>Salary *</label>
                  <input
                    type='text'
                    name='salary'
                    placeholder='e.g. 8-12 LPA'
                    value={jobForm.salary}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className='form__group'>
                  <label>Experience *</label>
                  <input
                    type='text'
                    name='experience'
                    placeholder='e.g. 0-1 years'
                    value={jobForm.experience}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className='form__group'>
                <label>Job Description *</label>
                <textarea
                  name='description'
                  placeholder='Describe the role, responsibilities...'
                  value={jobForm.description}
                  onChange={handleFormChange}
                  rows={4}
                  required
                />
              </div>

              <div className='form__group'>
                <label>Requirements (one per line)</label>
                <textarea
                  name='requirements'
                  placeholder='Strong JavaScript knowledge&#10;React.js experience&#10;Git version control'
                  value={jobForm.requirements}
                  onChange={handleFormChange}
                  rows={4}
                />
              </div>

              <div className='form__group'>
                <label>Skills (comma separated)</label>
                <input
                  type='text'
                  name='skills'
                  placeholder='React.js, Node.js, MongoDB, CSS'
                  value={jobForm.skills}
                  onChange={handleFormChange}
                />
              </div>

              <div className='form__group'>
                <label>Benefits (one per line)</label>
                <textarea
                  name='benefits'
                  placeholder='Health insurance&#10;Remote work&#10;Learning budget'
                  value={jobForm.benefits}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>

              <div className='form__row'>
                <div className='form__group'>
                  <label>Application Deadline</label>
                  <input
                    type='date'
                    name='deadline'
                    value={jobForm.deadline}
                    onChange={handleFormChange}
                  />
                </div>
                <div className='form__group form__checkbox'>
                  <label>
                    <input
                      type='checkbox'
                      name='featured'
                      checked={jobForm.featured}
                      onChange={handleFormChange}
                    />
                    ⭐ Feature this job
                  </label>
                </div>
              </div>

              <button
                type='submit'
                className='post__job__btn'
                disabled={posting}
              >
                {posting ? 'Posting...' : 'Post Job 🚀'}
              </button>
            </form>
          </div>
        )}

        {/* ─── My Jobs Tab ─── */}
        {activeTab === 'jobs' && !showPostJob && !selectedJob && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>My Job Listings</h2>
              <button
                className='post__new__btn'
                onClick={() => setShowPostJob(true)}
              >
                ➕ Post New Job
              </button>
            </div>

            {loading ? (
              <div className='dashboard__loading'>
                <div className='loading__spinner'></div>
                <p>Loading your jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className='dashboard__empty'>
                <span>💼</span>
                <h3>No jobs posted yet</h3>
                <p>Post your first job to start receiving applications</p>
                <button
                  className='browse__jobs__btn'
                  onClick={() => setShowPostJob(true)}
                >
                  Post a Job
                </button>
              </div>
            ) : (
              <div className='recruiter__jobs__list'>
                {jobs.map(job => (
                  <div key={job._id} className='recruiter__job__card'>
                    <div className='recruiter__job__info'>
                      <div className='job__title__row'>
                        <h3>{job.title}</h3>
                        {job.featured && (
                          <span className='featured__badge'>⭐ Featured</span>
                        )}
                        <span className={`job__status ${job.status === 'active' ? 'status__active' : 'status__closed'}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className='job__company__name'>
                        {job.company} · {job.location} · {job.type}
                      </p>
                      <div className='job__quick__stats'>
                        <span>💰 {job.salary}</span>
                        <span>📋 {job.applications?.length || 0} applications</span>
                        <span>👁️ {job.views} views</span>
                        <span>📅 {new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <div className='recruiter__job__actions'>
                      <button
                        className='view__applications__btn'
                        onClick={() => {
                          setSelectedJob(job)
                          setActiveTab('applications')
                          fetchJobApplications(job._id)
                        }}
                      >
                        👥 View Applications ({job.applications?.length || 0})
                      </button>
                      <button
                        className='delete__job__btn'
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Applications Tab ─── */}
        {activeTab === 'applications' && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>
                {selectedJob
                  ? `Applications for "${selectedJob.title}"`
                  : 'Select a job to view applications'
                }
              </h2>
              {selectedJob && (
                <button
                  className='back__btn'
                  onClick={() => {
                    setSelectedJob(null)
                    setActiveTab('jobs')
                  }}
                >
                  ← Back to Jobs
                </button>
              )}
            </div>

            {!selectedJob ? (
              <div className='dashboard__empty'>
                <span>👥</span>
                <h3>Select a job first</h3>
                <p>Go to My Jobs and click "View Applications"</p>
                <button
                  className='browse__jobs__btn'
                  onClick={() => setActiveTab('jobs')}
                >
                  Go to My Jobs
                </button>
              </div>
            ) : applications.length === 0 ? (
              <div className='dashboard__empty'>
                <span>📭</span>
                <h3>No applications yet</h3>
                <p>No one has applied to this job yet</p>
              </div>
            ) : (
              <div className='applications__list'>
                {applications.map(app => (
                  <div key={app._id} className='recruiter__application__card'>
                    <div className='applicant__avatar'>
                      {app.applicant?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className='applicant__info'>
                      <h3>{app.applicant?.username}</h3>
                      <p>{app.applicant?.email}</p>
                      {app.applicant?.skills?.length > 0 && (
                        <div className='applicant__skills'>
                          {app.applicant.skills.slice(0, 3).map((skill, i) => (
                            <span key={i}>{skill}</span>
                          ))}
                        </div>
                      )}
                      {app.coverLetter && (
                        <p className='application__coverletter'>
                          "{app.coverLetter.substring(0, 120)}..."
                        </p>
                      )}
                      <p className='applied__date'>
                        Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className='applicant__actions'>
                      <span className={`status__badge ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <select
                        className='status__select'
                        value={app.status}
                        onChange={e => handleStatusUpdate(app._id, e.target.value)}
                      >
                        <option value='pending'>Pending</option>
                        <option value='reviewed'>Reviewed</option>
                        <option value='shortlisted'>Shortlisted</option>
                        <option value='rejected'>Rejected</option>
                        <option value='hired'>Hired</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default RecruiterDashboard