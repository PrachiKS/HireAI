import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='navbar'>
      {/* Logo */}
      <div className='navbar__logo'>
        <Link to='/'>
          Hire<span>AI</span> 🤖
        </Link>
      </div>

      {/* Nav Links */}
      <ul className={`navbar__links ${isOpen ? 'active' : ''}`}>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/jobs'>Jobs</NavLink></li>
        <li><NavLink to='/about'>About</NavLink></li>
      </ul>

      {/* Auth Buttons */}
      <div className='navbar__auth'>
        <Link to='/login' className='btn__login'>Login</Link>
        <Link to='/register' className='btn__register'>Get Started</Link>
      </div>

      {/* Mobile Menu Toggle */}
      <span className='navbar__toggle' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </span>
    </nav>
  )
}

export default Navbar