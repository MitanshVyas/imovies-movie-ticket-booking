import { Navigate } from "react-router-dom";

const UserProtection = ({ children }) => {
  // Check for both user details and JWT token
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const token = localStorage.getItem("jwtToken");
  
  if (!user || !token) {
    // Clear any partial auth data if it exists
    localStorage.removeItem("userDetails");
    localStorage.removeItem("jwtToken");
    
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default UserProtection;
