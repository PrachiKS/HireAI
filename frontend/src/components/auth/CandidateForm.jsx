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

    // Format data before sending
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
    
      {error && {error}}
      
      
        
          Full Name *
          
        
        
          Email Address *
          
        
      

      
        Password *
        
      

      Education & Skills

      
        
          University / College
          
        
        
          Graduation Year
          
        
      

      
        
          Degree
          
        
        
          GitHub / LinkedIn URL
          
        
      

      
        Top Skills (comma separated) *
        
      

      
        {loading ? 'Creating account...' : 'Create Candidate Account'}
      
    
  );
};

export default CandidateForm;