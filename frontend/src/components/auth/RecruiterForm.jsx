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
    
      {error && {error}}

      
        
          Your Name *
          
        
        
          Work Email *
          
        
      
      
      
        
          Password *
          
        
        
          Your Role / Title *
          
        
      

      Company Details

      
        Company Name *
        
      

      
        Company Website *
        
      

      
        {loading ? 'Creating account...' : 'Create Recruiter Account'}
      
    
  );
};

export default RecruiterForm;