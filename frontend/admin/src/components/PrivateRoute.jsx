// src/components/PrivateRoute.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate(); // useNavigate hook for redirection

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token found, redirect to Admin Login page
      navigate("/adminlogin");
    }
  }, [navigate]);



  return (
    <>
      {/* Logout button */}
     

      {/* Render children components (protected content) */}
      {children}
    </>
  );
};

export default PrivateRoute;
