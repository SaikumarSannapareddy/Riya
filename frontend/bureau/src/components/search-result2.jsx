import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaShareAlt, FaPhone, FaLock, FaEllipsisV, FaWhatsapp } from "react-icons/fa";
import Loader from './Loader'; // Ensure Loader component is imported

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
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null)

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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Ensure loading is set to true at the start of fetch
        setLoading(true);
        setError(null);

        const response = await apiClient.get(apiEndpoints.userssearch, {
          params: searchData,
        });
        
        // Simulating a minimum loading time to show loader
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setResults(response.data.users);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.response?.data?.message || "Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    if (searchData) {
      fetchResults();
    } else {
      // If no search data, stop loading
      setLoading(false);
    }
  }, [searchData]);

  // Full page loader when initially loading
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader />
      </div>
    );
  }

  // Error state handling
  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-red-500 text-xl mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // No results handling
  if (!results || results.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-4">No Results Found</h2>
        <p className="text-gray-700">Try adjusting your search criteria.</p>
      </div>
    );
  }

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
                  <a href={`/profile_webview/${profile._id}`} className="text-center">
                    <FaUser className="text-blue-500 mb-1" size={20} />
                    <span className="text-xs">View More</span>
                  </a>
      
                  </>
        ) : (
          <a href={`/profile_webview/${profile._id}`} className="text-center">
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

      {/* Modals remain the same */}
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