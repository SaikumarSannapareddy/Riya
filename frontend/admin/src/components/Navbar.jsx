import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaDownload, FaArrowUp, FaInfoCircle, FaPhone, FaCog, FaShareAlt, FaStar, FaBuilding, FaHome } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from "./Apis";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [bname, setBname] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Close mobile menu if open
    setIsMobileOpen(false);
  };

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setBname(response.data.bname);
      
      if (response.data.logo) {
        setLogo(response.data.logo);
      }
    } catch (err) {
      console.error("Error fetching business details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Left Side - Logo */}
      <div className="font-semibold text-blue-600">
        <img 
          src={`${Uploads}/${logo}`}
          className="h-16 w-full object-contain rounded-md mr-4"
          alt={bname}
        />
      </div>

      {/* Right Side - Desktop Links */}
      <div className="hidden lg:flex space-x-6 items-center">
        <NavLink
          to="/"
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaHome className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        <button
          onClick={() => navigate('/create-bureau')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaDownload className="w-4 h-4" />
          <span>Create Matrimony App</span>
        </button>

        <button
          onClick={() => scrollToSection('download-app')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaDownload className="w-4 h-4" />
          <span>Download Matrimony App</span>
        </button>

        <button
          onClick={() => scrollToSection('packages')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaArrowUp className="w-4 h-4" />
          <span>Upgrade Plans</span>
        </button>

        <button
          onClick={() => scrollToSection('about-us')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaInfoCircle className="w-4 h-4" />
          <span>About Us</span>
        </button>

        <button
          onClick={() => scrollToSection('contact-us')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaPhone className="w-4 h-4" />
          <span>Contact Us</span>
        </button>

        <button
          onClick={() => scrollToSection('services')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaCog className="w-4 h-4" />
          <span>Services</span>
        </button>

        <button
          onClick={() => scrollToSection('social-media')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaShareAlt className="w-4 h-4" />
          <span>Social Media</span>
        </button>

        <button
          onClick={() => scrollToSection('user-reviews')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaStar className="w-4 h-4" />
          <span>User Reviews</span>
        </button>

        <button
          onClick={() => scrollToSection('bureau-reviews')}
          className="text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1"
        >
          <FaBuilding className="w-4 h-4" />
          <span>Bureau Reviews</span>
        </button>

        {/* Login Dropdown */}
        <div className="relative">
          <button
            onClick={toggleLoginDropdown}
            className="text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            Login
          </button>
          {isLoginDropdownOpen && (
            <div className="absolute mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
              <NavLink
                to="/login/user"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setIsLoginDropdownOpen(false)}
              >
                User Login
              </NavLink>
              <NavLink
                to="https://matrimonystudio.in/login"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setIsLoginDropdownOpen(false)}
              >
                Bureau Login
              </NavLink>
              <NavLink
                to="https://distributor.gitapps.in/"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setIsLoginDropdownOpen(false)}
              >
                Distributor Login
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Mobile Icon */}
      <div className="lg:hidden">
        <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
          {isMobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
          <div className="w-80 bg-white h-full shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-blue-600">{bname}</h2>
              <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
                <FaTimes size={24} />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                onClick={toggleMobileMenu}
              >
                <FaHome className="w-4 h-4" />
                <span>Home</span>
              </NavLink>

              <button
                onClick={() => navigate('/create-bureau')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Create Matrimony App</span>
              </button>

              <button
                onClick={() => scrollToSection('download-app')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaDownload className="w-4 h-4" />
                <span>Download Matrimony App</span>
              </button>

              <button
                onClick={() => scrollToSection('packages')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaArrowUp className="w-4 h-4" />
                <span>Upgrade Plans</span>
              </button>

              <button
                onClick={() => scrollToSection('about-us')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaInfoCircle className="w-4 h-4" />
                <span>About Us</span>
              </button>

              <button
                onClick={() => scrollToSection('contact-us')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaPhone className="w-4 h-4" />
                <span>Contact Us</span>
              </button>

              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaCog className="w-4 h-4" />
                <span>Services</span>
              </button>

              <button
                onClick={() => scrollToSection('social-media')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaShareAlt className="w-4 h-4" />
                <span>Social Media</span>
              </button>

              <button
                onClick={() => scrollToSection('user-reviews')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaStar className="w-4 h-4" />
                <span>User Reviews</span>
              </button>

              <button
                onClick={() => scrollToSection('bureau-reviews')}
                className="text-left text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FaBuilding className="w-4 h-4" />
                <span>Bureau Reviews</span>
              </button>

              <div className="border-t border-gray-200 pt-4">
                <div>
                  <button
                    onClick={toggleLoginDropdown}
                    className="text-gray-800 hover:text-blue-600 w-full text-left"
                  >
                    Login
                  </button>
                  {isLoginDropdownOpen && (
                    <div className="mt-2 bg-white border border-gray-200 shadow-lg rounded-md">
                      <NavLink
                        to="/login/user"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                        onClick={toggleMobileMenu}
                      >
                        User Login
                      </NavLink>
                      <NavLink
                        to="https://matrimonystudio.in/login/"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                        onClick={toggleMobileMenu}
                      >
                        Bureau Login
                      </NavLink>
                      <NavLink
                        to="https://distributor.gitapps.in/"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                        onClick={toggleMobileMenu}
                      >
                        Distributor Login
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
