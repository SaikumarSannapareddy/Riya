import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient2, { apiEndpoints2, Uploads2 } from '../components/Apismongo';
import { 
  FaThumbsUp, 
  FaSpinner,
  FaEdit,
  FaChevronRight,
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaRulerVertical
} from 'react-icons/fa';
import BottomNavbar from '../components/BottomNavbar';
import HomeButtons from '../components/Homebuttons';

// Enhanced Recent Profiles Carousel Component
const RecentProfilesCarousel = () => {
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProfiles = async () => {
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
          setRecentProfiles(response.data.users || []);
        }
      } catch (error) {
        console.error('Error fetching recent profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProfiles();
  }, []);

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

  if (loading) {
    return (
      <div className="px-4 mb-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">All Matches</h3>
            </div>
            <button 
              onClick={() => navigate('/all-matches')}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
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

  if (recentProfiles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-4">
      <div className="bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">All Matches</h3>
            <span className="bg-rose-100 text-rose-600 text-xs font-semibold px-2 py-1 rounded-full">
              New
            </span>
          </div>
          <button 
            onClick={() => navigate('/all-matches')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>View All</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
            {recentProfiles.map((profile) => (
              <div
                key={profile._id}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 group"
                onClick={() => navigate(`/profile_view/${profile._id}`)}
              >
                {/* Image Section */}
                <div className="relative">
                  <div className="w-full h-56 bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
                    <img
                      src={profile.image ? `${Uploads2}uploads/${profile.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                      alt={profile.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
                      }}
                    />
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-500 hover:text-white cursor-pointer">
                    <FaHeart className="text-xs" />
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

                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Premium Profiles Carousel Component
const PremiumProfilesCarousel = () => {
  const [premiumProfiles, setPremiumProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumProfiles = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const bureauId = localStorage.getItem('bureauId') || userData.bureauId;

      if (!token || !userData.gender || !bureauId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch premium matches (my preferences - same bureau with 50%+ compatibility)
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
          
          setPremiumProfiles(profilesWithMatch);
        }
      } catch (error) {
        console.error('Error fetching premium profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumProfiles();
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

  if (loading) {
    return (
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-white to-amber-50 shadow-xl rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">Premium Matches</h3>
            </div>
            <button 
              onClick={() => navigate('/my-preferences')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
            >
              <span>View All</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-3xl text-amber-500" />
          </div>
        </div>
      </div>
    );
  }

  if (premiumProfiles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-4">
      <div className="bg-gradient-to-br from-white to-amber-50 shadow-2xl rounded-2xl p-4 border border-amber-100 hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Premium Matches</h3>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <FaStar className="text-xs" />
              <span>PREMIUM</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/my-preferences')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>View All</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
            {premiumProfiles.map((profile) => (
              <div
                key={profile._id}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-white to-amber-50 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 border border-amber-100 group relative"
                onClick={() => navigate(`/profile_view/${profile._id}`)}
              >
                {/* Premium Badge */}
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                  <FaStar className="text-xs" />
                  <span>PREMIUM</span>
                </div>

                {/* Image Section */}
                <div className="relative">
                  <div className="w-full h-56 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                    <img
                      src={profile.image ? `${Uploads2}uploads/${profile.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                      alt={profile.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
                      }}
                    />
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 right-12 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-500 hover:text-white cursor-pointer">
                    <FaHeart className="text-xs" />
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
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
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
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
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

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bureauDetails, setBureauDetails] = useState(null);
  const navigate = useNavigate();

  // Function to get incomplete steps
  const getIncompleteSteps = () => {
    if (!user) return [];
    
    const steps = [
      { name: "Personal", step: user.step1, path: "/edit-personal-details" },
      { name: "Religion", step: user.step2, path: "/edit-religion-caste" },
      { name: "Education", step: user.step3, path: "/edit-education-details" },
      { name: "Family", step: user.step4, path: "/edit-family-details" },
      { name: "Property", step: user.step5, path: "/edit-property-details" },
      { name: "Agriculture", step: user.step6, path: "/edit-agriculture-flat" },
      { name: "Location", step: user.step7, path: "/edit-location-details" },
      { name: "Preferences", step: user.step8, path: "/edit-partner-preferences" }
    ];
    
    return steps.filter(step => step.step !== 1 && step.step !== '1');
  };

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
        const storedUser = localStorage.getItem('userData');
        
        // First set user from localStorage for quick UI rendering
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        }
        
        // Fetch fresh data from the /userdata API endpoint
        const response = await apiClient2.get(apiEndpoints2.userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          // Update the user data
          setUser(response.data.user);
          console.log('User data fetched:', response.data.user);
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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
 
    // Function to fetch bureau details
    const fetchBureauDetails = async () => {
      try {
        const bureauId = localStorage.getItem('bureauId') || user?.bureauId;
        console.log('Bureau ID from localStorage:', localStorage.getItem('bureauId'));
        console.log('Bureau ID from user object:', user?.bureauId);
        console.log('Final Bureau ID to use:', bureauId);
        
        if (bureauId) {
          console.log('Fetching bureau details for ID:', bureauId);
          // Use the MySQL API endpoint for bureau details
          const response = await axios.get(`https://localhost:3300/api/bureau_profiles_bureauId?bureauId=${bureauId}`);
          console.log('Bureau API response:', response.data);
          
          if (response.data.bureauProfiles && response.data.bureauProfiles.length > 0) {
            setBureauDetails(response.data.bureauProfiles[0]);
            console.log('Bureau details set:', response.data.bureauProfiles[0]);
          }
        } else {
          console.log('No bureauId found in localStorage or user object');
        }
      } catch (error) {
        console.error('Error fetching bureau details:', error);
      }
    };

    fetchUserData();
    fetchBureauDetails();
  }, [navigate]);

  // Fetch bureau details when user data is available
  useEffect(() => {
    if (user && user.bureauId) {
      const fetchBureauDetails = async () => {
        try {
          console.log('Fetching bureau details for user bureauId:', user.bureauId);
          // Use the MySQL API endpoint for bureau details
          const response = await axios.get(`https://localhost:3300/api/bureau_profiles_bureauId?bureauId=${user.bureauId}`);
          console.log('Bureau API response:', response.data);
          
          if (response.data.bureauProfiles && response.data.bureauProfiles.length > 0) {
            setBureauDetails(response.data.bureauProfiles[0]);
            console.log('Bureau details set from user bureauId:', response.data.bureauProfiles[0]);
          }
        } catch (error) {
          console.error('Error fetching bureau details:', error);
        }
      };
      
      fetchBureauDetails();
    }
  }, [user]);

  // Function to calculate profile completion based on step1-step8
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Fetch completeness from backend based on filled fields
  useEffect(() => {
    const fetchCompleteness = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const resp = await apiClient2.get(apiEndpoints2.profileCompleteness, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resp.data?.success) {
          setProfileCompletion(resp.data.percentage || 0);
        }
      } catch (e) {
        console.error('Error fetching profile completeness:', e);
      }
    };
    fetchCompleteness();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <FaSpinner className="animate-spin text-4xl text-rose-500 mb-4 mx-auto" />
          <p className="text-lg text-gray-700 text-center">Loading your matrimony profile...</p>
        </div>
      </div>
    );
  }

  const imageUrl = user?.image?.includes('http') 
    ? user.image 
    : user?.image 
      ? `${Uploads2}/uploads/${user.image}` 
      : 'https://cdn-icons-png.freepik.com/512/147/147144.png';

  return (
    <div className="bg-gradient-to-br from-gray-50 to-rose-50 min-h-screen">
      {/* Main Content */}
      <div className='mb-16'>
        {/* Enhanced Profile Card */}
        <div className="flex justify-center items-center px-4 mb-4 pt-20">
          <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md border border-gray-100 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={user?.fullName || 'User'}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold text-gray-800 truncate">Hello,</h1>
                  <h2 className="text-lg font-semibold text-rose-600 truncate">{user?.fullName || 'User'}</h2>
                </div>
              </div>
              <button 
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-2 rounded-xl text-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-1 hover:scale-105 flex-shrink-0"
                onClick={() => navigate('/my-profile')}
              >
                <FaEdit className="text-xs" />
                <span>Edit</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Profile Score based on filled fields */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-lg font-bold text-rose-600">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 relative overflow-hidden" 
                    style={{ width: `${profileCompletion}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Based on your filled details</p>
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Account Type</span>
                <span className={`px-2 py-1 rounded-full text-white text-xs font-bold ${
                  user?.paymentStatus === 'Free Profile' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                  {user?.paymentStatus || 'Free Profile'}
                </span>
              </div>

              {/* Welcome Message */}
              <div className="text-center pt-1 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Welcome to <span className="font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {bureauDetails?.bureauName || 'Heel Tech Matrimony'}
                  </span>
                </p>
                
              </div>
            </div>
          </div>
        </div>

        {/* Incomplete Step Buttons - Enhanced */}
        {getIncompleteSteps().length > 0 && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-gray-700">Complete Your Profile</h3>
              </div>
              <div className="overflow-x-auto">
                <div className="flex space-x-2 pb-1" style={{ minWidth: 'max-content' }}>
                  {getIncompleteSteps().map((step, index) => (
                    <button
                      key={`step-${index}`}
                      onClick={() => navigate(step.path)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition duration-300 whitespace-nowrap flex items-center space-x-1 hover:shadow-lg hover:scale-105 flex-shrink-0"
                    >
                      <span>📝</span>
                      <span>{step.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Completion Card - Enhanced */}
        {profileCompletion < 100 && (
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 shadow-2xl rounded-2xl p-4 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">{profileCompletion}%</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-800">Complete Your Profile</h3>
                    <p className="text-xs text-gray-600">
                      {8 - Math.round((profileCompletion / 100) * 8)} more steps to go
                    </p>
                    <p className="text-xs text-orange-600 font-medium mt-0.5">
                      Get 3x more profile views!
                    </p>
                  </div>
                </div>
                <button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 text-sm flex-shrink-0"
                  onClick={() => navigate('/my-profile')}
                >
                  Complete Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Completion Success Message - Enhanced */}
        {profileCompletion === 100 && (
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-2xl rounded-2xl p-4 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaThumbsUp className="text-white text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-gray-800">Profile Complete! 🎉</h3>
                  <p className="text-xs text-gray-600">All sections have been completed</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">
                    You're now visible to premium matches!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Carousels */}
        <PremiumProfilesCarousel />
        <RecentProfilesCarousel />
        <HomeButtons />
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Home;