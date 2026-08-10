import React from 'react'

const HeroStats = ({ statsData }) => {
  return (
    <div className='hero__stats'>
      <div className='hero__stat'>
        <strong>{statsData?.jobs?.value}+</strong>
        <span>{statsData?.jobs?.label}</span>
      </div>

      <div className='hero__stat'>
        <strong>{statsData?.companies?.value}+</strong>
        <span>{statsData?.companies?.label}</span>
      </div>

      <div className='hero__stat'>
        <strong>{statsData?.candidates?.value}+</strong>
        <span>{statsData?.candidates?.label}</span>
      </div>

      <div className='hero__stat'>
        <strong>{statsData?.successRate?.value}%</strong>
        <span>{statsData?.successRate?.label}</span>
      </div>
    </div>
  )
}

export default HeroStats