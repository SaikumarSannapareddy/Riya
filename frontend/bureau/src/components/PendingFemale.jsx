import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaShareAlt, FaPhone, FaLock, FaEllipsisV, FaWhatsapp, FaSearch, FaGlobe, FaEyeSlash, FaUsers, FaUserSlash, FaCog, FaTimes, FaExclamationTriangle, FaHeart, FaCheck, FaHistory } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';

const PendingFemale = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');
  const [openDropdown, setOpenDropdown] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityLoading, setVisibilityLoading] = useState({});
  const [showOtherProfilesLoading, setShowOtherProfilesLoading] = useState({});
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  // Report modal state
  const [currentProfile, setCurrentProfile] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Additional modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
  };
  
  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setCurrentEmail("");
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
    setCurrentProfile(null);
  };

  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };

  // Get gender from URL
  const getGenderFromUrl = () => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    return segments[3] || 'female'; // default to female if not found
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const gender = getGenderFromUrl();
      
      console.log('BureauId:', bureauId);
      console.log('Gender from URL:', gender);
      console.log('API Endpoint:', `${apiEndpoints.fetchpending}/${bureauId}/${gender}`);
      
      if (bureauId) {
        try {
          // Try the main API endpoint first
          const response = await apiClient.get(`${apiEndpoints.fetchpending}/${bureauId}/${gender}`);
          console.log('API Response:', response.data);
          
          if (response.data && Array.isArray(response.data.users)) {
            const users = response.data.users;
            console.log('Users found:', users.length);
            const processedProfiles = users.map(profile => ({
              ...profile,
              visibleToAll: convertStringToBoolean(profile.visibleToAll),
              showOtherProfiles: convertStringToBoolean(profile.showOtherProfiles),
            }));
            setProfiles(processedProfiles);
            setFilteredProfiles(processedProfiles);
            setError(null);
          } else {
            console.log('No users found or invalid response format');
            setProfiles([]);
            setFilteredProfiles([]);
            setError(null);
          }
        } catch (error) {
          console.error('Error fetching profiles:', error);
          console.error('Error details:', error.response?.data);
          console.error('Error status:', error.response?.status);
          
          // Try alternative API endpoint if the first one fails
          try {
            console.log('Trying alternative API endpoint...');
            const altResponse = await apiClient.get(`api/bureaupendinguser/${bureauId}/${gender}`);
            console.log('Alternative API Response:', altResponse.data);
            
            if (altResponse.data && Array.isArray(altResponse.data.users)) {
              const users = altResponse.data.users;
              console.log('Users found via alternative endpoint:', users.length);
              const processedProfiles = users.map(profile => ({
                ...profile,
                visibleToAll: convertStringToBoolean(profile.visibleToAll),
                showOtherProfiles: convertStringToBoolean(profile.showOtherProfiles),
              }));
              setProfiles(processedProfiles);
              setFilteredProfiles(processedProfiles);
              setError(null);
            } else {
              setError('No profiles found for this bureau.');
              setProfiles([]);
              setFilteredProfiles([]);
            }
          } catch (altError) {
            console.error('Alternative API also failed:', altError);
            setError(`API Error: ${error.response?.status || 'Network Error'}. Please check if the server is running and the endpoint exists.`);
            setProfiles([]);
            setFilteredProfiles([]);
          }
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Missing bureauId');
        setError('Missing bureau ID. Please login again.');
        setLoading(false);
      }
    };

    fetchProfiles();
    fetchProfileCounts();
  }, [bureauId]);

  // Fetch profile counts for both genders
  const fetchProfileCounts = async () => {
    if (!bureauId) return;
    
    try {
      console.log('Fetching profile counts for bureauId:', bureauId);
      
      // Fetch male profiles count
      try {
        const maleResponse = await apiClient.get(`${apiEndpoints.fetchpending}/${bureauId}/male`);
        console.log('Male response:', maleResponse.data);
        if (maleResponse.data) {
          setMaleCount(maleResponse.data.totalPending || 0);
        }
      } catch (maleError) {
        console.error('Error fetching male count:', maleError);
        setMaleCount(0);
      }

      // Fetch female profiles count
      try {
        const femaleResponse = await apiClient.get(`${apiEndpoints.fetchpending}/${bureauId}/female`);
        console.log('Female response:', femaleResponse.data);
        if (femaleResponse.data) {
          setFemaleCount(femaleResponse.data.totalPending || 0);
        }
      } catch (femaleError) {
        console.error('Error fetching female count:', femaleError);
        setFemaleCount(0);
      }
    } catch (error) {
      console.error('Error fetching profile counts:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = profiles.filter(
      (profile) =>
        profile.martialId?.toString().toLowerCase().includes(term) ||
        profile.fullName?.toLowerCase().includes(term)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  const calculateAge = (dob) => {
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
    const message = `Hello ${name}, I found your profile on Matrimony Studio and would like to connect with you.`;
    const whatsappUrl = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setCurrentProfile(null);
    setReportReason('');
    setReportDescription('');
  };

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

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="sticky top-0 bg-gray-100 z-10 py-4 mb-4">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold">My Female Profiles</h1>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <a
            href={`/pending-male-profiles/${bureauId}/male`}
            className="py-2 px-4 rounded-full bg-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-600 text-center"
          >
            Male ({maleCount})
          </a>
          <a
            href={`/pending-female-profiles/${bureauId}/female`}
            className="py-2 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-100 hover:text-blue-600 text-center"
          >
            Female ({femaleCount})
          </a>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Search by Marital ID or Name"
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
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProfiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
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
                <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion}%
                </span>
              </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <a
                  href={`tel:${profile.mobileNumber}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm"
                >
                  <FaPhone size={20} />
                  <span className='ml-3'>Call</span>
                </a>
                
                <a
                  onClick={() => sendwhatsapp(profile.fullName, profile.mobileNumber)}
                  className="bg-green-500 text-white px-4 mx-1 py-2 rounded-md flex items-center text-sm cursor-pointer"
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
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-44">
                      <button
                        onClick={() => openReportModal(profile)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
                      >
                        <FaExclamationTriangle className="mr-2" size={14} />
                        Report Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <hr className="border-gray-300 my-2" />
              
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{profile.fullName}</h2>
                <span className="text-sm font-bold">
                  {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
                </span>
              </div>
              
              <div className="flex">
                <div className="flex-1 text-sm">
                  <p className="text-gray-700">Marital ID: {profile.martialId}</p>
                  <p>Address: {profile.originalLocation}</p>
                  <p>Caste: {profile.caste} - {profile.subcaste}</p>
                  <p>Degree: {profile.education}</p>
                  <p>Income: ₹ {profile.annualIncome}</p>
                  <p>Profession: {profile.occupation}</p>
                  <p>{profile.district}, {profile.state}, {profile.country}</p>
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
                  <FaShareAlt className="text-green-500 mb-1" size={20} />
                  <span className="text-xs">Share</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No profiles found.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
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
    </div>
  );
};

export default PendingFemale;