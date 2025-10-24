import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import React Icons
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic for login submission
    console.log("Login attempted with ID:", userId, "Password:", password);
  };

  return (
    <>
      <Navbar />
      <div className="h-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 mt-16">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Bureau Login
          </h2>
          <form onSubmit={handleLogin}>
            {/* User ID Input */}
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-600">
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your User ID"
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

export default LoginPage;
