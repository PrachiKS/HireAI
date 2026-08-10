import React from 'react';
import { Link } from 'react-router-dom';

const CTA = ({ ctaData }) => {

  return (
    <>
      <section className='cta'>
        <h2>{ctaData?.title}</h2>
        <p>{ctaData?.description}</p>
        <div className='cta__buttons'>
          <Link to='/register' className='btn__primary'>
            {ctaData?.primaryButton}
          </Link>
          <Link to='/jobs' className='btn__outline'>
            {ctaData?.secondaryButton}
          </Link>
        </div>
      </section>
    </>
  )
}

export default CTA