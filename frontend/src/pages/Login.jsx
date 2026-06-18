import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AUTH_URL } from '../utils/config'
import './Auth.css'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const { loading, error, dispatch } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'LOGIN_START' })

    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const data = await res.json()

      if (!data.success) {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message })
        return
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.data,
          token: data.token,
          role: data.role
        }
      })

      // Redirect based on role
      if (data.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else if (data.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }

    } catch (err) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Something went wrong. Please try again.'
      })
    }
  }

  return (
    <div className='auth__container'>
      <div className='auth__box'>

        {/* Left Side */}
        <div className='auth__left'>
          <div className='auth__left-content'>
            <h1>Hire<span>AI</span> 🤖</h1>
            <p>Your AI-powered career companion</p>
            <div className='auth__features'>
              <div className='auth__feature'>
                <span>🎯</span>
                <p>AI Job Matching</p>
              </div>
              <div className='auth__feature'>
                <span>📄</span>
                <p>Resume Reviewer</p>
              </div>
              <div className='auth__feature'>
                <span>✍️</span>
                <p>Cover Letter Generator</p>
              </div>
              <div className='auth__feature'>
                <span>📊</span>
                <p>Application Tracker</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='auth__right'>
          <div className='auth__form-box'>
            <h2>Welcome Back!</h2>
            <p className='auth__subtitle'>Login to your HireAI account</p>

            {error && <div className='auth__error'>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className='form__group'>
                <label>Email Address</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form__group'>
                <label>Password</label>
                <input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='form__forgot'>
                <Link to='/forgot-password'>Forgot password?</Link>
              </div>

              <button
                type='submit'
                className='auth__btn'
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
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
              Don't have an account?{' '}
              <Link to='/register'>Sign up free</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login