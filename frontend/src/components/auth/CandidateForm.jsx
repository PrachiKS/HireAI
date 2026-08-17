import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_URL } from '../../utils/config';

const CandidateForm = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    university: '',
    degree: '',
    graduationYear: '',
    skills: '',
    portfolioUrl: '',
    role: 'jobseeker'
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

    const formattedSkills = userData.skills 
      ? userData.skills.split(',').map(skill => skill.trim()) 
      : [];

    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      skills: formattedSkills,
      portfolioUrl: userData.portfolioUrl,
      education: {
        university: userData.university,
        degree: userData.degree,
        graduationYear: userData.graduationYear
      }
    };

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
          <label>Full Name *</label>
          <input type='text' name='username' placeholder='Enter your full name' onChange={handleChange} required />
        </div>
        <div className='form__group'>
          <label>Email Address *</label>
          <input type='email' name='email' placeholder='Enter your email address' onChange={handleChange} required />
        </div>
      </div>

      <div className='form__group'>
        <label>Password *</label>
        <input type='password' name='password' placeholder='Min 6 characters' onChange={handleChange} required />
      </div>

      <div className='form__divider'><span>Education & Skills</span></div>

      <div className="form__row">
        <div className='form__group'>
          <label>University / College</label>
          <input type='text' name='university' placeholder='Enter your university or college name' onChange={handleChange} />
        </div>
        <div className='form__group'>
          <label>Graduation Year</label>
          <input type='text' name='graduationYear' placeholder='e.g. 2026' onChange={handleChange} />
        </div>
      </div>

      <div className="form__row">
        <div className='form__group'>
          <label>Degree</label>
          <input type='text' name='degree' placeholder='e.g. BTech Computer Engg' onChange={handleChange} />
        </div>
        <div className='form__group'>
          <label>GitHub / LinkedIn URL</label>
          <input type='url' name='portfolioUrl' placeholder='https://github.com/...' onChange={handleChange} />
        </div>
      </div>

      <div className='form__group'>
        <label>Top Skills (comma separated) *</label>
        <input type='text' name='skills' placeholder='React.js, Node.js, MongoDB' onChange={handleChange} required />
      </div>

      <button type='submit' className='auth__btn' disabled={loading}>
        {loading ? 'Creating account...' : 'Create Candidate Account'}
      </button>
    </form>
  );
};

export default CandidateForm;