import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Make sure to import a CSS file for styling

const Home = () => {
    const navigate = useNavigate();

    const handleFreeWillForm = () => {
        navigate('/freewill');
    };

    const handlePaidWillForm = () => {
        navigate('/submit/1');
    };

    return (
        <div className="home-container">
            <h1>Welcome to Our Will Form Service</h1>
            <p>Please select an option below:</p>
            <div className="button-section">
                <h1>WillForms</h1>
                <div className="button-container">
                    <div className="button-box" onClick={handleFreeWillForm}>
                        Free Will Form
                    </div>
                    <div className="button-box" onClick={handlePaidWillForm}>
                        Paid Will Form
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h2>Get Peace of Mind</h2>
                <p>It takes less than 20 minutes to write or update your legal will, for free.</p>
            </div>
        </div>

    );
};

export default Home;
