import React from 'react'
import { Link } from 'react-router-dom'
import useHome from '../hooks/useHome'
import Features from '../components/home/Features'
import './Home.css'

const Home = () => {
  const { homeData, loading, error } = useHome()

  // Handle Loading State
  if (loading) {
    return <div className="loading-screen">Loading HireAI...</div>
  }

  // Handle Error State
  if (error) {
    return <div className="error-screen">{error}</div>
  }

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className='hero'>
        <div className='hero__content'>
          <span className='hero__badge'>{homeData?.hero?.badge}</span>
          <h1 className='hero__title'>
            {homeData?.hero?.title.split('AI Assistance')[0]}
            <span>AI Assistance</span>
          </h1>
          <p className='hero__subtitle'>
            {homeData?.hero?.description}
          </p>
          <div className='hero__buttons'>
            <Link to='/jobs' className='btn__primary'>
              {homeData?.hero?.primaryButton}
            </Link>
            <Link to='/register' className='btn__secondary'>
              {homeData?.hero?.secondaryButton}
            </Link>
          </div>
          
          <div className='hero__stats'>
            <div className='stat'>
              <h3>{homeData?.stats?.jobs?.value}+</h3>
              <p>{homeData?.stats?.jobs?.label}</p>
            </div>
            <div className='stat'>
              <h3>{homeData?.stats?.companies?.value}+</h3>
              <p>{homeData?.stats?.companies?.label}</p>
            </div>
            <div className='stat'>
              <h3>{homeData?.stats?.candidates?.value}+</h3>
              <p>{homeData?.stats?.candidates?.label}</p>
            </div>
            <div className='stat'>
              <h3>{homeData?.stats?.successRate?.value}%</h3>
              <p>{homeData?.stats?.successRate?.label}</p>
            </div>
          </div>
        </div>
        
        <div className='hero__image'>
          <div className='hero__card'>
            <div className='hero__card-header'>
              <span>🤖 AI Job Match</span>
              <span className='match__score'>Latest Roles</span>
            </div>
            
            {/* Dynamic Job Cards matching your backend's "featuredJobs" array */}
            {homeData?.featuredJobs?.length > 0 ? (
              homeData.featuredJobs.map((job, index) => (
                <div key={index} className='hero__card-job'>
                  <h4>{job.title}</h4>
                  <p>{job.company} · {job.location} · {job.salary}</p>
                  <div className='skills'>
                    {job.skills?.map((skill, i) => (
                      <span key={i}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No recent jobs found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Passing the dynamic features array straight from the backend */}
      {homeData?.features && <Features featuresData={homeData.features} />}

      {/* ─── CTA Section ─── */}
      <section className='cta'>
        <h2>{homeData?.cta?.title}</h2>
        <p>{homeData?.cta?.description}</p>
        <div className='cta__buttons'>
          <Link to='/register' className='btn__primary'>
            {homeData?.cta?.primaryButton}
          </Link>
          <Link to='/jobs' className='btn__outline'>
            {homeData?.cta?.secondaryButton}
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className='footer'>
        <div className='footer__content'>
          <div className='footer__logo'>
            {homeData?.footer?.copyright} 🤖
          </div>
          <p>{homeData?.footer?.description}</p>
          <div className='footer__links'>
            {homeData?.footer?.links?.map((link, index) => (
              <Link key={index} to={link.path}>{link.label}</Link>
            ))}
          </div>
          <p className='footer__copy'>
            © {new Date().getFullYear()} {homeData?.footer?.copyright}. {homeData?.footer?.creator}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home