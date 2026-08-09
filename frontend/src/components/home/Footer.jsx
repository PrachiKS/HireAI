import React from 'react'
import { Link } from 'react-router-dom';

const Footer = ({ footerData }) => {

  return (
    <>
      <footer className='footer'>
        <div className='footer__content'>
          <div className='footer__logo'>
            Hire<span>AI</span> 🤖
          </div>
          <p>{footerData?.description}</p>
          <div className='footer__links'>
            {footerData?.links?.map((link) => (
              <Link
                key={link.path}
                to={link.path}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className='footer__copy'>
            © {new Date().getFullYear()} {footerData?.copyright} {footerData?.creator}
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer