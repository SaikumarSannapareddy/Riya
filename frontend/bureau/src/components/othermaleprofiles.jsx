import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaSearch, FaShareAlt, FaStar , FaEllipsisV, FaExclamationTriangle, FaEyeSlash, FaTimes, FaHeart } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);
  const [autoLoadTimer, setAutoLoadTimer] = useState(null);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();
  const profileRefs = useRef({});
  
  // Three-dots menu states
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDontShowModalOpen, setIsDontShowModalOpen] = useState(false);
  const [isSendInterestModalOpen, setIsSendInterestModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  
  // Report modal states
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  
  // Don't show again modal states
  const [dontShowLoading, setDontShowLoading] = useState(false);
  
  // Send Interest modal states
  const [interestDescription, setInterestDescription] = useState('');
  const [sendInterestLoading, setSendInterestLoading] = useState(false);
  const [targetmartialId, setTargetmartialId] = useState('');
  const [targetmartialIdError, setTargetmartialIdError] = useState('');
  
  // Shortlist states
  const [shortlistedProfiles, setShortlistedProfiles] = useState(new Set());
  const [shortlistLoading, setShortlistLoading] = useState(false);
  
  const bureauId = localStorage.getItem('bureauId');
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const gender = segments[3];
  const profilesPerPage = 10;

  const reportReasons = [
    'Inappropriate Content',
    'Fake Profile',
    'Spam or Scam',
    'Harassment',
    'Impersonation',
    'Misleading Information',
    'Other'
  ];

  useEffect(() => {
    localStorage.setItem('bureauId', bureauId);
    localStorage.setItem('gender', gender);
  }, [bureauId, gender]);

  // Fetch profiles for a specific page
  const fetchProfiles = useCallback(async (pageNum = 1, append = false) => {
    if (!bureauId) return;
    
    if (!append) {
      setLoading(true);
    } else {
      setLoadingNext(true);
    }
    setError(null);
    
    try {
      const response = await apiClient.get(
        `${apiEndpoints.fetchotherbureau}/${bureauId}/${gender}?page=${pageNum}&limit=${profilesPerPage}`
      );
      
      console.log('Fetched page', pageNum, 'Response:', response.data);
      
      const data = response.data;
   
      console.log("Other profiles",data)

      const users = data.users || data;
      const total = data.total || 0;
      
      if (Array.isArray(users) && users.length > 0) {
        if (append) {
          // Append new profiles to existing ones
          setProfiles(prevProfiles => {
            const newProfiles = [...prevProfiles, ...users];
            setFilteredProfiles(newProfiles);
            return newProfiles;
          });
        } else {
          // Replace current profiles with new batch (initial load)
          setProfiles(users);
          setFilteredProfiles(users);
        }
        
        // Update total count and pagination info
        setTotalProfiles(total);
        setCurrentPage(pageNum);
        
        // Check if there are more profiles to load
        const totalPages = Math.ceil(total / profilesPerPage);
        setHasMore(pageNum < totalPages);
        
        // Start auto-load timer for next batch only if we're appending
        if (append && pageNum < totalPages) {
          startAutoLoadTimer();
        } else if (!append) {
          // Start timer for initial load
          startAutoLoadTimer();
        }
      } else {
        // No more profiles
        setHasMore(false);
        if (!append) {
          setProfiles([]);
          setFilteredProfiles([]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasMore(false);
        if (!append) {
          setProfiles([]);
          setFilteredProfiles([]);
        }
      } else {
        setError('No Profiles Fund');
        console.error('Error fetching profiles:', error);
      }
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  }, [bureauId, gender, profilesPerPage]);

  // Start auto-load timer
  const startAutoLoadTimer = useCallback(() => {
    // Clear existing timer
    if (autoLoadTimer) {
      clearTimeout(autoLoadTimer);
    }
    
    // Set new timer for 15 seconds
    const timer = setTimeout(() => {
      if (hasMore && !isSearching) {
        loadNextBatch();
      }
    }, 15000); // 15 seconds to view current batch
    
    setAutoLoadTimer(timer);
  }, [hasMore, isSearching]);

  // Load next batch of profiles
  const loadNextBatch = useCallback(() => {
    if (hasMore && !loadingNext && !isSearching) {
      fetchProfiles(currentPage + 1, true); // true means append mode
    }
  }, [hasMore, loadingNext, isSearching, currentPage, fetchProfiles]);

  // Initial load
  useEffect(() => {
    fetchProfiles(1, false); // false means replace mode for initial load
    
    // Cleanup timer on unmount
    return () => {
      if (autoLoadTimer) {
        clearTimeout(autoLoadTimer);
      }
    };
  }, [fetchProfiles]);

  // After fetching profiles, filter for activeStatus === true
  useEffect(() => {
    if (profiles.length > 0) {
      const activeProfiles = profiles.filter(p => p.activeStatus === true);
      setFilteredProfiles(activeProfiles);
    }
  }, [profiles]);

  // Cleanup timer when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      if (autoLoadTimer) {
        clearTimeout(autoLoadTimer);
      }
    };
  }, [autoLoadTimer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsSearching(term.length > 0);
    
    // Clear auto-load timer during search
    if (autoLoadTimer) {
      clearTimeout(autoLoadTimer);
    }
    
    if (term.length === 0) {
      setFilteredProfiles(profiles);
      // Restart auto-load timer
      startAutoLoadTimer();
    } else {
      // Search in all loaded profiles
      const filtered = profiles.filter(
        (profile) =>
          profile.martialId?.toString().toLowerCase().includes(term) ||
          profile.fullName?.toLowerCase().includes(term)
      );
      setFilteredProfiles(filtered);
    }
  };

  // Manual load next batch
  const handleLoadNext = () => {
    if (autoLoadTimer) {
      clearTimeout(autoLoadTimer);
    }
    loadNextBatch();
  };

  // Intersection Observer for scroll-based loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingNext && !isSearching && !loading) {
          handleLoadNext();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingNext, isSearching, loading]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile_view/${profileId}`);
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

  useEffect(() => {
    if (loadingNext) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [loadingNext]);

  // Three-dots menu handlers
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

  const openDontShowModal = (profile) => {
    setCurrentProfile(profile);
    setIsDontShowModalOpen(true);
    setOpenDropdown(null);
  };

  const openSendInterestModal = (profile) => {
    setCurrentProfile(profile);
    setIsSendInterestModalOpen(true);
    setOpenDropdown(null);
    setInterestDescription('');
    setTargetmartialId(profile.martialId || '');
    setTargetmartialIdError('');
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setCurrentProfile(null);
    setReportReason('');
    setReportDescription('');
  };

  const closeDontShowModal = () => {
    setIsDontShowModalOpen(false);
    setCurrentProfile(null);
  };

  const closeSendInterestModal = () => {
    setIsSendInterestModalOpen(false);
    setCurrentProfile(null);
    setInterestDescription('');
    setTargetmartialId('');
    setTargetmartialIdError('');
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

  // Submit don't show again - Updated to call API endpoint
  const handleDontShowSubmit = async () => {
    setDontShowLoading(true);
    try {
      const dontShowData = {
        profileId: currentProfile._id,
        bureauId: bureauId
      };

      const response = await apiClient.post(`${apiEndpoints.dontShowAgain}`, dontShowData);
      
      if (response.status === 200 || response.status === 201) {
        // Remove profile from current view immediately
        setProfiles(prevProfiles => prevProfiles.filter(p => p._id !== currentProfile._id));
        setFilteredProfiles(prevProfiles => prevProfiles.filter(p => p._id !== currentProfile._id));
        
        // Show success message from API response
        const message = response.data.message || 'Profile will not be shown again';
        alert(message);
        
        closeDontShowModal();
        
        // Refresh the page to get updated profile list
        window.location.reload();
      } else {
        alert('Failed to hide profile. Please try again.');
      }
    } catch (error) {
      console.error('Error hiding profile:', error);
      const errorMessage = error.response?.data?.message || 'Error hiding profile. Please try again.';
      alert(errorMessage);
    } finally {
      setDontShowLoading(false);
    }
  };

  // Submit send interest
  const handleSendInterestSubmit = async () => {
    if (!interestDescription.trim()) {
      alert('Please enter a description for your interest');
      return;
    }

    if (!targetmartialId.trim()) {
      setTargetmartialIdError('Please enter a valid martial ID');
      return;
    }

    setTargetmartialIdError(''); // Clear any previous errors
    setSendInterestLoading(true);
    try {
      const interestData = {
        senderbureauId: bureauId,
        targetbureauId: currentProfile.bureauId,
        martialId: currentProfile.martialId,
        targetmartialId: targetmartialId.trim(),
        description: interestDescription
      };

      const response = await apiClient.post(`${apiEndpoints.sendinterest}`, interestData);
      
      if (response.status === 200 || response.status === 201) {
        const message = response.data.message || 'Interest sent successfully';
        alert(message);
        closeSendInterestModal();
      } else {
        alert('Failed to send interest. Please try again.');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      const errorMessage = error.response?.data?.message || 'Error sending interest. Please try again.';
      alert(errorMessage);
    } finally {
      setSendInterestLoading(false);
    }
  };

  const handleShareProfile = (profile) => {
    const shareUrl = `${window.location.origin}/profile_webview/${profile._id}`;
    const shareText = `Check out this profile on Matrimony Studio: ${profile.fullName} (Marital ID: ${profile.martialId})`;
    if (navigator.share) {
      navigator.share({
        title: 'Matrimony Studio Profile',
        text: shareText,
        url: shareUrl,
      }).catch((err) => {
        // User cancelled or error
        if (err && err.name !== 'AbortError') {
          alert('Could not share the profile.');
        }
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Profile link copied to clipboard!');
      }, () => {
        alert('Could not copy link.');
      });
    }
  };

  // Fetch shortlisted profiles on mount
  useEffect(() => {
    const fetchShortlistedProfiles = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.profilesfind}/shortlist/${bureauId}?limit=1000`);
        if (response.data.success) {
          const shortlistedIds = new Set(
            response.data.data.map(item => item.profileId._id || item.profileId)
          );
          setShortlistedProfiles(shortlistedIds);
        }
      } catch (error) {
        console.error('Error fetching shortlisted profiles:', error); 
      }
    };
    if (bureauId) fetchShortlistedProfiles();
  }, [bureauId]);
 
  const isProfileShortlisted = (profileId) => {
    return shortlistedProfiles.has(profileId);
  };

  // Shortlist handler
  const handleShortlist = async (profile) => {
    if (isProfileShortlisted(profile._id)) return; // Already shortlisted
    alert('Adding to shortlist...');
    setShortlistLoading(true);
    try {
      const shortlistData = {
        profileId: profile._id,
        martialId: profile.martialId,
        bureauId: bureauId,
        profileName: profile.fullName,
        note: '',
        shortlistedAt: new Date().toISOString()
      };
      const response = await apiClient.post(`${apiEndpoints.shortlistprofile}`, shortlistData);
      if (response.status === 200 || response.status === 201) {
        setShortlistedProfiles(prev => new Set([...prev, profile._id]));
        alert('Profile shortlisted successfully!');
      } else {
        alert('Failed to shortlist profile. Please try again.');
      }
    } catch (error) {
      console.error('Error shortlisting profile:', error);
      alert('Error shortlisting profile. Please try again.');
    } finally {
      setShortlistLoading(false);
    }
  };

  // Helper: Calculate completeness percentage
  const REQUIRED_FIELDS = [
    'fullName', 'dateOfBirth', 'height', 'martialId', 'caste', 'subcaste', 'education', 'annualIncome', 'occupation', 'originalLocation', 'city', 'state', 'country', 'image'
  ];
  function getCompleteness(profile) {
    let filled = 0;
    REQUIRED_FIELDS.forEach(field => {
      if (profile[field] && profile[field] !== '' && profile[field] !== null && profile[field] !== undefined) filled++;
    });
    return Math.round((filled / REQUIRED_FIELDS.length) * 100);
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="sticky top-0 bg-gray-100 z-10 py-4 mb-4">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          {/* <h1 className="text-2xl font-semibold">
            Other {gender === 'male' ? 'Male' : 'Super Admin'} Profiles
          </h1> */}
        </div>
        
        {/* Navigation Tabs */}
   <div className="flex justify-center items-center mb-6 w-full gap-2 sm:gap-4 flex-nowrap">
  <a
    href={`/other-male-profiles/${bureauId}/male`}
    className={`
      w-1/2 text-center font-semibold rounded-full shadow-md transition-all duration-300
      px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-lg
      ${gender === 'male'
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-600'}
    `}
  >
    Other Bureau Own Profiles
  </a>

  <a
    href="/superadmin/profiles/male"
    className={`
      w-1/2 text-center font-semibold rounded-full shadow-md transition-all duration-300
      px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-lg
      ${gender === 'male'
        ? 'bg-gray-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-600'}
    `}
  >
    Super Admin Profiles Male
  </a>
</div>






        
        {/* Search Bar */}
           {/* <div className="relative">
               <input
                 type="text"
                 className="w-full p-6 border border-green-600 rounded shadow-lg shadow-red-900 text-lg"
                 placeholder="Search by Marital ID or Name"
                 value={searchTerm}
                 onChange={handleSearch}
               />
               <FaSearch className="absolute right-3 top-4 w-7 h-9 text-gray-500" />
             </div> */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Profiles Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(isSearching ? filteredProfiles : profiles).map((profile, index) => (
            <div
              key={`${profile._id}-${index}`}
              ref={el => profileRefs.current[profile._id] = el}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              {/* Profile Score Badge - styled to blend with card */}
              <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion }%
                </span>
              </div>
              {/* Header with three-dots menu */}
              <div className="flex justify-between border-b border-gray-500 items-start mb-2">
  <div className="flex-1">
    <h2 className="text-lg font-bold">{profile.fullName}</h2>
    <span className="text-sm font-bold">
      {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
    </span>
  </div>

  <div className="relative flex items-center space-x-2 dropdown-container">
    <button
      onClick={() => handleShortlist(profile)}
      disabled={isProfileShortlisted(profile._id) || shortlistLoading}
      className={`focus:outline-none ${isProfileShortlisted(profile._id) ? '' : 'hover:scale-110'} transition-transform`}
      title={isProfileShortlisted(profile._id) ? 'Shortlisted' : 'Add to shortlist'}
      style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
    >
      <FaStar
        className="text-yellow-500"
        size={32}
        style={
          isProfileShortlisted(profile._id)
            ? {
                fill: '#facc15', // filled yellow
                stroke: '#facc15',
                strokeWidth: 2,
                filter: '',
              }
            : {
                fill: 'white', // white fill
                stroke: '#facc15', // yellow border
                strokeWidth: 5,
                filter: 'drop-shadow(0 0 5px #facc15)',
              }
        }
      />
    </button>

    <button
      onClick={() => toggleDropdown(profile._id)}
      className="text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
    >
      <FaEllipsisV size={16} />
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
          onClick={() => openDontShowModal(profile)}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
        >
          <FaEyeSlash className="mr-2" size={14} />
          Don't Show Again
        </button>
        <button
          onClick={() => handleShareProfile(profile)}
          className="block w-full text-left px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 flex items-center"
        >
          <FaShareAlt className="mr-2" size={14} />
          Share
        </button>
      </div>
    )}
  </div>
</div>

              
              <div className="flex">
                <div className="flex-1 text-sm">
                  <p className="text-gray-700">Marital ID: {profile.martialId}</p>
                  
                  <p>Caste: {profile.caste} - {profile.subcaste}</p>
                  <p>Degree: {profile.education}</p>
                  <p>Income: ₹ {profile.annualIncome}</p>
                  <p>Profession: {profile.occupation}</p>
                  <p>{profile.originalLocation}, {profile.city}, {profile.state}, {profile.country}</p>
                </div>
                <img
                  src={profile.image ? `${Uploads}${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                  alt="Profile"
                  className="w-28 h-36 object-fill ml-4 rounded-lg"
                />
              </div>
              <div className="mt-4">

              {/* Action Buttons Row - updated as per request */}
              <div className="relative mt-6 p-1  rounded-2xl">
                <div className="bg-white/90 backdrop-bl-sm rounded-xl py-1 px-1">
                  <div className="flex flex-row justify-between gap-2">
                    {/* View Profile Action */}
                    <a
                      href={`/other_bureau_profile/${profile._id}`}
                      className="group flex items-center justify-center gap-1 bg-gradient-to-br from-blue-500 to-gray-900 hover:from-blue-100 hover:to-blue-200 px-2 py-1 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 text-xs border-0 shadow-none min-w-0"
                    >
                      <FaUser size={16} className="text-white group-hover:text-blue-900" />
                      <span className="font-semibold text-white group-hover:text-blue-900">Full View</span>
                    </a>
 
                    {/* Views Counter */}
                    <div className="group flex items-center justify-center gap-1 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-100 hover:to-emerald-200 px-2 py-1 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 text-xs border-0 shadow-none min-w-0">
                      <FaEye size={16} className="text-white group-hover:text-emerald-900" />
                      <span className="font-bold text-white group-hover:text-emerald-900">{profile.views || 0}</span>
                      <span className="font-medium text-white group-hover:text-emerald-800 ml-1">Views</span>
                    </div>

                    {/* Send Interest Action */}
                    <div className="group flex items-center justify-center gap-1 bg-gradient-to-br from-pink-300 to-pink-700 hover:from-pink-100 hover:to-pink-200 px-2 py-1 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/25 text-xs border-0 shadow-none min-w-0 cursor-pointer"
                      onClick={() => openSendInterestModal(profile)}
                    >
                      <FaHeart size={16} className="text-white group-hover:text-pink-900" />
                      <span className="font-semibold text-white group-hover:text-pink-900">Send Interest</span>
                    </div>
                  </div>
                </div>
              </div>
</div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Section */}
      {!isSearching && !loading && (
        <div className="mt-8 mb-4">
          {/* Auto-load trigger point */}
          <div ref={loadMoreRef} className="h-4"></div>
          
          {/* Loading next batch */}
          {loadingNext && (
            <div
              style={{
                position: 'fixed',
                left: 0,
                width: '100%',
                bottom: '20%',
                zIndex: 50,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none', // so it doesn't block clicks above
              }}
            >
              <div style={{ pointerEvents: 'auto' }}>
                <Loader />
                <span className="ml-2 text-gray-600">Loading next batch...</span>
              </div>
            </div>
          )}
          
          {/* Manual load button */}
          {hasMore && !loadingNext && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Load Next 10 Profiles</span>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                  Batch {Math.ceil(profiles.length / profilesPerPage) + 1}
                </span>
              </button>
            </div>
          )}
          
          {/* End message */}
          {!hasMore && profiles.length > 0 && (
            <div className="text-center text-gray-500 py-4">
              <p>All profiles loaded</p>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && (isSearching ? filteredProfiles : profiles).length === 0 && (
        <div className="text-center text-gray-500 my-8">
          {isSearching ? 'No profiles found matching your search.' : 'No profiles found.'}
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

      {/* Don't Show Again Modal */}
      {isDontShowModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Don't Show Again</h2>
              <button
                onClick={closeDontShowModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {currentProfile && (
              <div className="mb-4 p-3 bg-red-50 rounded">
                <p className="text-sm text-gray-600">Hiding Profile:</p>
                <p className="font-semibold">{currentProfile.fullName}</p>
                <p className="text-sm text-gray-600">Marital ID: {currentProfile.martialId}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to hide this profile? It will not appear in your search results anymore.
              </p>
              <p className="text-sm text-gray-600">
                You can view hidden profiles later in your settings if needed.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeDontShowModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={dontShowLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDontShowSubmit}
                disabled={dontShowLoading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {dontShowLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Hiding...
                  </>
                ) : (
                  'Hide Profile'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Interest Modal */}
      {isSendInterestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">Send Interest</h2>
              <button
                onClick={closeSendInterestModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {currentProfile && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Sending Interest to:</p>
                <p className="font-semibold">{currentProfile.fullName}</p>
                <p className="text-sm text-gray-600">Profile Martial ID: {currentProfile.martialId}</p>
                <p className="text-sm text-gray-600">Bureau ID: {currentProfile.bureauId}</p>
                <p className="text-sm text-blue-600 mt-2">
                  <strong>Note:</strong> You will enter the target martial ID below
                </p>
              </div>
            )}

           

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Martial ID *
              </label>
              <input
                type="text"
                value={targetmartialId}
                onChange={(e) => {
                  setTargetmartialId(e.target.value);
                  setTargetmartialIdError(''); // Clear error when user types
                }}
                placeholder={`Enter target martial ID:`}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  targetmartialIdError ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {targetmartialIdError && <p className="text-red-500 text-sm mt-1">{targetmartialIdError}</p>}
             
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeSendInterestModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={sendInterestLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterestSubmit}
                disabled={sendInterestLoading || !interestDescription.trim()}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {sendInterestLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Interest'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;