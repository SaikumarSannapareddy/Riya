import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaEdit, FaTrash, FaPhone, FaLock, FaShareAlt, FaSearch, FaEllipsisV, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const profilesPerPage = 30;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`${apiEndpoints.Females}`);
        if (Array.isArray(response.data)) {
          setProfiles(response.data);
          setFilteredProfiles(response.data);
        } else {
          setError('Invalid response format. Expected an array of profiles.');
        }
      } catch (error) {
        setError('Error fetching profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleBackClick = () => navigate(-1);

  const handleProfileClick = (profileId) => navigate(`/profile/${profileId}`);

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

// Scroll to the top when the page changes
useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProfiles.length / profilesPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  

  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown by profile ID
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const toggleDropdown = (profileId) => {
    setOpenDropdown((prev) => (prev === profileId ? null : profileId));
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

  const sendCredentials = (password, maritalId, fullName) => {
    const message = `Hello! ${fullName} \n\nHere are your login credentials:\n\nMarital ID: ${maritalId}\nPassword: ${password}\n\nLogin at https://user.matrimonystudio.in`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
    // Open WhatsApp Web or WhatsApp app for sharing
    window.open(whatsappLink, "_blank");
  };
  
  const sendwhatsapp = (fullName, phoneNumber) => {
    if (!phoneNumber) {
      alert("Phone number is missing for this profile.");
      return;
    }
  
    const message = `Hello! ${fullName}\n\n Here are your login credentials:\n\n`;
    const whatsappLink = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    // Open WhatsApp Web link
    window.open(whatsappLink, "_blank");
  };
  

  const handleDelete = async (profileId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this profile?');
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`${apiEndpoints.update}/${profileId}`);
      setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== profileId));
      setFilteredProfiles((prevFiltered) => prevFiltered.filter((profile) => profile._id !== profileId));
      alert('Profile deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile. Please try again.');
    }
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
    setCurrentPage(1); // Reset to the first page
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
      <div className="sticky top-0 bg-gray-100 z-10 py-4 mb-4">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold">Female Profiles</h1>
        </div>
        <div className="mb-4">
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
          <div className="mb-2 flex justify-between">
    <p className="text-sm font-bold text-gray-700">Marital ID: {profile.martialId}</p>
    <p className="text-sm font-bold text-gray-700 text-right">Bureau ID: {profile.bureauId}</p>
  </div>
  
            <div className="flex justify-between items-center mb-4">
              {/* Call Button */}
              <a
                href={`tel:${profile.mobileNumber}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex  items-center text-sm"
              >
                <FaPhone size={20} />
                <span className='ml-3'> Call</span>
              </a>
               {/* Whats App Button */}
               <a
                onClick={() => sendwhatsapp(profile.fullName, profile.mobileNumber)}
                className="bg-green-500 text-white px-4 mx-1 py-2 rounded-md flex  items-center text-sm"
              >
                <FaWhatsapp size={20} />
                <span className='ml-3'> WhatsApp</span>
              </a>
              {/* Dropdown Options */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(profile._id)}
                  className=" text-grey px-4 py-2 rounded-md flex items-center text-sm"
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
              <a href={`/profile/${profile._id}`} className="text-center">
                <FaUser className="text-blue-500 mb-1" size={20} />
                <span className="text-xs">View More</span>
              </a>
              <a href={`/profile/${profile._id}`} className="text-center items-center">
                <FaEye className="text-green-500 mb-1" size={20} />
                <span className="text-xs text-left">{profile.viewCount || 0} Views</span>
              </a>
              <a href={`/edit-profile/${profile._id}`} className="text-center">
                    <FaEdit className="text-yellow-500 mb-1" size={20} />
                    <span className="text-xs">Edit</span>
                  </a>
              <a
                href={`https://wa.me/?text=Check out this profile: https://matrimonystudio.in/profile_view/${profile._id}`}
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
      ) : (
        <p>No Female profiles found.</p>
      )}

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
