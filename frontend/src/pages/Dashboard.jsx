import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { APPLICATIONS_URL, AUTH_URL } from '../utils/config'
import './Dashboard.css'

const Dashboard = () => {
  const { user, dispatch } = useAuth()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('applications')

  // ✅ Fetch my applications
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(`${APPLICATIONS_URL}/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setApplications(data.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchApplications()
  }, [user, navigate, fetchApplications])

  // ✅ Withdraw application
  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return

    try {
      const res = await fetch(`${APPLICATIONS_URL}/withdraw/${applicationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setApplications(applications.filter(app => app._id !== applicationId))
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (err) {
      console.log(err)
    } finally {
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    }
  }

  // ✅ Status badge color
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

  // ✅ Stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
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
          <span className='profile__role'>{user.role}</span>
        </div>

        <nav className='dashboard__nav'>
          <button
            className={`nav__item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📋 My Applications
          </button>
          <button
            className={`nav__item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 My Profile
          </button>
          <button
            className={`nav__item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            🔖 Saved Jobs
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

        {/* ─── Stats Cards ─── */}
        <div className='dashboard__stats'>
          <div className='stat__card'>
            <span className='stat__icon'>📋</span>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Applied</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>⏳</span>
            <div>
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>⭐</span>
            <div>
              <h3>{stats.shortlisted}</h3>
              <p>Shortlisted</p>
            </div>
          </div>
          <div className='stat__card'>
            <span className='stat__icon'>🎉</span>
            <div>
              <h3>{stats.hired}</h3>
              <p>Hired</p>
            </div>
          </div>
        </div>

        {/* ─── Applications Tab ─── */}
        {activeTab === 'applications' && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>My Applications</h2>
              <span>{stats.total} total</span>
            </div>

            {loading ? (
              <div className='dashboard__loading'>
                <div className='loading__spinner'></div>
                <p>Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className='dashboard__empty'>
                <span>📭</span>
                <h3>No applications yet</h3>
                <p>Start applying to jobs to track them here</p>
                <Link to='/jobs' className='browse__jobs__btn'>
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className='applications__list'>
                {applications.map(app => (
                  <div key={app._id} className='application__card'>
                    <div className='application__logo'>
                      {app.job?.company?.charAt(0) || 'J'}
                    </div>
                    <div className='application__info'>
                      <h3>{app.job?.title || 'Job Title'}</h3>
                      <p className='application__company'>
                        {app.job?.company} · {app.job?.location}
                      </p>
                      <div className='application__meta'>
                        <span>💼 {app.job?.type}</span>
                        <span>💰 {app.job?.salary}</span>
                        <span>
                          📅 Applied {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {app.coverLetter && (
                        <p className='application__coverletter'>
                          "{app.coverLetter.substring(0, 100)}..."
                        </p>
                      )}
                    </div>
                    <div className='application__actions'>
                      <span className={`status__badge ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      <div className='action__buttons'>
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className='view__job__btn'
                        >
                          View Job
                        </Link>
                        {app.status === 'pending' && (
                          <button
                            className='withdraw__btn'
                            onClick={() => handleWithdraw(app._id)}
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Profile Tab ─── */}
        {activeTab === 'profile' && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>My Profile</h2>
            </div>
            <div className='profile__card'>
              <div className='profile__field'>
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className='profile__field'>
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className='profile__field'>
                <label>Role</label>
                <p>{user.role}</p>
              </div>
              <div className='profile__field'>
                <label>Member Since</label>
                <p>{new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className='profile__coming-soon'>
                🚧 Profile editing coming soon!
              </div>
            </div>
          </div>
        )}

        {/* ─── Saved Jobs Tab ─── */}
        {activeTab === 'saved' && (
          <div className='dashboard__section'>
            <div className='section__header'>
              <h2>Saved Jobs</h2>
            </div>
            <div className='dashboard__empty'>
              <span>🔖</span>
              <h3>No saved jobs yet</h3>
              <p>Save jobs while browsing to find them here</p>
              <Link to='/jobs' className='browse__jobs__btn'>
                Browse Jobs
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard