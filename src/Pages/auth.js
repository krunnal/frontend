import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Function to extract token from URL hash
const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
};

// Function to get the JWT token from session storage or URL
const getToken = () => {
  let jwtToken = sessionStorage.getItem('jwtToken');

  if (!jwtToken) {
    jwtToken = getTokenFromUrl();
    if (jwtToken) {
      sessionStorage.setItem('jwtToken', jwtToken);
      window.location.hash = ''; // Clear the URL hash after token retrieval
    }
  }

  return jwtToken;
};

// Function to check if the token is expired
const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

// Custom hook for authentication
const useAuth = () => {
  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation(); // To get the current route

  useEffect(() => {
    const jwtToken = getToken();

    // Define the routes that should not be redirected to /static
    const exemptRoutes = ['/policy', '/privacyPolicy', '/shippPolicy', '/termsOfService'];

    // If the current route is exempt, do nothing
    if (exemptRoutes.includes(location.pathname)) {
      return;
    }

    // If the token is missing or expired, redirect to /static
    if (!jwtToken || isTokenExpired(jwtToken)) {
      navigate('/static');
    }
  }, [navigate, location.pathname]); // Include dependencies for hooks
};

export default useAuth;
