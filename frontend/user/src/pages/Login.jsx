// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import apiClient2, { apiEndpoints2 } from '../components/Apismongo';

const Login = () => {
  const [martialId, setMartialId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Form validation
    if (!martialId || !password) {
      setError('All fields are required');
      return;
    }
  
    setError('');
    setLoading(true);
  
    try {
      // Use POST instead of GET for login
      const response = await apiClient2.post(apiEndpoints2.userLogin, {
        martialId,
        password,
      });
  
      // If successful, store token and user data in localStorage
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
  
        toast.success('Login successful!');
        navigate('/home');
      } else {
        setError('Login failed. Please check your credentials.');
        toast.error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f0e6ff 0%, #d8c2ff 100%)'
    }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-black bg-opacity-90 p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Login into Matrimony Studio
            </h2>
            <p className="text-purple-200 text-sm text-center mt-1">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="martialId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-purple-600" /> Martial ID
                </label>
                <input
                  id="martialId"
                  type="text"
                  placeholder="Enter your Martial ID"
                  value={martialId}
                  onChange={(e) => setMartialId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaLock className="text-purple-600" /> Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-700 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Matrimony Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;