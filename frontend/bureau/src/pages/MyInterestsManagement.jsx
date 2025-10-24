import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaHeart, FaInbox, FaPaperPlane, FaCheck, FaTimes, FaEye, FaClock, FaUser, FaSearch, FaFilter, FaBell, FaMapMarkerAlt, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis1';
import Loader from '../components/Loader';
import { Eye, ArrowRight, Sparkles, Zap } from 'lucide-react';

const MyInterestsManagement = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // New state for profile details
  const [senderProfile, setSenderProfile] = useState(null);
  const [receiverProfile, setReceiverProfile] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  
  // Send Interest modal states
  const [isSendInterestModalOpen, setIsSendInterestModalOpen] = useState(false);
  const [interestDescription, setInterestDescription] = useState('');
  const [sendInterestLoading, setSendInterestLoading] = useState(false);
  const [targetmartialId, setTargetmartialId] = useState('');
  const [targetmartialIdError, setTargetmartialIdError] = useState('');
  const [currentProfileForInterest, setCurrentProfileForInterest] = useState(null);

  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: FaEye },
    { value: 'pending', label: 'Pending', icon: FaClock, color: 'text-yellow-600' },
    { value: 'seen', label: 'Seen', icon: FaEye, color: 'text-blue-600' },
    { value: 'accepted', label: 'Accepted', icon: FaCheck, color: 'text-green-600' },
    { value: 'rejected', label: 'Rejected', icon: FaTimes, color: 'text-red-600' }
  ];

  // Fetch received interests (same bureau)
  const fetchReceivedInterests = async () => {
    try {
      const response = await apiClient.post(apiEndpoints.getMyNotifications, {
        bureauId
      });

      if (response.data.success) {
        setReceivedInterests(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch received interests');
      }
    } catch (error) {
      console.error('Error fetching received interests:', error);
      setError('Failed to fetch received interests');
    }
  };

  // Fetch sent interests (same bureau)
  const fetchSentInterests = async () => {
    try {
      const response = await apiClient.post(apiEndpoints.getMySentInterests, {
        bureauId
      });

      if (response.data.success) {
        setSentInterests(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch sent interests');
      }
    } catch (error) {
      console.error('Error fetching sent interests:', error);
      setError('Failed to fetch sent interests');
    }
  };

  // Fetch notification count (same bureau)
  const fetchNotificationCount = async () => {
    try {
      const response = await apiClient.post(apiEndpoints.getMyNotificationCount, {
        bureauId
      });

      if (response.data.success) {
        setNotificationCount(response.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Update interest status
  const updateInterestStatus = async (interestId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await apiClient.post(apiEndpoints.updateMyNotificationStatus, {
        interestId,
        status: newStatus
      });

      if (response.data.success) {
        setReceivedInterests(prev => 
          prev.map(interest => 
            interest._id === interestId 
              ? { ...interest, status: newStatus }
              : interest
          )
        );
        
        fetchNotificationCount();
        setShowDetailModal(false);
        setSelectedInterest(null);
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating interest status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Mark all as seen
  const markAllAsSeen = async () => {
    try {
      const response = await apiClient.post(apiEndpoints.markAllMyNotificationsSeen, {
        bureauId
      });

      if (response.data.success) {
        setReceivedInterests(prev => 
          prev.map(interest => 
            interest.status === 'pending' 
              ? { ...interest, status: 'seen' }
              : interest
          )
        );
        setNotificationCount(0);
      } else {
        alert(response.data.message || 'Failed to mark all as seen');
      }
    } catch (error) {
      console.error('Error marking all as seen:', error);
      alert('Failed to mark all as seen. Please try again.');
    }
  };

  // Filter interests based on search and status
  const getFilteredInterests = (interests) => {
    let filtered = interests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(interest => interest.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interest => 
        interest.senderMartialId?.toLowerCase().includes(term) ||
        interest.targetMartialId?.toLowerCase().includes(term) ||
        interest.description?.toLowerCase().includes(term) ||
        interest.bureauId?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Get status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      seen: { color: 'bg-blue-100 text-blue-800', icon: FaEye },
      accepted: { color: 'bg-green-100 text-green-800', icon: FaCheck },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaTimes }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/dashboard');
  };

  // Handle interest detail view
  const handleViewDetail = async (interest) => {
    setSelectedInterest(interest);
    setShowDetailModal(true);
    setLoadingProfiles(true);
    setSenderProfile(null);
    setReceiverProfile(null);
    
    try {
      // Fetch both sender and receiver profiles
      const promises = [];
      
      // For received interests: sender is the one who sent the interest (senderMartialId)
      if (activeTab === 'received') {
        if (interest.senderMartialId) {
          promises.push(
            apiClient.get(`/api/martial/${interest.senderMartialId}`)
              .then(response => ({ type: 'sender', data: response.data }))
              .catch(error => ({ type: 'sender', error: error.message }))
          );
        }
        if (interest.targetMartialId) {
          promises.push(
            apiClient.get(`/api/martial/${interest.targetMartialId}`)
              .then(response => ({ type: 'receiver', data: response.data }))
              .catch(error => ({ type: 'receiver', error: error.message }))
          );
        }
      } else {
        // For sent interests: you are the sender (senderMartialId), target is the receiver (targetMartialId)
        if (interest.senderMartialId) {
          promises.push(
            apiClient.get(`/api/martial/${interest.senderMartialId}`)
              .then(response => ({ type: 'sender', data: response.data }))
              .catch(error => ({ type: 'sender', error: error.message }))
          );
        }
        if (interest.targetMartialId) {
          promises.push(
            apiClient.get(`/api/martial/${interest.targetMartialId}`)
              .then(response => ({ type: 'receiver', data: response.data }))
              .catch(error => ({ type: 'receiver', error: error.message }))
          );
        }
      }
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result.type === 'sender' && result.data) {
          setSenderProfile(result.data);
        } else if (result.type === 'receiver' && result.data) {
          setReceiverProfile(result.data);
        }
      });
      
    } catch (error) {
      console.error('Error fetching profile details:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Close detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInterest(null);
    setSenderProfile(null);
    setReceiverProfile(null);
  };

  // Calculate age helper function
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchReceivedInterests(),
          fetchSentInterests(),
          fetchNotificationCount()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load interests data');
      } finally {
        setLoading(false);
      }
    };

    if (bureauId) {
      loadData();
    }
  }, [bureauId]);

  const currentInterests = activeTab === 'received' ? receivedInterests : sentInterests;
  const filteredInterests = getFilteredInterests(currentInterests);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Interests Management</h1>
            </div>
            
            {notificationCount > 0 && (
              <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                <FaBell className="w-4 h-4 mr-1" />
                {notificationCount} new
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'received'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaInbox className="w-4 h-4 mr-2" />
            Interest Received
            {notificationCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FaPaperPlane className="w-4 h-4 mr-2" />
            Interest Sent
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search interests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeTab === 'received' && notificationCount > 0 && (
              <button
                onClick={markAllAsSeen}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FaEye className="w-4 h-4 mr-2" />
                Mark All as Seen
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <FaTimes className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Interests List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredInterests.length === 0 ? (
              <div className="bg-white rounded-lg  p-12 text-center shadow-gray-900 shadow-lg">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaHeart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} interests found
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'received' 
                    ? 'You haven\'t received any interests from your profiles yet.'
                    : 'You haven\'t sent any interests to your profiles yet.'
                  }
                </p>
              </div>
            ) : (
              filteredInterests.map((interest) => (
                <div
                  key={interest._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-gray-900 shadow-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Sender Profile Card */}
                  <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-xl shadow-sm">
                    <img
                      src={interest.senderProfile?.image ? `${Uploads}${interest.senderProfile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                      alt="Profile"
                      className="w-16 h-20 object-cover rounded-lg border border-blue-200 bg-white mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{interest.senderProfile?.fullName || 'Unknown Name'}</h3>
                      <div className="text-xs text-gray-600 mb-1">Martial ID: {interest.senderProfile?.martialId || interest.senderMartialId}</div>
                      <div className="text-xs text-gray-600">{interest.senderProfile?.dateOfBirth ? `${calculateAge(interest.senderProfile.dateOfBirth)} yrs` : ''} {interest.senderProfile?.height ? `| ${interest.senderProfile.height} ft` : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="w-12 h-12 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center mb-2">
                              <FaUser className="text-gray-500 mr-2" />
                              <h3 className="text-xl font-bold text-gray-800">
                                {activeTab === 'received' ? (
                                  <>
                                    <span className="text-gray-500">I am Interested in your Profile: </span> {interest.senderMartialId}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-gray-500">Sent request to: </span> {interest.targetMartialId}
                                  </>
                                )}
                          </h3>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <StatusBadge status={interest.status} />
                            <span className="text-sm text-gray-500 flex items-center">
                            {activeTab === 'received' 
                              ? `From Profile: ${interest.senderMartialId}`
                              : `To Profile: ${interest.targetMartialId}`
                            }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                       
                      </div>

                      <div className="flex items-center justify-between">
                     

                      <div className="flex space-x-3">
  {/* View Details Button */}
  <button
    onClick={() => handleViewDetail(interest)}
    className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
  >
    <Eye className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
    View Details
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
  </button>

  {/* Conditionally show Accept/Reject buttons */}
  {activeTab === 'received' && interest.status === 'pending' && (
    <>
      <button
        onClick={() => updateInterestStatus(interest._id, 'accepted')}
        disabled={updatingStatus}
        className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
      >
        <FaCheck className="w-4 h-4 mr-2" />
        Accept
      </button>
      <button
        onClick={() => updateInterestStatus(interest._id, 'rejected')}
        disabled={updatingStatus}
        className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
      >
        <FaTimes className="w-4 h-4 mr-2" />
        Reject
      </button>
    </>
  )}
</div>

                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedInterest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Interest Details</h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* Interest Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Interest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <StatusBadge status={selectedInterest.status} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <p className="text-gray-900">{formatDate(selectedInterest.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sender Martial ID
                    </label>
                    <p className="text-gray-900">{selectedInterest.senderMartialId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Martial ID
                    </label>
                    <p className="text-gray-900">{selectedInterest.targetMartialId}</p>
                  </div>
                </div>
               
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sender Profile */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="w-5 h-5 mr-2 text-blue-600" />
                    Sender Profile
                  </h3>
                  
                  {loadingProfiles ? (
                    <div className="flex justify-center py-8">
                      <Loader />
                    </div>
                  ) : senderProfile ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={senderProfile.image ? `${Uploads}${senderProfile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                          alt="Profile"
                          className="w-44 h-52 object-cover rounded-lg"
                        />
                       
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{senderProfile.fullName}</h4>
                          <p className="text-sm text-gray-600">Martial ID: {senderProfile.martialId}</p>
                          <p className="text-sm text-gray-600">
                            {calculateAge(senderProfile.dateOfBirth)} yrs | {senderProfile.height} ft
                          </p>
                        </div>
                        <div className="flex items-center">
                          <FaGraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{senderProfile.education || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{senderProfile.occupation || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{senderProfile.caste} - {senderProfile.subcaste}</span>
                        </div>
                        <div>
                          <span className="font-medium">Income:</span> ₹{senderProfile.annualIncome || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {senderProfile.originalLocation || 'N/A'} {senderProfile.city}, {senderProfile.state}, {senderProfile.country}
                        </div>
                      </div>
                      
                      {/* View More Button */}
                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/profile_view/${senderProfile._id}`)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaUser className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Profile not found</p>
                    </div>
                  )}
                </div>

                {/* Target Profile */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="w-5 h-5 mr-2 text-green-600" />
                    Target Profile
                  </h3>
                  
                  {loadingProfiles ? (
                    <div className="flex justify-center py-8">
                      <Loader />
                    </div>
                  ) : receiverProfile ? (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={receiverProfile.image ? `${Uploads}${receiverProfile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                          alt="Profile"
                          className="w-36 h-40 object-cover rounded-lg"
                        />
                       
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{receiverProfile.fullName}</h4>
                          <p className="text-sm text-gray-600">Martial ID: {receiverProfile.martialId}</p>
                          <p className="text-sm text-gray-600">
                            {calculateAge(receiverProfile.dateOfBirth)} yrs | {receiverProfile.height} ft
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          <FaGraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{receiverProfile.education || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaBriefcase className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{receiverProfile.occupation || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="w-4 h-4 text-gray-500 mr-2" />
                          <span>{receiverProfile.caste} - {receiverProfile.subcaste}</span>
                        </div>
                        <div>
                          <span className="font-medium">Income:</span> ₹{receiverProfile.annualIncome || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>{receiverProfile.originalLocation || 'N/A'} {receiverProfile.city}, {receiverProfile.state}, {receiverProfile.country}
                        </div>
                      </div>
                      
                      {/* View More Button */}
                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/profile_view/${receiverProfile._id}`)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaUser className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Profile not found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons for received interests */}
              {activeTab === 'received' && selectedInterest.status === 'pending' && (
                <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => updateInterestStatus(selectedInterest._id, 'accepted')}
                    disabled={updatingStatus}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <FaCheck className="w-4 h-4 mr-2" />
                    Accept Interest
                  </button>
                  <button
                    onClick={() => updateInterestStatus(selectedInterest._id, 'rejected')}
                    disabled={updatingStatus}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <FaTimes className="w-4 h-4 mr-2" />
                    Reject Interest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInterestsManagement; 