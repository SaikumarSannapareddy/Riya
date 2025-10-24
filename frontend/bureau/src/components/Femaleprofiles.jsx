import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash,FaEnvelope,FaPaperPlane, FaHeart,FaTimes,FaCheck, FaExclamationTriangle, FaShareAlt, FaPhone, FaLock, FaEllipsisV, FaWhatsapp, FaSearch,FaCog, FaGlobe, FaEyeSlash, FaUsers, FaUserSlash, FaExchangeAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';

import { useLocation } from "react-router-dom";


const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount,setTotalCount]= useState(0)
  const profilesPerPage = 100;
 


  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [shortlistedProfiles, setShortlistedProfiles] = useState(new Set()); // Store shortlisted profile IDs

    const [activeFilter, setActiveFilter] = useState('All');
    
    const [counters, setCounters] = useState({
      active: 0,
      inactive: 0,
      paid: 0,
      free: 0,
      otherMediatorDetails: 0,
      servicePreferences: { only_online: 0, only_offline: 0, online_offline: 0 }
    });

    const filters = [
      { id: 'All', label: 'All', getCount: () => profiles.length + (counters.otherMediatorDetails || 0) },
      { id: 'Active', label: 'Active', getCount: () => counters.active || 0 },
      { id: 'Inactive', label: 'Inactive', getCount: () => counters.inactive || 0 },
      { id: 'Free', label: 'Free Profiles', getCount: () => counters.free || 0 },
      { id: 'Paid', label: 'Paid Profiles', getCount: () => counters.paid || 0 },
      { id: 'otherMediatorDetails', label: 'Super Admin Profiles', getCount: () => counters.otherMediatorDetails || 0 },
      { id: 'Online', label: 'Online Profiles', getCount: () => counters.servicePreferences?.only_online || 0 },
      { id: 'Offline', label: 'Offline Profiles', getCount: () => counters.servicePreferences?.only_offline || 0 },
      { id: 'Both', label: 'Both Offline & Online', getCount: () => counters.servicePreferences?.online_offline || 0 }
    ];
  // Fetch shortlisted profiles
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

  const isProfileShortlisted = (profileId) => {
    return shortlistedProfiles.has(profileId);
  };

  // Add this helper function at the top of your component, before the ProfilePage component
  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };

  const sendwhatsapp = (fullName, phoneNumber) => {
    if (!phoneNumber) {
      alert("Phone number is missing for this profile.");
      return;
    }
    const message = `Hello! ${fullName}\n\n Here are your login credentials:\n\n`;
    const whatsappLink = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const gender = segments[3];

  useEffect(() => {
    localStorage.setItem('bureauId', bureauId);
    localStorage.setItem('gender', gender);
  }, [bureauId, gender]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (bureauId) {
        try {
          const response = await apiClient.get(`${apiEndpoints.fetchbureau}/${bureauId}/${gender}`);
          const contentType = response.headers['content-type'];

          if (contentType && contentType.includes('application/json')) {
            if (Array.isArray(response.data.users)) {
              const processedProfiles = response.data.users.map(profile => ({
                ...profile,
                visibleToAll: convertStringToBoolean(profile.visibleToAll),
                showOtherProfiles: convertStringToBoolean(profile.showOtherProfiles)
              }));
              setProfiles(processedProfiles);
              setFilteredProfiles(processedProfiles);
              setTotalCount(response.data.total)
              setCounters(response.data.counters || {});
            } else {
              setError('Invalid response format. Expected an array of profiles.');
            }
          } else {
            setError('Expected JSON response, but got HTML or other content type.');
          }
          
        } catch (error) {
          setError('No Profile Fund');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfiles();
    fetchShortlistedProfiles();
  }, [bureauId]);

  


  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleNavigationClick = (gender) => {
    let path;
    if (gender === 'All') {
      path = 'my-profiles';
    } else {
      path = gender === 'male' ? 'male-profiles' : 'female-profiles';
    }
    navigate(`/${path}/${bureauId}/${gender}`);
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

  // Update filter logic to use filterTags from backend
  const filterProfiles = (profiles, filter) => {
    if (filter === 'All') return profiles;
     if (filter === 'otherMediatorDetails') {
    // Show only profiles created by "Other Mediater Profile"
    return profiles.filter(profile => profile.createdBy === 'Other Mediater Profile');
  }
    return profiles.filter(profile => profile.filterTags && profile.filterTags.includes(filter));
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filterProfiles(filteredProfiles, activeFilter).slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(profiles.length / profilesPerPage);

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
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800 mb-36">
      <div className="sticky top-0 bg-gray-100 z-10  mb-4">
        <div className="flex items-center justify-between">
          
          
          <h3 className=" font-semibold flex items-center"><FaArrowLeft  className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}/>Your Own Profiles  &#40; Female  &#41;</h3>
           <h3 className=" font-semibold bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded-full shadow-lg">{totalCount}</h3>
        </div>
 
          <div className="relative mb-2">
          <input
            type="text"
            className="w-full p-4 border border-green-900 "
            placeholder="Search by ID Your Own Profiles Only"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute right-3 top-4 w-7 h-9 text-gray-500" />
        </div>

        <div className="w-full max-w-4xl mx-auto ">
      <div className="relative">
        {/* Horizontal scrolling container */}
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2">
  {filters.map((filter) => (
    <button
      key={filter.id}
      onClick={() => setActiveFilter(filter.id)}
      className="
        flex-shrink-0 px-6 py-2 font-medium text-sm
        border-2 border-gray-200 rounded-lg
        bg-white text-gray-700
        min-w-fit whitespace-nowrap
        shadow-md
      "
    >
      <span className="flex items-center space-x-2">
        <span>{filter.label}</span>
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
          {filter.getCount()}
        </span>
      </span>
    </button>
  ))}
</div>

        
        {/* Gradient fade effect for scroll indication */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
      
      {/* Active filter indicator */}
      <div className="mt-2 text-center">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold text-blue-600">{filters.find(f => f.id === activeFilter)?.label || activeFilter}</span> profiles
        </p>
      </div>
    </div>

      
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProfiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              {/* Profile Score Badge - styled to blend with card */}
              <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion}%
                </span>
              </div>
              <div className="flex">
                {/* Left Side Content */}
                <div className="flex-1">
                  {/* Your main content goes here */}
                  <h1 className="text-lg font-bold mb-4">
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
                  </h1>
                  {/* Other components or content */}
                </div>
                {/* Right Side Options Panel */}
                <div className="w-64 ml-4">
                  <div className="flex justify-end mb-4 space-x-2">
                    {/* Switch Button */}
                    <button
                      className="bg-gray-200 text-blue-700 px-3 py-2 rounded-md flex items-center text-sm hover:bg-blue-100 transition"
                      title="Switch Profile"
                      onClick={() => alert('Switch action!')}
                    >
                      <FaExchangeAlt className="mr-2" size={16} />
                      <span>Switch</span>
                    </button>
                    {/* Options Button */}
                    <button
                      onClick={() => navigate(`/options/${profile._id}`)}
                      className="bg-purple-500 text-white px-3 py-2 rounded-md flex items-center text-sm"
                    >
                      <FaCog size={16} />
                      <span className="ml-2">Options</span>
                    </button>
                  </div>
                  {/* If you're importing and rendering Options component directly */}
                  {/* <Options profileId={profile._id} /> */}
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
                <button 
                  onClick={() => handleShareProfile(profile)}
                  className="text-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <FaShareAlt className="text-purple-500 mb-1" size={20} />
                  <span className="text-xs">Share</span>
                </button>
               
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No profiles found.</p>
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

export default ProfilePage;