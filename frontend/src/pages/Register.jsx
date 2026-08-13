import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CandidateForm from '../components/auth/CandidateForm'
import RecruiterForm from '../components/auth/RecruiterForm'
import './Auth.css'

const Register = () => {
 const location = useLocation()

  // 1. Initialize state by reading the URL once
  const [activeRole, setActiveRole] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('role') === 'recruiter' ? 'recruiter' : 'jobseeker'
  })

  // 2. Keep synced if the URL changes, depending safely on the string location.search
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const roleFromUrl = params.get('role')
    if (roleFromUrl) {
      setActiveRole(roleFromUrl === 'recruiter' ? 'recruiter' : 'jobseeker')
    }
  }, [location.search]) // 👈 Safely depending on the search string
  return (
    <div className='auth__container auth__container--register'>
      <div className='auth__box auth__box--single'>
        
        <div className='auth__right auth__right--full'>
          <div className='auth__form-box auth__form-box--wide'>
            <h2>Create Account</h2>
            <p className='auth__subtitle'>Join HireAI for free today</p>

            {/* Role Selector Tabs */}
            <div className='role__selector'>
              <button
                type='button'
                className={`role__btn ${activeRole === 'jobseeker' ? 'active' : ''}`}
                onClick={() => setActiveRole('jobseeker')}
              >
                👤 Job Seeker
              </button>
              <button
                type='button'
                className={`role__btn ${activeRole === 'recruiter' ? 'active' : ''}`}
                onClick={() => setActiveRole('recruiter')}
              >
                🏢 Recruiter
              </button>
            </div>

            {/* Render the correct form */}
            {activeRole === 'jobseeker' ? <CandidateForm /> : <RecruiterForm />}

            <p className='auth__switch'>
              Already have an account?{' '}
              <Link to='/login'>Login here</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Register