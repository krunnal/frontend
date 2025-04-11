import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
// import { Link } from 'react-router-dom';
import Navbar from '../Pages/bar';
import image from '../images/logo.jpeg';
import image1 from '../images/baground-image.jpg';
import freewill from '../images/freewill.jpeg';
import WhatsLogo from '../images/whastLogo.jpeg'; // Import WhatsApp logo
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Icons for phone and email

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../css/Staticpage.css';

const Home = () => {
  // Create refs for each section
  const homeSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const pricesectionRef = useRef(null)

  // Scroll function to smooth scroll to a section
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // WhatsApp link - replace with your own WhatsApp number
  const whatsappNumber = ''; // Your WhatsApp phone number in international format
  const message = 'Hello, I would like to inquire about your services.'; // Message text

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="home-container1">
      <Helmet>
        <title>Six Steps</title>
        <meta name="description" content="Description of the website" />
        <meta property="og:title" content="Finbest" />
        <meta property="og:description" content="Description of the website" />
      </Helmet>

      {/* Navbar */}
      <Navbar
        scrollToHome={() => scrollToSection(homeSectionRef)}
        scrollToAbout={() => scrollToSection(aboutSectionRef)}
        scrollToContact={() => scrollToSection(contactSectionRef)}
        scrollToprice={() => scrollToSection(pricesectionRef)}
      />

      {/* Home Section */}
      <div id="home" ref={homeSectionRef} className="home-hero">
        <header className="home-heading10">
          <div id="notifcation" className="home-notification">
            <Link to="/Home"></Link>
          </div>
        </header>
        <div className="home-content10">
          <div className="home-content11">
            <h1 className="home-title1">Welcome to Our Will Form Service</h1>
            <span className="home-caption1">
              It takes less than 20 minutes to write or update your legal will, for free.
            </span>
            <div className="home-hero-buttons1">
              <div
                className="home-ios-btn1"
                onClick={() => window.location.href = 'https://auth.lmnopservices.com/login?client_id=1ftqhjj9prcb6qbcrae8mqkuum&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fwww.lmnopservices.com%2Findex.html'}
              >
                <img alt="pastedImage" src={image} className="home-apple1" />
                <span className="home-caption2">Get Started</span>
              </div>
            </div>
          </div>
          <div className="home-images">
            <div>
              <img alt="pastedImage" src={freewill} className="home-pasted-image1" />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" ref={aboutSectionRef} className="about-section">
        <div className="about-content">
          <h2 className="about-title">About Us</h2>
          <p className="about-description">
            Six Steps, a leading technology service provider, operates lmnopservices.in, India's premier legaltech platform dedicated to simplifying will creation.

            We understand that drafting a legally sound will can be complex and daunting. That's why we've developed an innovative platform that empowers individuals to easily and securely create their own legally valid wills.

            lmnopservices.in leverages cutting-edge technology to guide users through a straightforward process, ensuring their wishes are accurately reflected in their legal documents.

            Key Highlights:

            User-friendly interface: Our platform is designed for everyone, regardless of their technical expertise.
            Secure and confidential: We prioritize the security and confidentiality of your personal information.
            Legally sound: Our platform ensures your will adheres to all relevant legal requirements.
            Peace of mind: Create your will with confidence, knowing your wishes will be respected.
            Experience the lmnopservices.in difference today and take control of your future.
          </p>
          <img src={image1} alt="Finbest" className="about-image" />
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" ref={contactSectionRef} className="contact-section">
        <div className="contact-info">
          <h2 className="contact-title">Contact Us</h2>
          <div className="contact-details">
            <strong> Must have Indian contact number/email address and operating addres</strong>
            <p className="contact-item">
              <FaPhoneAlt className="contact-icon" /> {/* Phone Icon */}

              <strong>Phone Number:</strong> +917020742603

            </p>
            <p className="contact-item">
              <FaEnvelope className="contact-icon" /> {/* Email Icon */}
              <strong>Email:</strong> <span className="email-prefix">support</span>sales@sixsteps.org.in

            </p>
            <p className='contact-item'>
              <strong>Registered Business name to be mentioned on the website:
              </strong>
              <lable>Office 102, Runwal Platinum, Bavdhan Khurd PUne 411021
              </lable>
            </p>

          </div>

          {/* WhatsApp Button */}
          
        </div>
      </div>
      <div id="price" ref={pricesectionRef} className="contact-section1">
        <div className="contact-info">
          <h2 className="contact-title">Pricing</h2>
          <div className="will-pricing">
            <div className="flex items-center justify-between">
              <strong className="text-dark">Standard Will:</strong> <span className="text-light">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <strong className="text-dark">Comprehensive Will:</strong> INR 2500/- per will
            </div>
          </div>


        </div>

      </div>

      {/* Footer Section */}
      <footer>
        <div className="containers">
          <p>&copy; {new Date().getFullYear()} Six Steps. All rights reserved.</p>
        </div>
        <div className="App">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/policy">Cancellation Policy</Link>
              </li>
              <li>
                <Link to="/privacyPolicy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shippPolicy">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/termsOfService">Terms of Service</Link>
              </li>
            </ul>
          </nav>
        </div>

      </footer>
    </div >
  );
};

export default Home;
