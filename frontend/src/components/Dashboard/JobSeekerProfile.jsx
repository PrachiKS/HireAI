import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AUTH_URL } from '../../utils/config'

const JobSeekerProfile = () => {
  const { user, dispatch } = useAuth()

  // 1. Text Data State
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    portfolioUrl: user?.portfolioUrl || '',
    experienceLevel: user?.experienceLevel || '',
    education: user?.education || { university: '', degree: '', graduationYear: '' }
  })

  // 2. File Upload State
  const [files, setFiles] = useState({
    photo: null,
    resume: null,
    certificate: null
  })

  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // 3. Handle Text Inputs
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }
  const handleEducationChange = (e) => {
    setProfileForm({
      ...profileForm,
      education: {
        ...profileForm.education,
        [e.target.name]: e.target.value
      }
    })
  }
  // 4. Handle File Inputs
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] })
  }

  // 5. Submit profile update using FormData (required for files)
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)
    setProfileMsg({ type: '', text: '' })

    try {
      // Create a FormData object to hold both text and files
      const formData = new FormData()

      // Append text data
      formData.append('username', profileForm.username)
      formData.append('phone', profileForm.phone)
      formData.append('location', profileForm.location)
      formData.append('bio', profileForm.bio)
      formData.append('portfolioUrl', profileForm.portfolioUrl)
      formData.append('experienceLevel', profileForm.experienceLevel)

      // Format skills back into an array and append
      const skillsArray = profileForm.skills.split(',').map(s => s.trim()).filter(s => s)
      formData.append('skills', JSON.stringify(skillsArray)) // Arrays must be stringified in FormData
      formData.append('education', JSON.stringify(profileForm.education))

      // Append files ONLY if the user selected a new one
      if (files.photo) formData.append('photo', files.photo)
      if (files.resume) formData.append('resume', files.resume)
      if (files.certificate) formData.append('certificate', files.certificate)

      const res = await fetch(`${AUTH_URL}/profile`, {
        method: 'PUT',
        // 🚨 IMPORTANT: Do NOT set 'Content-Type': 'application/json' here!
        // The browser will automatically set 'multipart/form-data' when using FormData
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Profile & files updated successfully! 🎉' })
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
        <h2>My Profile</h2>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Update your personal information, resume, and certificates</p>
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

        {/* ─── FILE UPLOADS SECTION ─── */}
        <div className='form__row' style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #cbd5e1' }}>

          <div className='form__group'>
            <label>📷 Profile Photo</label>
            <input
              type='file'
              name='photo'
              accept='image/jpeg, image/png, image/jpg'
              onChange={handleFileChange}
              style={{ padding: '8px', background: 'white' }}
            />
            {user?.photo && <p style={{ fontSize: '12px', color: '#0062FF', marginTop: '4px' }}>Current photo active</p>}
          </div>

          <div className='form__group'>
            <label>📄 Upload Resume (PDF/DOCX)</label>
            <input
              type='file'
              name='resume'
              accept='.pdf,.doc,.docx'
              onChange={handleFileChange}
              style={{ padding: '8px', background: 'white' }}
            />
            {user?.resumeUrl && <p style={{ fontSize: '12px', color: '#0062FF', marginTop: '4px' }}>Current resume active</p>}
          </div>

          <div className='form__group'>
            <label>🎓 Certificate (Optional)</label>
            <input
              type='file'
              name='certificate'
              accept='.pdf,image/*'
              onChange={handleFileChange}
              style={{ padding: '8px', background: 'white' }}
            />
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
            <label>Phone Number</label>
            <input type='tel' name='phone' placeholder='+91 9876543210' value={profileForm.phone} onChange={handleProfileChange} />
          </div>
          <div className='form__group'>
            <label>Location</label>
            <input type='text' name='location' placeholder='e.g., Pune, Maharashtra' value={profileForm.location} onChange={handleProfileChange} />
          </div>
        </div>

        <div className='form__row'>
          <div className='form__group'>
            <label>Experience Level</label>
            <select name='experienceLevel' value={profileForm.experienceLevel} onChange={handleProfileChange}>
              <option value=''>Select Experience...</option>
              <option value='Fresher'>Fresher (0 years)</option>
              <option value='1-3 Years'>1-3 Years</option>
              <option value='3-5 Years'>3-5 Years</option>
              <option value='5+ Years'>5+ Years</option>
            </select>
          </div>
          <div className='form__group'>
            <label>Portfolio / LinkedIn URL</label>
            <input type='url' name='portfolioUrl' placeholder='https://linkedin.com/in/yourprofile' value={profileForm.portfolioUrl} onChange={handleProfileChange} />
          </div>
        </div>
        <div className='form__row'>
          <div className='form__group'>
            <label>University / College</label>
            <input
              type='text'
              name='university'
              placeholder='Enter your university or college name'
              value={profileForm.education.university}
              onChange={handleEducationChange}
            />
          </div>
          <div className='form__group'>
            <label>Degree</label>
            <input
              type='text'
              name='degree'
              placeholder='e.g. B.Tech Computer Engineering'
              value={profileForm.education.degree}
              onChange={handleEducationChange}
            />
          </div>
          <div className='form__group'>
            <label>Graduation Year</label>
            <input
              type='text'
              name='graduationYear'
              placeholder='e.g., 2026'
              value={profileForm.education.graduationYear}
              onChange={handleEducationChange}
            />
          </div>
        </div>
        <div className='form__group'>
          <label>Skills (comma separated)</label>
          <input type='text' name='skills' placeholder='React, Node.js, MongoDB, JavaScript' value={profileForm.skills} onChange={handleProfileChange} />
        </div>

        <div className='form__group'>
          <label>Professional Bio</label>
          <textarea name='bio' placeholder='Tell recruiters about yourself...' value={profileForm.bio} onChange={handleProfileChange} rows={4} />
        </div>

        <button type='submit' className='post__job__btn' disabled={updatingProfile} style={{ width: 'auto', padding: '12px 32px' }}>
          {updatingProfile ? 'Uploading & Saving...' : '💾 Save Profile & Files'}
        </button>

      </form>
    </div>
  )
}

export default JobSeekerProfile