import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import { 
  FaDownload, 
  FaUserShield, 
  FaHandPointRight, 
  FaUsers, 
  FaCommentDots, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaSpinner,
  FaUser
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Function to fetch user data using /userdata route
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('userData');
        
        // First set user from localStorage for quick UI rendering
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        }
        
        // Fetch fresh data from API
        const response = await apiClient2.get(apiEndpoints2.userData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          // Update the user data
          setUser(response.data.user);
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md text-center">
          <FaUser className="text-4xl text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-600">No user data found</p>
        </div>
      </div>
    );
  }
  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
  
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    return age;
  }
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-blue-500 p-4 flex items-center justify-between shadow-md z-50">
        <button onClick={() => navigate(-1)} className="text-2xl font-bold text-white">
          {'<'}
        </button>
        <div className="text-lg font-semibold text-white">My Profile</div>
        <div className="w-6"></div> {/* Spacer */}
      </nav>

      <div className="pt-20 px-4 space-y-6">
        {/* Edit Profile Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/edit-profile')}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-2"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* Profile Section */}
        <section className="bg-white rounded p-4 flex items-center shadow-sm">
          <img
           src={
                        user.image
                          ? `${Uploads}${user.image}`
                          : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                      }
                       alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded object-fill"
            onError={(e) => {
              e.target.src = "https://static.toiimg.com/thumb/imgsize-23456,msid-72007751,width-600,resizemode-4/72007751.jpg";
            }}
          />
          <div className="ml-6 flex flex-col space-y-1 text-xs">
            <h2 className="text-xl font-semibold text-gray-800">
              {user.fullName || user.firstName + ' ' + (user.lastName || '') || 'Unknown User'}
            </h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Marital ID</strong>: {user.martialId || user.id || 'N/A'}
            </p>
            <p className="text-gray-700">
  {user.dateOfBirth ? `${calculateAge(user.dateOfBirth)} yrs` : 'N/A'} / {user.height || 'N/A'}
</p>

            <p className="text-gray-700">
              <strong className="font-semibold">Caste</strong>: {user.caste || 'N/A'}, {user.subcaste  || 'N/A'},, {user.religion || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Degree</strong>: {user.education || user.degree || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Income</strong>: {user.annualIncome || user.salary || 'N/A'}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Profession</strong>: {user.profession || user.occupation || user.job || 'N/A'}
            </p>
          </div>
        </section>

        {/* Edit Profile Steps Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
          <section className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StepButton color="bg-pink-500" text="Profile Picture" onClick={() => navigate('/edit-profile-picture')} />
            <StepButton color="bg-yellow-500" text="Personal Details" onClick={() => navigate('/edit-personal-details')} />
            <StepButton color="bg-blue-500" text="Religion & Caste (Pending)" onClick={() => navigate('/edit-religion-caste')} />
            <StepButton color="bg-green-500" text="Education Details (Pending)" onClick={() => navigate('/edit-education-details')} />
            <StepButton color="bg-teal-500" text="Family Details (Pending)" onClick={() => navigate('/edit-family-details')} />
            <StepButton color="bg-purple-500" text="Property Details (Pending)" onClick={() => navigate('/edit-property-details')} />
            <StepButton color="bg-indigo-500" text="Agriculture Flat Details (Pending)" onClick={() => navigate('/edit-agriculture-flat')} />
            <StepButton color="bg-orange-500" text="Location Details (Pending)" onClick={() => navigate('/edit-location-details')} />
            <StepButton color="bg-red-500" text="Partner Preferences (Pending)" onClick={() => navigate('/edit-partner-preferences')} />
            <StepButton color="bg-lime-500" text="Edit Gallery" onClick={() => navigate('/edit-gallery')} />
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-md p-6 mb-20 border border-gray-200">
  <h3 className="text-xl font-bold text-indigo-600 mb-4">🎯 My Plan</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
    <div className="flex flex-col">
      <span className="font-semibold text-gray-500">Name</span>
      <span>{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</span>
    </div>

    <div className="flex flex-col">
      <span className="font-semibold text-gray-500">Start Date</span>
      <span>{user.planStart || user.subscriptionStart || '01-01-2025'}</span>
    </div>

    <div className="flex flex-col">
      <span className="font-semibold text-gray-500">End Date</span>
      <span>{user.planEnd || user.subscriptionEnd || '01-01-2026'}</span>
    </div>

    {user.planType && (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-500">Plan Type</span>
        <span>{user.planType}</span>
      </div>
    )}
  </div>
</section>


      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

// Step Button Component
const StepButton = ({ color, text, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg w-full shadow-md hover:opacity-90 transition text-sm font-semibold`}
  >
    <span>{text}</span>
    <FaEdit className="ml-1" />
  </button>
);

export default ProfilePage;