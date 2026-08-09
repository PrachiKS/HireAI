import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import CTA from '../components/home/CTA'
import Footer from '../components/home/Footer';
import useHome from '../hooks/useHome'
import './Home.css'


const Home = () => {
  const { homeData, loading, error } = useHome()

  console.log('Home Data:', homeData)
  console.log('Home Loading:', loading)
  console.log('Home Error:', error)

  return (
    <div>
      <Hero
        heroData={homeData?.hero}
        statsData={homeData?.stats}
        featuredJobs={homeData?.featuredJobs}
      />
      <Features featuresData={homeData?.features} />
      <CTA ctaData={homeData?.cta} />
      <Footer footerData={homeData?.footer} />
    </div>
  )
}

export default Home