import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "../css/Recharge.css";

const RechargePage = () => {
    const [amount, setAmount] = useState('');
    const [jwtToken, setJwtToken] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Loading state
    const navigate = useNavigate();
    const location = useLocation();
    const { yourPrefillData } = location.state || {}; 

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (!token || isTokenExpired(token)) {
            // Redirect to login if token is not available or expired
            window.location.href = 'https://mylogintest.auth.us-east-1.amazoncognito.com/login?client_id=1ftqhjj9prcb6qbcrae8mqkuum&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fds2eqpz1nm5m7.cloudfront.net%2Fforms_automation%2Fwill.html'; 
            return;
        }
        setJwtToken(token);
    }, []);

    const isTokenExpired = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    };

    const getUserIdFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub; // This is where the userId is usually stored
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true);  // Set loading to true when form is submitted

        const jwtToken = sessionStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT Token is missing.');
            showPopup('Authentication error. Please log in again.');
            setIsLoading(false);  // Reset loading state if no token
            return;
        }

        const userId = getUserIdFromToken(jwtToken); // Extract userId from the JWT
        console.log("Extracted User ID:", userId);

        // Ensure amount is set
        if (!amount || amount <= 0) {
            showPopup('Please enter a valid amount.');
            setIsLoading(false);  // Reset loading state if no amount is entered
            return;
        }

        // Send the API request to create the order
        fetch('https://r1i3ys4jw5.execute-api.us-east-1.amazonaws.com/Dev/create_order', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,  // Set Authorization header
                'Content-Type': 'application/json',  // Set Content-Type header
            },
            body: JSON.stringify({ amount })  // Send amount as the body
        })
        .then(res => {
            console.log("API Response Status:", res.status);  // Log the HTTP status code
            return res.json();  // Parse the response as JSON
        })
        .then(data => {
            setIsLoading(false);  // Reset loading when response is received

            if (data.order_id) {
                // If order is created successfully, initialize Razorpay
                initializeRazorpay(data.order_id, data.amount, data.currency, userId);
            } else {
                console.error('Error creating order:', data.message);
                showPopup('Error creating order. Please try again.');
            }
        })
        .catch(error => {
            setIsLoading(false);  // Reset loading on error
            console.error('Unexpected error occurred:', error);
            showPopup('An unexpected error occurred. Please try again later.');
        });
    };

    const initializeRazorpay = (orderId, amount, currency, userId) => {
        const options = {
            key: "rzp_test_y477qudvVXQk6h", // Replace with your Razorpay key
            amount: amount * 100, // Convert amount to paise
            currency: currency, // Currency code from Lambda response
            name: "Your Company",
            description: "Recharge Account",
            order_id: orderId,
            handler: function (response) {
                showPopup('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                if (redirectUrl) {
                    window.location.href = decodeURIComponent(redirectUrl);
                } else {
                    navigate('/submit/1', { state: { prefillData: yourPrefillData } });
                }
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999"
            },
            notes: {
                user_id: userId // Adding userId to notes
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="recharge-page">
            <h1>Recharge Your Account</h1>
            <form id="rechargeForm" onSubmit={handleSubmit}>
                <label htmlFor="amount">Enter Amount (INR):</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}  // Disable input while loading
                />
                <button type="submit" disabled={isLoading}>Pay Now</button>  {/* Disable button during loading */}
            </form>

            {isLoading && (
                <div style={loadingStyles}>
                    <div className="spinner"></div>
                    <p>Loading, please wait...</p>
                </div>
            )}

            {isPopupOpen && (
                <div style={popupStyles}>
                    <div style={popupContentStyles}>
                        <span style={closeButtonStyles} onClick={closePopup}>&times;</span>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Popup styles
const popupStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const popupContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '80%',
    maxWidth: '400px',
};

const closeButtonStyles = {
    color: '#aaa',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
};

// Loading spinner styles
const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '20px',
};

export default RechargePage;
