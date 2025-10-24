import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // Import bcryptjs for password comparison
import apiClient, { apiEndpoints } from './Apis';

const ChangePassword = () => {
  const navigate = useNavigate();
  const bureauId = localStorage.getItem("bureauId");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hashedPassword, setHashedPassword] = useState('');  // State to store the hashed password

  const handleBackClick = () => {
    navigate('/dashboard'); // Navigate to dashboard or previous page
  };

  useEffect(() => {
    const fetchBureauDetails = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data.bureauProfiles[0];
        setHashedPassword(bureauData.password); // Assuming 'password' is the hashed password from the API
      } catch (error) {
        console.error("Error fetching bureau details:", error);
      }
    };

    fetchBureauDetails();
  }, [bureauId]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Check if the current password matches the hashed password
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isCurrentPasswordCorrect) {
      alert('Current password is incorrect!');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    // Send the data to the backend API for updating the password
    try {
      const response = await apiClient.post(apiEndpoints.PasswordUpdate, {
        bureauId,
        currentPassword,
        newPassword
      });

      if (response.status === 200) {
        alert('Password changed successfully!');
        navigate('/dashboard'); // Redirect to dashboard after successful password change
      } else {
        alert('Failed to change password. Please try again later.');
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-12">
      <div className="flex items-center mb-6">
        <FaArrowLeft
          className="text-gray-600 cursor-pointer"
          onClick={handleBackClick}
          size={24}
        />
        <h1 className="text-3xl font-semibold text-center w-full">Change Password</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto">
        <form onSubmit={handlePasswordChange}>
          {/* Current Password */}
          <div className="mb-6">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
