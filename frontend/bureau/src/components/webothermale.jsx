import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaSearch, FaShareAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader'; // Import Loader component // Dummy image path
import WebNav from './WebNav';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10; // Load 10 at a time
  const [hasMore, setHasMore] = useState(true);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const loadMoreRef = useRef(null);
  const autoLoadTimer = useRef(null);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const bureauId = segments[2];
  const gender = segments[3];

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
      const data = response.data;
      const users = data.users || data;
      const total = data.total || 0;
      if (Array.isArray(users) && users.length > 0) {
        if (append) {
          setProfiles(prev => {
            const newProfiles = [...prev, ...users];
            setFilteredProfiles(newProfiles);
            return newProfiles;
          });
        } else {
          setProfiles(users);
          setFilteredProfiles(users);
        }
        setTotalProfiles(total);
        setCurrentPage(pageNum);
        const totalPages = Math.ceil(total / profilesPerPage);
        setHasMore(pageNum < totalPages);
      } else {
        setHasMore(false);
        if (!append) {
          setProfiles([]);
          setFilteredProfiles([]);
        }
      }
    } catch (err) {
      setError('Error fetching profile data. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  }, [bureauId, gender, profilesPerPage]);

  // Initial load
  useEffect(() => {
    fetchProfiles(1, false);
    return () => {
      if (autoLoadTimer.current) clearTimeout(autoLoadTimer.current);
    };
  }, [fetchProfiles]);

  // Intersection Observer for scroll-based loading
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingNext && !isSearching && !loading) {
          handleLoadNext();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loadingNext, isSearching, loading]);

  const handleLoadNext = useCallback(() => {
    if (hasMore && !loadingNext && !isSearching) {
      fetchProfiles(currentPage + 1, true);
    }
  }, [hasMore, loadingNext, isSearching, currentPage, fetchProfiles]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsSearching(term.length > 0);
    if (term.length === 0) {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(
        (profile) =>
          profile.martialId?.toString().toLowerCase().includes(term) ||
          profile.fullName?.toLowerCase().includes(term)
      );
      setFilteredProfiles(filtered);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back one step in history
  };
  const handleProfileClick = (profileId) => {
    navigate(`/profile_webview/${profileId}`);
  };

  const handleNavigationClick = (gender) => {
    let path;
  
    if (gender === 'All') {
        path = 'web-other-all-profiles';
      } else {
        path = gender === 'male' ? 'web-other-male-profiles' : 'web-other-female-profiles';
      }
    
      navigate(`/${path}/${bureauId}/${gender}`);
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

  // Pagination logic

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

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

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
     <div className="sticky top-0 bg-gray-100 z-10 py-4 mb-4">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold">Other Male Profiles</h1>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
 
  <a
    href="/"
    className="py-2 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-100 hover:text-blue-600 text-center"
  >
    Male
  </a>
  <a
  href={`/web-other-female-profiles/${bureauId}/female`}
  className="py-2 px-4 rounded-full bg-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-600 text-center"
>
  Female
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
        <p className="text-red-500">{error}</p>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{profile.fullName}</h2>
                <span className="text-sm font-bold">
                  {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
                </span>
              </div>
              <div className="flex">
                <div className="flex-1 text-sm">
                     <p className=" text-gray-700">Marital ID: {profile.martialId}</p>
                  <p>Address: {profile.originalLocation}</p>
                  <p>Caste: {profile.caste} - {profile.subcaste}</p>
                  <p>Degree: {profile.education}</p>
                  <p>Income: ₹ {profile.annualIncome}</p>
                  <p>Profession: {profile.occupation}</p>
                  <p>{profile.city}, {profile.state}, {profile.country}</p>
                </div>
                <img
                  src={profile.image ? `${Uploads}${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                  alt="Profile"
                  className="w-28 h-36 object-fill ml-4 rounded-lg"
                />
              </div>
              <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => handleProfileClick(profile._id)}
                >
                  <FaUser className="text-blue-500 mb-1" size={20} />
                  <span className="text-xs">View More</span>
                </div>
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
      ) : (
        <p>No profiles found.</p>
      )}

      {/* Load More Section */}
      {!isSearching && !loading && (
        <div className="mt-8 mb-4">
          {/* Auto-load trigger point */}
          <div ref={loadMoreRef} className="h-4"></div>
          {/* Loading next batch */}
          {loadingNext && (
            <div className="flex justify-center items-center mt-2">
              <Loader />
              <span className="ml-2 text-gray-600">Loading next batch...</span>
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
                  Batch {currentPage + 1}
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
      {/* Place WebNav at the bottom */}
      <WebNav />
    </div>
  );
};

export default ProfilePage;
