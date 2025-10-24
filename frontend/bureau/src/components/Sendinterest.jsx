import React, { useState } from 'react';
import apiClient, { apiEndpoints, Uploads } from './Apis1';

const Sendinterest = () => {
  const [martialId, setMartialId] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [isSameAccount, setIsSameAccount] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(''); // 'success', 'error', 'warning', 'info'
  
  const bureauId = localStorage.getItem('bureauId');

  // Show popup with message
  const showAlert = (msg, type) => {
    setMessage(msg);
    setPopupType(type);
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setMessage('');
    setPopupType('');
  };

  // Check if user exists
  const checkUserExists = async () => {
    if (!martialId.trim()) {
      showAlert('Please enter a martial ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`${apiEndpoints.userbymartial}/${martialId}`);
      
      if (response.data) {
        const user = response.data;
        setUserData(user);
        setUserExists(true);
        setUserChecked(true);
        
        // Check if it's the same bureau
        if (user.bureauId === bureauId) {
          setIsSameAccount(true);
          showAlert('This is your own account. You cannot send interest to yourself.', 'warning');
        } else {
          setIsSameAccount(false);
          showAlert('User found! Please enter description to send interest.', 'success');
        }
      }
    } catch (error) {
      // If error (user doesn't exist)
      setUserExists(false);
      setUserChecked(true);
      showAlert('User does not exist. Please check the martial ID.', 'error');
    }
    setLoading(false);
  };

  // Send interest
  const sendInterest = async () => {
    if (!description.trim()) {
      showAlert('Please enter a description', 'error');
      return;
    }

    setLoading(true);
    try {
      const interestData = {
        senderbureauId: bureauId,
        targetbureauId: userData.bureauId,
        description: description,
        martialId: martialId
      };

      const response = await apiClient.post(apiEndpoints.sendinterest, interestData);
      
      showAlert('Interest sent successfully!', 'success');
      resetForm();
    } catch (error) {
      // Check if error response exists and has data
      if (error.response && error.response.data && error.response.data.message) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert('Failed to send interest. Please try again.', 'error');
      }
      console.error('Send interest error:', error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setMartialId('');
    setDescription('');
    setUserExists(false);
    setUserChecked(false);
    setUserData(null);
    setIsSameAccount(false);
  };

  // Get popup styles based on type
  const getPopupStyles = () => {
    switch (popupType) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: '✅',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '❌',
          iconBg: 'bg-red-100',
          iconText: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚠️',
          iconBg: 'bg-yellow-100',
          iconText: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'ℹ️',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
        };
    }
  };

  const popupStyles = getPopupStyles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Send Interest</h2>
          <p className="text-indigo-100">Find and send interest to other users</p>
        </div>
        
        <div className="p-8">
          {/* User ID Input */}
          <div className="mb-6">
            <label htmlFor="martialId" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Martial ID
            </label>
            <div className="flex gap-3 items-stretch">
              <input
                type="text"
                id="martialId"
                value={martialId}
                onChange={(e) => setMartialId(e.target.value)}
                placeholder="Enter martial ID to search"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={userChecked && userExists}
              />
              {!userChecked && (
                <button
                  onClick={checkUserExists}
                  disabled={loading || !martialId.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Search User'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Found Info */}
          {userChecked && userExists && userData && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-semibold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{userData.name || 'User'}</h4>
                <p className="text-gray-600 text-sm">ID: {martialId}</p>
              </div>
            </div>
          )}

          {/* Description Input - Only show if user exists and not same account */}
          {userChecked && userExists && !isSameAccount && (
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Interest Message
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a message expressing your interest..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base resize-vertical min-h-[120px] font-inherit transition-all duration-300 bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              
              <button
                onClick={sendInterest}
                disabled={loading || !description.trim()}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  'Send Interest'
                )}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {userChecked && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 text-gray-600 border-2 border-gray-200 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-200"
              >
                Search Another User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Alert Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${popupStyles.bg} ${popupStyles.border} border-2 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-pulse`}>
            {/* Popup Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${popupStyles.iconBg} flex items-center justify-center text-2xl`}>
                  <span className={popupStyles.iconText}>{popupStyles.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${popupStyles.text}`}>
                    {popupType === 'success' ? 'Success!' : 
                     popupType === 'error' ? 'Error!' : 
                     popupType === 'warning' ? 'Warning!' : 'Information'}
                  </h3>
                </div>
              </div>
              
              {/* Message */}
              <div className={`${popupStyles.text} text-base leading-relaxed mb-6`}>
                {message}
              </div>
            </div>

            {/* Popup Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={closePopup}
                className={`w-full px-6 py-3 ${popupStyles.button} text-white rounded-xl font-semibold text-base transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sendinterest;