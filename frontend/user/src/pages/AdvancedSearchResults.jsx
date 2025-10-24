import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaSpinner, FaEllipsisV, FaHeart, FaShareAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';

const AdvancedSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bureauProfiles, setBureauProfiles] = useState([]);
  const [otherBureauProfiles, setOtherBureauProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [userData, setUserData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    console.log('AdvancedSearchResults mounted');
    console.log('Location state:', location.state);
    
    if (location.state?.searchData) {
      setSearchCriteria(location.state.searchData);
      initializeSearch();
    } else {
      console.log('No search data found in location state');
      setError('No search criteria provided');
      setLoading(false);
    }
  }, [location.state]);

  const initializeSearch = async () => {
    try {
      console.log('Initializing search...');
      const token = localStorage.getItem('token');
      const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      console.log('Stored user data:', storedUserData);
      
      if (storedUserData.martialId && storedUserData.bureauId) {
        console.log('Using stored user data');
        setUserData(storedUserData);
        await performAdvancedSearch(location.state.searchData, storedUserData);
      } else {
        console.log('Fetching user data from API...');
        const response = await apiClient2.get(apiEndpoints2.userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('API response:', response.data);
        
        if (response.data.success) {
          setUserData(response.data.user);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
          await performAdvancedSearch(location.state.searchData, response.data.user);
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
    } catch (error) {
      console.error('Error in initializeSearch:', error);
      setError('Failed to load user data: ' + error.message);
      setLoading(false);
    }
  };

  const performAdvancedSearch = async (searchData, userData) => {
    if (!searchData || !userData) {
      console.log('Missing searchData or userData:', { searchData, userData });
      setError('Missing search data or user data');
      setLoading(false);
      return;
    }
    
    console.log('Performing advanced search with:', { searchData, userData });
    setLoading(true);
    setError(null);
    
    try {
      // Search in same bureau
      console.log('Searching same bureau...');
      const sameBureauResponse = await apiClient2.post(`${apiEndpoints2.advancedSearch}`, {
        ...searchData,
        bureauId: userData.bureauId,
        page: 1,
        limit: 20
      });
      
      console.log('Same bureau response:', sameBureauResponse.data);
      
      // Search in other bureaus
      console.log('Searching other bureaus...');
      const otherBureauResponse = await apiClient2.post(`${apiEndpoints2.advancedSearch}`, {
        ...searchData,
        excludeBureauId: userData.bureauId,
        page: 1,
        limit: 20
      });
      
      console.log('Other bureau response:', otherBureauResponse.data);
      
      const sameBureauUsers = sameBureauResponse.data.users || [];
      const otherBureauUsers = otherBureauResponse.data.users || [];
      
      console.log('Setting profiles:', { sameBureauUsers, otherBureauUsers });
      
      setBureauProfiles(sameBureauUsers);
      setOtherBureauProfiles(otherBureauUsers);
      
    } catch (error) {
      console.error('Error performing advanced search:', error);
      console.error('Error details:', error.response?.data);
      setError('Error performing search: ' + (error.response?.data?.message || error.message));
      setBureauProfiles([]);
      setOtherBureauProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/advanced-search');
  };

  const handleProfileClick = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  const toggleDropdown = (profileId) => {
    setOpenDropdown((prev) => (prev === profileId ? null : profileId));
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
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

  const ProfileCard = ({ profile, isBureauProfile }) => {
    const age = calculateAge(profile.dateOfBirth);
    const profileImage = profile.image 
      ? `${Uploads}${profile.image}` 
      : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png";

    return (
      <div className={`bg-white rounded-2xl shadow-md p-4 space-y-4 relative mb-4 border-2 ${
        isBureauProfile ? 'border-blue-200' : 'border-green-200'
      }`}>
        {/* Bureau Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isBureauProfile 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isBureauProfile ? 'Same Bureau' : 'Other Bureau'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate pr-2">
            {profile.fullName || 'User Name'}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => toggleDropdown(profile._id)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaEllipsisV className="w-4 h-4 text-gray-600" />
              </button>
              {openDropdown === profile._id && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-10">
                  <button 
                    onClick={() => handleProfileClick(profile._id)}
                    className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <FaEye className="w-4 h-4 mr-2 text-blue-500" />
                    View Profile
                  </button>
                  <button className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    <FaHeart className="w-4 h-4 mr-2 text-pink-500" />
                    Send Interest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="flex items-start space-x-4">
          <div className="flex-1 text-sm text-gray-700 space-y-2">
            <div><span className="font-semibold">ID:</span> {profile.martialId}</div>
            <div><span className="font-semibold">Age:</span> {age !== 'N/A' ? `${age} yrs` : 'N/A'}</div>
            <div><span className="font-semibold">Height:</span> {profile.height || 'N/A'}</div>
            <div><span className="font-semibold">Religion:</span> {profile.religion || 'N/A'}</div>
            <div><span className="font-semibold">Caste:</span> {profile.caste || 'N/A'}</div>
            <div><span className="font-semibold">Education:</span> {profile.education || 'N/A'}</div>
            <div><span className="font-semibold">Occupation:</span> {profile.occupation || 'N/A'}</div>
            <div><span className="font-semibold">Location:</span> {profile.district || profile.jobLocation || 'N/A'}</div>
          </div>

          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-24 h-32 rounded-md overflow-hidden bg-gray-100">
              <img 
                src={profileImage}
                alt={`${profile.fullName || 'User'}'s profile`}
                className="object-cover w-full h-full" 
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png";
                }}
              />
            </div>
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="flex justify-around text-xs text-gray-600 pt-2">
          <button 
            onClick={() => handleProfileClick(profile._id)}
            className="flex flex-col items-center hover:opacity-75 transition-opacity"
          >
            <FaEye className="w-4 h-4 mb-1 text-blue-500" />
            <span>View More</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-green-500">{profile.views || 0}</span>
            <span>Views</span>
          </div>
          <button className="flex flex-col items-center hover:opacity-75 transition-opacity">
            <FaShareAlt className="w-4 h-4 mb-1 text-purple-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading search results...</p>
          </div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-sm mx-auto my-12 mt-30">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/advanced-search')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Different Search
            </button>
          </div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-sm mx-auto my-12 mt-30 space-y-4">
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
            <div className="grid grid-cols-1 gap-2 text-sm">
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
            </div>
          </div>
        )}

        {/* Same Bureau Profiles */}
        {bureauProfiles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Same Bureau Profiles ({bureauProfiles.length})
            </h2>
            <div className="space-y-4">
              {bureauProfiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} isBureauProfile={true} />
              ))}
            </div>
          </div>
        )}

        {/* Other Bureau Profiles */}
        {otherBureauProfiles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Other Bureau Profiles ({otherBureauProfiles.length})
            </h2>
            <div className="space-y-4">
              {otherBureauProfiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} isBureauProfile={false} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {bureauProfiles.length === 0 && otherBureauProfiles.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-600 mb-2">No profiles found matching your criteria</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search preferences</p>
            <button
              onClick={() => navigate('/advanced-search')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Modify Search
            </button>
          </div>
        )}

        {/* Handle click outside to close dropdowns */}
        {openDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setOpenDropdown(null)}
          />
        )}
      </div>
      <BottomNavbar />
    </>
  );
};

export default AdvancedSearchResults; 