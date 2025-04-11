import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/bar.css';

const Navbar = ({ scrollToHome, scrollToAbout, scrollToContact,scrollToprice }) => {
  return (
    <header className="bar-bar">
      <div className="bar-desktop">
        <div className="bar-main">
          <div>
            <div className="logo">lmnopservices By Six Steps</div>
          </div>
          <div className="bar-links1">
            {/* Update the Navbar links to use scrollToSec
            tion */}
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToHome(); }} className="link">Home</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToAbout(); }} className="link">About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToContact(); }} className="link">Contact Us</a>
            <a href="#price" onClick={(e) => { e.preventDefault(); scrollToprice(); }} className="link">Price</a>
          </div>
        </div>
        <div className="bar-quick-actions">
          <Link  className="bar-navlink2" onClick={() => window.location.href = 'https://auth.lmnopservices.com/login?client_id=1ftqhjj9prcb6qbcrae8mqkuum&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fwww.lmnopservices.com%2Findex.html'}>
            <div className="bar-sign-up-btn">
              <span className="bar-sign-up">Login</span>
            </div>
          </Link>

          <img
            id="open-mobile-menu"
            alt="hamburger menu"
            src="/pastedimage-cx4wqj.svg"
            className="bar-hamburger-menu"
          />
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  scrollToHome: PropTypes.func.isRequired,
  scrollToAbout: PropTypes.func.isRequired,
  scrollToContact: PropTypes.func.isRequired,
};

export default Navbar;
