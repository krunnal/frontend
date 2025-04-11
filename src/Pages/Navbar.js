import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/navbar.css';

const Bar = ({ currentSection, validSections }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const section = parseInt(location.pathname.split('/').pop(), 10);

    // Dropdown visibility state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Function to get the step text based on the section number
    const getStepText = (num) => {
        switch (num) {
            case 1: return 'Basic';
            case 2: return 'Nominee';
            case 3: return 'Assets';
            case 4: return 'Residuary';
            case 5: return 'Executor';
            default: return '';
        }
    };

    // Handle navigation based on whether the section is valid
    const handleSectionClick = (sectionNum) => {
        if (validSections[sectionNum] || sectionNum < currentSection) {
            navigate(`/submit/${sectionNum}`);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        window.location.href = 'https://auth.lmnopservices.com/login?client_id=1ftqhjj9prcb6qbcrae8mqkuum&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fwww.lmnopservices.com%2Findex.html'; // Redirect to the login page
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="step1">
            <div className="step2">
                <div className="step3">

                    <ol className="step4">
                        <li className="step5">
                            <div className="step6">
                                {/* Step Numbers */}
                                <div className='handlenumber'>
                                
                                    <div className="step-numbers">

                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div
                                                key={num}
                                                className="step-container"
                                                onClick={() => handleSectionClick(num)}
                                            >
                                                <div
                                                    className={`step-number ${num === section ? 'active' : ''
                                                        }`}
                                                >
                                                    {/* Show ✓ for completed sections */}
                                                    {validSections[num] || num < currentSection ? '✓' : num}
                                                </div>
                                                <div
                                                    className={`step-text ${num === section ? 'active-text' : ''
                                                        }`}
                                                >
                                                    {getStepText(num)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                                {/* Dropdown on the right side */}

                            </div>
                        </li>
                    </ol>
                    {/* Bar Line */}
                    <div className="bar-line">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div
                                key={num}
                                className={`bar-step ${validSections[num] || num < currentSection
                                    ? 'completed'
                                    : ''
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Bar;
