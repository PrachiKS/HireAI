import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className='hero'>
        <div className='hero__content'>
          <span className='hero__badge'>🤖 AI-Powered Job Board</span>
          <h1 className='hero__title'>
            Find Your Dream Job with <span>AI Assistance</span>
          </h1>
          <p className='hero__subtitle'>
            HireAI matches you with the perfect job using AI. 
            Get your resume reviewed, cover letter generated, 
            and match score calculated — all in one place!
          </p>
          <div className='hero__buttons'>
            <Link to='/jobs' className='btn__primary'>
              Browse Jobs
            </Link>
            <Link to='/register' className='btn__secondary'>
              Post a Job
            </Link>
          </div>
          <div className='hero__stats'>
            <div className='stat'>
              <h3>500+</h3>
              <p>Jobs Posted</p>
            </div>
            <div className='stat'>
              <h3>200+</h3>
              <p>Companies</p>
            </div>
            <div className='stat'>
              <h3>1000+</h3>
              <p>Candidates</p>
            </div>
            <div className='stat'>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
        <div className='hero__image'>
          <div className='hero__card'>
            <div className='hero__card-header'>
              <span>🤖 AI Job Match</span>
              <span className='match__score'>95% Match</span>
            </div>
            <div className='hero__card-job'>
              <h4>Senior React Developer</h4>
              <p>Google · Bangalore · ₹25-40 LPA</p>
              <div className='skills'>
                <span>React.js</span>
                <span>Node.js</span>
                <span>MongoDB</span>
              </div>
            </div>
            <div className='hero__card-job'>
              <h4>Full Stack Developer</h4>
              <p>Swiggy · Remote · ₹15-25 LPA</p>
              <div className='skills'>
                <span>MERN</span>
                <span>AWS</span>
                <span>Docker</span>
              </div>
            </div>
            <div className='hero__card-job'>
              <h4>Frontend Engineer</h4>
              <p>Razorpay · Pune · ₹12-20 LPA</p>
              <div className='skills'>
                <span>React</span>
                <span>TypeScript</span>
                <span>CSS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className='features'>
        <h2>Why Choose <span>HireAI?</span></h2>
        <p className='features__subtitle'>
          Smart tools to help you land your dream job faster
        </p>
        <div className='features__grid'>
          <div className='feature__card'>
            <span className='feature__icon'>📄</span>
            <h3>AI Resume Reviewer</h3>
            <p>Upload your resume and get instant AI feedback, 
            score, and improvement suggestions.</p>
          </div>
          <div className='feature__card'>
            <span className='feature__icon'>✍️</span>
            <h3>AI Cover Letter</h3>
            <p>Generate a personalized cover letter for any 
            job in seconds using AI.</p>
          </div>
          <div className='feature__card'>
            <span className='feature__icon'>🎯</span>
            <h3>AI Job Matching</h3>
            <p>See your match percentage for each job based 
            on your skills and experience.</p>
          </div>
          <div className='feature__card'>
            <span className='feature__icon'>🏢</span>
            <h3>Top Companies</h3>
            <p>Apply to jobs from India's top startups and 
            product companies directly.</p>
          </div>
          <div className='feature__card'>
            <span className='feature__icon'>⚡</span>
            <h3>One Click Apply</h3>
            <p>Apply to multiple jobs with one click. 
            Track all your applications in one place.</p>
          </div>
          <div className='feature__card'>
            <span className='feature__icon'>📊</span>
            <h3>Smart Dashboard</h3>
            <p>Track your applications, interviews, and 
            offers in a beautiful dashboard.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className='cta'>
        <h2>Ready to Find Your Dream Job?</h2>
        <p>Join thousands of candidates who found their perfect role with HireAI</p>
        <div className='cta__buttons'>
          <Link to='/register' className='btn__primary'>
            Get Started Free
          </Link>
          <Link to='/jobs' className='btn__outline'>
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className='footer'>
        <div className='footer__content'>
          <div className='footer__logo'>
            Hire<span>AI</span> 🤖
          </div>
          <p>AI-powered job board connecting talent with opportunity</p>
          <div className='footer__links'>
            <Link to='/jobs'>Jobs</Link>
            <Link to='/about'>About</Link>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </div>
          <p className='footer__copy'>
            © 2026 HireAI. Built by Prachi Sonawane
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home