import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { JOBS_URL, APPLICATIONS_URL} from '../utils/config'
import './JobDetail.css'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [applyError, setApplyError] = useState('')

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${JOBS_URL}/${id}`)
        const data = await res.json()

        if (data.success) {
          setJob(data.data)
        } else {
          setError('Job not found')
        }
      } catch (err) {
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleApply = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowCoverLetter(true)
  }

  const submitApplication = async () => {
    setApplying(true)
    setApplyError('')
    try {
      const res = await fetch(`${APPLICATIONS_URL}/apply/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ coverLetter })
      })

      const data = await res.json()

      if (data.success) {
        setApplied(true)
        setShowCoverLetter(false)
      } else {
        setApplyError(data.message)
      }
    } catch (err) {
      setApplyError('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className='jobdetail__loading'>
        <div className='loading__spinner'></div>
        <p>Loading job details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='jobdetail__error'>
        <span>😕</span>
        <h3>{error}</h3>
        <Link to='/jobs'>Browse All Jobs</Link>
      </div>
    )
  }

  return (
    <div className='jobdetail__page'>
      <div className='jobdetail__container'>

        {/* ─── Left Column ─── */}
        <div className='jobdetail__main'>

          {/* Job Header */}
          <div className='jobdetail__header'>
            <div className='jobdetail__company-logo'>
              {job.company.charAt(0)}
            </div>
            <div className='jobdetail__title-section'>
              <h1>{job.title}</h1>
              <p className='jobdetail__company'>{job.company}</p>
              <div className='jobdetail__meta'>
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>⏱️ {job.experience}</span>
                <span>💰 {job.salary}</span>
                <span>👁️ {job.views} views</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className='jobdetail__section'>
            <h3>Required Skills</h3>
            <div className='jobdetail__skills'>
              {job.skills.map((skill, index) => (
                <span key={index} className='skill__tag'>{skill}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className='jobdetail__section'>
            <h3>Job Description</h3>
            <p>{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className='jobdetail__section'>
              <h3>Requirements</h3>
              <ul className='jobdetail__list'>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className='jobdetail__section'>
              <h3>Benefits & Perks</h3>
              <div className='jobdetail__benefits'>
                {job.benefits.map((benefit, index) => (
                  <div key={index} className='benefit__item'>
                    <span>✅</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posted By */}
          {job.postedBy && (
            <div className='jobdetail__section'>
              <h3>About the Recruiter</h3>
              <div className='jobdetail__recruiter'>
                <div className='recruiter__avatar'>
                  {job.postedBy.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className='recruiter__name'>{job.postedBy.username}</p>
                  <p className='recruiter__company'>
                    {job.postedBy.company || 'Company not specified'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── Right Column (Sticky Apply Card) ─── */}
        <div className='jobdetail__sidebar'>
          <div className='apply__card'>

            <div className='apply__card-header'>
              <h2>{job.title}</h2>
              <p>{job.company}</p>
            </div>

            <div className='apply__card-details'>
              <div className='apply__detail'>
                <span>💰 Salary</span>
                <strong>{job.salary}</strong>
              </div>
              <div className='apply__detail'>
                <span>📍 Location</span>
                <strong>{job.location}</strong>
              </div>
              <div className='apply__detail'>
                <span>💼 Type</span>
                <strong>{job.type}</strong>
              </div>
              <div className='apply__detail'>
                <span>⏱️ Experience</span>
                <strong>{job.experience}</strong>
              </div>
              {job.deadline && (
                <div className='apply__detail'>
                  <span>📅 Deadline</span>
                  <strong>
                    {new Date(job.deadline).toLocaleDateString('en-IN')}
                  </strong>
                </div>
              )}
            </div>

            {showCoverLetter && !applied && (
              <div className='coverletter__form'>
                <label>Cover Letter (Optional)</label>
                <textarea
                  placeholder='Write a short cover letter...'
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                />
                {applyError && (
                  <p className='apply__error'>{applyError}</p>
                )}
                <button
                  className='apply__btn'
                  onClick={submitApplication}
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application 🚀'}
                </button>
                <button
                  className='cancel__btn'
                  onClick={() => setShowCoverLetter(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {applied ? (
              <div className='apply__success'>
                ✅ Application Submitted!
              </div>
            ) : (
              !showCoverLetter && (
                <button
                  className='apply__btn'
                  onClick={handleApply}
                >
                  {user ? 'Apply Now 🚀' : 'Login to Apply'}
                </button>
              )
            )}

            {!user && (
              <p className='apply__note'>
                <Link to='/login'>Login</Link> or{' '}
                <Link to='/register'>Register</Link> to apply
              </p>
            )}

            <div className='apply__share'>
              <p>Share this job:</p>
              <div className='share__buttons'>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  🔗 Copy Link
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default JobDetail