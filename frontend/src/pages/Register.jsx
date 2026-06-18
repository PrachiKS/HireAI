import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AUTH_URL } from '../utils/config'
import './Auth.css'

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'jobseeker'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message)
        setLoading(false)
        return
      }

      // Redirect to login after successful registration
      navigate('/login')

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className='auth__container'>
      <div className='auth__box'>

        {/* Left Side */}
        <div className='auth__left'>
          <div className='auth__left-content'>
            <h1>Hire<span>AI</span> 🤖</h1>
            <p>Join thousands finding their dream job</p>
            <div className='auth__features'>
              <div className='auth__feature'>
                <span>🚀</span>
                <p>Get hired 3x faster</p>
              </div>
              <div className='auth__feature'>
                <span>🤖</span>
                <p>AI-powered tools</p>
              </div>
              <div className='auth__feature'>
                <span>🏢</span>
                <p>500+ top companies</p>
              </div>
              <div className='auth__feature'>
                <span>💰</span>
                <p>Best salary packages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='auth__right'>
          <div className='auth__form-box'>
            <h2>Create Account</h2>
            <p className='auth__subtitle'>Join HireAI for free today</p>

            {error && <div className='auth__error'>{error}</div>}

            {/* Role Selection */}
            <div className='role__selector'>
              <button
                type='button'
                className={`role__btn ${userData.role === 'jobseeker' ? 'active' : ''}`}
                onClick={() => setUserData({ ...userData, role: 'jobseeker' })}
              >
                👤 Job Seeker
              </button>
              <button
                type='button'
                className={`role__btn ${userData.role === 'recruiter' ? 'active' : ''}`}
                onClick={() => setUserData({ ...userData, role: 'recruiter' })}
              >
                🏢 Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='form__group'>
                <label>Full Name</label>
                <input
                  type='text'
                  name='username'
                  placeholder='Enter your full name'
                  value={userData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form__group'>
                <label>Email Address</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form__group'>
                <label>Password</label>
                <input
                  type='password'
                  name='password'
                  placeholder='Min 6 chars, 1 uppercase, 1 number'
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type='submit'
                className='auth__btn'
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className='auth__divider'>
                <span>or continue with</span>
              </div>

              <button type='button' className='auth__google'>
                <img
                  src='https://www.google.com/favicon.ico'
                  alt='google'
                  width='18'
                />
                Continue with Google
              </button>

            </form>

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