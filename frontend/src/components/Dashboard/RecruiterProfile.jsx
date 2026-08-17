import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AUTH_URL } from '../../utils/config'

const RecruiterProfile = () => {
  const { user, dispatch } = useAuth()

  // 1. Text Data State (Tailored for Recruiters)
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    company: user?.company || '',
    companyWebsite: user?.companyWebsite || '',
    designation: user?.designation || '',
    bio: user?.bio || ''
  })
  
  // 2. File Upload State
  const [file, setFile] = useState(null)

  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)
    setProfileMsg({ type: '', text: '' })

    try {
      const formData = new FormData()

      // Append text data
      formData.append('username', profileForm.username)
      formData.append('phone', profileForm.phone)
      formData.append('location', profileForm.location)
      formData.append('company', profileForm.company)
      formData.append('companyWebsite', profileForm.companyWebsite)
      formData.append('designation', profileForm.designation)
      formData.append('bio', profileForm.bio)

      // Append photo if a new one was selected
      if (file) formData.append('photo', file)

      const res = await fetch(`${AUTH_URL}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Company profile updated successfully! 🎉' })
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.data, token: localStorage.getItem('token'), role: data.data.role }
        })
      } else {
        setProfileMsg({ type: 'error', text: data.message })
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setUpdatingProfile(false)
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div className='dashboard__section'>
      <div className='section__header'>
        <h2>Company Profile</h2>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Update your recruiter details and company information</p>
      </div>

      {profileMsg.text && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          background: profileMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: profileMsg.type === 'success' ? '#166534' : '#dc2626'
        }}>
          {profileMsg.text}
        </div>
      )}

      <form className='job__form' onSubmit={handleProfileUpdate}>
        
        {/* ─── LOGO UPLOAD SECTION ─── */}
        <div className='form__row' style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #cbd5e1' }}>
          <div className='form__group' style={{ width: '100%' }}>
            <label>🏢 Company Logo / Profile Photo</label>
            <input 
              type='file' 
              name='photo' 
              accept='image/jpeg, image/png, image/jpg'
              onChange={handleFileChange} 
              style={{ padding: '8px', background: 'white', width: '100%' }}
            />
            {user?.photo && <p style={{ fontSize: '12px', color: '#0062FF', marginTop: '4px' }}>Current photo active</p>}
          </div>
        </div>

        {/* ─── TEXT DATA SECTION ─── */}
        <div className='form__row'>
          <div className='form__group'>
            <label>Full Name *</label>
            <input type='text' name='username' value={profileForm.username} onChange={handleProfileChange} required />
          </div>
          <div className='form__group'>
            <label>Email Address *</label>
            <input type='email' name='email' value={profileForm.email} disabled style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} />
          </div>
        </div>

        <div className='form__row'>
          <div className='form__group'>
            <label>Company Name *</label>
            <input type='text' name='company' placeholder='e.g., FineTech Pvt Ltd' value={profileForm.company} onChange={handleProfileChange} required />
          </div>
          <div className='form__group'>
            <label>Your Designation *</label>
            <input type='text' name='designation' placeholder='e.g., HR Manager' value={profileForm.designation} onChange={handleProfileChange} required />
          </div>
        </div>

        <div className='form__row'>
          <div className='form__group'>
            <label>Company Website</label>
            <input type='url' name='companyWebsite' placeholder='https://www.example.com' value={profileForm.companyWebsite} onChange={handleProfileChange} />
          </div>
          <div className='form__group'>
            <label>Phone Number</label>
            <input type='tel' name='phone' placeholder='+91 9876543210' value={profileForm.phone} onChange={handleProfileChange} />
          </div>
        </div>

        <div className='form__group'>
          <label>Company HQ / Location</label>
          <input type='text' name='location' placeholder='e.g., Mumbai, Maharashtra' value={profileForm.location} onChange={handleProfileChange} />
        </div>

        <div className='form__group'>
          <label>Company Bio / About</label>
          <textarea name='bio' placeholder='Tell candidates about your company culture and mission...' value={profileForm.bio} onChange={handleProfileChange} rows={4} />
        </div>

        <button type='submit' className='post__job__btn' disabled={updatingProfile} style={{ width: 'auto', padding: '12px 32px' }}>
          {updatingProfile ? 'Uploading & Saving...' : '💾 Save Profile'}
        </button>

      </form>
    </div>
  )
}

export default RecruiterProfile