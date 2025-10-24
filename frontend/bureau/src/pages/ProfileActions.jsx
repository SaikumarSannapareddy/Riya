import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaUser, FaEye, FaShareAlt, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaUsers, FaHeart, FaGlobe, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis1';
import Loader from '../components/Loader';

const ProfileActions = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const navigate = useNavigate();
  const { profileId, action } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.fetchprofile}/${profileId}`);
        if (response.data.success) {
          setProfile(response.data.data);
          setViewCount(response.data.data.viewCount || 0);
        } else {
          setError('Profile not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const handleBackClick = () => {
    navigate(-1);
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

  const handleCall = () => {
    if (profile?.mobileNumber) {
      window.open(`tel:${profile.mobileNumber}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (profile?.mobileNumber) {
      const message = `Hello! ${profile.fullName}\n\nI'm interested in your profile.`;
      const whatsappLink = `https://wa.me/+91${profile.mobileNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    }
  };

  const handleShare = () => {
    const shareUrl = `https://matrimonystudio.in/profile_webview/${profileId}`;
    const shareText = `Check out this profile: ${profile?.fullName}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleViewMore = () => {
    navigate(`/profile/${profileId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <FaArrowLeft
              className="mr-2 text-gray-600 cursor-pointer"
              onClick={handleBackClick}
            />
            <h1 className="text-2xl font-semibold">Profile Actions</h1>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-red-500">{error || 'Profile not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold">Profile Actions</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center">
              <img
                src={
                  profile.image
                    ? `${Uploads}${profile.image}`
                    : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                }
                alt="Profile"
                className="w-24 h-32 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{profile.fullName}</h2>
                <div className="flex items-center space-x-4 text-lg">
                  <span>{calculateAge(profile.dateOfBirth)} years</span>
                  <span>•</span>
                  <span>{profile.height} ft</span>
                  <span>•</span>
                  <span>ID: {profile.martialId}</span>
                </div>
                <div className="flex items-center mt-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{profile.originalLocation}, {profile.district}, {profile.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaGraduationCap className="text-blue-500 mr-3 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Education</p>
                      <p className="font-medium">{profile.education || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaBriefcase className="text-green-500 mr-3 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Profession</p>
                      <p className="font-medium">{profile.occupation || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-yellow-500 mr-3 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Annual Income</p>
                      <p className="font-medium">₹{profile.annualIncome || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUsers className="text-purple-500 mr-3 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Caste & Subcaste</p>
                      <p className="font-medium">{profile.caste} - {profile.subcaste}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact & Actions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaPhone className="text-blue-500 mr-3 w-5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{profile.mobileNumber || 'Not available'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaEnvelope className="text-green-500 mr-3 w-5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{profile.email || 'Not available'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {profile.visibleToAll ? (
                      <FaGlobe className="text-green-500 mr-3 w-5" />
                    ) : (
                      <FaEyeSlash className="text-red-500 mr-3 w-5" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Profile Status</p>
                      <p className="font-medium">
                        {profile.visibleToAll ? 'Public' : 'Private'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={handleViewMore}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaUser className="text-blue-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-blue-700">View More</span>
                </button>
                
                <button
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg"
                >
                  <FaEye className="text-green-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-green-700">{viewCount} Views</span>
                </button>
                
                <button
                  onClick={handleCall}
                  disabled={!profile.mobileNumber}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <FaPhone className="text-blue-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-blue-700">Call</span>
                </button>
                
                <button
                  onClick={handleWhatsApp}
                  disabled={!profile.mobileNumber}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <FaWhatsapp className="text-green-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-green-700">WhatsApp</span>
                </button>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FaShareAlt className="text-purple-500 mr-2" size={20} />
                  <span className="text-sm font-medium text-purple-700">Share Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions; 