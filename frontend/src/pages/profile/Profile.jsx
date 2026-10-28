import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import "./style.scss";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status before rendering
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('jwtToken');
      if (!token) {
        // Store the attempted URL for redirect after login
        const redirectPath = location.pathname + location.search;
        sessionStorage.setItem('redirectAfterLogin', redirectPath);
        navigate('/login', { replace: true });
        return false;
      }
      return true;
    };

    // Set initial auth state
    setIsAuthenticated(checkAuth());

    // Listen for auth state changes
    const handleStorageChange = () => {
      const token = Cookies.get('jwtToken');
      setIsAuthenticated(!!token);
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate, location]);

  const handleLogout = () => {
    // Remove user JWT token with different path options
    Cookies.remove("jwtToken");
    Cookies.remove("jwtToken", { path: "/" });
    Cookies.remove("jwtToken", { path: "", domain: window.location.hostname });
    
    // Clear admin token as well (in case user was also admin)
    Cookies.remove("adminJwtToken");
    Cookies.remove("adminJwtToken", { path: "/" });
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/login');
  };

  // Show nothing until we know the auth state
  if (isAuthenticated === null) {
    return null;
  }

  // If not authenticated, we've already handled the redirect in the effect
  if (!isAuthenticated) {
    return null;
  }

  // Only render the actual content when we're sure the user is authenticated
  return (
    <div className="profilePage">
      <Header />
      <div className="profileContainer">
        <ul className="profileOptions">
          <li onClick={() => navigate("/bookings")}>Bookings</li>
          <li onClick={() => navigate("/editprofile")}>Edit Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
