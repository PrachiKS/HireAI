import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CandidateForm from '../components/auth/CandidateForm'
import RecruiterForm from '../components/auth/RecruiterForm'
import './Auth.css'

const Register = () => {
  // 1. Use searchParams to both read AND write to the URL
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeRole, setActiveRole] = useState(() => {
    return searchParams.get('role') === 'recruiter' ? 'recruiter' : 'jobseeker'
  })

  // 2. Keep state synced if the user hits the browser's Back/Forward buttons
  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl && roleFromUrl !== activeRole) {
      setActiveRole(roleFromUrl === 'recruiter' ? 'recruiter' : 'jobseeker')
    }
  }, [searchParams, activeRole])

  // 3. New function to change the tab AND update the URL instantly
  const handleRoleChange = (role) => {
    setActiveRole(role)
    setSearchParams({ role }) // 👈 This magically updates the URL to ?role=...
  }

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
                onClick={() => handleRoleChange('jobseeker')}
              >
                👤 Job Seeker
              </button>
              <button
                type='button'
                className={`role__btn ${activeRole === 'recruiter' ? 'active' : ''}`}
                onClick={() => handleRoleChange('recruiter')}
              >
                🏢 Recruiter
              </button>
            </div>

            {/* Render the correct form */}
            {activeRole === 'jobseeker' ? <CandidateForm /> : <RecruiterForm />}

            <p className='auth__switch' style={{ marginTop: '20px' }}>
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