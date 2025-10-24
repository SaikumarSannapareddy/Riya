import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEdit, FaTrash, FaPhone, FaLock, FaShareAlt, FaSearch, FaEllipsisV, FaWhatsapp, FaExchangeAlt, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import apiClient2, { apiEndpoints2 } from './Apis2';
import Loader from './Loader';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [bureauProfiles, setBureauProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const profilesPerPage = 30;

  // Modal states
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBureauChangeModalOpen, setIsBureauChangeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newBureauId, setNewBureauId] = useState("");
  const [currentProfileId, setCurrentProfileId] = useState("");
  const [suspendreason, setSuspendReason] = useState("");
  const [foundBureau, setFoundBureau] = useState(null);
  const [bureauSearchError, setBureauSearchError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch male profiles
        const profilesResponse = await apiClient.get(`${apiEndpoints.Males}`);
        
        // Fetch bureau profiles
        const bureauResponse = await apiClient2.get(`${apiEndpoints2.BureauManage}`);
        
        if (Array.isArray(profilesResponse.data) && Array.isArray(bureauResponse.data.bureauProfiles)) {
          setBureauProfiles(bureauResponse.data.bureauProfiles);
          setProfiles(profilesResponse.data);
          setFilteredProfiles(profilesResponse.data);
        } else {
          setError('Invalid response format. Expected arrays of profiles and bureau data.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Get bureau details by bureauId
  const getBureauDetails = (bureauId) => {
    const bureau = bureauProfiles.find(bureau => bureau.bureauId === bureauId);
    return bureau || null;
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

  const openDeleteModal = (profileId) => {
    setCurrentProfileId(profileId);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null); // Close dropdown
  };

  const openSuspendModal = (profileId) => {
    setCurrentProfileId(profileId);
    setSuspendReason("");
    setIsSuspendModalOpen(true);
    setOpenDropdown(null); // Close dropdown
  };

  const openBureauChangeModal = (profileId) => {
    setCurrentProfileId(profileId);
    setNewBureauId("");
    setFoundBureau(null);
    setBureauSearchError("");
    setIsBureauChangeModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
  };
  
  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setCurrentEmail("");
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentProfileId("");
  };

  const closeSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setCurrentProfileId("");
    setSuspendReason("");
  };

  const closeBureauChangeModal = () => {
    setIsBureauChangeModalOpen(false);
    setCurrentProfileId("");
    setNewBureauId("");
    setFoundBureau(null);
    setBureauSearchError("");
  };

  const checkBureauExists = () => {
    if (!newBureauId.trim()) {
      setBureauSearchError("Please enter a Bureau ID");
      setFoundBureau(null);
      return;
    }

    const bureau = bureauProfiles.find(bureau => bureau.bureauId === newBureauId);
    
    if (bureau) {
      setFoundBureau(bureau);
      setBureauSearchError("");
    } else {
      setFoundBureau(null);
      setBureauSearchError("Bureau not found with this ID");
    }
  };

  const handleBureauIdChange = (e) => {
    setNewBureauId(e.target.value);
    // Clear previous results
    setFoundBureau(null);
    setBureauSearchError("");
  };

  const updateProfileBureau = async () => {
    if (!foundBureau) {
      setBureauSearchError("Please verify bureau ID first");
      return;
    }

    setIsUpdating(true);
    
    try {
      // Get the profile to update
      const profileToUpdate = profiles.find(profile => profile._id === currentProfileId);
      
      if (!profileToUpdate) {
        throw new Error("Profile not found");
      }
      
      // Prepare data with updated bureauId
      const updatedData = {
        ...profileToUpdate,
        bureauId: newBureauId
      };
      
      // Call the update endpoint
      const endpoint = `${apiEndpoints.update}/${currentProfileId}`;
      await apiClient.put(endpoint, updatedData);
      
      // Update local state
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile._id === currentProfileId ? { ...profile, bureauId: newBureauId } : profile
        )
      );
      
      setFilteredProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile._id === currentProfileId ? { ...profile, bureauId: newBureauId } : profile
        )
      );
      
      alert("Bureau changed successfully");
      closeBureauChangeModal();
      
    } catch (error) {
      console.error("Error updating bureau:", error);
      alert("Failed to update bureau. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const sendCredentials = (password, maritalId, fullName) => {
    const message = `Hello! ${fullName} \n\nHere are your login credentials:\n\nMarital ID: ${maritalId}\nPassword: ${password}\n\nLogin at https://matrimonystudio.in/userlogin`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
    // Open WhatsApp Web or WhatsApp app for sharing
    window.open(whatsappLink, "_blank");
  };
  
  const sendWhatsApp = (fullName, phoneNumber) => {
    if (!phoneNumber) {
      alert("WhatsApp number is missing for this profile.");
      return;
    }
  
    const message = `Hello! ${fullName}\n\n Here are your login credentials:\n\n`;
    const whatsappLink = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    // Open WhatsApp Web link
    window.open(whatsappLink, "_blank");
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    
    try {
      // Call the delete endpoint
      const endpoint = `${apiEndpoints.update}/${currentProfileId}`;
      await apiClient.delete(endpoint);
      
      // Update local state by removing the profile
      setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== currentProfileId));
      setFilteredProfiles((prevFiltered) => prevFiltered.filter((profile) => profile._id !== currentProfileId));
      
      alert('Profile deleted successfully.');
      closeDeleteModal();
      
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendreason.trim()) {
      alert("Please provide a reason for suspension.");
      return;
    }

    setIsUpdating(true);
    
    try {
      // Get the profile to update
      const profileToUpdate = profiles.find(profile => profile._id === currentProfileId);
      
      if (!profileToUpdate) {
        throw new Error("Profile not found");
      }
      
      // Prepare data with updated status and reason
      const updatedData = {
        ...profileToUpdate,
        status: 1, // 1 for suspend
        suspendreason: suspendreason
      };
      
      // Call the update endpoint
      const endpoint = `${apiEndpoints.update}/${currentProfileId}`;
      await apiClient.put(endpoint, updatedData);
      
      // Update local state with suspended status
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile._id === currentProfileId ? { ...profile, status: 1, suspendreason } : profile
        )
      );
      
      setFilteredProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile._id === currentProfileId ? { ...profile, status: 1, suspendreason } : profile
        )
      );
      
      alert('Profile suspended successfully.');
      closeSuspendModal();
      
    } catch (error) {
      console.error("Error suspending profile:", error);
      alert("Failed to suspend profile. Please try again.");
    } finally {
      setIsUpdating(false);
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
          <h1 className="text-2xl font-semibold">Male Profiles</h1>
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
          {currentProfiles.map((profile) => {
            const bureauDetails = getBureauDetails(profile.bureauId);
            const bureauPhone = bureauDetails?.mobileNumber || '';
            const bureauWhatsApp = bureauDetails?.mobileNumber || '';
            
            return (
              <div
                key={profile._id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
              >
                <div className="mb-2 flex justify-between">
                  <p className="text-sm font-bold text-gray-700">Marital ID: {profile.martialId}</p>
                  <p className="text-sm font-bold text-gray-700 text-right">Bureau ID: {profile.bureauId}</p>
                </div>
                {profile.status === 1 && (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm mb-2">
                    Suspended: {profile.suspendreason}
                  </div>
                )}
                <h1 className='font-bold'>Profile Contact Details</h1>
                <div className="flex justify-between items-center mb-4">
                  {/* Call Button - Using Bureau Mobile Number */}
                  <a
                    href={profile.mobileNumber ? `tel:${profile.mobileNumber}` : '#'}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm"
                    onClick={!profile.mobileNumber ? () => alert("Profile phone number not available") : undefined}
                  >
                    <FaPhone size={20} />
                    <span className='ml-3'> Call</span>
                  </a>
                  
                  {/* WhatsApp Button - Using Bureau WhatsApp Number */}
                  <a
                    onClick={() => sendWhatsApp(profile.fullName, profile.mobileNumber)}
                    className="bg-green-500 text-white px-4 mx-1 py-2 rounded-md flex items-center text-sm cursor-pointer"
                  >
                    <FaWhatsapp size={20} />
                    <span className='ml-3'> WhatsApp</span>
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
                        <button
                          onClick={() => openDeleteModal(profile._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FaTrash className="inline mr-2" size={14} />
                          Delete Profile
                        </button>
                        <button
                          onClick={() => openSuspendModal(profile._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 cursor-pointer"
                        >
                          <FaBan className="inline mr-2" size={14} />
                          Suspend Profile
                        </button>
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
                        <button
                          onClick={() => openBureauChangeModal(profile._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          <FaExchangeAlt className="inline mr-2" size={14} />
                          Change Bureau
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Display Bureau Contact Info as Buttons */}
                {bureauDetails && (
                  <>
                    <h1 className='font-bold'>Bureau Contact Details</h1>
                    <p><strong>Bureau Name:</strong> {bureauDetails.bureauName}</p>
                    <div className="flex gap-2 mb-2">
                    
                    {/* Call Button */}
                    <a
                      href={`tel:${bureauDetails.mobileNumber}`}
                      className="text-xs px-3 py-2 flex bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <FaPhone size={20} /> Call
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${bureauDetails.mobileNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-2 flex bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaWhatsapp size={20} />  WhatsApp
                    </a>
                  </div>
                  </>
                )}
                
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
            );
          })}
        </div>
      ) : (
        <p>No male profiles found.</p>
      )}

      {/* Password Modal */}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-red-600">Delete Profile</h2>
            <p className="mb-4">Are you sure you want to delete this profile? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-md ${isUpdating ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-600 text-white'}`}
              >
                {isUpdating ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-yellow-600">Suspend Profile</h2>
            <p className="mb-4">This profile will be suspended and will not be visible to other users.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Reason for Suspension <span className="text-red-500">*</span></label>
              <textarea
                value={suspendreason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full border rounded p-2 h-24"
                placeholder="Please provide a reason for suspension"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeSuspendModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={!suspendreason.trim() || isUpdating}
                className={`px-4 py-2 rounded-md ${!suspendreason.trim() || isUpdating ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-yellow-600 text-white'}`}
              >
                {isUpdating ? 'Suspending...' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Bureau Modal */}
      {isBureauChangeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Change Bureau</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Enter New Bureau ID</label>
              <div className="flex">
                <input
                  type="text"
                  value={newBureauId}
                  onChange={handleBureauIdChange}
                  className="flex-1 border rounded-l p-2"
                  placeholder="Bureau ID"
                />
                <button
                  onClick={checkBureauExists}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Verify
                </button>
              </div>
              {bureauSearchError && <p className="text-red-500 text-sm mt-1">{bureauSearchError}</p>}
            </div>
            
            {foundBureau && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <h3 className="font-bold text-sm">Bureau Found:</h3>
                <p className="text-sm"><strong>Name:</strong> {foundBureau.bureauName}</p>
                <p className="text-sm"><strong>Contact:</strong> {foundBureau.mobileNumber}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeBureauChangeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={updateProfileBureau}
                disabled={!foundBureau || isUpdating}
                className={`px-4 py-2 rounded-md ${!foundBureau || isUpdating ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white'}`}
              >
                {isUpdating ? 'Updating...' : 'Update Bureau'}
              </button>
            </div>
          </div>
        </div>
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
          <span>Page {currentPage} of {Math.ceil(filteredProfiles.length / profilesPerPage)}
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