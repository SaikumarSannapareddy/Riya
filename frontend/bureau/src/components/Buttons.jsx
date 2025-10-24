// ButtonComponent.jsx
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaEdit, FaShareAlt, FaChartBar, FaUsers, FaMale, FaFemale, FaHeart, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaDownload, FaQrcode,FaExclamationTriangle } from 'react-icons/fa';
import apiClient, { apiEndpoints, WEB_URL, Banner } from './Apis';
import { darkThemeClasses } from './darkTheme';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import MaleProfileSlides from './MaleProfileSlides';
import FemaleProfileSlides from '../pages/FemaleProfileSlides';
import EditProfile from '../pages/EditBureau';
import BrandScore from '../pages/BrandScore';
import OtherMaleProfileSlider from '../pages/OtherMaleProfileSlider';
import OtherFemaleProfileSlider from '../pages/OtherFemaleProfileSlides';
import MalePendingSlides from '../pages/MalePendingSlides';
import FemalePendingSlides from '../pages/FemalePendingSlides';
import ShortlistSlides from '../pages/ShortlistSlides';
import { useTranslation } from "react-i18next";


const Buttons = () => {
    const { t } = useTranslation();
  const [userName, setUserName] = useState('User Name');
  const [userThumbnail, setUserThumbnail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const bureauId = localStorage.getItem('bureauId');
  const [expiryDate, setExpiryDate] = useState(null);
  const [accountMessage, setAccountMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'info', 'warning', or 'danger'
  const [showOtherProfilesButton, setShowOtherProfilesButton] = useState(false);
  const [isVisitingCardModalOpen, setIsVisitingCardModalOpen] = useState(false);
  const [bureauData, setBureauData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isFreeAccount, setIsFreeAccount] = useState(false);
  const [profileScore, setProfileScore] = useState(0); // Remove default score
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [checkpoints, setCheckpoints] = useState({
    editWebsite: false,
    navbarLogo: false,
    sliderImages: false,
    location:false, 
    profiles:false,
    terms_and_conditions:false,
    success_stories:false,
    testimonials2:false,
    packages2:false,
    services:false
  });
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isBusinessQRModalOpen, setIsBusinessQRModalOpen] = useState(false);
  const [mongoScore, setMongoScore] = useState(0);
  const [completeProfilesCount, setCompleteProfilesCount] = useState(0);
  const [pendingMaleCount, setPendingMaleCount] = useState(0);
  const [pendingFemaleCount, setPendingFemaleCount] = useState(0);

 
  const fetchProfileCheckpoints = async () => {
    setIsLoadingScore(true);
    try {
      // Fetch checkpoints from MySQL
      const response = await apiClient.post(apiEndpoints.profileScore, {
        bureauId: bureauId
      });
      
      if (response.data.success && response.data.checkpoints) {
        const newCheckpoints = response.data.checkpoints;
        setCheckpoints(newCheckpoints);
        
        // Calculate score based on checkpoints (0-100%)
        const completedCount = Object.values(newCheckpoints).filter(Boolean).length;
        const totalCount = Object.keys(newCheckpoints).length; 
        const score = Math.round((completedCount / totalCount) * 100);
        setProfileScore(score);
      } else {
        // If no checkpoints data, set default values
        setCheckpoints({
          editWebsite: false,
          navbarLogo: false,
          sliderImages: false,
          location:false,
          profiles:false,
          terms_and_conditions:false,
          success_stories:false,
          testimonials2:false,
          packages2:false,
          services:false
        });
        setProfileScore(0);
      }

      // Fetch MongoDB score (keep existing logic)
      const mongoResponse = await fetch(apiEndpoints.mongoProfileScore, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bureauId: bureauId })
      });

      let mongoScoreValue = 0;
      if (mongoResponse.ok) {
        const mongoData = await mongoResponse.json();
        if (mongoData.success) {
          mongoScoreValue = mongoData.score;
          setMongoScore(mongoScoreValue);
          // Also set the complete profiles count
          if (mongoData.completeProfiles !== undefined) {
            setCompleteProfilesCount(mongoData.completeProfiles);
          }
        }
      }

      // Fetch pending profile counts
      await fetchPendingProfileCounts();
      
    } catch (error) {
      console.error('Error fetching profile checkpoints:', error);
      // Set default values if there's an error
      setCheckpoints({
        editWebsite: false,
        navbarLogo: false,
        sliderImages: false,
        location:false,
        profiles:false,
        terms_and_conditions:false,
        success_stories:false,
        testimonials2:false,
        packages2:false,
        services:false
      });
      setProfileScore(0);
    } finally {
      setIsLoadingScore(false);
    }
  };

  // Fetch pending profile counts
  const fetchPendingProfileCounts = async () => {
    try {
      // Fetch pending male profiles count
      const maleResponse = await fetch(`http://localhost:3300/api/bureaupendinguser/${bureauId}/male`);
      if (maleResponse.ok) {
        const maleData = await maleResponse.json();
        setPendingMaleCount(maleData.totalPending || 0);
      }

      // Fetch pending female profiles count
      const femaleResponse = await fetch(`http://localhost:3300/api/bureaupendinguser/${bureauId}/female`);
      if (femaleResponse.ok) {
        const femaleData = await femaleResponse.json();
        setPendingFemaleCount(femaleData.totalPending || 0);
      }
    } catch (error) {
      console.error('Error fetching pending profile counts:', error);
    }
  };

  useEffect(() => { 
    fetchProfileCheckpoints();
  }, [bureauId]);

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


useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get( `${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const data = response.data;

        if (data.bureauProfiles && data.bureauProfiles.length > 0) {
          const bureauInfo = data.bureauProfiles[0];
          setBureauData(bureauInfo);
          setUserName(bureauInfo.bureauName);
          // setCurrentImage(bureauInfo.welcomeImageBanner);
          // setUserThumbnail(bureauInfo.image);
          // setExpiryDate(bureauInfo.expiryDate);
          
          // Check otherbuttons setting
          const otherButtonsSetting = bureauInfo.otherbuttons || bureauInfo.otherButtons;
          setShowOtherProfilesButton(otherButtonsSetting === 'show');
          // Handle expiry check
          // const expiry = bureauInfo.expiryDate ? new Date(bureauInfo.expiryDate) : null;
          // const now = new Date();
          
          // if (!expiry) {
          //   setAccountMessage('You are in Free account');
          //   setAlertType('info');
          //   setIsFreeAccount(true);
          // } else if (expiry < now) {
          //   setAccountMessage('Account expired - turned to free account. Please upgrade your plan.');
          //   setAlertType('danger');
          //   setIsFreeAccount(true);
          // } else {
          //   const oneMonthFromNow = new Date();
          //   oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        
            // if (expiry <= oneMonthFromNow) {
            //   setAccountMessage(Your plan will expire soon. Please renew to avoid losing access. Valid until: ${expiry.toLocaleDateString()});
            //   setAlertType('warning');
            //    setIsFreeAccount(false);
            // } else {
            //   // Active paid member
            //   setAccountMessage(Paid Member - Valid until: ${expiry.toLocaleDateString()});
            //   setAlertType('success');
            //   setIsFreeAccount(false);
            // }
          // }
        }
        
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [bureauId]);

 


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

  // const handleCopyLink = () => {
  //   const link = `${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`;
  //   navigator.clipboard.writeText(link);
  //   alert('Link copied to clipboard');
  // };

  // const shareVisitingCard = async () => {
  //   setIsDownloading(true);
  //   try {
  //     const cardElement = document.getElementById('visiting-card-preview');
  //     if (cardElement) {
  //       // Temporarily modify the card for better capture
  //       const originalStyle = cardElement.style.cssText;
  //       cardElement.style.width = '800px';
  //       cardElement.style.height = '200px';
  //       cardElement.style.margin = '0';
  //       cardElement.style.padding = '16px';
        
  //       const canvas = await html2canvas(cardElement, {
  //         backgroundColor: '#ffffff',
  //         scale: 2, // Good quality for sharing
  //         useCORS: true,
  //         allowTaint: true,
  //         logging: false,
  //         width: 800,
  //         height: 200,
  //         scrollX: 0,
  //         scrollY: 0,
  //         windowWidth: 800,
  //         windowHeight: 200
  //       });
        
  //       // Restore original styles
  //       cardElement.style.cssText = originalStyle;
        
  //       // Convert canvas to blob
  //       canvas.toBlob(async (blob) => {
  //         if (blob) {
  //           // Create file from blob
  //           const file = new File([blob], `${userName.replace(/\s+/g, '_')}_visiting_card.png`, { type: 'image/png' });
            
  //           // Check if Web Share API is available
  //           if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
  //             try {
  //               await navigator.share({
  //                 title: `${userName} - Digital Visiting Card`,
  //                 text: `Check out ${userName}'s digital visiting card from Matrimony Studio`,
  //                 files: [file],
  //                 url: `${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`
  //               });
  //             } catch (shareError) {
  //               if (shareError.name !== 'AbortError') {
  //                 // Fallback to download if sharing fails
  //                 downloadImage(canvas);
  //               }
  //             }
  //           } else {
  //             // Fallback to download for browsers that don't support file sharing
  //             downloadImage(canvas);
  //           }
  //         }
  //       }, 'image/png', 0.9);
  //     }
  //   } catch (error) {
  //     console.error('Error sharing visiting card:', error);
  //     alert('Error sharing visiting card. Please try again.');
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  // const downloadImage = (canvas) => {
  //   const link = document.createElement('a');
  //   link.download = `${userName.replace(/\s+/g, '_')}_visiting_card.png`;
  //   link.href = canvas.toDataURL('image/png', 0.9);
  //   link.click();
  // };

  return (
    <>
      <div className="min-h-screen bg-gray-50 mb-10">
    <div className="max-w-4xl mx-auto space-y-4 pb-2 overflow-y-auto shadow-lg rounded-lg bg-white ">
          <div className="max-w-4xl mx-auto  pb-8 overflow-y-auto">

         <div className='bg-gray-100 p-4 rounded-lg max-w-5xl mx-auto mt-1'>
  {!isLoadingScore && checkpoints ? (
    // Check if any checkpoint is missing
    !(checkpoints.editWebsite &&
      checkpoints.navbarLogo &&
      checkpoints.sliderImages &&
      checkpoints.location &&
      checkpoints.profiles &&
      checkpoints.terms_and_conditions &&
      checkpoints.success_stories &&
      checkpoints.testimonials2 &&
      checkpoints.packages2 &&
      checkpoints.services) ? (
      // If any checkpoint missing -> show edit button
      <div className="flex flex-col items-center">
        <div className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-center rounded-md transition duration-300 flex items-center justify-center cursor-pointer mb-2">
          <FaExclamationTriangle className="mr-2" />
          {t("businessaccountpending")}
        </div>
        <EditProfile />
      </div>
    ) : (
      // If all checkpoints exist -> profile active
      <div className="text-green-600 font-semibold text-center">
        ✅ {t("profileStatus")}: {t("active")}
      </div>
    )
  ) : null}
      </div>


        {/* {accountMessage && (
          <div
            className={`p-3 rounded-md text-white text-center font-medium ${
              alertType === 'success'
                ? 'bg-green-600'
                : alertType === 'warning'
                ? 'bg-yellow-600'
                : alertType === 'danger'
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}
          >
            {accountMessage}
          </div>
        )} */} 

        {/* Profile Score Card */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white shadow-lg'>
          <BrandScore/>
          {/* <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Your Brand Value Score</h3>
            {isLoadingScore ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <div className="text-2xl font-bold">{mongoScore}%</div>
            )}
          </div> */}
          
          {/* <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${mongoScore}%` }}
            ></div>
          </div> */}
          
          {/* Complete Profiles Count */}
          {/* {!isLoadingScore && (
            <div className="text-center mb-3">
              <div className="text-blue-200 text-sm">
                <strong>Complete Profiles:</strong> {completeProfilesCount} profiles crossed 80% data completeness
              </div>
              </div>
          )} */}
          
          {/* Profile Status */}
          {!isLoadingScore && (
            <div className="mb-3">
              {checkpoints.editWebsite && checkpoints.navbarLogo && checkpoints.sliderImages && checkpoints.location && checkpoints.profiles && checkpoints.terms_and_conditions && checkpoints.success_stories && 
              checkpoints.testimonials2 && checkpoints.packages2 && checkpoints.services ? (
                <div>
                  {/* <div className="text-green-200 text-center font-semibold">
                  ✅ {t("profileStatus")}: {t("active")}
              </div>
               <div className="text-orange-200">
                <strong>Good start!</strong> Keep improving your profile to get better results.
              </div> */}
                </div>
              ) : (
              <div>
                  {/* <div className="text-red-200 text-center font-semibold">
                  ❌  {t("profileStatus")}: {t("inactive")}
                </div>
                <div className="text-yellow-200">
                <strong>{t("businessprofileincomplete")}</strong><br />
                {t("businessprofileincompletemessage")}
              </div> */}
                </div>
                
              )}
            </div>
          )}
          
          {/* <div className="text-sm">
            {mongoScore === 0 ? (
              <div className="text-yellow-200">
                <strong>Your business profile is incomplete!</strong><br />
                Please complete your profile to get better response for your business.
              </div>
            ) : mongoScore < 50 ? (
              <div className="text-orange-200">
                <strong>Good start!</strong> Keep improving your profile to get better results.
              </div>
            ) : mongoScore < 80 ? (
              <div className="text-green-200">
                <strong>Great progress!</strong> Your profile is performing well.
              </div>
            ) : (
              <div className="text-green-100">
                <strong>Excellent!</strong> Your profile is fully optimized for maximum results.
              </div>
            )}
          </div> */}
        </div>

        {/* Complete Business Profile Button - Show only when profile is incomplete */}
        {/* {!isLoadingScore && checkpoints && !(checkpoints.editWebsite && checkpoints.navbarLogo && checkpoints.sliderImages) && (
          <div className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-center rounded-md transition duration-300 flex items-center justify-center cursor-pointer"
               onClick={() => window.location.href = '/edit-buttons'}>
            <FaEdit className="mr-2" /> Business Profile Account is Pending - Complete Your Business Profile
          </div>
        )} */}

        {/* Add Profile Button */}
        {/* <div
          className={`w-full ${darkThemeClasses.bgPrimary} ${darkThemeClasses.textWhite} py-3 text-center rounded-md ${darkThemeClasses.hoverPrimary} transition duration-300 flex items-center justify-center cursor-pointer`}
          onClick={openAddProfileModal}
        >
          <FaUser className="mr-2" /> Add Profile
        </div> */}
        
        {/* Row 1: My Profiles */}
        {/* <div className="flex space-x-4 relative">
          <NavLink
            to={`/male-profiles/${bureauId}/male`}
            className={`${showOtherProfilesButton ? 'w-1/2' : 'w-full'} ${darkThemeClasses.bgPrimaryDark} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-purple-800 transition duration-300 flex items-center justify-center`}
          >
            <FaUsers className="mr-2" /> My Male Profiles
          </NavLink>
          <NavLink
            to={`/female-profiles/${bureauId}/female`}
            className={`${showOtherProfilesButton ? 'w-1/2' : 'w-full'} ${darkThemeClasses.bgPrimaryDark} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-purple-800 transition duration-300 flex items-center justify-center`}
          >
            <FaUsers className="mr-2" /> My Female Profiles
          </NavLink>
        </div> */}

        <div style={{borderBottom:"1px solid lightgrey"}}>
           <MaleProfileSlides/>
        </div>
        {/* <div style={{border:"0.5px solid lightgrey"}}></div> */}

        <div style={{borderBottom:"1px solid lightgrey"}}>
          <FemaleProfileSlides/>
        </div>

         {/* <NavLink
            to={`/female-profiles/${bureauId}/female`}
            className={`${showOtherProfilesButton ? 'w-1/2' : 'w-full'} ${darkThemeClasses.bgPrimaryDark} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-purple-800 transition duration-300 flex items-center justify-center`}
          >
            <FaUsers className="mr-2" /> My Female Profiles
          </NavLink> */}
        <div style={{borderBottom:"1px solid lightgrey"}}>
          <MalePendingSlides/>
        </div>
         <div style={{borderBottom:"1px solid lightgrey"}}>
          <FemalePendingSlides/>
        </div>


        {showOtherProfilesButton && (
  <div
    style={{ borderBottom: "1px solid lightgrey" }}
  >
          <OtherMaleProfileSlider/>
  </div>
)}



        {showOtherProfilesButton && (
  <div
    style={{ borderBottom: "1px solid lightgrey" }}
  >
    <OtherFemaleProfileSlider />
  </div>
)}

        
       


        <div >
          <ShortlistSlides/>
        </div>

        {/* Row 2: Pending Profiles */}
        {/* <div className="flex space-x-4 relative">
          <NavLink
            to={`/pending-male-profiles/${bureauId}/male`}
            className={`w-1/2 ${darkThemeClasses.bgBlue} ${darkThemeClasses.textWhite} py-3 px-4 text-center rounded-lg ${darkThemeClasses.hoverBlue} transition duration-300 flex items-center justify-center gap-2 ${darkThemeClasses.shadowMedium}`}
          >
            <FaMale className="text-lg" /> Pending <br />Male Profiles ({pendingMaleCount})
          </NavLink>

          <NavLink
            to={`/pending-female-profiles/${bureauId}/female`}
            className={`w-1/2 ${darkThemeClasses.bgBlueDark} ${darkThemeClasses.textWhite} py-3 px-4 text-center rounded-lg hover:bg-blue-800 transition duration-300 flex items-center justify-center gap-2 ${darkThemeClasses.shadowMedium}`}
          >
            <FaFemale className="text-lg" /> Pending <br />Female Profiles ({pendingFemaleCount})
          </NavLink>
        </div> */}

        {/* Row 3: Shortlist Profiles */}
        {/* <div className="flex space-x-4">
          <NavLink
            to="/shortlist-profiles"
            className={`w-full ${darkThemeClasses.bgPrimaryDarker} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-purple-900 transition duration-300 flex items-center justify-center`}
          >
            <FaUser className="mr-2" /> Shortlist Profiles
          </NavLink>
        </div> */}

        {/* Row 4: Interests Management */}
        {/* <div className="flex space-x-4">
          <NavLink
            to="/interests-management"
            className={`w-full ${darkThemeClasses.bgPrimary} ${darkThemeClasses.textWhite} py-3 text-center rounded-md ${darkThemeClasses.hoverPrimary} transition duration-300 flex items-center justify-center`}
          >
            <FaHeart className="mr-2" /> Other Bureau Interests History
          </NavLink>
        </div> */}

        {/* Row 5: My Interests Management */}
        {/* <div className="flex space-x-4">
          <NavLink
            to="/my-interests-management"
            className={`w-full ${darkThemeClasses.bgBlueDarker} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-blue-900 transition duration-300 flex items-center justify-center`}
          >
            <FaHeart className="mr-2" /> Only My Profiles Interests History
          </NavLink>
        </div> */}

        {/* Edit Your Business Website Button */}
        {/* <div className="relative">
          {!isLoadingScore && checkpoints && (
            <div className="mb-2 space-y-1">
              {!checkpoints.editWebsite && (
                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-200">
                  ⚠️ Pending: Complete business profile details
                </div>
              )}
              {!checkpoints.navbarLogo && (
                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-200">
                  ⚠️ Pending: Upload navbar logo
                </div>
              )}
              {!checkpoints.sliderImages && (
                <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded border border-red-200">
                  ⚠️ Pending: Add slider images
                </div>
              )}
            </div>
          )}
          
        <NavLink
          to="/edit-buttons"
          className={`w-full ${darkThemeClasses.bgPrimaryDark} ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-purple-800 transition duration-300 flex items-center justify-center`}
        >
          <FaEdit className="mr-2" /> Edit Your Business Website
        </NavLink>
        </div>  */}

        {/* Share Website Button */}
        {/* <div
          className={`w-full bg-blue-900 ${darkThemeClasses.textWhite} py-3 text-center rounded-md hover:bg-blue-950 transition duration-300 flex items-center justify-center cursor-pointer`}
          onClick={() => handleButtonClick('share-website')}
        >
          <FaShareAlt className="mr-2" /> Share Your Customer Website
        </div> */}

        {/* New: Share Digital Visiting Card Button */}
        {/* <div
          className="w-full bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 text-white py-3 text-center rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center cursor-pointer mt-2"
          onClick={() => handleButtonClick('share-visiting-card')}
        >
          <FaUser className="mr-2" /> Share Digital Visiting Card
        </div> */}

        {/* New: Share Business Website QR Button */}
        {/* <div
          className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white py-3 text-center rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center cursor-pointer mt-2"
          onClick={() => handleButtonClick('share-business-qr')}
        >
          <FaQrcode className="mr-2" /> Share Business Website QR
        </div> */}

        {/* Visiting Card Modal */}
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
              <button 
                onClick={shareVisitingCard}
                disabled={isDownloading}
                className={`w-full ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'} text-white py-3 rounded-lg font-semibold transition duration-300 mb-4 flex items-center justify-center shadow-lg`}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Preparing...
                  </>
                ) : (
                  <>
                    <FaShareAlt className="mr-2" /> Share Digital Visiting Card
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

        {/* Business QR Modal */}
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
              <h2 className="text-xl font-semibold mb-4">Share Website</h2>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${WEB_URL}/${bureauId}/${bureauUserName.replace(/\s+/g, '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300"
                >
                  <FaWhatsapp className="mr-2" /> Share via WhatsA
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${WEB_URL}/${bureauId}/${userName.replace(/\s+/g, '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center ${darkThemeClasses.bgBlue} ${darkThemeClasses.textWhite} py-3 px-6 rounded-md ${darkThemeClasses.hoverBlue} transition duration-300`}
                >
                  <FaFacebook className="mr-2" /> Share on Facebook
                </a>

                <div
                  className="flex items-center justify-center bg-gray-600 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-gray-700 transition duration-300"
                  onClick={handleCopyLink}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Buttons;