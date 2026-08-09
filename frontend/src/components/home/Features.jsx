import React from 'react'
import { Link } from 'react-router-dom'

const Features = ({ featuresData }) => {

  return (
    <>
      <section className='features'>
        <h2>Why Choose <span>HireAI?</span></h2>
        <p className='features__subtitle'>
          Smart tools to help you land your dream job faster
        </p>
        <div className='features__grid'>
          {featuresData?.map((feature) => (
            <Link
              to='/login'
              className='feature__card'
              key={feature.title}
            >
              <span className='feature__icon'>
                {feature.icon}
              </span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Features