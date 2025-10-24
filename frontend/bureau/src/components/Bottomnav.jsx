import React, { useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient, { apiEndpoints, WEB_URL, Banner } from './Apis';
import { FaHome, FaSearch, FaPlusCircle, FaIdBadge, FaUserCircle, FaUser, FaUsers,FaShareAlt,FaWhatsapp,FaFacebook } from 'react-icons/fa';
import { themeClasses } from './colors';
import { useTranslation } from "react-i18next";


const BottomNavBar = () => {
      const { t } = useTranslation();
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
          const [isFreeAccount, setIsFreeAccount] = useState(false);
            const [userName, setUserName] = useState('User Name');
          

   const [isModalOpen, setIsModalOpen] = useState(false);
     const bureauId = localStorage.getItem('bureauId');


const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);

  

  const openAddProfileModal = () => setIsAddProfileModalOpen(true);
  const closeAddProfileModal = () => setIsAddProfileModalOpen(false);

  const handleButtonClick = (buttonType) => {
  if (buttonType === 'share-website') {
    if (isFreeAccount) {
      openUpgradeModal();
    } else {
      openModal();
    }
  }
};


useEffect(() => {
  if (!bureauId) return; // early exit if bureauId is not available

  const fetchUserDetails = async () => {
    try {
      const response = await apiClient.get(
        `${apiEndpoints.bureaudetails}?bureauId=${bureauId}`
      );

      const data = response.data;


      if (data?.bureauProfiles?.length > 0) {
        const bureauData = data.bureauProfiles[0]; // ✅ first item

        // ✅ Access and store bureauName properly
        localStorage.setItem("userName", bureauData.bureauName || "Unknown");

        // (optional) if you also want it in state
        // setUserName(bureauData.bureauName);
      } else {
        console.error("No bureau profile data found.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  fetchUserDetails();
}, [bureauId]);

// You can read it here:
const bureauUserName = localStorage.getItem("userName");



  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 ${themeClasses.bgWhite} ${themeClasses.shadowMedium} z-10 pt-2 pb-3`}>
        <div className="flex justify-between items-center">
          {/* Each section gets an equal width */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 ${
                isActive ? themeClasses.textPrimary : ''
              }`
            }
          >
            <FaHome className="text-3xl" />
            <span className="text-xs">{t("home")}</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 ${
                isActive ? themeClasses.textPrimary : ''
              }`
            }
          >
            <FaSearch className="text-3xl" />
            <span className="text-xs">{t("search")}</span>
          </NavLink>

          <div
            className={`flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 cursor-pointer`}
            onClick={openAddProfileModal}
          >
            <FaPlusCircle className="text-3xl" />
            <span className="text-xs">{t("addprofile")}</span>
          </div>

          <NavLink
            to="/search-by-id" 
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 ${
                isActive ? themeClasses.textPrimary : ''
              }`
            }
          >
            <FaIdBadge className="text-3xl" />
            <span className="text-xs">{t("searchid")}</span>
          </NavLink>

              <div
                    className={`flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 cursor-pointer`}
                    onClick={() => handleButtonClick('share-website')} >
                    <FaShareAlt className="text-3xl" />
                      <span className="text-xs">{t("shareurl")}</span>
             </div>

            

          {/* <NavLink
            to="share-website"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${themeClasses.textGrayMedium} font-light w-1/5 ${
                isActive ? themeClasses.textPrimary : ''
              }`
            }
          >
            <FaShareAlt className="text-3xl" />
            <span className="text-xs">Share URL</span>
          </NavLink> */}
        </div>
      </div>

      {/* Add Profile Modal */}
      {isAddProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96 max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <FaUser className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Profile
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Choose the type of profile you want to add:
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    closeAddProfileModal();
                    window.location.href = '/add-profile';
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 transition duration-300 flex items-center justify-center"
                >
                  <FaUser className="mr-2" />
                  Add Your Own Profile
                </button>
                <button
                  onClick={() => {
                    closeAddProfileModal();
                    window.location.href = '/add-othermediator-profile';
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-md hover:from-green-700 hover:to-teal-700 transition duration-300 flex items-center justify-center"
                >
                  <FaUsers className="mr-2" />
                  Add Super Admin Profile
                </button>
              </div>
              <button
                onClick={closeAddProfileModal}
                className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>

           

          </div>
        </div>
      )}
       {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-md w-96">
      <h2 className="text-xl font-semibold mb-4">Share Website</h2>
      <div className="space-y-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${WEB_URL}/${bureauId}/${bureauUserName.replace(/\s+/g, '')}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300"
        >
          <FaWhatsapp className="mr-2" /> Share via WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${WEB_URL}/${bureauId}/${bureauUserName.replace(/\s+/g, '')}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <FaFacebook className="mr-2" /> Share on Facebook
        </a>

        <div
          className="flex items-center justify-center bg-gray-600 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300"
          onClick={() => {
            navigator.clipboard.writeText(`${WEB_URL}/${bureauId}/${bureauUserName.replace(/\s+/g, '')}`);
            alert('Link copied to clipboard!');
          }}
        >
          <FaShareAlt className="mr-2" /> Copy Link
        </div>
      </div>
      <button
        onClick={closeModal}
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
      >
        Close
      </button>
    </div>
  </div>
)}
    </>
  );
};

export default BottomNavBar;
