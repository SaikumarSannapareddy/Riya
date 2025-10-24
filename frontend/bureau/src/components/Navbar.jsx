import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaStar, FaExternalLinkAlt, FaQuoteLeft, FaLink, FaChevronLeft, FaChevronRight, FaSearch, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaDownload, FaBuilding, FaUsers, FaStar as FaStarIcon, FaBox, FaInfoCircle, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import apiClient, { apiEndpoints, Banner } from './Apis'; 
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { NavLink } from "react-router-dom";
import { themeClasses } from './colors';
import Sucess from './Gallery';

import { Autoplay, Pagination, Navigation } from "swiper/modules";

const Navbar = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [userId, setUserId] = useState(id);
  const [bureauName, setBureauName] = useState("");
  const [welcomeImageBanner, setWelcomeImageBanner] = useState(""); 
  const [bannerImages, setBannerImages] = useState([]); 
  const [email, setEmail] = useState(""); // New state variable for email
  const [mobile, setMobile] = useState("");
  const [about, setAbout] = useState(""); 
  const [navbarLogo, setNavbarLogo] = useState("");
  // Add state for location
  const [location, setLocation] = useState("");
  const bureauId = localStorage.getItem('bureauId');

  
  // New state for testimonials and customized links
  const [testimonials, setTestimonials] = useState([]);
  const [customizedLinks, setCustomizedLinks] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // New state for testimonials modal
  const [showTestimonialsModal, setShowTestimonialsModal] = useState(false);

  // Add social media state variables
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Add state for services
  const [services, setServices] = useState([]);

  // Add state for locations
  const [locations, setLocations] = useState([]);

  const [successStories, setSuccessStories] = useState([]);
  const [currentSuccess, setCurrentSuccess] = useState(0);
  const successIntervalRef = React.useRef(null);

  // Add state for locations modal
  const [showLocationsModal, setShowLocationsModal] = useState(false);

  // Scroll functions for navigation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => scrollToSection('about-section');
  const scrollToContact = () => scrollToSection('contact-section');
  const scrollToServices = () => scrollToSection('services-section');
  const scrollToFollowUs = () => scrollToSection('follow-us-section');
  const scrollToReviews = () => scrollToSection('reviews-section');
  const scrollToPackages = () => scrollToSection('packages-section');

  // External link functions
  const openCreateBureau = () => {
    window.open('https://riyatechpark.com/create-bureau', '_blank', 'noopener,noreferrer');
  };

  const openDownloadApp = () => {
    alert('Coming Soon!');
  };

  const fetchBureauDetails = async () => {
    try {
      if (userId) {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${userId}`);
        const data = response.data.bureauProfiles;

        console.log('Fetched Bureau Details:', data);

        if (data && data.length > 0) {
          const bureauData = data[0]; // Define bureauData for consistency
          setBureauName(bureauData.bureauName); 
          setWelcomeImageBanner(bureauData.welcomeImageBanner); 
          setEmail(bureauData.email); // Set email
          setMobile(bureauData.mobileNumber); // Set mobile number
          setAbout(bureauData.about); // Set about
          setNavbarLogo(bureauData.navbarLogo); // fetch logo 
          setFacebookUrl(bureauData.facebook || "");
          setTwitterUrl(bureauData.twitter || "");
          setInstagramUrl(bureauData.instagram || "");
          setLinkedinUrl(bureauData.linkedin || "");
          setYoutubeUrl(bureauData.youtube || "");
          setLocation(bureauData.location || ""); // Set location
        }
        
      } else {
        console.error('No Bureau ID found');
      }
    } catch (error) {
      console.error('Error fetching bureau details:', error);
    }
  };

  // Fetch testimonials
  const fetchTestimonials = async () => {
    if (!userId) return;
    
    setLoadingTestimonials(true);
    try {
      const response = await apiClient.post(`${apiEndpoints.testimonialsFetchPublic}`, {
        bureau_id: userId
      });
      if (response.data.success) {
        setTestimonials(response.data.testimonials || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  // Fetch customized links
  const fetchCustomizedLinks = async () => {
    if (!userId) return;
    
    setLoadingLinks(true);
    try {
      const response = await apiClient.post(`${apiEndpoints.customizedLinksFetchPublic}`, {
        bureau_id: userId
      });
      if (response.data.success) {
        setCustomizedLinks(response.data.links || []);
      }
    } catch (error) {
      console.error('Error fetching customized links:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  // Fetch packages
  const fetchPackages = async () => {
    if (!userId) return;
    
    setLoadingPackages(true);
    try {
      console.log('Fetching packages for bureau ID:', userId);
      console.log('API endpoint:', `${apiEndpoints.packagesFetchPublic}/${userId}`);
      
      // Use GET request with bureau ID in URL path
      const response = await apiClient.get(`${apiEndpoints.packagesFetchPublic}/${userId}`);
      console.log('Packages API response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let packagesData = [];
      if (response.data) {
        if (response.data.success && response.data.data) {
          // Backend returns { success: true, data: [...] }
          packagesData = response.data.data;
          console.log('Using success.data structure');
        } else if (Array.isArray(response.data)) {
          // Direct array response
          packagesData = response.data;
          console.log('Using direct array structure');
        } else if (response.data.data) {
          // Nested data structure
          packagesData = response.data.data;
          console.log('Using nested data structure');
        } else {
          // Fallback to direct response
          packagesData = response.data;
          console.log('Using fallback structure');
        }
      }
      
      console.log('Final packages data:', packagesData);
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      console.error('Error details:', error.response?.data);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  // Open link in new tab
  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate('/login');
    } else {
      setUserId(id); 
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.BureauGetsliderimages}/${bureauId}`);
        console.log(response.data);
  
        // Check if the response contains the expected data structure
        if (response.data && response.data.data) {
          setBannerImages(response.data.data); // Assuming response.data.data contains the images array
        } else {
          setBannerImages([]); // Set to empty array if no data or unexpected structure
        }
      } catch (error) {
        console.error("Error fetching banner images:", error);
        setBannerImages([]); // Set to empty array on error
      }
    };
  
    if (userId) {
      fetchBannerImages(); // Only call if bureauId is present
    }
  }, [userId]); // Dependency on bureauId to trigger effect when it changes
  

  useEffect(() => {
    fetchBureauDetails();
  }, [userId]);

  // Fetch testimonials and links when userId is available
  useEffect(() => {
    if (userId) {
      fetchTestimonials();
      fetchCustomizedLinks();
      fetchPackages();
    }
  }, [userId]);

  // In fetchBureauDetails or a new useEffect, fetch services for this bureau
  useEffect(() => {
    const fetchServices = async () => {
      if (!userId) return;
      try {
        const response = await apiClient.get(`${apiEndpoints.services}/${userId}`);
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setServices([]);
      }
    };
    fetchServices();
  }, [userId]);

  // Fetch locations for this bureau
  useEffect(() => {
    const fetchLocations = async () => {
      if (!userId) return;
      try {
        const response = await apiClient.get(apiEndpoints.location);
        // Filter locations for this bureau
        const filtered = (Array.isArray(response.data) ? response.data : []).filter(
          (loc) => String(loc.bureau_id) === String(userId)
        );
        setLocations(filtered);
      } catch (error) {
        setLocations([]);
      }
    };
    fetchLocations();
  }, [userId]);

  // Fetch success stories images (gallery)
  const fetchSuccessStories = async () => {
    try {
      // You may need to adjust the endpoint as per your backend
      const response = await apiClient.get('/success-stories');
      if (Array.isArray(response.data)) {
        setSuccessStories(response.data);
      } else if (Array.isArray(response.data.data)) {
        setSuccessStories(response.data.data);
      } else {
        setSuccessStories([]);
      }
    } catch (error) {
      setSuccessStories([]);
    }
  };

  useEffect(() => {
    fetchSuccessStories();
  }, [userId]);

  // Auto-advance carousel
  useEffect(() => {
    if (successStories.length > 1) {
      if (successIntervalRef.current) clearInterval(successIntervalRef.current);
      successIntervalRef.current = setInterval(() => {
        setCurrentSuccess((prev) => (prev + 1) % successStories.length);
      }, 4000);
      return () => clearInterval(successIntervalRef.current);
    }
  }, [successStories]);

  const goToPrevSuccess = () => {
    setCurrentSuccess((prev) => (prev === 0 ? successStories.length - 1 : prev - 1));
  };
  const goToNextSuccess = () => {
    setCurrentSuccess((prev) => (prev === successStories.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
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

  return (
    <>

<nav className={`bg-white ${themeClasses.shadowMedium} px-10 sm:px-20 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50`}>
        {/* Logo - Centered on mobile, left on desktop */}
        <div className="flex-1 flex md:justify-start justify-center items-center space-x-3">
          {navbarLogo ? (
            <img src={Banner + navbarLogo} alt="Logo" className="h-16 w-auto object-contain bg-white rounded shadow" />
          ) : null}
        </div>

        {/* Right Side - Desktop Links */}
        <div className="hidden md:flex space-x-4 items-center">
          {/* Create Matrimony Business App */}
       

          {/* Download App */}
          <button
            onClick={openDownloadApp}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaDownload className="text-sm" />
            Download App
          </button>

          {/* About Us */}
          <button
            onClick={scrollToAbout}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaInfoCircle className="text-sm" />
            About Us
          </button>

          {/* Contact Us */}
          <button
            onClick={scrollToContact}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaPhone className="text-sm" />
            Contact Us
          </button>

          {/* Services */}
          <button
            onClick={scrollToServices}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaBox className="text-sm" />
            Services
          </button>

          {/* Follow Us */}
          <button
            onClick={scrollToFollowUs}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaUsers className="text-sm" />
            Follow Us
          </button>

          {/* Reviews */}
          <button
            onClick={scrollToReviews}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaStarIcon className="text-sm" />
            Reviews
          </button>

          {/* Packages */}
          <button
            onClick={scrollToPackages}
            className="flex items-center gap-2 text-gray-300 hover:text-purple-300 font-bold text-sm"
          >
            <FaBox className="text-sm" />
            Packages
          </button>
         
          <div className="relative inline-block text-left dropdown-container">
            <button
              className="text-gray-300 hover:text-purple-300 font-bold"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Login
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-40 rounded-md ${themeClasses.shadowMedium} ${themeClasses.bgWhite} ring-1 ring-black ring-opacity-5`}>
                <NavLink
                  to="/login"
                  className={`block px-4 py-2 ${themeClasses.textGrayMedium} hover:${themeClasses.bgPrimary} hover:${themeClasses.textWhite} font-bold`}
                  activeClassName={`${themeClasses.textPrimary} font-semibold`}
                  onClick={() => setDropdownOpen(false)}
                >
                  Buero Login
                </NavLink>
                <NavLink
                  to="/user-login"
                  className={`block px-4 py-2 ${themeClasses.textGrayMedium} hover:${themeClasses.bgPrimary} hover:${themeClasses.textWhite} font-bold`}
                  activeClassName={`${themeClasses.textPrimary} font-semibold`}
                  onClick={() => setDropdownOpen(false)}
                >
                  User Login
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/register"
            className={`text-gray-300 hover:text-purple-300 font-bold`}
            activeClassName={`${themeClasses.textPrimary} font-semibold`}
          >
            User Register
          </NavLink>
        </div>

        {/* Right Side - Mobile Icon */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`${themeClasses.textGrayDark} focus:outline-none`}
          >
            {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
            <div className={`w-64 ${themeClasses.bgWhite} h-full ${themeClasses.shadowMedium} p-6`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-xl font-semibold ${themeClasses.textPrimary}`}>
                  {bureauName || "Loading..."}
                </h2>
                <button
                  onClick={toggleMobileMenu}
                  className={`${themeClasses.textGrayDark} focus:outline-none`}
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
          

                {/* Download App */}
                <button
                  onClick={() => {
                    openDownloadApp();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaDownload className="text-sm" />
                  Download App
                </button>

                {/* About Us */}
                <button
                  onClick={() => {
                    scrollToAbout();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaInfoCircle className="text-sm" />
                  About Us
                </button>

                {/* Contact Us */}
                <button
                  onClick={() => {
                    scrollToContact();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaPhone className="text-sm" />
                  Contact Us
                </button>

                {/* Services */}
                <button
                  onClick={() => {
                    scrollToServices();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaBox className="text-sm" />
                  Services
                </button>

                {/* Follow Us */}
                <button
                  onClick={() => {
                    scrollToFollowUs();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaUsers className="text-sm" />
                  Follow Us
                </button>

                {/* Reviews */}
                <button
                  onClick={() => {
                    scrollToReviews();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaStarIcon className="text-sm" />
                  Reviews
                </button>

                {/* Packages */}
                <button
                  onClick={() => {
                    scrollToPackages();
                    toggleMobileMenu();
                  }}
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary} flex items-center gap-2 text-left`}
                >
                  <FaBox className="text-sm" />
                  Packages
                </button>

              
                <a
                  href="https://user.matrimonystudio.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary}`}
                  onClick={toggleMobileMenu}
                >
                  User Login
                </a>
                <NavLink
                  to="/register"
                  className={`${themeClasses.textGrayDark} hover:${themeClasses.textPrimary}`}
                  activeClassName={`${themeClasses.textPrimary} font-semibold`}
                  onClick={toggleMobileMenu}
                >
                  Register
                </NavLink>
              </nav>
            </div>
          </div>
        )}
      </nav>
      <section className="mt-24 relative overflow-hidden text-white  w-full">
  <div className="container-fluid mx-auto px-0">
    <div className="w-full animate__animated animate__fadeIn animate__delay-0.5s">
      {/* Carousel Component */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="w-full"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            // Adjusting the height for mobile
            height: 'auto', // Make the height auto on small screens to show full image
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            // Adjusting the height for medium-sized mobile screens
            height: 'auto', // Keep it responsive with auto height for better fit
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
            centeredSlides: true,
            // Adjusting height for tablets, slightly larger but still mobile-friendly
            height: 'auto',
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 50,
            centeredSlides: true,
            // Standard desktop height (you can keep it larger for desktops)
            height: 'calc(100vh - 64px)', // Adjust to your needs on desktop
          },
        }}
      >
        {/* Map over the fetched bannerImages and display them */}
        {bannerImages.length > 0 ? (
          bannerImages.map((image) => (
            <SwiperSlide key={image.id}>
              <img
                src={image.imageUrl ? Banner + image.imageUrl : 'default-image-path.jpg'} // Provide a fallback URL if image.url is missing
                alt={`Banner ${image.id}`}
                className="w-full object-cover rounded-none" // Adjust height here as well for scaling
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <img
              src="https://img.freepik.com/premium-photo/indian-wedding-pooja_96696-144.jpg?semt=ais_hybrid"
              alt="Default Slide"
              className="w-full h-[auto] object-cover rounded-none" // Ensures the image is responsive and doesn't stretch
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  </div>
</section>

      <section>
        {/* Single Card: My Profiles, Other Profiles, and Search */}
        <div className="flex justify-center items-center w-full mt-3 mb-10">
          <div className="bg-white rounded-2xl shadow-lg px-8 py-8 flex flex-col items-center w-full max-w-2xl">
            {/* Row 1: My Profiles & Other Profiles */}
            <div className="flex flex-col md:flex-row w-full md:space-x-8 mb-4">
              <a href={`/web-male-profiles/${userId}/male`} className={`flex-1 px-8 py-5 mb-4 md:mb-0 ${themeClasses.bgPrimary} ${themeClasses.textWhite} font-extrabold text-lg md:text-xl rounded-lg ${themeClasses.hoverPrimary} transition duration-300 text-center shadow-none`}>My Profiles</a>
              <a href={`/web-other-male-profiles/${userId}/male`} className={`flex-1 px-8 py-5 ${themeClasses.bgPrimaryDark} ${themeClasses.textWhite} font-extrabold text-lg md:text-xl rounded-lg hover:bg-purple-700 transition duration-300 text-center shadow-none`}>Others Profiles</a>
            </div>
            {/* Row 2: Search */}
            <div className="w-full flex justify-center">
              <a
                href={`/quick-search2`}
                className={`w-full md:w-2/3 px-8 py-5 ${themeClasses.bgBlue} ${themeClasses.textWhite} font-extrabold text-lg md:text-xl rounded-lg ${themeClasses.hoverBlue} transition duration-300 flex items-center justify-center shadow-none`}
              >
                <FaSearch className="inline-block mr-2 mb-1" />
                Search Life Partner
              </a>
            </div>
          </div>
        </div>
  <div className=" bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-all duration-300">
        {/* Card Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
         
          <h2 className="text-2xl font-bold text-white mb-2">Login Details</h2>
          <p className="text-indigo-100 text-sm">Access your account or create a new one</p>
        </div>

        {/* Card Body */}
        <div className="px-8 py-8">
          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <a
              href={`/user-register/${userId}`}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Free Register Now
            </a>
            
            <a
              href="https://user.matrimonystudio.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm text-gray-200 mr-2">Already a member?</span>
              Login to Account
            </a>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* App Download Section */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download our mobile app
            </p>
            
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-300">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-8 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>

    {/* Any Questions? Call Support Section */}
    <section id="contact-section" className="bg-gray-100 py-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-center mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM15 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM15 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Any Questions? Call Support
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
        {mobile && (
          <>
            {/* Call Button */}
            <button
              onClick={() => window.location.href = `tel:${mobile}`}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 font-semibold text-lg gap-2 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM15 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM15 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Call {mobile}
            </button>
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${mobile.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 font-semibold text-lg gap-2 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.67 6.13L0 24l6.25-1.64A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/>
              </svg>
              WhatsApp
            </a>
          </>
        )}
      </div>
    </section>
    {/* Social Media Card Section */}
   

        {/* Testimonials Scrolling Section */}
        {testimonials.length > 0 && (
          <section id="reviews-section" className="py-12 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Previous Customer Reviews
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
              </div>
              {/* Show only the first testimonial */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <FaQuoteLeft className="text-purple-500 text-2xl mr-3" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 italic leading-relaxed">
                    "{testimonials[0].message}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonials[0].name}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(testimonials[0].created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* See all reviews button with counter */}
              <div className="flex justify-center mt-6">
                <button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  onClick={() => setShowTestimonialsModal(true)}
                >
                  See all reviews ({testimonials.length})
                </button>
              </div>
            </div>
            {/* Modal for all testimonials */}
            {showTestimonialsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    onClick={() => setShowTestimonialsModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">All Reviews</h3>
                  <div className="flex flex-col gap-6">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-gray-50 rounded-lg shadow p-4">
                        <div className="flex items-center mb-2">
                          <FaQuoteLeft className="text-purple-500 text-xl mr-2" />
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-xs" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2 italic">"{testimonial.message}"</p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{testimonial.name}</span>
                          <span className="text-xs text-gray-500">{new Date(testimonial.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

<div id="follow-us-section" className="flex justify-center mt-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Follow My Social Media Pages</h3>
        <div className="flex space-x-6">
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Facebook">
              <span className="bg-[#1877F3] rounded-full p-2 flex items-center justify-center w-10 h-10">
                <FaFacebook className="text-white w-6 h-6" />
              </span>
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Twitter">
              <span className="bg-[#1DA1F2] rounded-full p-2 flex items-center justify-center w-10 h-10">
                <FaTwitter className="text-white w-6 h-6" />
              </span>
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="Instagram">
              <span className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full p-2 flex items-center justify-center w-10 h-10">
                <FaInstagram className="text-white w-6 h-6" />
              </span>
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="LinkedIn">
              <span className="bg-[#0077B5] rounded-full p-2 flex items-center justify-center w-10 h-10">
                <FaLinkedin className="text-white w-6 h-6" />
              </span>
            </a>
          )}
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" title="YouTube">
              <span className="bg-[#FF0000] rounded-full p-2 flex items-center justify-center w-10 h-10">
                <FaYoutube className="text-white w-6 h-6" />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>

  

       
        {/* Customized Links Section */}
        {customizedLinks.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  For More Info
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">
                  Explore our other services and businesses
                </p>
                      </div>
              
              {/* Grid Layout for Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customizedLinks.map((link) => (
                  <div key={link.id} className="group">
                    <a
                      href={link.url_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => openLink(link.url_link)}
                      className="block bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl h-full"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <FaLink className="text-2xl" />
                        <FaExternalLinkAlt className="text-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                    </div>
                      <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                      <p className="text-purple-100 text-sm opacity-90">
                        Click to visit
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About Us Section */}
        {about && (
          <section id="about-section" className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  About Us
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: about }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Packages Section */}
        {packages.length > 0 && (
          <section id="packages-section" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                  Our Premium Packages
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-4"></div>
                
              </div>
              
              {/* Enhanced Grid Layout for Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="group relative">
                    {/* Popular Badge for first package */}
                    {index === 0 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                        
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-3">{pkg.title}</h3>
                          <div className="flex items-end justify-between mb-4">
                            <div>
                              <span className="text-3xl font-bold">₹{parseFloat(pkg.price).toLocaleString()}</span>
                              <span className="text-purple-200 text-sm ml-2">/package</span>
                            </div>
                            <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                              {pkg.duration} Validity
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-8">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{pkg.description}</p>
                        
                        {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></div>
                              Provide:
                            </h4>
                            <ol className="space-y-3 list-decimal list-inside">
                              {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-gray-700 text-sm">{feature}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                        {pkg.features && typeof pkg.features === 'string' && pkg.features.trim() !== '' && (
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></div>
                              Provided Features:
                            </h4>
                            <ol className="space-y-3 list-decimal list-inside">
                              {(function() {
                                let arr;
                                try {
                                  arr = JSON.parse(pkg.features);
                                  if (!Array.isArray(arr)) arr = pkg.features.split(',');
                                } catch {
                                  arr = pkg.features.split(',');
                                }
                                return arr.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <span className="text-gray-700 text-sm">{feature.trim()}</span>
                                  </li>
                                ));
                              })()}
                            </ol>
                          </div>
                        )}
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {new Date(pkg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* CTA Button */}
                        <button
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-2xl"
                          onClick={() => {
                            const phone = mobile ? mobile.replace(/[^0-9]/g, '') : '';
                            const msg = encodeURIComponent(
                              `I am interested in this package: ${pkg.title}, Price: ₹${parseFloat(pkg.price).toLocaleString()}, Duration: ${pkg.duration}.`
                            );
                            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                          }}
                        >
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.67 6.13L0 24l6.25-1.64A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/>
                          </svg>
                          Pay Now ₹{parseFloat(pkg.price).toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
             
            </div>
          </section>
        )}

<Sucess />

              {/* Our Services Section */}
              {services.length > 0 && (
          <div id="services-section" className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Our Services</h3>
              <ul className="w-full space-y-3">
                {services.map(service => (
                  <li key={service.id} className="flex items-center px-4 py-2 bg-gray-50 rounded-lg shadow-sm text-gray-700 font-medium">
                    <span className="mr-2 text-blue-500">•</span> {service.Servicename}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}


 {/* Our Locations Section (after services) */}
 {locations.length > 0 && (
    <div id="locations-section" className="flex justify-center mb-8">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Branch Locations</h3>
        <div className="w-full space-y-6">
          {/* Show only the first location */}
          <div key={locations[0].id} className="flex flex-col bg-white border-l-4 border-blue-500 rounded-xl shadow p-5 gap-4 hover:shadow-xl transition-all">
            {/* Branch Manager */}
            <div className="flex items-center gap-3">
              <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2">
                {/* User/Manager icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </span>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Branch Manager</div>
                <div className="font-bold text-base text-blue-800">{locations[0].branch_manager_name}</div>
              </div>
            </div>
            {/* Contact */}
            <div className="flex items-center gap-3">
              <span className="inline-block bg-green-100 text-green-700 rounded-full p-2">
                {/* Phone icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.68 3.48.68a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5H6.5a1 1 0 011 1c0 1.15.23 2.36.68 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/></svg>
              </span>
              <div>
                <div className="text-xs text-gray-500 font-semibold">Contact</div>
                <div className="text-gray-700 font-medium">{locations[0].contact_details}</div>
              </div>
            </div>
            {/* Address Details */}
            <div className="flex items-start gap-3">
              <span className="inline-block bg-purple-100 text-purple-700 rounded-full p-2 mt-1">
                {/* Home/Address icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9.75L12 4l9 5.75V19a2 2 0 01-2 2H5a2 2 0 01-2-2V9.75z"/><path d="M9 22V12h6v10"/></svg>
              </span>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-500 font-semibold">Address</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">House No:</span> {locations[0].house_no || '-'}</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">Street:</span> {locations[0].street || '-'}</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">City:</span> {locations[0].city || '-'}</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">District:</span> {locations[0].district || '-'}</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">State:</span> {locations[0].state || '-'}</div>
                <div className="text-gray-700 text-sm"><span className="font-semibold">Country:</span> {locations[0].country || '-'}</div>
              </div>
            </div>
            {/* Google Map Link */}
            {locations[0].google_map_link && (
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block bg-blue-50 text-blue-600 rounded-full p-2">
                  {/* Location/Map icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>
                </span>
                <a href={locations[0].google_map_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">View on Google Maps</a>
              </div>
            )}
          </div>
          {/* View More Button if more than 1 location */}
          {locations.length > 1 && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                onClick={() => setShowLocationsModal(true)}
              >
                View more branches ({locations.length - 1})
              </button>
                      </div>
          )}
        </div>
      </div>
      {/* Modal for remaining locations */}
      {showLocationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setShowLocationsModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">All Branches</h3>
            <div className="flex flex-col gap-6">
              {locations.slice(1).map(loc => (
                <div key={loc.id} className="bg-gray-50 rounded-lg shadow p-4">
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </span>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Branch Manager</div>
                      <div className="font-bold text-base text-blue-800">{loc.branch_manager_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-green-100 text-green-700 rounded-full p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.68 3.48.68a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5H6.5a1 1 0 011 1c0 1.15.23 2.36.68 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/></svg>
                    </span>
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Contact</div>
                      <div className="text-gray-700 font-medium">{loc.contact_details}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="inline-block bg-purple-100 text-purple-700 rounded-full p-2 mt-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9.75L12 4l9 5.75V19a2 2 0 01-2 2H5a2 2 0 01-2-2V9.75z"/><path d="M9 22V12h6v10"/></svg>
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500 font-semibold">Address</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">House No:</span> {loc.house_no || '-'}</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">Street:</span> {loc.street || '-'}</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">City:</span> {loc.city || '-'}</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">District:</span> {loc.district || '-'}</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">State:</span> {loc.state || '-'}</div>
                      <div className="text-gray-700 text-sm"><span className="font-semibold">Country:</span> {loc.country || '-'}</div>
                    </div>
                  </div>
                  {loc.google_map_link && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block bg-blue-50 text-blue-600 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>
                      </span>
                      <a href={loc.google_map_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-semibold">View on Google Maps</a>
                    </div>
                  )}
                  </div>
                ))}
              </div>
            </div>
        </div>
      )}
    </div>
        )}





  

        {/* Display Profile ID on the page */}
       
      </section>
    
            {/* Success Stories Gallery Section */}
{successStories.length > 0 && (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4 md:px-8">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Success Stories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {successStories.map((img, idx) => (
          <div
            key={img.id || idx}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-w-16 aspect-h-12 bg-gray-200">
              <img
                src={`${Banner}/${img.path || img.imageUrl || img.url}`}
                alt={`Success Story ${idx + 1}`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Optional overlay with story number */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Story {idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
   
     
    </>
  );
};

export default Navbar;
