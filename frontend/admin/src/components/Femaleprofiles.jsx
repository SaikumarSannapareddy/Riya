import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaPhone, FaLock, FaShareAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader'; // Import Loader component // Dummy image path

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 4; // Profiles to show per page

  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');
  const pathname = window.location.pathname;
  const segments = pathname.split('/'); // Split the URL into parts

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
            if (Array.isArray(response.data)) {
              setProfiles(response.data);
            } else {
              setError('Invalid response format. Expected an array of profiles.');
            }
          } else {
            setError('Expected JSON response, but got HTML or other content type.');
          }
        } catch (error) {
          setError('Error fetching profile data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfiles();
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

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

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
          <h1 className="text-2xl font-semibold">My Profile</h1>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          {['All', 'male', 'female'].map((gender) => (
            <button
              key={gender}
              className="py-2 px-4 rounded-full bg-gray-300 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              onClick={() => handleNavigationClick(gender)}
            >
              {gender}
            </button>
          ))}
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
            <div className="mb-2">
            <p className="text-sm font-bold text-gray-700">
              Martial ID: {profile.martialId}
            </p>
          </div>
          {/* Top Actions */}
          <div className="flex justify-around items-center mb-4">
            <a
              href={`tel:${profile.mobileNumber}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex flex-col items-center text-sm"
            >
              <FaPhone size={20} />
              <span>Call</span>
            </a>
            <a
              href={`/view-password/${profile._id}`}
              className="bg-gray-500 text-white px-4 py-2 rounded-md flex flex-col items-center text-sm"
            >
              <FaLock size={20} />
              <span>View Password</span>
            </a>
            <a
    href={`https://wa.me/?text=Check out this profile: https://matrimonystudio.in/profile_view/${profile._id}`}
    className="bg-green-500 text-white px-4 py-2 rounded-md flex flex-col items-center text-sm"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaShareAlt size={20} />
    <span>Share</span>
  </a>
  
          </div>
        
          <hr className="border-gray-300 my-2" />
        
          {/* Profile Details */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">{profile.fullName}</h2>
            <span className="text-sm font-bold">
              {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
            </span>
          </div>
        
          <div className="flex">
            <div className="flex-1 text-sm">
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
        
          {/* Bottom Actions */}
          <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
            <a href={`/profile/${profile._id}`} className="text-center">
              <FaUser className="text-blue-500 mb-1" size={20} />
              <span className="text-xs">View More</span>
            </a>
            <a href={`/profile/${profile._id}`} className="text-center">
              <FaEye className="text-green-500 mb-1" size={20} />
              <span className="text-xs">{profile.viewCount || 0} Views</span>
            </a>
            <a href={`/edit-profile/${profile._id}`} className="text-center">
              <FaEdit className="text-yellow-500 mb-1" size={20} />
              <span className="text-xs">Edit</span>
            </a>
            <a href={`/delete-profile/${profile._id}`} className="text-center">
              <FaTrash className="text-red-500 mb-1" size={20} />
              <span className="text-xs">Delete</span>
            </a>
          </div>
        </div>
        ))}
      </div>
      ) : (
        <p>No profiles found.</p>
      )}

      {/* Pagination */}
      {profiles.length > profilesPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
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

export default ProfilePage;
