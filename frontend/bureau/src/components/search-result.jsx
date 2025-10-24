import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaShareAlt, FaPhone, FaLock, FaEllipsisV, FaWhatsapp } from "react-icons/fa";
import Loader from './Loader'; // Import Loader component // Dummy image path

const SearchResults = () => {
  const location = useLocation();
  const searchData = location.state?.searchData;
  const MybureauId = localStorage.getItem('bureauId');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [profilesPerPage] = useState(10);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [autoLoadTimer, setAutoLoadTimer] = useState(null);
  const loadMoreRef = useRef(null);

  const sendwhatsapp = (name, number) => {
    console.log(`Sending WhatsApp to ${name} (${number})`);
  };


  const openPasswordModal = (password) => {
    setCurrentPassword(password);
    setIsPasswordModalOpen(true);
  };
  const openEmailModal = (email) => {
    setCurrentEmail(email);
    setIsEmailModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
  };
  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setCurrentEmail("");
  };

  const handleDelete = (id) => {
    console.log(`Delete profile with ID: ${id}`);
  };

  const sendCredentials = (password, martialId, fullName) => {
    console.log(`Sending credentials to ${fullName} (${martialId}): ${password}`);
  };

  const toggleDropdown = (profileId) => {
    setOpenDropdown((prev) => (prev === profileId ? null : profileId));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Fetch profiles for a specific page
  const fetchResults = useCallback(async (pageNum = 1, append = false) => {
    if (!searchData) return;
    if (!append) {
      setLoading(true);
    } else {
      setLoadingNext(true);
    }
    setError(null);
    try {
      const response = await apiClient.get(apiEndpoints.userssearch, {
        params: { ...searchData, page: pageNum, limit: profilesPerPage },
      });
      const data = response.data;
      const users = data.users || data;
      const total = data.total || 0;
      if (Array.isArray(users) && users.length > 0) {
        if (append) {
          setResults(prev => [...prev, ...users]);
        } else {
          setResults(users);
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
        if (!append) setResults([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch results.");
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  }, [searchData, profilesPerPage]);

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
    if (hasMore && !loadingNext) {
      fetchResults(currentPage + 1, true);
    }
  }, [hasMore, loadingNext, currentPage, fetchResults, autoLoadTimer]);

  // Initial load
  useEffect(() => {
    fetchResults(1, false);
    return () => {
      if (autoLoadTimer) clearTimeout(autoLoadTimer);
    };
  }, [fetchResults]);

  // Cleanup timer on unmount
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

  if (loading) return <div className="flex justify-center"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Search Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {results.map((profile) => (
          <div
            key={profile._id}
            className="bg-white shadow-2xl rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
          >
            {/* top of the card buttons section */}

            <div className="flex justify-between items-center mb-4">
              {MybureauId === profile.bureauId ? (
                <>
                  {/* Call Button */}
                  <a
                    href={`tel:${profile.mobileNumber}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm"
                  >
                    <FaPhone size={20} />
                    <span className="ml-3"> Call</span>
                  </a>

                  {/* Whats App Button */}
                  <a
                    onClick={() => sendwhatsapp(profile.fullName, profile.mobileNumber)}
                    className="bg-green-500 text-white px-4 mx-1 py-2 rounded-md flex items-center text-sm"
                  >
                    <FaWhatsapp size={20} />
                    <span className="ml-3"> WhatsApp</span>
                  </a>

                  {/* Dropdown Options */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(profile._id)}
                      className="text-grey px-4 py-2 rounded-md flex items-center text-sm"
                    >
                      <FaEllipsisV />
                    </button>
                    {openDropdown === profile._id && (
                      <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-40">
                        <a
                          onClick={() => handleDelete(profile._id)}
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Delete
                        </a>
                        <button
                          onClick={() => openEmailModal(profile.email)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          View Email
                        </button>
                        <button
                          onClick={() => sendCredentials(profile.password, profile.martialId, profile.fullName)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Send Login Credentials
                        </button>
                        <button
                          onClick={() => openPasswordModal(profile.password)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          See Password
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 w-full pl-5 pr-5 rounded bg-green-300">Other Mediator profile</p>
              )}
            </div>

            {/* closing */}
            <hr className="border-gray-300 my-2" />
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
            {MybureauId === profile.bureauId ? (
      <>
              <a href={`/profile/${profile._id}`} className="text-center">
                <FaUser className="text-blue-500 mb-1" size={20} />
                <span className="text-xs">View More</span>
              </a>

              </>
    ) : (
      <a href={`/profile_view/${profile._id}`} className="text-center">
                <FaUser className="text-blue-500 mb-1" size={20} />
                <span className="text-xs">View More</span>
              </a>
    )}
              <div className="text-center">
                <FaEye className="text-green-500 mb-1" size={20} />
                <span className="text-xs">{profile.views || 0} Views</span>
              </div>
              {MybureauId === profile.bureauId ? (
      <>

              <a href={`/edit-profile/${profile._id}`} className="text-center">
                    <FaEdit className="text-yellow-500 mb-1" size={20} />
                    <span className="text-xs">Edit</span>
                  </a>


                  </>
    ) : (
  ""
    )}
              <a
                href={`https://wa.me/?text= https://matrimonystudio.in/profile_view/${profile._id}`}
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
      {!loading && (
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
                  Batch {Math.ceil(results.length / profilesPerPage) + 1}
                </span>
              </button>
            </div>
          )}
          {!hasMore && results.length > 0 && (
            <div className="text-center text-gray-500 py-4">
              <p>All profiles loaded</p>
            </div>
          )}
        </div>
      )}
      {/* No Results */}
      {!loading && results.length === 0 && (
        <div className="text-center text-gray-500 my-8">
          No profiles found.
        </div>
      )}
      {/* Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Profile Password</h2>
            <p className="text-sm">{currentPassword}</p>
            <button
              onClick={closePasswordModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
       {/* Email Modal */}
       {isEmailModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Profile Email</h2>
            <p className="text-sm">{currentEmail}</p>
            <button
              onClick={closeEmailModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
