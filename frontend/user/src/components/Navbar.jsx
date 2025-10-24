import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient2, { apiEndpoints2, Uploads2 } from '../components/Apismongo';
import {
  FaHome, FaSearch, FaPlusCircle, FaIdBadge, FaUser , FaBars, FaTimes,
  FaUsers, FaFileAlt, FaKey, FaBell, FaHeart, FaMapMarkerAlt, FaStar,
  FaGlobe, FaCrown, FaGift,
  FaUserTie, FaWifi, FaList, FaHistory, FaUserCheck, FaHandshake
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to calculate profile completion based on step1-step8
  const getProfileCompletion = () => {
    if (!user) return 0;
    
    // Get all step values (step1 through step8)
    const steps = [
      user.step1,
      user.step2,
      user.step3,
      user.step4,
      user.step5,
      user.step6,
      user.step7,
      user.step8
    ];
    
    // Count completed steps (value = 1 means completed, anything else means incomplete)
    const completedSteps = steps.filter(step => step === 1 || step === '1').length;
    
    // Calculate percentage (8 total steps)
    const percentage = Math.round((completedSteps / 8) * 100);
    
    return percentage;
  };

  // Function to get incomplete steps
  const getIncompleteSteps = () => {
    if (!user) return [];
    
    const steps = [
      { name: "Step1", step: user.step1, path: "/edit-personal-details" },
      { name: "Step2", step: user.step2, path: "/edit-religion-caste" },
      { name: "Step3", step: user.step3, path: "/edit-education-details" },
      { name: "Step4", step: user.step4, path: "/edit-family-details" },
      { name: "Step5", step: user.step5, path: "/edit-property-details" },
      { name: "Step6", step: user.step6, path: "/edit-agriculture-flat" },
      { name: "Step7", step: user.step7, path: "/edit-location-details" },
      { name: "Step8", step: user.step8, path: "/edit-partner-preferences" }
    ];
    
    return steps.filter(step => step.step !== 1 && step.step !== '1');
  };

  const notifications = [
    "Your profile has been viewed.",
    "New match found!",
    "Membership plan expiring soon.",
    "You have 3 new messages.",
  ];
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

    fetchUserData();
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Get profile image URL
  const imageUrl = user?.image?.includes('http')
    ? user.image
    : user?.image
      ? `${Uploads2}/uploads/${user.image}`
      : 'https://cdn-icons-png.freepik.com/512/147/147144.png';

  return (
    <div className="mb-16">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-white text-gray-800 shadow-md z-40">
        {/* Profile Card in Navbar */}
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 shadow mr-3 object-cover"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-base truncate">{user?.fullName || 'User'}</span>
            <span className="text-xs text-gray-500 truncate">ID: {user?.martialId || 'Not set'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
              <FaBell className="text-xl sm:text-2xl text-gray-700" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-2 font-bold border-b">Notifications</div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((note, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 text-sm">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Menu Button */}
          <button onClick={() => setMenuOpen(true)}>
            <FaBars className="text-xl sm:text-2xl text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Horizontal Scrollable Button Bar */}
      <div className="fixed top-16 left-0 right-0 bg-white shadow-sm z-30">
        <div className="overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-3 p-2 sm:p-3" style={{ minWidth: 'max-content' }}>
            {/* Match Categories */}
            {[
              { text: "Home", icon: <FaHome className="text-sm sm:text-lg" />, path: "/home" },
              { text: "All Matches", icon: <FaUsers className="text-sm sm:text-lg" />, path: "/all-matches" },
              { text: "My Preference Matches", icon: <FaHeart className="text-sm sm:text-lg" />, path: "/my-preferences" },
              { text: "Nearby Matches", icon: <FaMapMarkerAlt className="text-sm sm:text-lg" />, path: "/nearby-matches" },
              { text: "New Matches", icon: <FaStar className="text-sm sm:text-lg" />, path: "/new-matches" },
              { text: "NRI Matches", icon: <FaGlobe className="text-sm sm:text-lg" />, path: "/nri-matches" },
              { text: "Paid Matches", icon: <FaCrown className="text-sm sm:text-lg" />, path: "/paid-matches" },
              { text: "Free Matches", icon: <FaGift className="text-sm sm:text-lg" />, path: "/free-matches" },
              // Merged additional quick actions
              { text: "Upper Middle Class", icon: <FaUserTie className="text-sm sm:text-lg" />, path: "/upper-middle-class" },
              { text: "IAS/IPS Profiles", icon: <FaUserTie className="text-sm sm:text-lg" />, path: "/ias-ips" },
              { text: "Online Services", icon: <FaWifi className="text-sm sm:text-lg" />, path: "/online-services" },
              { text: "My Shortlisted", icon: <FaList className="text-sm sm:text-lg" />, path: "/shortlist" },
              { text: "Who Shortlisted Me", icon: <FaUserCheck className="text-sm sm:text-lg" />, path: "/shortlisted-by-others" },
              { text: "Interest Matches", icon: <FaHandshake className="text-sm sm:text-lg" />, path: "/interest-matches" },
              { text: "Chat History", icon: <FaHistory className="text-sm sm:text-lg" />, path: "/chat-history" },
            ].map((button, index) => {
              const isActive = location.pathname === button.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(button.path)}
                  className={`px-3 sm:px-4 py-2 rounded-lg shadow-md transition duration-300 whitespace-nowrap flex items-center space-x-1 sm:space-x-2 border ${
                    isActive 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-black border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {button.icon}
                  <span className="text-xs sm:text-sm font-medium">{button.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <img
              src={imageUrl}
              alt="Profile"
              className="rounded-full w-10 h-10 mr-3 object-cover border-2 border-gray-200 shadow"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.freepik.com/512/147/147144.png";
              }}
            />
            <div>
              <h2 className="font-bold text-base">{user?.fullName || 'User'}</h2>
              <p className="text-sm text-gray-500">ID: {user?.martialId || 'Not set'}</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="p-4 space-y-3">
          {[
            ["Edit Profile", <FaUser  />],
            ["Edit Partner Preference", <FaUsers />],
            ["View Membership Plans", <FaFileAlt />],
            ["View Membership Validity", <FaFileAlt />],
            ["Profile Privacy", <FaKey />],
            ["Search by ID", <FaIdBadge />],
            ["Search by Basic Preference", <FaSearch />],
            ["Search by Full Preference", <FaSearch />],
            ["Download Your Biodata", <FaFileAlt />],
            ["Logout", <FaTimes />, "text-red-500", handleLogout]
          ].map(([label, icon, color = "text-gray-700", action]) => (
            <li
              key={label}
              onClick={action}
              className={`flex items-center space-x-3 ${color} text-sm font-semibold hover:bg-gray-100 p-2 rounded-md cursor-pointer`}
            >
              {icon}
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
