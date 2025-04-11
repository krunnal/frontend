import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; // Changed to HashRouter
import useAuth from './Pages/auth'; // Import the authentication hook
import Documents from './Pages/Documents';
import SurveysList from './Pages/ServeyList';
import Submit from './Pages/Submit';
import Billing from './Pages/Billing';
import Home from './Pages/HomePage';
import FreeWillForm from './Pages/FreeWillform';
import GenratePdf from './Pages/Genratepdf';
import Payment from './Pages/Payment';
import StaticPage from './Pages/Staticpage';
import Pdf from './Pages/pdf';
import PaymentById from './Pages/PaymentById';
import Newpage from './Pages/newpage';
import CanclePolicy from './Pages/canclePloicy'
import PrivacyPolicy from './Pages/privecyPolicy';
import ShippingPolicy from './Pages/shipping';
import PDFViewer from './Pages/demopage'
import Chat from '../src/Pages/chat'
import TermsOfService from './Pages/termsandcondition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileAlt, faMoneyBill, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './style.css';

const App = () => {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
};

// Component that wraps the app and runs the authentication logic
const AuthWrapper = () => {
  useAuth(); // Run authentication hook here
  return (
    <div>
      <LayoutWrapper />
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    window.location.href = 'https://auth.lmnopservices.com/login?client_id=1ftqhjj9prcb6qbcrae8mqkuum&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fwww.lmnopservices.com%2Findex.html';
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">𝒘𝒊𝒍𝒍𝒇𝒐𝒓𝒎</div>

      {/* Divider Bar */}
      <div className="vertical-bar"></div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" className="nav-item">
          <i className="fas fa-home"></i>
        </Link>
        <div className="vertical-bar"></div>
        <div className="dotted-cube">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="dot"></div>
          ))}
        </div>
      </div>


      {/* Logout Button */}
      <div className="nav-icons">
        <div className="dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            ☰
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* Profile Section */}


              {/* Links */}

              <Link to="/profile" className="dropdown-item">
                <span className="icon-column">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </span>
                <span className="text-column">Profile</span>
              </Link>
              <Link to="/documents" className="dropdown-item">
                <span className="icon-column">
                  <FontAwesomeIcon icon={faFileAlt} className="icon" />
                </span>
                <span className="text-column">Document</span>
              </Link>
              <Link to="/billing" className="dropdown-item">
                <span className="icon-column">
                  <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                </span>
                <span className="text-column">Billing</span>
              </Link>
              <hr className="dropdown-divider" />

              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-btn">
                <span className="icon-column">
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                </span>
                <span className="text-column">Logout</span>
              </button>
            </div>


          )}

        </div>

      </div>
    </div >
  );
};

// LayoutWrapper - Handles the conditional rendering of Navbar and content
const LayoutWrapper = () => {
  const location = useLocation();

  // Define static pages directly
  const staticPages = ['/static', '/policy', '/privacyPolicy', '/shippPolicy', '/termsOfService'];

  const isStaticPage = staticPages.includes(location.pathname);

  return (
    <div className="layout-wrapper">
      {/* Render Navbar only when not on a static page */}
      {!isStaticPage ? (
        <>
          <Navbar />
          
          <div className="content-wrapper">
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/surveys" element={<SurveysList />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/freewill" element={<FreeWillForm />} />
                <Route path="/submit/:section" element={<Submit />} />
                <Route path="/genratepdf" element={<GenratePdf />} />
                <Route path="/pay" element={<Payment />} />
                <Route path="/pdf" element={<Pdf />} />
                <Route path="/order" element={<PaymentById />} />
                <Route path="/policy" element={<CanclePolicy />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/shippPolicy" element={<ShippingPolicy />} />
                <Route path="/termsOfService" element={<TermsOfService />} />
              </Routes>
            </div>
            <Chat/>
          </div>
        </>
      ) : (

        <div className="static-page-wrapper">
          <div className="main-content static-content">
            <Routes>
              <Route path="/static" element={<StaticPage />} />
              <Route path="/policy" element={<CanclePolicy />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/shippPolicy" element={<ShippingPolicy />} />
                <Route path="/termsOfService" element={<TermsOfService />} />
            </Routes>
          </div>
        </div>

      )}
    </div>
  );
};


export default App;
