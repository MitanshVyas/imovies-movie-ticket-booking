import { Navigate } from "react-router-dom";

const AdminProtection = ({ children }) => {
  // Check for admin details and token
  const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const adminToken = localStorage.getItem("adminJwtToken");
  
  if (!adminDetails || !adminToken) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  // Additional check if you have a role in adminDetails
  if (adminDetails.role && adminDetails.role !== "admin") {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

export default AdminProtection;
