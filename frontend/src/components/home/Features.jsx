import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Features = ({ featuresData }) => {

  const navigate = useNavigate()
  const { user } = useAuth()

  const handleFeatureClick = (feature) => {

    if (
      feature.title === 'Top Companies' ||
      feature.title === 'One Click Apply'
    ) {
      navigate('/jobs')
      return
    }

    if (feature.title === 'Smart Dashboard') {
      if (user) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
      return
    }

    if (user) {
      navigate('/ai-tools')
    } else {
      navigate('/login')
    }
  }

  return (
    <>
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
    </>
  )
}

export default Features