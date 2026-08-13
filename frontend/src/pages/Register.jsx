import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CandidateForm from '../components/auth/CandidateForm'
import RecruiterForm from '../components/auth/RecruiterForm'
import './Auth.css'

const Register = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'jobseeker'

  const [activeRole, setActiveRole] = useState(initialRole)

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl) {
      setActiveRole(roleFromUrl === 'recruiter' ? 'recruiter' : 'jobseeker')
    }
  }, [location])

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