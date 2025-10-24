import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import React Icons
import apiClient, { apiEndpoints } from '../components/Apis';
import { useNavigate, useSearchParams } from "react-router-dom"; // Use useNavigate for page redirection
import localforage from "localforage";


const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");  // This will hold the email (userId)
  const [password, setPassword] = useState(""); // This will hold the password
  const [error, setError] = useState(""); // To display error messages
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const navigate = useNavigate(); // useNavigate for page redirection
  const [searchParams] = useSearchParams();

  // Check if token exists in localStorage on page load
  useEffect(() => {
    // Check for auto-login parameters from admin panel
    const autoMobile = searchParams.get('mobile');
    const autoPassword = searchParams.get('password');
    const source = searchParams.get('source');
    
    console.log('Login page loaded with params:', { autoMobile, autoPassword: autoPassword ? '***HASHED***' : null, source });
    
    if (autoMobile && autoPassword && source === 'admin') {
      // Auto-login from admin panel with fetched credentials
      console.log('Starting admin panel auto-login...');
      handleAdminAutoLogin(autoMobile, autoPassword);
    } else if (autoMobile && autoPassword) {
      // Auto-login with provided credentials (legacy support)
      console.log('Starting legacy auto-login...');
      handleAutoLogin(autoMobile, autoPassword);
    }
  }, [navigate, searchParams]);

  // Auto-login function
  const handleAutoLogin = async (mobile, pass) => {
    setIsAutoLoggingIn(true);
    setError("");
    
    try {
      // Send the login request to the server with mobile and password
      const response = await apiClient.post(apiEndpoints.BureauLogin, {
        email: mobile,
        password: pass,
      });

      const data = response.data;

      console.log("userNersf",data)

      // Check if login was successful
      if (response.status === 200) {
        // Store the token and bureau ID in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("bureauId", data.id);


        // Redirect to the admin dashboard on successful login
        navigate("/dashboard");
      } else {
        // Set the error message if login failed
        setError(data.message || "Auto-login failed");
      }
    } catch (err) {
      console.error("Auto-login failed", err);
      
      // Handle specific error cases
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 403) {
          setError(data.message || "Your account has been suspended. Please contact support for assistance.");
        } else if (status === 404) {
          setError(data.message || "Bureau not found. Please check your mobile number.");
        } else if (status === 401) {
          setError(data.message || "Invalid password. Please try again.");
        } else {
          setError(data.message || "Auto-login failed. Please try again.");
        }
      } else {
        setError("An error occurred during auto-login. Please check your connection and try again.");
      }
    } finally {
      setIsAutoLoggingIn(false);
    }
  };

  // Admin panel auto-login function (with fetched credentials)
  const handleAdminAutoLogin = async (mobile, pass) => {
    setIsAutoLoggingIn(true);
    setError("");
    
    console.log('Admin auto-login started with:', { mobile, passwordLength: pass ? pass.length : 0, isHashed: pass ? pass.startsWith('$2a$') : false });
    
    try {
      // For admin panel login, we need to send the hashed password directly
      // since it's already hashed from the database
      const loginData = {
        email: mobile,
        password: pass, // This is already the hashed password from database
        isHashedPassword: true // Flag to indicate this is a hashed password
      };
      
      console.log('Sending login request with data:', { ...loginData, password: '***HASHED***' });
      
      const response = await apiClient.post(apiEndpoints.BureauLogin, loginData);

      const data = response.data;
      console.log('Login response received:', { success: data.success, message: data.message, hasToken: !!data.token });

      // Check if login was successful
      if (response.status === 200) {
        // Store the token and bureau ID in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("bureauId", data.id);

        console.log('Login successful, redirecting to dashboard...');
        // Redirect to the admin dashboard on successful login
        navigate("/dashboard");
      } else {
        // Set the error message if login failed
        setError(data.message || "Admin auto-login failed");
      }
    } catch (err) {
      console.error("Admin auto-login failed", err);
      
      // Handle specific error cases
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 403) {
          setError(data.message || "Your account has been suspended. Please contact support for assistance.");
        } else if (status === 404) {
          setError(data.message || "Bureau not found. Please check your mobile number.");
        } else if (status === 401) {
          setError(data.message || "Invalid password. Please try again.");
        } else {
          setError(data.message || "Admin auto-login failed. Please try again.");
        }
      } else {
        setError("An error occurred during admin auto-login. Please check your connection and try again.");
      }
    } finally {
      setIsAutoLoggingIn(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any existing localStorage data for a clean session
    localStorage.clear();
    console.log('LocalStorage cleared before manual login');

    try {
      // Send the login request to the server with email and password
      const response = await apiClient.post(apiEndpoints.BureauLogin, {
        email: userId,
        password: password,
      });

      console.log("kjghdfi",response)

      const data = response.data;

      // Check if login was successful 
      if (response.status === 200) {
        // Store the token and distributor ID in localStorage
        localStorage.setItem("authToken", data.token); // Assuming the server responds with a token
        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("bureauId", data.id); // Store distributor ID

        // Redirect to the admin dashboard on successful login
        navigate("/dashboard");
      } else {
        // Set the error message if login failed
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed", err);
      
      // Handle specific error cases
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 403) {
          // Account suspended
          setError(data.message || "Your account has been suspended. Please contact support for assistance.");
        } else if (status === 404) {
          // Bureau not found
          setError(data.message || "Bureau not found. Please check your mobile number.");
        } else if (status === 401) {
          // Invalid password
          setError(data.message || "Invalid password. Please try again.");
        } else {
          // Other errors
          setError(data.message || "Login failed. Please try again.");
        }
      } else {
        // Network or other errors
        setError("An error occurred. Please check your connection and try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Matrimony Studio Bureau Login
          </h2>
          
          {/* Auto-login indicator */}
          {isAutoLoggingIn && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
              {searchParams.get('source') === 'admin' ? 
                '🔄 Admin Panel Auto-login... Please wait' : 
                '🔄 Auto-logging in... Please wait'
              }
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* User ID (Email) Input */}
            <div className="mb-4">
              <label htmlFor="userId" className="block text-sm font-medium text-gray-600">
                Mobile Number
              </label>
              <input
                type="number"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Mobile Number"
                required
                disabled={isAutoLoggingIn}
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
                disabled={isAutoLoggingIn}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-8 text-gray-500"
                disabled={isAutoLoggingIn}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`text-sm mb-4 p-3 rounded-lg ${
                error.includes('suspended') 
                  ? 'bg-red-100 border border-red-400 text-red-700' 
                  : 'text-red-500'
              }`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAutoLoggingIn}
              >
                {isAutoLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm">
                Forgot Password?
              </a>
            </div>

            {/* Create Bureau Account Link */}
            <div className="text-center mt-3">
              <a 
                href="https://riyatechpark.com/createbureau" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                wants to create marriage bureau account
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
