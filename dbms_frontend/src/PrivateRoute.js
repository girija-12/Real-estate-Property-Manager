import React from "react";
import { Navigate} from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem("role")?.toLowerCase();

  if (!userRole) {
    return <Navigate to="/login" replace />;  // Redirect if not logged in
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;  // Redirect if wrong role
  }

  return children; 
};

export default PrivateRoute;
