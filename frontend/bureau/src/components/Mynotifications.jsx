import React, { useState, useEffect } from 'react';
import { Bell, Heart, User, Clock, Check, X, Eye, Send } from 'lucide-react';
import apiClient, { apiEndpoints, Uploads } from './Apis1';

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  const bureauId = localStorage.getItem('bureauId');

  // Fetch received notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching notifications for bureauId:', bureauId);
      
      const response = await apiClient.post(apiEndpoints.getNotifications, {
        bureauId
      });
      
      console.log('📥 API Response:', response);
      console.log('📥 Actual API Data:', response.data);
      console.log('✅ Response success:', response.data.success);
      console.log('📊 Response data array:', response.data.data);
      console.log('🔢 Data length:', response.data.data?.length);
      
      if (response.data.success) {
        const notificationData = response.data.data || [];
        console.log('🎯 Setting notifications to:', notificationData);
        setNotifications(notificationData);
        console.log('✨ Notifications state should be updated');
      } else {
        setError(response.data.message || 'Failed to fetch notifications');
        console.error('❌ Error fetching notifications:', response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('💥 Exception in fetchNotifications:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
    }
  };

  // Fetch sent interests
// Fixed fetchSentInterests function
const fetchSentInterests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching sent interests for bureauId:', bureauId);
      
      const response = await apiClient.post(apiEndpoints.getSentInterests, {
        bureauId
      });
      
      console.log('📥 Sent Interests API Response:', response);
      console.log('✅ Response success:', response.data.success); // Fixed: added .data
      console.log('📊 Response data:', response.data.data); // Fixed: added .data
      console.log('🔢 Data length:', response.data.data?.length); // Fixed: added .data
      
      if (response.data.success) { // Fixed: added .data
        const sentInterestsData = response.data.data || []; // Fixed: added .data
        console.log('🎯 Setting sent interests to:', sentInterestsData);
        setSentInterests(sentInterestsData);
        console.log('✨ Sent interests state should be updated');
      } else {
        setError(response.data.message || 'Failed to fetch sent interests'); // Fixed: added .data
        console.error('❌ Error fetching sent interests:', response.data.message); // Fixed: added .data
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch sent interests';
      setError(errorMessage);
      console.error('💥 Exception in fetchSentInterests:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
    }
  };

  useEffect(() => {
    console.log('🚀 useEffect triggered with:', { bureauId, activeTab });
    console.log('📊 Current notifications state:', notifications);
    console.log('📊 Current sentInterests state:', sentInterests);
    
    if (bureauId) {
      if (activeTab === 'received') {
        console.log('👀 Fetching received notifications');
        fetchNotifications();
      } else {
        console.log('📤 Fetching sent interests');
        fetchSentInterests();
      }
    } else {
      console.warn('⚠️ No bureauId found in localStorage');
      setLoading(false);
      setError('Bureau ID not found. Please log in again.');
    }
  }, [bureauId, activeTab]);

  // Handle interest response (accept/reject)
  const handleInterestResponse = async (interestId, status) => {
    try {
      setUpdating(interestId);
      setError(null);
      
      console.log('🔄 Updating notification status:', { interestId, status });
      
      const response = await apiClient.post(apiEndpoints.updateNotificationStatus, {
        interestId,
        status
      });
      
      console.log('📥 Update response:', response);
      
      if (response.data.success) {
        setNotifications(prev => {
          const updated = prev.map(notif => 
            notif._id === interestId 
              ? { ...notif, status } 
              : notif
          );
          console.log('✨ Updated notifications:', updated);
          return updated;
        });
      } else {
        setError(response.data.message || 'Failed to update notification status');
        console.error('❌ Error updating status:', response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update notification status';
      setError(errorMessage);
      console.error('💥 Exception in handleInterestResponse:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'seen': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'seen': return <Eye className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffHours < 24) {
        if (diffHours === 1) return '1 hour ago';
        return `${diffHours} hours ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };

  // Error Display Component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <X className="w-5 h-5 text-red-500 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      )}
    </div>
  );

  const ReceivedNotifications = () => {
    console.log('🎨 Rendering ReceivedNotifications, notifications count:', notifications.length);
    console.log('📊 Current notifications array:', notifications);
    
    return (
      <div className="space-y-4">
        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={fetchNotifications}
          />
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You'll see interest notifications here when someone shows interest in your profile.</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            console.log(`🎯 Rendering notification ${index}:`, notification);
            return (
              <div key={notification._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Interest from Bureau: {notification.senderbureauId}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(notification.status)}`}>
                          {getStatusIcon(notification.status)}
                          <span className="ml-1 capitalize">{notification.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        <strong>Profile ID:</strong> {notification.martialId}
                      </p>
                      
                      {notification.description && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border-l-4 border-pink-200">
                          <p className="text-gray-700 text-sm italic">"{notification.description}"</p>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(notification.createdAt || notification.sentAt)}
                      </div>
                      
                      {notification.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleInterestResponse(notification._id, 'accepted')}
                            disabled={updating === notification._id}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === notification._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Accept
                          </button>
                          <button
                            onClick={() => handleInterestResponse(notification._id, 'rejected')}
                            disabled={updating === notification._id}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updating === notification._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            ) : (
                              <X className="w-4 h-4 mr-2" />
                            )}
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {notification.status === 'seen' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleInterestResponse(notification._id, 'accepted')}
                            disabled={updating === notification._id}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleInterestResponse(notification._id, 'rejected')}
                            disabled={updating === notification._id}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const SentInterests = () => {
    console.log('🎨 Rendering SentInterests, sentInterests count:', sentInterests.length);
    console.log('📊 Current sentInterests array:', sentInterests);
    
    return (
      <div className="space-y-4">
        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={fetchSentInterests}
          />
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : sentInterests.length === 0 ? (
          <div className="text-center py-12">
            <Send className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sent interests</h3>
            <p className="text-gray-600">Interests you send to other profiles will appear here.</p>
          </div>
        ) : (
          sentInterests.map((interest, index) => {
            console.log(`🎯 Rendering sent interest ${index}:`, interest);
            return (
              <div key={interest._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <Send className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Interest sent to: {interest.targetbureauId}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(interest.status)}`}>
                          {getStatusIcon(interest.status)}
                          <span className="ml-1 capitalize">{interest.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        <strong>Profile ID:</strong> {interest.martialId}
                      </p>
                      
                      {interest.description && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border-l-4 border-blue-200">
                          <p className="text-gray-700 text-sm italic">"{interest.description}"</p>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Sent {formatDate(interest.createdAt || interest.sentAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const sentCount = sentInterests.length;

  console.log('🎨 Rendering main component, pendingCount:', pendingCount, 'sentCount:', sentCount);

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Bell className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Notifications</h1>
              <p className="text-gray-600">Manage your matrimonial interests and notifications</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'received'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Received Interests</span>
                {pendingCount > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === 'received' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-pink-600 text-white'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Sent Interests</span>
                {sentCount > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === 'sent' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {sentCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === 'received' ? <ReceivedNotifications /> : <SentInterests />}
        </div>
      </div>
    </div>
  );
};

export default MyNotifications;