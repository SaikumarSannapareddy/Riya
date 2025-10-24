import React, { useState, useEffect ,useRef} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt, FaHome, FaUserAlt, FaUserShield, FaCogs, FaShareAlt, FaKey, FaGlobe, FaBell, FaCamera, FaChartBar,FaIdCard,FaFileContract,FaLock,FaEdit,FaUser,FaQrcode, FaChevronDown,FaWhatsapp,FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import apiClient, { apiEndpoints, WEB_URL, Banner } from './Apis';
import apiClient2, { apiEndpoints2 } from './Apis2';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from "react-i18next";




import { darkThemeClasses } from '../components/darkTheme';

import { themeClasses } from './colors';
import MaleProfileSlides from "./MaleProfileSlides";

const Navbar = () => {
  const navigate = useNavigate();
const { t, i18n } = useTranslation();




  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userName, setUserName] = useState("User Name");
  const [userThumbnail, setUserThumbnail] = useState("https://via.placeholder.com/50");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isBusinessQRModalOpen, setIsBusinessQRModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisitingCardModalOpen, setIsVisitingCardModalOpen] = useState(false);
    const [isFreeAccount, setIsFreeAccount] = useState(false);
    const [bureauData, setBureauData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [open, setOpen] = useState(false);
  const [openLangMenu, setOpenLangMenu] = useState(false); // Languages dropdown


    const dropdownRef = useRef(null);


   const handleLanguageChange = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("language", lang); // 👈 Save user selection permanently
  };

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to login page
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("bureauId");
    navigate("/login"); // Redirect to login page after logout
  };

  const bureauId = localStorage.getItem('bureauId');


  
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openVisitingCardModal = () => setIsVisitingCardModalOpen(true);
  const closeVisitingCardModal = () => setIsVisitingCardModalOpen(false);
  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);
  const openAddProfileModal = () => setIsAddProfileModalOpen(true);
  const closeAddProfileModal = () => setIsAddProfileModalOpen(false);
  const openBusinessQRModal = () => setIsBusinessQRModalOpen(true);
  const closeBusinessQRModal = () => setIsBusinessQRModalOpen(false);

  const handleButtonClick = (buttonType) => {
    if (isFreeAccount && (buttonType === 'share-website' || buttonType === 'share-visiting-card' || buttonType === 'share-business-qr')) {
      openUpgradeModal();
    } else {
      switch (buttonType) {
        case 'share-website':
          openModal();
          break;
        case 'share-visiting-card':
          openVisitingCardModal();
          break;
        case 'share-business-qr':
          openBusinessQRModal();
          break;
        default:
          break;
      }
    }
  };

  const handleCopyLink = () => {
    const link = `${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard');
  };

  const shareVisitingCard = async () => {
    setIsDownloading(true);
    try {
      const cardElement = document.getElementById('visiting-card-preview');
      if (cardElement) {
        // Temporarily modify the card for better capture
        const originalStyle = cardElement.style.cssText;
        cardElement.style.width = '800px';
        cardElement.style.height = '200px';
        cardElement.style.margin = '0';
        cardElement.style.padding = '16px';
        
        const canvas = await html2canvas(cardElement, {
          backgroundColor: '#ffffff',
          scale: 2, // Good quality for sharing
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: 800,
          height: 200,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800,
          windowHeight: 200
        });
        
        // Restore original styles
        cardElement.style.cssText = originalStyle;
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Create file from blob
            const file = new File([blob], `${userName.replace(/\s+/g, '_')}_visiting_card.png`, { type: 'image/png' });
            
            // Check if Web Share API is available
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  title: `${userName} - Digital Visiting Card`,
                  text: `Check out ${userName}'s digital visiting card from Matrimony Studio`,
                  files: [file],
                  url: `${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`
                });
              } catch (shareError) {
                if (shareError.name !== 'AbortError') {
                  // Fallback to download if sharing fails
                  downloadImage(canvas);
                }
              }
            } else {
              // Fallback to download for browsers that don't support file sharing
              downloadImage(canvas);
            }
          }
        }, 'image/png', 0.9);
      }
    } catch (error) {
      console.error('Error sharing visiting card:', error);
      alert('Error sharing visiting card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadImage = (canvas) => {
    const link = document.createElement('a');
    link.download = `${userName.replace(/\s+/g, '_')}_visiting_card.png`;
    link.href = canvas.toDataURL('image/png', 0.9);
    link.click();
  };



  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await apiClient2.post(`${apiEndpoints2.getNotifications}`, {
        bureauId: bureauId
      });
      if (response.data.success) {
        const pendingNotifications = response.data.data.filter(notification => 
          notification.status === 'pending'
        );
        setNotifications(pendingNotifications);
        setNotificationCount(pendingNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as seen and redirect
  const handleNotificationClick = async (notificationId) => {
    try {
      await apiClient2.post(`${apiEndpoints2.updateNotificationStatus}`, {
        interestId: notificationId,
        status: 'seen'
      });
      
      // Remove the notification from local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setNotificationCount(prev => prev - 1);
      setShowNotificationDropdown(false);
      
      // Navigate to notifications page
      navigate('/my-notifications');
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const data = response.data;
        
        if (data.bureauProfiles && data.bureauProfiles.length > 0) {
          const bureauData = data.bureauProfiles[0];
          setUserName(bureauData.bureauName);
          setUserThumbnail(bureauData.image);
        } else {
          console.error('No bureau profile data found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch profile image
    const fetchProfileImage = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.profiles, {
          headers: { bureauId },
        });
        if (response.data.profile_img) {
          setProfileImage(`data:image/jpeg;base64,${response.data.profile_img}`);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        setProfileImage(null);
      }
    };

    fetchUserDetails();
    fetchProfileImage();
    fetchNotifications();

    // Set up real-time polling for notifications (every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [bureauId]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav  className={`relative px-4 sm:px-20 py-4 flex justify-between items-center sticky fixed top-0 left-0 w-full z-50`} style={{background:'#f2f2ea'}}>
        {/* Left Side - Logo and Profile Pic */}
        <div className="flex items-center space-x-4">
          <img
            src={profileImage || "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="text-xl font-semibold text-purple-600">{userName}</div>
          {/* Removed camera icon button from desktop navbar */}
        </div>

        {/* <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-md font-semibold">
          <p style={{marginBottom:"45px",adding: "12px 24px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      color: "#333",}}>  Welcome to your dashboard</p>
      </div> */}


        {/* Right Side - Desktop Links and Logout Button */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/dashboard"
            className="text-purple-600 hover:text-purple-300 font-bold transition duration-300 cursor-pointer"
          >
            <FaHome size={20} className="inline-block mr-2" />
             {t("home")}
          </NavLink>
          <NavLink
            to="/myprofiles"
            className="text-purple-600 hover:text-purple-300 font-bold transition duration-300"
          >
            <FaUserAlt size={20} className="inline-block mr-2" />
             {t("myProfile")}
          </NavLink>
          <NavLink
            to="/bureau-privacy"
            className="text-purple-600 hover:text-purple-300 font-bold transition duration-300"
          >
            <FaUserAlt size={20} className="inline-block mr-2" />
             {t("editBureauPrivacy")}
          </NavLink>
        <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Main Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center text-purple-600 hover:text-purple-400 font-bold transition duration-300"
      >
        <FaUserShield size={20} className="mr-2" />
      {t("settings")}

        <FaChevronDown
          className={`ml-2 text-sm transform transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onMouseDown={(e) => e.stopPropagation()}>
         

            <NavLink
                to="/my-notifications"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaBell size={20} className="inline-block mr-2" />
                  {t("mynotifications")}
                {notificationCount > 0 && (
                  <span className="absolute left-8 top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </NavLink>
              <div className="relative">
            <button
              onClick={() => setOpenLangMenu((prev) => !prev)}
              className={`${themeClasses.textGrayDark} flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-purple-50 hover:text-purple-700 transition`}
            >
              <span className="flex items-center">
                <FaGlobe size={18} className="inline-block mr-2" />
              {t("languages")}

              </span>
              <FaChevronDown
                className={`ml-2 transform transition-transform duration-300 ${
                  openLangMenu ? "rotate-180" : ""
                }`}
              />
            </button>
            {openLangMenu && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-50">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-100"
                >
                {t("english")}
                </button>
                <button
                  onClick={() => handleLanguageChange("te")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-100"
                >
              {t("telugu")}
                </button>
              </div>
            )}
          </div>

                 <NavLink
                to="/membership"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaIdCard size={20} className="inline-block mr-2" />
                {t("membership")}
              </NavLink>
              {/* <NavLink
                to="/terms"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaFileContract size={20} className="inline-block mr-2" />
               {t("termsandconditions")}
              </NavLink> */}
               <NavLink
                to="/community-guidelines"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaFileContract size={20} className="inline-block mr-2" />
               {t("communityguidenlines")}
              </NavLink>
                <NavLink
                to="/edit-password"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaKey size={20} className="inline-block mr-2" />
                {t("editpassword")}
              </NavLink>
                <NavLink
                to="/bureau-privacy"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaLock size={20} className="inline-block mr-2" />
              {t("editbureauprivacy")}
              </NavLink>


              {/* <NavLink
                to="/edit-website"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaGlobe size={20} className="inline-block mr-2" />
             {t("editwebsite")}
              </NavLink> */}

              <NavLink
                to="/how-to-use"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaChartBar size={20} className="inline-block mr-2" />
               {t("howtouse")}
              </NavLink>

              {/* Profile Image Update Button - after Edit Website */}
              <NavLink
                to="/edit-profile-image"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                onClick={toggleMobileMenu}
              >
                <FaCamera size={20} className="inline-block mr-2" />
                 {t("updateprofilepic")}
              </NavLink>
<div>
               <NavLink
                        to="/edit-buttons"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition`}
                      >
                        <FaEdit size={20} className="inline-block mr-2" /> 
                          {t("editbusinesswebsite")}
                      </NavLink>
                      </div> 
              
                      {/* Share Website Button */}
                              <button
                type="button"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition flex items-center w-full text-left`}
                 onClick={() => handleButtonClick('share-website')}
                            >
                              <FaShareAlt className="mr-2" />
        {t("sharecustomerwebsite")}
                           </button>   
              
                      {/* New: Share Digital Visiting Card Button */}
                      <button
                type="button"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition flex items-center w-full text-left`}
                        onClick={() => handleButtonClick('share-visiting-card')}
                      >
                        <FaUser size={20} className="inline-block mr-2"/>
                                {t("sharedigitalvisitingcard")}
                      </button>
              
                      {/* New: Share Business Website QR Button */}
                      <button
                type="button"
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition flex items-center w-full text-left`}
                        onClick={() => handleButtonClick('share-business-qr')}
                      >
                        <FaQrcode className="inline-block mr-2" /> 
                        {t("sharebusinesswebsiteqr")}
                      </button>

                   <button
            onClick={handleLogout}
                className={`${themeClasses.textGrayDark} block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition flex`}
          >
            <FaSignOutAlt size={20} />
            <span className="text-sm ml-2"> {t("logout")}</span>
          </button>

        
        </div>
      )}
    </div>

          {/* Notification Bell */}
          {/* <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="text-gray-300 hover:text-purple-300 transition duration-300 relative"
            >
              <FaBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div className={`absolute right-0 mt-2 w-80 ${themeClasses.bgWhite} rounded-lg ${themeClasses.shadowMedium} border z-10`}>
                <div className="p-4 border-b">
                  <h3 className={`text-lg font-semibold ${themeClasses.textGrayDark}`}>Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification._id)}
                        className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <p className={`text-sm ${themeClasses.textGrayDark}`}>
                          New interest received from Bureau ID: {notification.senderbureauId}
                        </p>
                        <p className={`text-xs ${themeClasses.textGrayMedium} mt-1`}>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className={`p-4 text-center ${themeClasses.textGrayMedium}`}>
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-3 border-t">
                  <button
                    onClick={() => {
                      setShowNotificationDropdown(false);
                      navigate('/my-notifications');
                    }}
                    className={`${themeClasses.textBlue} text-sm hover:underline`}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* Logout Button */}
         
        </div>

        {/* Right Side - Mobile Icon */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Notification Bell */}
          {/* <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="text-white focus:outline-none relative"
            >
              <FaBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div> */}

          <button onClick={toggleMobileMenu} className="text-purple-600 focus:outline-none">
            {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Notification Dropdown */}
      {showNotificationDropdown && (
        <div className={`fixed top-16 right-4 w-80 ${themeClasses.bgWhite} rounded-lg ${themeClasses.shadowMedium} border z-50 md:hidden`}>
          <div className="p-4 border-b">
            <h3 className={`text-lg font-semibold ${themeClasses.textGrayDark}`}>{t("notifications")}</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification._id)}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                >
                  <p className={`text-sm ${themeClasses.textGrayDark}`}>
                    New interest received from Bureau ID: {notification.senderbureauId}
                  </p>
                  <p className={`text-xs ${themeClasses.textGrayMedium} mt-1`}>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className={`p-4 text-center ${themeClasses.textGrayMedium}`}>
                No new notifications
              </div>
            )}
          </div>
          <div className="p-3 border-t">
            <button
              onClick={() => {
                setShowNotificationDropdown(false);
                navigate('/my-notifications');
              }}
              className={`${themeClasses.textBlue} text-sm hover:underline`}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}

      {isMobileOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end">
          <div className="w-3/4 bg-gray-100 h-full shadow-lg p-6 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div>
                  <p className={`text-lg font-semibold ${themeClasses.textBlue}`}>{userName}</p>
                  <p className={`text-sm ${themeClasses.textGrayMedium}`}>ID: {bureauId}</p>
                </div>
              </div>
              <button onClick={toggleMobileMenu} className={`${themeClasses.textGrayDark} focus:outline-none`} aria-label="Close Menu">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-6">
              {/* <NavLink
                to={`/male-profiles/${bureauId}/male`}
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaUserTie size={20} className="inline-block mr-2" />
                My Male Profiles
              </NavLink> */}
              

              {/* <NavLink
                to={`/female-profiles/${bureauId}/female`}
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaUserFriends size={20} className="inline-block mr-2" />
                My Female Profiles
              </NavLink> */}

              {/* <NavLink
                to="/all-profiles"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}  >
                <FaUsers size={20} className="inline-block mr-2" />
                Other Profiles
              </NavLink> */}

              <NavLink
                to="/my-notifications"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md relative`}
                onClick={toggleMobileMenu}
              >
                <FaBell size={20} className="inline-block mr-2" />
               {t("mynotifications")}
                {notificationCount > 0 && (
                  <span className="absolute left-8 top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/membership"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md relative`}
                onClick={toggleMobileMenu}
              >
                <FaIdCard size={20} className="inline-block mr-2" />
               {t("membership")}
              </NavLink>

              {/* <NavLink
                to="/terms"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaFileContract size={20} className="inline-block mr-2" />
                    {t("termsandconditions")}
              </NavLink> */}

              <NavLink
                to="/community-guidelines"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaFileContract size={20} className="inline-block mr-2" />
            {t("communityguidenlines")}
              </NavLink>

              <NavLink
                to="/edit-password"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaKey size={20} className="inline-block mr-2" />
                        {t("editpassword")}
              </NavLink>

              <NavLink
                to="/bureau-privacy"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaLock size={20} className="inline-block mr-2" />
             {t("editbureauprivacy")}
              </NavLink>

              {/* <NavLink
                to="/edit-website"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaGlobe size={20} className="inline-block mr-2" />
                {t("editwebsite")}
              </NavLink> */}

              <NavLink
                to="/how-to-use"
                className={`${themeClasses.textGrayDark} hover:text-purple-500 transition duration-300 p-2 rounded-md`}
                onClick={toggleMobileMenu}
              >
                <FaChartBar size={20} className="inline-block mr-2" />
              {t("howtouse")}
              </NavLink>

              {/* Profile Image Update Button - after Edit Website */}
              <NavLink
                to="/edit-profile-image"
                className={`${themeClasses.textGrayDark} hover:text-blue-600 transition duration-300 p-2 rounded-md flex items-center`}
                onClick={toggleMobileMenu}
              >
                <FaCamera size={20} className="inline-block mr-2" />
                   {t("updateprofilepic")}
              </NavLink>
<div>
               <NavLink 
                        to="/edit-buttons"
                className={`${themeClasses.textGrayDark} hover:text-blue-600 transition duration-300 p-2 rounded-md flex items-center`}
                      >
                        <FaEdit size={20} className="inline-block mr-2" />{t("editbusinesswebsite")}
                      </NavLink>
                      </div> 
              
                      {/* Share Website Button */}
                     <div
                className={`${themeClasses.textGrayDark} hover:text-blue-600 transition duration-300 p-2 rounded-md flex items-center`}
                              onClick={() => handleButtonClick('share-website')}
                            >
                              <FaShareAlt className="mr-2" />  {t("sharecustomerwebsite")}
                            </div>
              
                      {/* New: Share Digital Visiting Card Button */}
                      <div
                className={`${themeClasses.textGrayDark} hover:text-blue-600 transition duration-300 p-2 rounded-md flex items-center`}
                        onClick={() => handleButtonClick('share-visiting-card')}
                      >
                        <FaUser size={20} className="inline-block mr-2"/>   {t("sharedigitalvisitingcard")}
                      </div>
              
                      {/* New: Share Business Website QR Button */}
                      <div
                className={`${themeClasses.textGrayDark} hover:text-blue-600 transition duration-300 p-2 rounded-md flex items-center`}
                        onClick={() => handleButtonClick('share-business-qr')}
                      >
                        <FaQrcode className="inline-block mr-2" />   {t("sharebusinesswebsiteqr")}
                      </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-red-500 transition duration-300"
              >
                <FaSignOutAlt size={20} />
                <span className="text-sm"> {t("logout")}</span>
              </button>
            </nav>
              {/* Visiting Card Modal */}
      

        {/* Business QR Modal */}
      
          </div>
        </div>
      )}
        {isBusinessQRModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-96 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeBusinessQRModal}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 z-10"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Business Website QR</h2>
              
              {/* QR Preview */}
              <div id="business-qr-preview" className="bg-white rounded-lg p-6 mb-4 flex flex-col border-2 border-gray-200 shadow-lg">
                {/* Main Content - Owner Image and QR Code */}
                <div className="flex items-center justify-center space-x-6">
                  {/* Owner Image */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-blue-400 shadow-md flex-shrink-0">
                    <img 
                      src={bureauData?.image ? `${Banner}${bureauData.image}` : (userThumbnail || '/default-avatar.png')} 
                      alt="Owner Image" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = userThumbnail || '/default-avatar.png';
                      }}
                    />
                  </div>
                  
                  {/* Bureau Name */}
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-gray-800 mb-2">{userName}</div>
                    <div className="text-sm text-gray-600 text-center">Marriage Bureau</div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <QRCodeSVG 
                      value={`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`} 
                      size={80}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                
                {/* Bottom - Website URL */}
                <div className="text-xs text-gray-500 text-center break-all mt-4 pt-2 border-t border-gray-200">
                  {`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`}
                </div>
              </div>
              
              {/* Share Button */}
              <button 
                onClick={shareVisitingCard}
                disabled={isDownloading}
                className={`w-full ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'} text-white py-3 rounded-lg font-semibold transition duration-300 mb-4 flex items-center justify-center shadow-lg`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Preparing...
                  </>
                ) : (
                  <>
                    <FaShareAlt className="mr-2" /> Share Business QR
                  </>
                )}
              </button>
              
              {/* Social Media Section */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-3 text-center text-gray-800">Follow My Social Media</div>
                <div className="flex justify-center gap-4">
                  <a 
                    href={bureauData?.facebook || "https://facebook.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-600 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaFacebook className="text-white text-lg" />
                  </a>
                  <a 
                    href={bureauData?.instagram || "https://instagram.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaInstagram className="text-white text-lg" />
                  </a>
                  <a 
                    href={bureauData?.twitter || "https://twitter.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-400 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaTwitter className="text-white text-lg" />
                  </a>
                  <a 
                    href={`https://wa.me/${bureauData?.whatsapp || ''}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-green-500 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaWhatsapp className="text-white text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-xl font-semibold mb-4">{t("sharewebsite")}</h2>
                <div className="space-y-4">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300"
                  >
                    <FaWhatsapp className="mr-2" /> {t("sharewhatsapp")}
                  </a>

                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center ${darkThemeClasses.bgBlue} ${darkThemeClasses.textWhite} py-3 px-6 rounded-md ${darkThemeClasses.hoverBlue} transition duration-300`}
                  >
                    <FaFacebook className="mr-2" /> {t("sharefacebook")}
                  </a>

                  <div
                    className="flex items-center justify-center bg-gray-600 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300"
                    onClick={handleCopyLink}
                  >
                    <FaShareAlt className="mr-2" /> {t("copylink")}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Close {t("close")}
                </button>
              </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-96 max-w-md">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Premium Feature
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  This feature is available for paid members only. Upgrade your plan to access all premium features including:
                </p>
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    How to Use Guide
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Share Website Feature
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Digital Visiting Cards
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced Analytics
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority Support
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited ContactDetails Showing in other Profiles
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customer App & Website Login feature
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeUpgradeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      closeUpgradeModal();
                      // Add upgrade logic here - could redirect to upgrade page or contact support
                      alert('Please contact our support team to upgrade your plan.');
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 transition duration-300"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


          {isVisitingCardModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-96 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeVisitingCardModal}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 z-10"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Digital Visiting Card</h2>
              
              {/* Card Preview */}
              <div id="visiting-card-preview" className="bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-lg p-4 mb-4 flex flex-col border-2 border-gray-200 shadow-lg h-[200px]">
                {/* Main Content - Logo, Details, and QR Code */}
                <div className="flex items-center justify-between flex-1">
                  {/* Left Side - Logo and Details */}
                  <div className="flex items-center space-x-4">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-blue-400 shadow-md flex-shrink-0">
                      <img 
                        src={bureauData?.navbarLogo ? `${Banner}${bureauData.navbarLogo}` : (userThumbnail || '/default-avatar.png')} 
                        alt="Bureau Logo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = userThumbnail || '/default-avatar.png';
                        }}
                      />
                    </div>
                    
                    {/* Bureau Info */}
                    <div className="flex flex-col">
                      <div className="text-lg font-bold text-gray-800 mb-1">{userName}</div>
                      <div className="text-xs text-gray-600 mb-1 font-medium">Marriage Bureau</div>
                      <div className="text-xs text-gray-600 mb-1">ID: {bureauId}</div>
                      {bureauData?.email && (
                        <div className="text-xs text-gray-600 mb-1">Email: {bureauData.email}</div>
                      )}
                      {bureauData?.phone && (
                        <div className="text-xs text-gray-600 mb-1">Phone: {bureauData.phone}</div>
                      )}
                      {bureauData?.location && (
                        <div className="text-xs text-gray-600">Location: {bureauData.location}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Side - QR Code */}
                  <div className="flex flex-col items-center">
                    <QRCodeSVG 
                      value={`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`} 
                      size={60}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                
                {/* Bottom - Website URL */}
                <div className="text-[10px] text-gray-500 text-center break-all mt-2 pt-2 border-t border-gray-200">
                  {`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`}
                </div>
              </div>
              
              {/* Share Button */}
            
              
              {/* Social Media Section */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-3 text-center text-gray-800">Follow My Social Media</div>
                <div className="flex justify-center gap-4">
                  <a 
                    href={bureauData?.facebook || "https://facebook.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-600 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaFacebook className="text-white text-lg" />
                  </a>
                  <a 
                    href={bureauData?.instagram || "https://instagram.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaInstagram className="text-white text-lg" />
                  </a>
                  <a 
                    href={bureauData?.twitter || "https://twitter.com"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-blue-400 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaTwitter className="text-white text-lg" />
                  </a>
                  <a 
                    href={`https://wa.me/${bureauData?.whatsapp || ''}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-green-500 rounded-full p-3 hover:scale-110 transition-transform shadow-md"
                  >
                    <FaWhatsapp className="text-white text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        
    </>
  );
};

export default Navbar;