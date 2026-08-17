import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_URL } from '../../utils/config';

const RecruiterForm = () => {
  const [userData, setUserData] = useState({
    username: '', 
    email: '', 
    password: '',
    company: '',
    companyWebsite: '',
    designation: '',
    role: 'recruiter'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth__form-scrollable">
      {error && <div className='auth__error'>{error}</div>}

      <div className="form__row">
        <div className='form__group'>
          <label>Your Name *</label>
          <input type='text' name='username' placeholder='Enter your full name' onChange={handleChange} required />
        </div>
        <div className='form__group'>
          <label>Work Email *</label>
          <input type='email' name='email' placeholder='Enter your work email' onChange={handleChange} required />
        </div>
      </div>
      
      <div className="form__row">
        <div className='form__group'>
          <label>Password *</label>
          <input type='password' name='password' placeholder='Min 6 characters' onChange={handleChange} required />
        </div>
        <div className='form__group'>
          <label>Your Role / Title *</label>
          <input type='text' name='designation' placeholder='e.g. HR Manager' onChange={handleChange} required />
        </div>
      </div>

      <div className='form__divider'><span>Company Details</span></div>

      <div className='form__group'>
        <label>Company Name *</label>
        <input type='text' name='company' placeholder='Company Name' onChange={handleChange} required />
      </div>

      <div className='form__group'>
        <label>Company Website *</label>
        <input type='url' name='companyWebsite' placeholder='https://www.company.com' onChange={handleChange} required />
      </div>

      <button type='submit' className='auth__btn' disabled={loading}>
        {loading ? 'Creating account...' : 'Create Recruiter Account'}
      </button>
    </form>
  );
};

export default RecruiterForm;