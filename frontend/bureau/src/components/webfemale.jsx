import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaSearch, FaShareAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader'; // Import Loader component // Dummy image path
import WebNav from './WebNav';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100; // Profiles to show per page
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const pathname = window.location.pathname;
  const segments = pathname.split('/'); // Split the URL into parts
  const bureauId = segments[2]; 
  const gender = segments[3]; // Extract the gender (male)
  useEffect(() => {
    localStorage.setItem('bureauId', bureauId);
    localStorage.setItem('gender', gender);
  }, [bureauId, gender]);



  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = profiles.filter(
      (profile) =>
        profile.martialId?.toString().toLowerCase().includes(term) ||
        profile.fullName?.toLowerCase().includes(term)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1); // Reset to the first page
  };
  useEffect(() => {
    const fetchProfiles = async () => {
      if (bureauId) {
        try {
          const response = await apiClient.get(`${apiEndpoints.fetchbureau}/${bureauId}/${gender}`);
          const contentType = response.headers['content-type'];

          if (contentType && contentType.includes('application/json')) {
            // Use response.data.users if present and is an array, else fallback to response.data
            if (Array.isArray(response.data?.users)) {
              setProfiles(response.data.users);
              setFilteredProfiles(response.data.users);
            } else if (Array.isArray(response.data)) {
              setProfiles(response.data);
              setFilteredProfiles(response.data);
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
    navigate(-1); // Go back one step in history
  };
  

  const handleNavigationClick = (gender) => {
    let path;
  
    if (gender === 'All') {
      path = 'web-all-profiles';
    } else {
      path = gender === 'male' ? 'web-male-profiles' : 'web-female-profiles';
    }
    navigate(`/${path}/${bureauId}/${gender}`);
  };
  

  const handleProfileClick = (profileId) => {
    navigate(`/profile_webview/${profileId}`);
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
     <div className="sticky top-0 bg-white shadow-lg border-b z-10 py-4 mb-6">
       <div className="flex items-center mb-4">
         <FaArrowLeft
           className="mr-3 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors text-lg"
           onClick={handleBackClick}
         />
         <h1 className="text-xl font-semibold text-gray-800">My Male Profiles</h1>
       </div>
       
       {/* Navigation Buttons */}
      {/* Navigation Buttons */}
     <div className="flex flex-row flex-wrap sm:flex-nowrap gap-2 mb-4">
       <a
           href={`/web-male-profiles/${bureauId}/male`}
         className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 flex-1 min-w-[100px]"
       >
         {/* SVG Icon */}
         <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
             <path d="M9 9C10.29 9 11.5 9.41 12.47 10.11L17.58 5H13V3H21V11H19V6.41L13.89 11.5C14.59 12.5 15 13.7 15 15C15 18.31 12.31 21 9 21C5.69 21 3 18.31 3 15C3 11.69 5.69 9 9 9M9 11C6.79 11 5 12.79 5 15C5 17.21 6.79 19 9 19C11.21 19 13 17.21 13 15C13 12.79 11.21 11 9 11Z"/>
           </svg>
         <span className="relative z-10 truncate">Male</span>
         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
       </a>
     
       <a
         href={`/web-female-profiles/${bureauId}/female`}
         className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 flex-1 min-w-[100px]"
       >
         {/* SVG Icon */}
         <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 4C13.1 4 14 3.1 14 2C14 0.9 13.1 0 12 0C10.9 0 10 0.9 10 2C10 3.1 10.9 4 12 4ZM12 22C15.31 22 18 19.31 18 16C18 14.5 17.5 13.13 16.66 12H18V10H16C15.2 10 14.5 10.3 14 10.76V9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9V10.76C9.5 10.3 8.8 10 8 10H6V12H7.34C6.5 13.13 6 14.5 6 16C6 19.31 8.69 22 12 22ZM12 20C9.79 20 8 18.21 8 16C8 13.79 9.79 12 12 12C14.21 12 16 13.79 16 16C16 18.21 14.21 20 12 20Z"/>
           </svg>
         <span className="relative z-10 truncate">Female</span>
         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
       </a>
     
       <a
         href="/quick-search2"
         className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 flex-1 min-w-[100px]"
       >
         {/* SVG Icon */}
         <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
           </svg>
         <span className="relative z-10 truncate">Search</span>
         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
       </a>
     </div>
     
       
       {/* Search Input */}
       <div className="relative">
         <input
           type="text"
           className="w-full pl-4 pr-12 py-3 text-sm border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
           placeholder="Search by Marital ID or Name..."
           value={searchTerm}
           onChange={handleSearch}
         />
         <div className="absolute right-3 top-3 bg-gray-100 rounded-full p-1">
           <FaSearch className="text-gray-500 text-sm" />
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
