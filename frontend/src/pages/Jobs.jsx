import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Jobs.css'

// Sample data - will be replaced with API data later
const sampleJobs = [
  {
    _id: '1',
    title: 'Junior React Developer',
    company: 'Razorpay',
    location: 'Bangalore',
    type: 'Full Time',
    salary: '8-12 LPA',
    experience: '0-1 years',
    skills: ['React.js', 'JavaScript', 'CSS'],
    description: 'Looking for a passionate React developer to join our frontend team.',
    featured: true,
    createdAt: '2026-06-13'
  },
  {
    _id: '2',
    title: 'MERN Stack Developer',
    company: 'Swiggy',
    location: 'Remote',
    type: 'Full Time',
    salary: '10-15 LPA',
    experience: '0-2 years',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    description: 'Join our engineering team to build scalable food delivery products.',
    featured: true,
    createdAt: '2026-06-12'
  },
  {
    _id: '3',
    title: 'Frontend Developer',
    company: 'Zepto',
    location: 'Mumbai',
    type: 'Full Time',
    salary: '6-10 LPA',
    experience: '0-1 years',
    skills: ['React.js', 'HTML5', 'CSS3', 'Bootstrap'],
    description: 'Build beautiful user interfaces for our quick commerce platform.',
    featured: false,
    createdAt: '2026-06-11'
  },
  {
    _id: '4',
    title: 'Node.js Backend Developer',
    company: 'CRED',
    location: 'Bangalore',
    type: 'Full Time',
    salary: '12-18 LPA',
    experience: '1-2 years',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    description: 'Build robust backend services for our fintech platform.',
    featured: false,
    createdAt: '2026-06-10'
  },
  {
    _id: '5',
    title: 'Full Stack Developer Intern',
    company: 'Groww',
    location: 'Remote',
    type: 'Internship',
    salary: '25-40K/month',
    experience: 'Fresher',
    skills: ['React.js', 'Node.js', 'MongoDB'],
    description: 'Exciting internship opportunity to work on fintech products.',
    featured: true,
    createdAt: '2026-06-09'
  },
  {
    _id: '6',
    title: 'React Native Developer',
    company: 'PhonePe',
    location: 'Pune',
    type: 'Full Time',
    salary: '8-14 LPA',
    experience: '0-2 years',
    skills: ['React Native', 'JavaScript', 'Redux'],
    description: 'Build cross-platform mobile apps for our payments platform.',
    featured: false,
    createdAt: '2026-06-08'
  },
]

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [experience, setExperience] = useState('')

  // Filter jobs
  const filteredJobs = sampleJobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    ) &&
    (location === '' || job.location.toLowerCase().includes(location.toLowerCase())) &&
    (jobType === '' || job.type === jobType) &&
    (experience === '' || job.experience.includes(experience))
  })

  return (
    <div className='jobs__page'>

      {/* ─── Search Header ─── */}
      <div className='jobs__header'>
        <h1>Find Your <span>Dream Job</span></h1>
        <p>Discover {sampleJobs.length}+ opportunities from top companies</p>

        {/* Search Bar */}
        <div className='jobs__searchbar'>
          <div className='search__input'>
            <span>🔍</span>
            <input
              type='text'
              placeholder='Job title, company or skill...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='search__input'>
            <span>📍</span>
            <input
              type='text'
              placeholder='Location...'
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          <button className='search__btn'>Search Jobs</button>
        </div>
      </div>

      <div className='jobs__content'>

        {/* ─── Filters Sidebar ─── */}
        <div className='jobs__filters'>
          <h3>Filters</h3>

          <div className='filter__group'>
            <label>Job Type</label>
            <select value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value=''>All Types</option>
              <option value='Full Time'>Full Time</option>
              <option value='Internship'>Internship</option>
              <option value='Part Time'>Part Time</option>
              <option value='Remote'>Remote</option>
            </select>
          </div>

          <div className='filter__group'>
            <label>Experience</label>
            <select value={experience} onChange={e => setExperience(e.target.value)}>
              <option value=''>All Levels</option>
              <option value='Fresher'>Fresher</option>
              <option value='0-1'>0-1 years</option>
              <option value='1-2'>1-2 years</option>
              <option value='2-3'>2-3 years</option>
            </select>
          </div>

          <div className='filter__group'>
            <label>Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value=''>All Locations</option>
              <option value='Bangalore'>Bangalore</option>
              <option value='Mumbai'>Mumbai</option>
              <option value='Pune'>Pune</option>
              <option value='Remote'>Remote</option>
              <option value='Delhi'>Delhi</option>
            </select>
          </div>

          <button
            className='filter__clear'
            onClick={() => {
              setSearchTerm('')
              setLocation('')
              setJobType('')
              setExperience('')
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* ─── Jobs List ─── */}
        <div className='jobs__list'>

          {/* Results count */}
          <div className='jobs__results'>
            <p><strong>{filteredJobs.length}</strong> jobs found</p>
            <select>
              <option>Sort by: Latest</option>
              <option>Sort by: Salary</option>
              <option>Sort by: Relevance</option>
            </select>
          </div>

          {/* Job Cards */}
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job._id} className={`job__card ${job.featured ? 'featured' : ''}`}>
                {job.featured && <span className='job__featured'>⭐ Featured</span>}

                <div className='job__card-header'>
                  <div className='job__company-logo'>
                    {job.company.charAt(0)}
                  </div>
                  <div className='job__info'>
                    <h3>{job.title}</h3>
                    <p className='job__company'>{job.company}</p>
                  </div>
                  <div className='job__salary'>
                    💰 {job.salary}
                  </div>
                </div>

                <div className='job__meta'>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>⏱️ {job.experience}</span>
                </div>

                <p className='job__description'>{job.description}</p>

                <div className='job__skills'>
                  {job.skills.map((skill, index) => (
                    <span key={index} className='job__skill'>{skill}</span>
                  ))}
                </div>

                <div className='job__card-footer'>
                  <span className='job__date'>
                    📅 {new Date(job.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <div className='job__actions'>
                    <button className='btn__save'>🔖 Save</button>
                    <Link to={`/jobs/${job._id}`} className='btn__apply'>
                      Apply Now →
                    </Link>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className='jobs__empty'>
              <span>😕</span>
              <h3>No jobs found</h3>
              <p>Try different keywords or clear filters</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Jobs