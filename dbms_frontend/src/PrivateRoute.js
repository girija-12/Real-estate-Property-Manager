import React, { Children } from "react";
import { Navigate} from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;  // Redirect if not logged in
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;  // Redirect if wrong role
  }

  return children; 
};

export default PrivateRoute;
