import React from 'react'
import { Link } from 'react-router-dom';
import HeroStats from './HeroStats'
import AIJobCard from './AIJobCard'

const Hero = ({ heroData, statsData, featuredJobs }) => {

  return (
    <section className='hero'>
      <div className='hero__content'>
        <span className='hero__badge'>{heroData?.badge}</span>

        <h1 className='hero__title'>{heroData?.title}</h1>

        <p className='hero__subtitle'>{heroData?.description}</p>

        <div className='hero__buttons'>
          <Link to='/jobs' className='btn__primary'>
            {heroData?.primaryButton}
          </Link>
          <Link to='/register' className='btn__secondary'>
            {heroData?.secondaryButton}
          </Link>
        </div>
        <HeroStats statsData={statsData} />
      </div>
      <AIJobCard featuredJobs={featuredJobs} />
    </section>
  )
}

export default Hero