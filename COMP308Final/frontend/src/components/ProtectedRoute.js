import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role");

  if (!role || !allowedRoles.includes(role)) {
    alert("Access denied!");
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;