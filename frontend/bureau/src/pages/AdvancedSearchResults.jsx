import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEye, FaSearch, FaShareAlt, FaHeart, FaPhone, FaWhatsapp, FaEllipsisV, FaEdit } from 'react-icons/fa';
import TopNavbar from '../components/Gnavbar';
import Bottomnav from '../components/Bottomnav';
import PrivateRoute from '../components/PrivateRoute';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis1';
import Loader from '../components/Loader';

const AdvancedSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const MybureauId = localStorage.getItem('bureauId');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [profilesPerPage] = useState(10);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [autoLoadTimer, setAutoLoadTimer] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (location.state?.searchData) {
      setSearchCriteria(location.state.searchData);
      performAdvancedSearch(location.state.searchData, 1, false);
    } else {
      setError('No search criteria provided');
      setLoading(false);
    }
  }, [location.state]);

  // Fetch profiles for a specific page
  const performAdvancedSearch = useCallback(async (searchData, pageNum = 1, append = false) => {
    if (!searchData) return;
    if (!append) {
      setLoading(true);
    } else {
      setLoadingNext(true);
    }
    setError(null);
    
    try {
      const response = await apiClient.post(`${apiEndpoints.advancedSearch}`, {
        ...searchData,
        page: pageNum,
        limit: profilesPerPage
      });
      
      const data = response.data;
      const users = data.users || data;
      const total = data.total || 0;
      
      if (Array.isArray(users) && users.length > 0) {
        if (append) {
          setProfiles(prev => [...prev, ...users]);
        } else {
          setProfiles(users);
        }
        setTotalProfiles(total);
        setCurrentPage(pageNum);
        const totalPages = Math.ceil(total / profilesPerPage);
        setHasMore(pageNum < totalPages);
        if (append && pageNum < totalPages) {
          startAutoLoadTimer();
        } else if (!append) {
          startAutoLoadTimer();
        }
      } else {
        setHasMore(false);
        if (!append) setProfiles([]);
      }
    } catch (error) {
      console.error('Error performing advanced search:', error);
      setError('Error performing search. Please try again.');
      if (!append) setProfiles([]);
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  }, [profilesPerPage]);

  // Start auto-load timer
  const startAutoLoadTimer = useCallback(() => {
    if (autoLoadTimer) clearTimeout(autoLoadTimer);
    const timer = setTimeout(() => {
      if (hasMore) {
        handleLoadNext();
      }
    }, 15000);
    setAutoLoadTimer(timer);
  }, [hasMore]);

  // Manual load next batch
  const handleLoadNext = useCallback(() => {
    if (autoLoadTimer) clearTimeout(autoLoadTimer);
    if (hasMore && !loadingNext && searchCriteria) {
      performAdvancedSearch(searchCriteria, currentPage + 1, true);
    }
  }, [hasMore, loadingNext, currentPage, searchCriteria, performAdvancedSearch, autoLoadTimer]);

  // Initial load
  useEffect(() => {
    return () => {
      if (autoLoadTimer) clearTimeout(autoLoadTimer);
    };
  }, [autoLoadTimer]);

  // Intersection Observer for scroll-based loading
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingNext && !loading) {
          handleLoadNext();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loadingNext, loading]);

  const handleBackClick = () => {
    navigate('/search');
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile_view/${profileId}`);
  };

  const toggleDropdown = (profileId) => {
    setOpenDropdown((prev) => (prev === profileId ? null : profileId));
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

  if (loading) return (
    <PrivateRoute>
      <div className="flex flex-col bg-white min-h-screen">
        <TopNavbar />
        <div className="flex-1 p-4 mt-20 mb-20">
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        </div>
        <Bottomnav />
      </div>
    </PrivateRoute>
  );

  if (error) return (
    <PrivateRoute>
      <div className="flex flex-col bg-white min-h-screen">
        <TopNavbar />
        <div className="flex-1 p-4 mt-20 mb-20">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Different Search
            </button>
          </div>
        </div>
        <Bottomnav />
      </div>
    </PrivateRoute>
  );

  return (
    <PrivateRoute>
      <div className="flex flex-col bg-white min-h-screen">
        <TopNavbar />
        
        <div className="flex-1 p-4 mt-20 mb-20">
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaArrowLeft
              className="mr-3 text-gray-600 cursor-pointer text-xl"
              onClick={handleBackClick}
            />
            <h1 className="text-2xl font-bold text-gray-800">Advanced Search Results</h1>
          </div>

          {/* Search Criteria Summary */}
          {searchCriteria && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Search Criteria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                {searchCriteria.gender && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Gender:</strong> {searchCriteria.gender === 'male' ? 'Male' : 'Female'}
                  </span>
                )}
                {searchCriteria.ageMin && searchCriteria.ageMax && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Age:</strong> {searchCriteria.ageMin} - {searchCriteria.ageMax} years
                  </span>
                )}
                {searchCriteria.heightMin && searchCriteria.heightMax && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Height:</strong> {searchCriteria.heightMin} - {searchCriteria.heightMax} ft
                  </span>
                )}
                {searchCriteria.religionPreferences && searchCriteria.religionPreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Religion:</strong> {searchCriteria.religionPreferences}
                  </span>
                )}
                {searchCriteria.castePreferences && searchCriteria.castePreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Caste:</strong> {searchCriteria.castePreferences}
                  </span>
                )}
                {searchCriteria.educationPreferences && searchCriteria.educationPreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Education:</strong> {searchCriteria.educationPreferences}
                  </span>
                )}
                {searchCriteria.occupationPreferences && searchCriteria.occupationPreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Occupation:</strong> {searchCriteria.occupationPreferences}
                  </span>
                )}
                {searchCriteria.countryPreferences && searchCriteria.countryPreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>Country:</strong> {searchCriteria.countryPreferences}
                  </span>
                )}
                {searchCriteria.statePreferences && searchCriteria.statePreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>State:</strong> {searchCriteria.statePreferences}
                  </span>
                )}
                {searchCriteria.cityPreferences && searchCriteria.cityPreferences !== 'Any' && (
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    <strong>City:</strong> {searchCriteria.cityPreferences}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              Found {totalProfiles} profile{totalProfiles !== 1 ? 's' : ''} matching your criteria
            </p>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No profiles found matching your search criteria.</p>
              <button
                onClick={() => navigate('/search')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Modify Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
                {profiles.map((profile, index) => (
                  <div
                    key={`${profile._id}-${index}`}
                    className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
                  >
                    {/* Profile Header with three-dots menu */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold">{profile.fullName}</h2>
                        <span className="text-sm font-bold">
                          {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
                        </span>
                      </div>
                      <div className="relative dropdown-container">
                        {MybureauId === profile.bureauId ? (
                          <>
                            {/* Call Button */}
                            <a
                              href={`tel:${profile.mobileNumber}`}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center text-xs mr-2"
                            >
                              <FaPhone size={14} />
                              <span className="ml-1">Call</span>
                            </a>

                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/${profile.countryCode}${profile.mobileNumber}`}
                              className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center text-xs mr-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaWhatsapp size={14} />
                              <span className="ml-1">WhatsApp</span>
                            </a>

                            {/* Dropdown Options */}
                            <button
                              onClick={() => toggleDropdown(profile._id)}
                              className="text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <FaEllipsisV size={16} />
                            </button>
                            {openDropdown === profile._id && (
                              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-48">
                                <a
                                  href={`/edit-profile/${profile._id}`}
                                  className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 flex items-center"
                                >
                                  <FaEdit className="mr-2" size={14} />
                                  Edit Profile
                                </a>
                                <div className="px-4 py-2 text-sm text-gray-600">
                                  Own Bureau Profile
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-600 px-3 py-1 rounded bg-green-300 text-xs">
                            Other Mediator profile
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-1 text-sm">
                        <p className="text-gray-700">Marital ID: {profile.martialId}</p>
                        <p>Address: {profile.originalLocation || profile.district}</p>
                        <p>Caste: {profile.caste} - {profile.subcaste}</p>
                        <p>Degree: {profile.education}</p>
                        <p>Income: ₹ {profile.annualIncome}</p>
                        <p>Profession: {profile.occupation}</p>
                        <p>{profile.district}, {profile.state}, {profile.country}</p>
                      </div>
                      <img
                        src={profile.image ? `${Uploads}${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                        alt="Profile"
                        className="w-28 h-36 object-fill ml-4 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
                      {MybureauId === profile.bureauId ? (
                        <a href={`/profile/${profile._id}`} className="text-center">
                          <FaUser className="text-blue-500 mb-1" size={20} />
                          <span className="text-xs">View More</span>
                        </a>
                      ) : (
                        <div
                          className="text-center cursor-pointer"
                          onClick={() => handleProfileClick(profile._id)}
                        >
                          <FaUser className="text-blue-500 mb-1" size={20} />
                          <span className="text-xs">View More</span>
                        </div>
                      )}
                      <div className="text-center">
                        <FaEye className="text-green-500 mb-1" size={20} />
                        <span className="text-xs">{profile.views || 0} Views</span>
                      </div>
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

              {/* Load More Section */}
              <div className="mt-8 mb-4">
                <div ref={loadMoreRef} className="h-4"></div>
                {loadingNext && (
                  <div style={{ position: 'fixed', left: 0, width: '100%', bottom: '20%', zIndex: 50, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'auto' }}>
                      <Loader />
                      <span className="ml-2 text-gray-600">Loading next batch...</span>
                    </div>
                  </div>
                )}
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
                {!hasMore && profiles.length > 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <p>All profiles loaded</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdvancedSearchResults; 