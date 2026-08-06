import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AUTH_URL } from '../utils/config'
import './Auth.css'

// ✅ Country list with codes
const countries = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'UAE', code: '+971', flag: '🇦🇪' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
]

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+91',
    role: 'jobseeker'
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  // ✅ Validation rules
  const validate = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = '⚠️ Full name is required'
        } else if (value.trim().length < 3) {
          newErrors.username = '⚠️ Name must be at least 3 characters'
        } else if (value.trim().length > 30) {
          newErrors.username = '⚠️ Name must not exceed 30 characters'
        } else {
          delete newErrors.username
        }
        break

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|rediffmail)\.(com|in|co\.in|net|org)$/i
        if (!value.trim()) {
          newErrors.email = '⚠️ Email is required'
        } else if (!emailRegex.test(value)) {
          newErrors.email = '⚠️ Please enter a valid email (e.g. name@gmail.com)'
        } else {
          delete newErrors.email
        }
        break

      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/
        if (!value.trim()) {
          newErrors.phone = '⚠️ Phone number is required'
        } else if (!/^\d+$/.test(value)) {
          newErrors.phone = '⚠️ Phone number must contain only digits'
        } else if (value.length !== 10) {
          newErrors.phone = `⚠️ Phone number must be exactly 10 digits (${value.length}/10)`
        } else if (userData.countryCode === '+91' && !phoneRegex.test(value)) {
          newErrors.phone = '⚠️ Indian number must start with 6, 7, 8 or 9'
        } else {
          delete newErrors.phone
        }
        break

      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!value) {
          newErrors.password = '⚠️ Password is required'
        } else if (value.length < 8) {
          newErrors.password = '⚠️ Password must be at least 8 characters'
        } else if (!passwordRegex.test(value)) {
          newErrors.password = '⚠️ Must include uppercase, lowercase, number and special character'
        } else {
          delete newErrors.password
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // ✅ Phone number — only allow digits, max 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setUserData({ ...userData, phone: digitsOnly })
      if (touched.phone) validate('phone', digitsOnly)
      return
    }

    setUserData({ ...userData, [name]: value })
    if (touched[name]) validate(name, value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    validate(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    // ✅ Validate all fields before submit
    const fields = ['username', 'email', 'phone', 'password']
    let isValid = true
    const allTouched = {}

    fields.forEach(field => {
      allTouched[field] = true
      const fieldValid = validate(field, userData[field])
      if (!fieldValid) isValid = false
    })

    setTouched(allTouched)

    if (!isValid) return

    setLoading(true)

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          phone: `${userData.countryCode}${userData.phone}`,
          role: userData.role
        })
      })

      const data = await res.json()

      if (!data.success) {
        setServerError(data.message)
        setLoading(false)
        return
      }

      navigate('/login')

    } catch (err) {
      setServerError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // ✅ Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: '#dc2626' }
    if (strength <= 3) return { strength, label: 'Medium', color: '#d97706' }
    if (strength <= 4) return { strength, label: 'Strong', color: '#059669' }
    return { strength, label: 'Very Strong', color: '#16a34a' }
  }

  const passwordStrength = getPasswordStrength(userData.password)

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

            {serverError && (
              <div className='auth__error'>{serverError}</div>
            )}

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

            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className='form__group'>
                <label>Full Name <span className='required'>*</span></label>
                <input
                  type='text'
                  name='username'
                  placeholder='Enter your full name'
                  value={userData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username ? 'input__error' : touched.username && !errors.username ? 'input__success' : ''}
                />
                {errors.username && touched.username && (
                  <span className='error__message'>{errors.username}</span>
                )}
                {!errors.username && touched.username && (
                  <span className='success__message'>✅ Looks good!</span>
                )}
              </div>

              {/* Email */}
              <div className='form__group'>
                <label>Email Address <span className='required'>*</span></label>
                <input
                  type='email'
                  name='email'
                  placeholder='e.g. name@gmail.com'
                  value={userData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'input__error' : touched.email && !errors.email ? 'input__success' : ''}
                />
                {errors.email && touched.email && (
                  <span className='error__message'>{errors.email}</span>
                )}
                {!errors.email && touched.email && (
                  <span className='success__message'>✅ Valid email!</span>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div className='form__group'>
                <label>Phone Number <span className='required'>*</span></label>
                <div className='phone__input__group'>
                  <select
                    name='countryCode'
                    value={userData.countryCode}
                    onChange={handleChange}
                    className='country__select'
                  >
                    {countries.map(country => (
                      <option key={country.code + country.name} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type='tel'
                    name='phone'
                    placeholder='10 digit number'
                    value={userData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                    className={errors.phone && touched.phone ? 'input__error' : touched.phone && !errors.phone ? 'input__success' : ''}
                  />
                </div>
                <div className='phone__counter'>
                  {userData.phone.length}/10 digits
                </div>
                {errors.phone && touched.phone && (
                  <span className='error__message'>{errors.phone}</span>
                )}
                {!errors.phone && touched.phone && userData.phone.length === 10 && (
                  <span className='success__message'>✅ Valid phone number!</span>
                )}
              </div>

              {/* Password */}
              <div className='form__group'>
                <label>Password <span className='required'>*</span></label>
                <input
                  type='password'
                  name='password'
                  placeholder='Min 8 chars, uppercase, number, special char'
                  value={userData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password ? 'input__error' : touched.password && !errors.password ? 'input__success' : ''}
                />

                {/* Password Strength Bar */}
                {userData.password && (
                  <div className='password__strength'>
                    <div className='strength__bar'>
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className='strength__segment'
                          style={{
                            background: level <= passwordStrength.strength
                              ? passwordStrength.color
                              : '#e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: passwordStrength.color, fontSize: '12px' }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}

                {errors.password && touched.password && (
                  <span className='error__message'>{errors.password}</span>
                )}
                {!errors.password && touched.password && (
                  <span className='success__message'>✅ Strong password!</span>
                )}
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
                <img src='https://www.google.com/favicon.ico' alt='google' width='18' />
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