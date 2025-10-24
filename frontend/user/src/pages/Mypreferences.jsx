import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Eye, Share2, MoreVertical, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import { FaSpinner, FaStar, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaRulerVertical, FaChevronRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigate } from 'react-router-dom';

// Utility function moved outside component to prevent recreation
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

// Enhanced My Preferences Carousel Component
const MyPreferencesCarousel = () => {
  const [preferencesProfiles, setPreferencesProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferencesProfiles = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const bureauId = localStorage.getItem('bureauId') || userData.bureauId;

      if (!token || !userData.gender || !bureauId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch my preferences (same bureau with 50%+ compatibility)
        const response = await apiClient2.get(
          `${apiEndpoints2.userDataMypreferences}?martialId=${userData.martialId}&bureauId=${bureauId}&page=1&limit=20`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          // Enhanced matching logic
          const profilesWithMatch = (response.data.data || []).map(profile => {
            const matchPercentage = calculateCompatibility(userData, profile);
            return { ...profile, matchPercentage };
          });
          
          // Sort by match percentage (highest first)
          profilesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
          
          setPreferencesProfiles(profilesWithMatch);
        }
      } catch (error) {
        console.error('Error fetching preferences profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferencesProfiles();
  }, []);

  // Enhanced compatibility calculation
  const calculateCompatibility = (currentUser, targetProfile) => {
    let score = 0;
    let totalCriteria = 0;

    // Age compatibility (20 points)
    totalCriteria += 20;
    const currentAge = calculateAge(currentUser.dateOfBirth);
    const targetAge = calculateAge(targetProfile.dateOfBirth);
    const ageDiff = Math.abs(currentAge - targetAge);
    if (ageDiff <= 2) score += 20;
    else if (ageDiff <= 5) score += 15;
    else if (ageDiff <= 8) score += 10;
    else if (ageDiff <= 12) score += 5;

    // Education compatibility (15 points)
    totalCriteria += 15;
    if (currentUser.education && targetProfile.education) {
      if (currentUser.education.toLowerCase() === targetProfile.education.toLowerCase()) {
        score += 15;
      } else if (
        (currentUser.education.toLowerCase().includes('engineer') && targetProfile.education.toLowerCase().includes('engineer')) ||
        (currentUser.education.toLowerCase().includes('doctor') && targetProfile.education.toLowerCase().includes('doctor')) ||
        (currentUser.education.toLowerCase().includes('mba') && targetProfile.education.toLowerCase().includes('mba'))
      ) {
        score += 12;
      } else {
        score += 8;
      }
    }

    // Location compatibility (15 points)
    totalCriteria += 15;
    if (currentUser.location && targetProfile.location) {
      if (currentUser.location.toLowerCase() === targetProfile.location.toLowerCase()) {
        score += 15;
      } else if (
        currentUser.location.toLowerCase().includes(targetProfile.location.toLowerCase()) ||
        targetProfile.location.toLowerCase().includes(currentUser.location.toLowerCase())
      ) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // Religion/Caste compatibility (20 points)
    totalCriteria += 20;
    if (currentUser.religion && targetProfile.religion) {
      if (currentUser.religion.toLowerCase() === targetProfile.religion.toLowerCase()) {
        score += 20;
        // Additional points for same caste
        if (currentUser.caste && targetProfile.caste && 
            currentUser.caste.toLowerCase() === targetProfile.caste.toLowerCase()) {
          score += 5;
          totalCriteria += 5;
        }
      } else {
        score += 8;
      }
    }

    // Occupation compatibility (15 points)
    totalCriteria += 15;
    if (currentUser.occupation && targetProfile.occupation) {
      if (currentUser.occupation.toLowerCase() === targetProfile.occupation.toLowerCase()) {
        score += 15;
      } else if (
        (currentUser.occupation.toLowerCase().includes('engineer') && targetProfile.occupation.toLowerCase().includes('engineer')) ||
        (currentUser.occupation.toLowerCase().includes('doctor') && targetProfile.occupation.toLowerCase().includes('doctor')) ||
        (currentUser.occupation.toLowerCase().includes('teacher') && targetProfile.occupation.toLowerCase().includes('teacher'))
      ) {
        score += 12;
      } else {
        score += 8;
      }
    }

    // Family type compatibility (10 points)
    totalCriteria += 10;
    if (currentUser.familyType && targetProfile.familyType) {
      if (currentUser.familyType.toLowerCase() === targetProfile.familyType.toLowerCase()) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // Income compatibility (5 points)
    totalCriteria += 5;
    if (currentUser.income && targetProfile.income) {
      const currentIncome = parseFloat(currentUser.income.replace(/[^0-9.]/g, ''));
      const targetIncome = parseFloat(targetProfile.income.replace(/[^0-9.]/g, ''));
      const incomeDiff = Math.abs(currentIncome - targetIncome) / Math.max(currentIncome, targetIncome);
      if (incomeDiff <= 0.2) score += 5;
      else if (incomeDiff <= 0.4) score += 3;
      else score += 1;
    }

    // Calculate final percentage
    const percentage = Math.round((score / totalCriteria) * 100);
    return Math.min(percentage, 99); // Cap at 99%
  };

  if (loading) {
    return (
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">My Preferences</h3>
            </div>
            <button 
              onClick={() => navigate('/my-preferences')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300"
            >
              <span>View All</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (preferencesProfiles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-4">
      <div className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">My Preferences</h3>
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <FaStar className="text-xs" />
              <span>PREMIUM</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/my-preferences')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>View All</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
            {preferencesProfiles.map((profile) => (
              <div
                key={profile._id}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-blue-100 group relative"
                onClick={() => navigate(`/profile_view/${profile._id}`)}
              >
                {/* Premium Badge */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                  <FaStar className="text-xs" />
                  <span>PREMIUM</span>
                </div>

                {/* Image Section - Full Clear View */}
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                    <img
                      src={profile.image ? `${Uploads}uploads/${profile.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                      alt={profile.fullName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
                      }}
                    />
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 right-12 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-500 hover:text-white cursor-pointer">
                    <Heart className="text-xs" />
                  </div>
                  
                  {/* Match Percentage */}
                  {profile.matchPercentage && (
                    <div className="absolute bottom-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      {profile.matchPercentage}% Match
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-3 space-y-2">
                  {/* Name and Age */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-gray-800 truncate">
                      {profile.fullName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {calculateAge(profile.dateOfBirth)} years
                      </span>
                      {profile.height && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FaRulerVertical className="text-xs" />
                          <span>{profile.height} ft</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {profile.occupation && (
                      <div className="flex items-center space-x-2">
                        <FaBriefcase className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.occupation}</span>
                      </div>
                    )}
                    {profile.education && (
                      <div className="flex items-center space-x-2">
                        <FaGraduationCap className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.education}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Match Score */}
                  {profile.matchPercentage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-700 font-semibold">Compatibility</span>
                        <span className="text-green-800 font-bold">{profile.matchPercentage}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${profile.matchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced My Preferences Others Carousel Component
const MyPreferencesOthersCarousel = () => {
  const [preferencesOthersProfiles, setPreferencesOthersProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferencesOthersProfiles = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const bureauId = localStorage.getItem('bureauId') || userData.bureauId;

      if (!token || !userData.gender || !bureauId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch profiles from other bureaus (same as all-other-matches)
        const response = await apiClient2.get(
          `${apiEndpoints2.userDataonGenderexeptbureau}?gender=${userData.gender}&bureauId=${bureauId}&page=1&limit=20`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setPreferencesOthersProfiles(response.data.users || []);
        }
      } catch (error) {
        console.error('Error fetching preferences others profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferencesOthersProfiles();
  }, []);

  if (loading) {
    return (
      <div className="px-4 mb-4">
        <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">My Preferences Others</h3>
            </div>
            <button 
              onClick={() => navigate('/my-preferences-others')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300"
            >
              <span>View All</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-rose-500" />
          </div>
        </div>
      </div>
    );
  }

  if (preferencesOthersProfiles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-4">
      <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">My Preferences Others</h3>
            <span className="bg-rose-100 text-rose-600 text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          </div>
          <button 
            onClick={() => navigate('/my-preferences-others')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>View All</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
            {preferencesOthersProfiles.map((profile) => (
              <div
                key={profile._id}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 group"
                onClick={() => navigate(`/profile_view/${profile._id}`)}
              >
                {/* Image Section - Full Clear View */}
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
                    <img
                      src={profile.image ? `${Uploads}uploads/${profile.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                      alt={profile.fullName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
                      }}
                    />
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-500 hover:text-white cursor-pointer">
                    <Heart className="text-xs" />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-3 space-y-2">
                  {/* Name and Age */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-gray-800 truncate">
                      {profile.fullName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {calculateAge(profile.dateOfBirth)} years
                      </span>
                      {profile.height && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FaRulerVertical className="text-xs" />
                          <span>{profile.height} ft</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {profile.occupation && (
                      <div className="flex items-center space-x-2">
                        <FaBriefcase className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.occupation}</span>
                      </div>
                    )}
                    {profile.education && (
                      <div className="flex items-center space-x-2">
                        <FaGraduationCap className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.education}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProfileDetail component
const ProfileDetail = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4 mx-auto" />
      <p className="text-lg text-gray-700 text-center">Loading your preferences...</p>
    </div>
  </div>
);

const Mypreferences = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* Main Content */}
        <div className='mb-16'>
          {/* Profile Carousels */}
          <MyPreferencesCarousel />
          <MyPreferencesOthersCarousel />
        </div>
      </div>
      <BottomNavbar />
    </>
  );
};

export default Mypreferences;