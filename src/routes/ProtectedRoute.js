// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { getSession } from "../services/dataService";

export const ProtectedRoute = ({ children, isAdmin = false }) => {
  const token = getSession("token");
  const userRole = getSession("role");

  // If user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If admin access is required but the user is not an admin, redirect to unauthorized page
  if (isAdmin && userRole.toLowerCase() !== "admin") {
  
    return <Navigate to="/unauthorized" />;
  }

  // Allow access to the protected page
  return children;
};
