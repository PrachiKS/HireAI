import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Features = ({ featuresData }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleFeatureClick = (feature) => {
    // 1. General routes (No login required)
    if (
      feature.title === 'Top Companies' ||
      feature.title === 'One Click Apply'
    ) {
      navigate('/jobs')
      return
    }

    // 2. Dashboard routing
    if (feature.title === 'Smart Dashboard') {
      if (user) {
        // Check their role to send them to the correct new dashboard path
        if (user.role === 'recruiter') {
          navigate('/recruiter/dashboard')
        } else {
          navigate('/jobseeker/dashboard') // 👈 Changed from '/dashboard'
        }
      } else {
        navigate('/login')
      }
      return
    }

    // 3. AI Tools smart routing
    if (user) {
      // If they are already logged in, take them straight to the AI tools page
      navigate('/ai-tools')
    } else {
      // If not logged in, check which tool they clicked to pre-select the right tab!
      if (
        feature.title === 'AI JD Writer' ||
        feature.title === 'AI Candidate Evaluator'
      ) {
        // Route to Recruiter login tab
        navigate('/login?role=recruiter')
      } else {
        // Route to Job Seeker login tab (Resume, Cover Letter, Job Match, Interview Prep)
        navigate('/login?role=jobseeker')
      }
    }
  }

  return (
    <section className='features'>
      <h2>Why Choose <span>HireAI?</span></h2>
      <p className='features__subtitle'>
        Smart tools to help you land your dream job faster
      </p>
      <div className='features__grid'>
        {featuresData?.map((feature) => (
          <div
            className='feature__card'
            key={feature.title}
            onClick={() => handleFeatureClick(feature)}
          >
            <span className='feature__icon'>
              {feature.icon}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features