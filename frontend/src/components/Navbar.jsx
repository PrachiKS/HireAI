import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AUTH_URL } from '../utils/config'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, role, dispatch } = useAuth()
  const navigate = useNavigate()

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

  return (
    <nav className='navbar'>
      {/* Logo */}
      <div className='navbar__logo'>
        <Link to='/'>Hire<span>AI</span> 🤖</Link>
      </div>

      {/* Nav Links */}
      <ul className={`navbar__links ${isOpen ? 'active' : ''}`}>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/jobs'>Jobs</NavLink></li>
        {user && role === 'jobseeker' && (
          <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
        )}
        {user && role === 'recruiter' && (
          <li><NavLink to='/recruiter/dashboard'>Dashboard</NavLink></li>
        )}
        {user && role === 'admin' && (
          <li><NavLink to='/admin/dashboard'>Admin</NavLink></li>
        )}
      </ul>

      {/* Auth Buttons */}
      <div className='navbar__auth'>
        {user ? (
          <div className='navbar__user'>
            <span className='navbar__username'>
              👤 {user.username}
            </span>
            <button
              className='btn__logout'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to='/login' className='btn__login'>Login</Link>
            <Link to='/register' className='btn__register'>Get Started</Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <span
        className='navbar__toggle'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </span>
    </nav>
  )
}

export default Navbar