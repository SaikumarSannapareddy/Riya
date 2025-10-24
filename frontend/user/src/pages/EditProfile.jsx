import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCheck, FaTimes, FaUser, FaCamera, FaSpinner } from "react-icons/fa";
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Function to fetch user data
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
          setUser(response.data.user);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
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

  const handleEditSection = (section) => {
    setEditingSection(section);
    // Navigate to specific edit page based on section
    switch (section) {
      case 'profile-picture':
        navigate('/edit-profile-picture');
        break;
      case 'personal-details':
        navigate('/edit-personal-details');
        break;
      case 'religion-caste':
        navigate('/edit-religion-caste');
        break;
      case 'education-details':
        navigate('/edit-education-details');
        break;
      case 'family-details':
        navigate('/edit-family-details');
        break;
      case 'property-details':
        navigate('/edit-property-details');
        break;
      case 'agriculture-flat':
        navigate('/edit-agriculture-flat');
        break;
      case 'location-details':
        navigate('/edit-location-details');
        break;
      case 'partner-preferences':
        navigate('/edit-partner-preferences');
        break;
      case 'gallery':
        navigate('/edit-gallery');
        break;
      default:
        break;
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

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

  const profileSections = [
    {
      id: 'profile-picture',
      title: 'Profile Picture',
      icon: FaCamera,
      color: 'bg-pink-500',
      status: user.image ? 'completed' : 'pending',
      description: user.image ? 'Profile picture uploaded' : 'Upload your profile picture'
    },
    {
      id: 'personal-details',
      title: 'Personal Details',
      icon: FaUser,
      color: 'bg-yellow-500',
      status: user.fullName && user.dateOfBirth ? 'completed' : 'pending',
      description: user.fullName ? 'Personal details completed' : 'Complete your personal information'
    },
    {
      id: 'religion-caste',
      title: 'Religion & Caste',
      icon: FaUser,
      color: 'bg-blue-500',
      status: user.religion && user.caste ? 'completed' : 'pending',
      description: user.religion ? 'Religion & caste details completed' : 'Add your religion and caste details'
    },
    {
      id: 'education-details',
      title: 'Education Details',
      icon: FaUser,
      color: 'bg-green-500',
      status: user.education ? 'completed' : 'pending',
      description: user.education ? 'Education details completed' : 'Add your education information'
    },
    {
      id: 'family-details',
      title: 'Family Details',
      icon: FaUser,
      color: 'bg-teal-500',
      status: user.familyType ? 'completed' : 'pending',
      description: user.familyType ? 'Family details completed' : 'Add your family information'
    },
    {
      id: 'property-details',
      title: 'Property Details',
      icon: FaUser,
      color: 'bg-purple-500',
      status: user.houseType ? 'completed' : 'pending',
      description: user.houseType ? 'Property details completed' : 'Add your property information'
    },
    {
      id: 'agriculture-flat',
      title: 'Agriculture & Flat Details',
      icon: FaUser,
      color: 'bg-indigo-500',
      status: user.numberOfFlats ? 'completed' : 'pending',
      description: user.numberOfFlats ? 'Agriculture & flat details completed' : 'Add your agriculture and flat details'
    },
    {
      id: 'location-details',
      title: 'Location Details',
      icon: FaUser,
      color: 'bg-orange-500',
      status: user.country && user.state ? 'completed' : 'pending',
      description: user.country ? 'Location details completed' : 'Add your location information'
    },
    {
      id: 'partner-preferences',
      title: 'Partner Preferences',
      icon: FaUser,
      color: 'bg-red-500',
      status: user.partnerServicePreference ? 'completed' : 'pending',
      description: user.partnerServicePreference ? 'Partner preferences completed' : 'Add your partner preferences'
    },
    {
      id: 'gallery',
      title: 'Edit Gallery',
      icon: FaUser,
      color: 'bg-lime-500',
      status: 'pending',
      description: 'Manage your profile gallery'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-400 to-blue-500 p-4 flex items-center justify-between shadow-md z-50">
        <button onClick={() => navigate(-1)} className="text-2xl font-bold text-white">
          {'<'}
        </button>
        <div className="text-lg font-semibold text-white">Edit Profile</div>
        <div className="w-6"></div> {/* Spacer */}
      </nav>

      <div className="pt-20 px-4 space-y-6 pb-20">

        {/* Profile Summary */}
        <section className="bg-white rounded-lg p-4 flex items-center shadow-sm">
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
              <strong className="font-semibold">Caste</strong>: {user.caste || 'N/A'}, {user.subcaste || 'N/A'}, {user.religion || 'N/A'}
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

        {/* Edit Profile Sections */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Edit Profile Sections</h3>
          <section className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profileSections.map((section) => (
              <ProfileSectionCard
                key={section.id}
                section={section}
                onEdit={() => handleEditSection(section.id)}
                user={user}
              />
            ))}
          </section>
        </div>

        {/* Profile Completion Status */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Completion</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${(profileSections.filter(s => s.status === 'completed').length / profileSections.length) * 100}%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {profileSections.filter(s => s.status === 'completed').length} of {profileSections.length} sections completed
          </p>
        </section>

      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

// Profile Section Card Component
const ProfileSectionCard = ({ section, onEdit, user }) => {
  const IconComponent = section.icon;
  
  return (
    <button
      onClick={onEdit}
      className={`${section.color} flex items-center justify-between text-white py-3 px-4 rounded-lg w-full shadow-md hover:opacity-90 transition text-sm font-semibold relative`}
    >
      <div className="flex items-center space-x-2">
        <IconComponent className="ml-1" />
        <span>{section.title}</span>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center space-x-2">
        {section.status === 'completed' ? (
          <FaCheck className="text-green-300" />
        ) : (
          <FaTimes className="text-red-300" />
        )}
        <FaEdit className="ml-1" />
      </div>
      
      {/* Status badge */}
      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${
        section.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
    </button>
  );
};

export default EditProfile; 