import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaShareAlt, FaPhone, FaLock, FaEllipsisV, FaWhatsapp, FaSearch, FaGlobe, FaEyeSlash, FaUsers, FaUserSlash, FaCog, FaTimes, FaExclamationTriangle, FaHeart, FaCheck, FaHeartBroken } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';

const ShortlistPage = () => {
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;

  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  // Report modal states
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Remove from shortlist states
  const [removeLoading, setRemoveLoading] = useState(false);

  const toggleDropdown = (profileId) => {
    setOpenDropdown((prev) => (prev === profileId ? null : profileId));
  };

  const openReportModal = (profile) => {
    setCurrentProfile(profile);
    setIsReportModalOpen(true);
    setOpenDropdown(null);
    setReportReason('');
    setReportDescription('');
  };

  const openRemoveModal = (profile) => {
    setCurrentProfile(profile);
    setIsRemoveModalOpen(true);
    setOpenDropdown(null);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setCurrentProfile(null);
    setReportReason('');
    setReportDescription('');
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setCurrentProfile(null);
  };

  // Fetch individual profile details with better error handling
// Fixed fetchProfileDetails function
const fetchProfileDetails = async (profileId) => {
  try {
    console.log(`Fetching profile details for ID: ${profileId}`);
    const response = await apiClient.get(`${apiEndpoints.user}/${profileId}`);
    console.log(`Profile API response for ${profileId}:`, response.data);
    
    // Check if response.data exists and has an _id (indicating it's profile data)
    if (response.data && response.data._id) {
      console.log(`Profile details found for ${profileId}:`, response.data);
      return response.data;
    } 
    // Also check for the nested structure in case API sometimes returns it
    else if (response.data && response.data.success && response.data.data) {
      console.log(`Profile details found for ${profileId}:`, response.data.data);
      return response.data.data;
    } 
    else {
      console.log(`Profile API returned unexpected response structure for ${profileId}:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching profile details for ${profileId}:`, error);
    if (error.response) {
      console.error(`Error response status: ${error.response.status}`);
      console.error(`Error response data:`, error.response.data);
    }
    return null;
  }
};

  // Fixed fetch function with better state management
  const fetchShortlistedProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== STARTING SHORTLIST FETCH ===');
      console.log('Bureau ID:', bureauId);
      
      const response = await apiClient.get(`${apiEndpoints.profilesfind}/shortlist/${bureauId}?limit=1000`);
      
      console.log('Raw shortlist API response:', response);
      console.log('Shortlist response data:', response.data);
      
      if (!response.data) {
        console.log('No response data received');
        updateProfiles([]);
        return;
      }

      // Handle different response structures
      let shortlistItems = [];
      
      if (response.data.success && response.data.data) {
        shortlistItems = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      } else if (Array.isArray(response.data)) {
        shortlistItems = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        shortlistItems = response.data.data;
      }
      
      console.log('Extracted shortlist items:', shortlistItems);
      console.log('Number of shortlist items:', shortlistItems.length);
      
      if (shortlistItems.length === 0) {
        console.log('No shortlisted profiles found');
        updateProfiles([]);
        return;
      }
      
      // Process each shortlist item
      console.log('=== PROCESSING INDIVIDUAL PROFILES ===');
      const profilesWithDetails = [];
      
      for (let i = 0; i < shortlistItems.length; i++) {
        const item = shortlistItems[i];
        console.log(`\n--- Processing item ${i + 1}/${shortlistItems.length} ---`);
        console.log('Shortlist item:', item);
        
        // Extract profile ID from different possible fields
        let profileId = item.profileId || item.userId || item._id || item.id;
        console.log('Extracted profile ID:', profileId);
        
        if (!profileId) {
          console.log('No profile ID found, skipping item');
          continue;
        }
        
        // Fetch detailed profile information
        const profileDetails = await fetchProfileDetails(profileId);
        
        if (profileDetails) {
          console.log(`Successfully fetched profile details for ${profileId}`);
          const mergedProfile = {
            // Profile details first
            ...profileDetails,
            // Shortlist-specific data (will overwrite profile data if same keys exist)
            shortlistId: item._id || item.id,
            shortlistedAt: item.shortlistedAt || item.createdAt || new Date().toISOString(),
            note: item.note || '',
            shortlistStatus: item.status || 'active',
            // Ensure we have the correct martial ID
            martialId: item.martialId || profileDetails.martialId || profileDetails.matrimonyId || 'N/A',
            // Flag to indicate this is a shortlisted profile
            isShortlisted: true
          };
          
          console.log('Merged profile data:', mergedProfile);
          profilesWithDetails.push(mergedProfile);
          
        } else {
          console.log(`Failed to fetch profile details for ${profileId}, creating placeholder`);
          // Create a placeholder profile with available shortlist data
          const placeholderProfile = {
            _id: profileId,
            shortlistId: item._id || item.id,
            martialId: item.martialId || 'N/A',
            shortlistedAt: item.shortlistedAt || item.createdAt || new Date().toISOString(),
            note: item.note || '',
            shortlistStatus: item.status || 'active',
            fullName: 'Profile Details Not Available',
            profileNotFound: true,
            isShortlisted: true
          };
          
          console.log('Created placeholder profile:', placeholderProfile);
          profilesWithDetails.push(placeholderProfile);
        }
      }
      
      console.log('=== FINAL PROCESSING RESULTS ===');
      console.log('Total profiles processed:', profilesWithDetails.length);
      console.log('Final profiles array:', profilesWithDetails);
      
      // Update state with new function
      updateProfiles(profilesWithDetails);
      
      console.log('State updated successfully');
      
    } catch (error) {
      console.error('=== ERROR IN FETCH SHORTLISTED PROFILES ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      }
      
      if (error.request) {
        console.error('Error request:', error.request);
      }
      
      setError(`Error fetching shortlisted profiles: ${error.message}`);
      updateProfiles([]);
    } finally {
      setLoading(false);
      console.log('=== FETCH SHORTLISTED PROFILES COMPLETED ===');
    }
  };

  // New function to update profiles state consistently
  const updateProfiles = (profiles) => {
    console.log('Updating profiles state:', profiles);
    setShortlistedProfiles(profiles);
    
    // Apply current search filter if exists
    if (searchTerm.trim()) {
      const filtered = profiles.filter(
        (profile) => {
          const martialIdMatch = profile.martialId?.toString().toLowerCase().includes(searchTerm.toLowerCase());
          const nameMatch = profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
          return martialIdMatch || nameMatch;
        }
      );
      console.log('Applying existing search filter:', filtered);
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  };

  // Submit report
  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert('Please select a reason for reporting');
      return;
    }

    setReportLoading(true);
    try {
      const reportData = {
        reportedProfileId: currentProfile._id,
        reportedMartialId: currentProfile.martialId,
        reporterBureauId: bureauId,
        reason: reportReason,
        description: reportDescription,
        reportedProfileName: currentProfile.fullName,
        reportedAt: new Date().toISOString()
      };

      console.log('Submitting report:', reportData);
      const response = await apiClient.post(`${apiEndpoints.reportProfile}`, reportData);
      
      if (response.status === 200 || response.status === 201) {
        alert('Profile reported successfully');
        closeReportModal();
      } else {
        alert('Failed to report profile. Please try again.');
      }
    } catch (error) {
      console.error('Error reporting profile:', error);
      alert('Error reporting profile. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  // Fixed remove from shortlist function
  const handleRemoveFromShortlist = async () => {
    setRemoveLoading(true);
    try {
      console.log('Removing profile from shortlist:', currentProfile.shortlistId);
      const response = await apiClient.delete(`${apiEndpoints.shortlistprofile}/${currentProfile.shortlistId}`);
      
      if (response.status === 200 || response.status === 204) {
        alert('Profile removed from shortlist successfully');
        
        // Remove from state using profile ID
        const profileIdToRemove = currentProfile._id;
        const updatedProfiles = shortlistedProfiles.filter(p => p._id !== profileIdToRemove);
        
        console.log('Updated profiles after removal:', updatedProfiles);
        updateProfiles(updatedProfiles);
        
        closeRemoveModal();
      } else {
        alert('Failed to remove profile from shortlist. Please try again.');
      }
    } catch (error) {
      console.error('Error removing profile from shortlist:', error);
      alert('Error removing profile from shortlist. Please try again.');
    } finally {
      setRemoveLoading(false);
    }
  };

  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };

  useEffect(() => {
    console.log('=== COMPONENT MOUNTED ===');
    console.log('Bureau ID from localStorage:', bureauId);
    
    if (bureauId) {
      fetchShortlistedProfiles();
    } else {
      console.error('No bureauId found in localStorage');
      setError('Bureau ID not found. Please login again.');
      setLoading(false);
    }
  }, [bureauId]);

  // Enhanced debugging useEffect for state changes
  useEffect(() => {
    console.log('=== STATE UPDATE ===');
    console.log('Shortlisted profiles count:', shortlistedProfiles.length);
    console.log('Filtered profiles count:', filteredProfiles.length);
    console.log('Search term:', searchTerm);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Current page:', currentPage);
    
    // Log first few profiles for verification
    if (shortlistedProfiles.length > 0) {
      console.log('First shortlisted profile:', shortlistedProfiles[0]);
    }
    if (filteredProfiles.length > 0) {
      console.log('First filtered profile:', filteredProfiles[0]);
    }
  }, [shortlistedProfiles, filteredProfiles, loading, error, searchTerm, currentPage]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  // Fixed search function
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    console.log('Search term changed to:', term);
    
    if (term.trim() === '') {
      console.log('Empty search term, showing all profiles');
      setFilteredProfiles(shortlistedProfiles);
    } else {
      const filtered = shortlistedProfiles.filter(
        (profile) => {
          const martialIdMatch = profile.martialId?.toString().toLowerCase().includes(term.toLowerCase());
          const nameMatch = profile.fullName?.toLowerCase().includes(term.toLowerCase());
          return martialIdMatch || nameMatch;
        }
      );
      
      console.log(`Filtered ${shortlistedProfiles.length} profiles to ${filtered.length} results`);
      setFilteredProfiles(filtered);
    }
    
    setCurrentPage(1); // Reset to first page
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

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

  const sendwhatsapp = (name, mobile) => {
    if (!mobile) {
      alert('Mobile number not available');
      return;
    }
    const message = `Hello ${name}, I found your profile on Matrimony Studio and would like to connect with you.`;
    const whatsappUrl = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'N/A';
    }
  };

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const reportReasons = [
    'Inappropriate Content',
    'Fake Profile',
    'Spam or Scam',
    'Harassment',
    'Impersonation',
    'Misleading Information',
    'Other'
  ];

  // Debug logging for render
  console.log('=== RENDER STATE ===');
  console.log('Current render state:', {
    loading,
    error,
    shortlistedProfilesCount: shortlistedProfiles.length,
    filteredProfilesCount: filteredProfiles.length,
    currentProfilesCount: currentProfiles.length,
    currentPage,
    totalPages,
    searchTerm
  });

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="sticky top-0 bg-gray-100 z-10 py-4 mb-4">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold flex items-center">
            <FaHeart className="mr-2 text-pink-600" />
            My Shortlisted Profiles
          </h1>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <div className="py-2 px-4 rounded-full bg-pink-600 text-white text-center">
            Shortlisted ({filteredProfiles.length})
          </div>

          <a
            href="/quick-search"
            className="py-2 px-4 rounded-full bg-red-400 text-white hover:bg-red-600 text-center flex items-center justify-center space-x-2"
          >
            <FaSearch className="w-5 h-5" />
            <span>Search</span>
          </a>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Search shortlisted profiles by Marital ID or Name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <FaExclamationTriangle className="mx-auto text-red-400 mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchShortlistedProfiles}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProfiles.map((profile) => (
            <div
              key={`${profile._id}-${profile.shortlistId}`}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105 border-l-4 border-pink-500"
            >
              {/* Profile not found warning */}
              {profile.profileNotFound && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p className="text-yellow-700 font-medium">⚠️ Profile details unavailable</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <div className={`flex items-center w-16 px-2 py-1 rounded-full text-xs ${
                  convertStringToBoolean(profile.visibleToAll)
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {convertStringToBoolean(profile.visibleToAll) ? (
                    <>
                      <FaGlobe className="mr-1" size={12} />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <FaEyeSlash className="mr-1" size={12} />
                      <span>Private</span>
                    </>
                  )}
                </div>

                {/* Shortlisted Badge - Always show since this is shortlist page */}
                <div className="flex items-center bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                  <FaHeart className="mr-1" size={10} />
                  <span>Shortlisted</span>
                </div>
                <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion}%
                </span>
              </div>
              </div>

              {/* Shortlisted date and note */}
              <div className="mb-2 p-2 bg-pink-50 rounded text-xs">
                <p className="text-pink-700 font-medium">
                  Added: {formatDate(profile.shortlistedAt)}
                </p>
                {profile.note && (
                  <p className="text-pink-600 mt-1 italic">"{profile.note}"</p>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <a
                  href={`tel:${profile.mobileNumber || ''}`}
                  className={`px-4 py-2 rounded-md flex items-center text-sm ${
                    profile.mobileNumber 
                      ? 'bg-blue-500 text-white cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaPhone size={20} />
                  <span className='ml-3'>Call</span>
                </a>
                
                <a
                  onClick={() => sendwhatsapp(profile.fullName || 'User', profile.mobileNumber)}
                  className={`px-4 mx-1 py-2 rounded-md flex items-center text-sm ${
                    profile.mobileNumber 
                      ? 'bg-green-500 text-white cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaWhatsapp size={20} />
                  <span className='ml-3'>WhatsApp</span>
                </a>
                
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(profile._id)}
                    className="text-grey px-4 py-2 rounded-md flex items-center text-sm"
                  >
                    <FaEllipsisV />
                  </button>
                  {openDropdown === profile._id && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-48">
                      <button
                        onClick={() => openReportModal(profile)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
                      >
                        <FaExclamationTriangle className="mr-2" size={14} />
                        Report Profile
                      </button>
                      
                      <button
                        onClick={() => openRemoveModal(profile)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <FaHeartBroken className="mr-2" size={14} />
                        Remove from Shortlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <hr className="border-gray-300 my-2" />
              
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{profile.fullName || 'Name Not Available'}</h2>
                <span className="text-sm font-bold">
                  {calculateAge(profile.dateOfBirth)} yrs | {profile.height || 'N/A'} ft
                </span>
              </div>
              
              <div className="flex">
                <div className="flex-1 text-sm">
                  <p className="text-gray-700">Marital ID: {profile.martialId || 'N/A'}</p>
                  <p>Address: {profile.originalLocation || 'N/A'}</p>
                  <p>Caste: {profile.caste || 'N/A'} - {profile.subcaste || 'N/A'}</p>
                  <p>Degree: {profile.education || 'N/A'}</p>
                  <p>Income: ₹ {profile.annualIncome || 'N/A'}</p>
                  <p>Profession: {profile.occupation || 'N/A'}</p>
                  <p>{profile.district || 'N/A'}, {profile.state || 'N/A'}, {profile.country || 'N/A'}</p>
                </div>
                <img
                  src={
                    profile.image
                      ? `${Uploads}${profile.image}`
                      : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                  }
                  alt="Profile"
                  className="w-28 h-36 object-fill ml-4 rounded-lg"
                />
              </div>
              
              <hr className="border-gray-300 my-2" />
              
              <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
                <a href={`/profile/${profile._id}`} className="text-center">
                  <FaUser className="text-blue-500 mb-1" size={20} />
                  <span className="text-xs">View More</span>
                </a>
                <div className="text-center">
                  <FaEye className="text-green-500 mb-1" size={20} />
                  <span className="text-xs">{profile.views || 0} Views</span>
                </div>
                <a href={`/edit-profile/${profile._id}`} className="text-center">
                  <FaEdit className="text-yellow-500 mb-1" size={20} />
                  <span className="text-xs">Edit</span>
                </a>
                <a
                  href={`https://wa.me/?text= https://matrimonystudio.in/profile_webview/${profile._id}`}
                  className="text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaShareAlt className="text-purple-500 mb-1" size={20} />
                  <span className="text-xs">Share</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaHeart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Shortlisted Profiles</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm ? `No profiles found matching "${searchTerm}"` : "You haven't shortlisted any profiles yet."}
          </p>
          {searchTerm ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredProfiles(shortlistedProfiles);
              }}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4"
            >
              Clear Search
            </button>
          ) : null}
          <a
            href="/quick-search"
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <FaSearch className="mr-2" />
            Start Searching Profiles
          </a>
        </div>
      )}

      

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Report Profile</h2>
              <button
                onClick={closeReportModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {currentProfile && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Reporting Profile:</p>
                <p className="font-semibold">{currentProfile.fullName}</p>
                <p className="text-sm text-gray-600">Marital ID: {currentProfile.martialId}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reporting *
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a reason...</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please provide more details about your report..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="4"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeReportModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportLoading || !reportReason.trim()}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {reportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Reporting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove from Shortlist Modal */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Remove from Shortlist</h2>
              <button
                onClick={closeRemoveModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {currentProfile && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaHeartBroken className="text-red-500 mr-3" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Are you sure you want to remove this profile from your shortlist?</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold">{currentProfile.fullName}</p>
                  <p className="text-sm text-gray-600">Marital ID: {currentProfile.martialId}</p>
                  {currentProfile.note && (
                    <p className="text-sm text-gray-500 mt-1 italic">Note: "{currentProfile.note}"</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={closeRemoveModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={removeLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveFromShortlist}
                disabled={removeLoading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {removeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Removing...
                  </>
                ) : (
                  'Remove from Shortlist'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredProfiles.length > profilesPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredProfiles.length / profilesPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredProfiles.length / profilesPerPage)}
            className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortlistPage;