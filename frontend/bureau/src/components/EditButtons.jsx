import React from 'react';
import { NavLink } from 'react-router-dom';

import { 
  FaEdit, 
  FaImage, 
  FaSlidersH, 
  FaTrophy, 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUserCircle,
  FaFileContract,
  FaCogs,
  FaComments,
  FaLink,
  FaBox 
} from 'react-icons/fa';
import BottomNavBar from './Bottomnav';
import TopNavbar from "../components/Gnavbar";
import { themeClasses } from './colors';

const BusinessWebsitePage = () => {
  const buttonVariants = {
    primary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105",
    accent: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105",
    warning: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105",
    info: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105",
    orange: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105", 

  };

  const ButtonCard = ({ to, variant, icon: Icon, children, className = "" }) => (
    <NavLink
      to={to}
      className={`
        relative overflow-hidden rounded-xl text-white font-medium
        py-6 px-4 text-center transition-all duration-300 ease-in-out
        flex items-center justify-center space-x-3
        ${buttonVariants[variant]}
        ${className}
        group
      `}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <Icon className="text-xl group-hover:rotate-12 transition-transform duration-300" />
      <span className="font-semibold tracking-wide">{children}</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white bg-opacity-20 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
    </NavLink>
  ); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ">
      <TopNavbar />
      
      <div className="container mx-auto px-4 py-8 mt-20 max-w-6xl">
        {/* Back Button */}
        <NavLink
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 group transition-all duration-300"
        >
          <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Dashboard</span>
        </NavLink>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Edit Your Business Website
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Customize and manage all aspects of your business website with our comprehensive editing tools
          </p>
        </div>

        {/* Main Grid - 2 Buttons Per Row (Mobile & Desktop) */}
        <div className="space-y-4 mb-32">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/edit-website"
              variant="primary"
              icon={FaEdit}
            >
              Edit Profile
            </ButtonCard>
            
            <ButtonCard 
              to="/edit-social-media-links"
              variant="orange"
              icon={FaImage}
            >
             Edit Social Pages
            </ButtonCard>
          </div>


          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/customized-links-management"
              variant="accent"
              icon={FaLink}
            >
              Custom Links
            </ButtonCard>

            <ButtonCard
              to="/sliderimages"
              variant="info"
              icon={FaSlidersH}
            >
              Slider Images
            </ButtonCard>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/edit-location"
              variant="success"
              icon={FaMapMarkerAlt}
            >
              Your Locations
            </ButtonCard>

            <ButtonCard
              to="/edit-profile"
              variant="secondary"
              icon={FaUserCircle}
            >
              Profile Image
            </ButtonCard>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/terms-conditions"
              variant="warning"
              icon={FaFileContract}
            >
              Terms & Conditions
            </ButtonCard>

            <ButtonCard
              to="/success-stories"
              variant="accent"
              icon={FaTrophy}
            >
              Success Stories
            </ButtonCard>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/testimonials-management"
              variant="primary"
              icon={FaComments}
            >
              Testimonials
            </ButtonCard>

            <ButtonCard
              to="/packages-management"
              variant="info"
              icon={FaBox}
            >
              Manage Packages
            </ButtonCard>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <ButtonCard
              to="/edit-service"
              variant="success"
              icon={FaCogs}
            >
              Your Services
            </ButtonCard>
             
            <ButtonCard
              to="/navbar-logo"
              variant="accent"
              icon={FaImage}
            >
              Navbar Logo
            </ButtonCard>
          </div>
          
      
        </div>

        {/* Additional Info Cards */}
      
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default BusinessWebsitePage;