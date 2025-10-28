import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaShareAlt, FaSearch, FaExchangeAlt, FaCog, FaGlobe, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis';
import Loader from '../components/Loader';

const SuperAdminProfiles = () => {
  const { gender } = useParams();
  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [counters, setCounters] = useState({ otherMediatorDetails: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;
  const [activeFilter, setActiveFilter] = useState('otherMediatorDetails');

  

  // Helper: convert string boolean values
  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  };

  useEffect(() => {
    localStorage.setItem('bureauId', bureauId);
    localStorage.setItem('gender', gender);
  }, [bureauId, gender]); 

  // Fetch Other Mediator Profiles
  useEffect(() => {
  const fetchProfiles = async () => {
    if (!gender) return;

    setLoading(true);
    try {
      // Call backend API
      const response = await apiClient.get(
        `${apiEndpoints.profilesgender}?gender=${gender}`
      );

      console.log("Fetched Data:", response.data);

      if (response.data && Array.isArray(response.data.bureaus)) {
        // Extract only users of the selected gender
        const allUsers = response.data.bureaus.flatMap(bureau => {
          const users = gender.toLowerCase() === 'male'
            ? bureau.maleUsers || []
            : bureau.femaleUsers || [];
 
          // Add bureau details to each user
          return users.map(user => ({
            ...user,
            bureauName: bureau.bureauName,
            bureauId: bureau.bureauId,
            bureauEmail: bureau.email,
            bureauMobile: bureau.mobileNumber,
          }));
        });

        // Process final data for display
        const processedProfiles = allUsers.map(profile => ({
          ...profile,
          fullName: profile.userName || '',
          image: profile.images?.[0] || null, // first image if available
        }));

        setProfiles(processedProfiles);
        setFilteredProfiles(processedProfiles);
        setTotalCount(processedProfiles.length);
        setError(null);
      } else {
        setError('No data found');
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  fetchProfiles();
}, [gender]);


  console.log("Rwafs",profiles)


 

  

  // Search filter
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = profiles.filter(
      (p) =>
        p.martialId?.toString().toLowerCase().includes(term) ||
        p.fullName?.toLowerCase().includes(term)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  // Age calculation
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  };

  // Pagination
  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  // Share profile
  const handleShareProfile = (profile) => {
    const shareUrl = `${window.location.origin}/profile_webview/${profile._id}`;
    const shareText = `Check out this profile on Matrimony Studio: ${profile.fullName} (Marital ID: ${profile.martialId})`;
    if (navigator.share) {
      navigator.share({
        title: 'Matrimony Studio Profile',
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleBackClick = () => navigate('/dashboard');

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800 mb-36">
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
              {/* Navigation Tabs */}
<div className="flex justify-center space-x-6 mb-6 flex-wrap">
  <a
    href={`/other-${gender}-profiles/${bureauId}/${gender}`}
    className={`
      py-3 px-20 rounded-full text-center text-lg font-semibold shadow-md transition-all duration-300
      ${gender === 'male'
        ? 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
        : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-600'}
    `}
  >
 Other  Bureau Own Profiles
  </a>

  <a
    href={`/superadmin/profiles/${gender}`}
    className={`
      py-3 px-20 rounded-full text-center text-lg font-semibold shadow-md transition-all duration-300
      ${gender === 'male'
        ? 'bg-blue-600 text-white'
        : 'bg-blue-600 text-white'}
    `}
  >
    Super Admin Profiles {gender === 'male' ? 'Male' : 'Female'}
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
      <div className="sticky top-0 bg-gray-100 z-10 mb-4">
       
        {/* Filter Buttons */}
        {/* <div className="flex overflow-x-auto scrollbar-hide space-x-3 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                flex-shrink-0 px-6 py-2 font-medium text-sm
                border-2 border-gray-200 rounded-lg
                bg-white text-gray-700 min-w-fit whitespace-nowrap shadow-md
              `}
            >
              <span className="flex items-center space-x-2">
                <span>{filter.label}</span>
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                  {filter.getCount()}
                </span>
              </span>
            </button>
          ))}
        </div> */}
      </div>

      {/* Loader / Error / Profiles */}
      {loading ? (
        <div className="flex justify-center"><Loader /></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              {/* Profile Score */}
              <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion || 0}%
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{profile.fullName}</h2>
                <span className="text-sm font-bold">
                  {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
                </span>
              </div>

              <div className="flex">
                <div className="flex-1 text-sm">
                  <p className="text-gray-700">ID: {profile.martialId}</p>
                  <p>{profile.caste} - {profile.subcaste}</p>
                  <p>{profile.education}</p>
                  <p>₹ {profile.annualIncome}</p>
                  <p>{profile.occupation}</p>
                  <p>{profile.district}, {profile.state}</p>
                </div>
                <img
                  src={
                    profile.image
                      ? `${Uploads}${profile.image}`
                      : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                  }
                  alt="Profile"
                  className="w-28 h-36 object-cover ml-4 rounded-lg"
                />
              </div>

              <hr className="border-gray-300 my-2" />
              <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
                <a href={`/other_bureau_profile/${profile._id}`}                     
                  className="group flex items-center justify-center gap-1 bg-gradient-to-br from-blue-500 to-gray-900 hover:from-blue-100 hover:to-blue-200 px-2 py-1 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 text-xs border-0 shadow-none min-w-0">
                  <FaUser size={16} className="text-white group-hover:text-blue-900" />
                                      <span className="font-semibold text-white group-hover:text-blue-900">Full View</span>
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
        <p>No Super Admin profiles found.</p>
      )}

      {/* Pagination */}
      {filteredProfiles.length > profilesPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProfiles;
