import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { JOBS_URL } from '../utils/config'
import './Jobs.css'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    experience: '',
    page: 0
  })

  // ✅ Fetch jobs from backend
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      if (filters.keyword) queryParams.append('keyword', filters.keyword)
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.type) queryParams.append('type', filters.type)
      if (filters.experience) queryParams.append('experience', filters.experience)
      queryParams.append('page', filters.page)

      const res = await fetch(`${JOBS_URL}?${queryParams}`)
      const data = await res.json()

      if (data.success) {
        setJobs(data.data)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch jobs')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters]) 

useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters({ ...filters, page: 0 })
    fetchJobs()
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 })
  }

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      type: '',
      experience: '',
      page: 0
    })
  }

  return (
    <div className='jobs__page'>

      {/* ─── Search Header ─── */}
      <div className='jobs__header'>
        <h1>Find Your <span>Dream Job</span></h1>
        <p>Discover {pagination.total || 0}+ opportunities from top companies</p>

        {/* Search Bar */}
        <form className='jobs__searchbar' onSubmit={handleSearch}>
          <div className='search__input'>
            <span>🔍</span>
            <input
              type='text'
              name='keyword'
              placeholder='Job title, company or skill...'
              value={filters.keyword}
              onChange={handleFilterChange}
            />
          </div>
          <div className='search__input'>
            <span>📍</span>
            <input
              type='text'
              name='location'
              placeholder='Location...'
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          <button type='submit' className='search__btn'>
            Search Jobs
          </button>
        </form>
      </div>

      <div className='jobs__content'>

        {/* ─── Filters Sidebar ─── */}
        <div className='jobs__filters'>
          <h3>Filters</h3>

          <div className='filter__group'>
            <label>Job Type</label>
            <select
              name='type'
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value=''>All Types</option>
              <option value='Full Time'>Full Time</option>
              <option value='Internship'>Internship</option>
              <option value='Part Time'>Part Time</option>
              <option value='Remote'>Remote</option>
              <option value='Contract'>Contract</option>
            </select>
          </div>

          <div className='filter__group'>
            <label>Experience</label>
            <select
              name='experience'
              value={filters.experience}
              onChange={handleFilterChange}
            >
              <option value=''>All Levels</option>
              <option value='Fresher'>Fresher</option>
              <option value='0-1'>0-1 years</option>
              <option value='0-2'>0-2 years</option>
              <option value='1-2'>1-2 years</option>
              <option value='2-3'>2-3 years</option>
            </select>
          </div>

          <button
            className='filter__clear'
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>

          <button
            className='filter__apply'
            onClick={fetchJobs}
          >
            Apply Filters
          </button>
        </div>

        {/* ─── Jobs List ─── */}
        <div className='jobs__list'>

          {/* Results count */}
          <div className='jobs__results'>
            <p><strong>{jobs.length}</strong> jobs found</p>
            <select onChange={e => setFilters({ ...filters, sortBy: e.target.value })}>
              <option value=''>Sort by: Latest</option>
              <option value='views'>Sort by: Popular</option>
              <option value='featured'>Sort by: Featured</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className='jobs__loading'>
              <div className='loading__spinner'></div>
              <p>Finding best jobs for you...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className='jobs__error'>
              <span>⚠️</span>
              <p>{error}</p>
              <button onClick={fetchJobs}>Try Again</button>
            </div>
          )}

          {/* Job Cards */}
          {!loading && !error && jobs.length > 0 && jobs.map(job => (
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
                <span>👁️ {job.views} views</span>
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
                    View & Apply →
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <div className='jobs__empty'>
              <span>😕</span>
              <h3>No jobs found</h3>
              <p>Try different keywords or clear filters</p>
              <button onClick={handleClearFilters}>Clear Filters</button>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className='jobs__pagination'>
              <button
                disabled={filters.page === 0}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className='page__btn'
              >
                ← Previous
              </button>
              <span>Page {filters.page + 1} of {pagination.pages}</span>
              <button
                disabled={filters.page + 1 >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className='page__btn'
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Jobs