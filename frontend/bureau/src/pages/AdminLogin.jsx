import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import React Icons
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; // Use useNavigate for page redirection

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");  // This will hold the email (userId)
  const [password, setPassword] = useState(""); // This will hold the password
  const [error, setError] = useState(""); // To display error messages
  const navigate = useNavigate(); // useNavigate for page redirection

  // Check if token exists in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/admin-dashboard"); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send the login request to the server with email and password
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userId, password }),
      });

      const data = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("authToken", data.token); // Assuming the server responds with a token

        // Redirect to the admin dashboard on successful login
        navigate("/admin-dashboard");
      } else {
        // Set the error message if login failed
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 mt-16">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Admin Login
          </h2>
          <form onSubmit={handleLogin}>
            {/* User ID (Email) Input */}
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-8 text-gray-500"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105"
              >
                Login
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
