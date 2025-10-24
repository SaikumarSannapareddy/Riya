import React, { useState } from "react";
import {
  AiOutlineDashboard, AiOutlineUser, AiOutlineDown, AiOutlineMenu, AiOutlineClose, AiOutlineSetting, AiOutlinePlus, AiOutlineEdit, AiOutlineFileText, AiOutlineFileProtect
} from "react-icons/ai";
import { FaBuilding, FaUsers, FaComments, FaVideo } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isDistributorsOpen, setDistributorsOpen] = useState(false);
  const [isBureauOpen, setBureauOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleDistributors = () => setDistributorsOpen(!isDistributorsOpen);
  const toggleBureau = () => setBureauOpen(!isBureauOpen);
  const toggleUser = () => setUserOpen(!isUserOpen);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

  return (
    <div className="flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden p-4 text-white bg-gray-900 fixed top-0 left-0 z-50 rounded-br-lg shadow-lg"
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col z-40 shadow-2xl flex flex-col h-screen`}>
        
        {/* Close Button for mobile */}
        {isSidebarOpen && (
          <button 
            onClick={toggleSidebar} 
            className="absolute top-4 right-4 text-white text-2xl hover:bg-gray-700 p-1 rounded-full transition-colors duration-200 md:hidden"
          >
            <AiOutlineClose />
          </button>
        )}

        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-center py-6 text-xl font-bold border-b border-gray-700 shadow-lg flex-shrink-0">
          <div className="text-blue-400">Riyta</div>
          <div className="text-sm text-gray-300 font-normal">Tech Park</div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
          <nav className="py-4 px-2 space-y-1">
            
            {/* Dashboard Links */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Dashboards</div>
              
              <NavLink to="/admin-dashboard" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineDashboard className="mr-3 text-lg" />
                <span className="font-medium">Dashboard</span>
              </NavLink>

              <NavLink to="/profiles-dashboard" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineDashboard className="mr-3 text-lg" />
                <span className="font-medium">Profiles Dashboard</span>
              </NavLink>

              <NavLink to="/bureau-dashboard" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineDashboard className="mr-3 text-lg" />
                <span className="font-medium">Bureau Dashboard</span>
              </NavLink>

              <NavLink to="/distributer-dashboard" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineDashboard className="mr-3 text-lg" />
                <span className="font-medium">Distributor Dashboard</span>
              </NavLink>

              <NavLink to="/packages" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineDashboard className="mr-3 text-lg" />
                <span className="font-medium">Packages</span>
              </NavLink>
            </div>

            {/* Management Section */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Management</div>
              
              <NavLink to="/edit-branding-website" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineEdit className="mr-3 text-lg" />
                <span className="font-medium">Edit Branding Website</span>
              </NavLink>

              <NavLink
                to="/manage-videos"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <FaVideo className="mr-3 h-5 w-5" />
                Manage How to Use Videos
              </NavLink>

              <NavLink to="/edit-bureau-terms" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineFileText className="mr-3 text-lg" />
                <span className="font-medium">Edit Bureau Terms & Conditions</span>
              </NavLink>

              <NavLink to="/edit-distributors-terms" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <AiOutlineFileProtect className="mr-3 text-lg" />
                <span className="font-medium">Edit Distributors Terms & Conditions</span>
              </NavLink>

              {/* Chat Messages Link */}
              <NavLink to="/admin/chat-messages" className={({ isActive }) => `flex items-center px-4 py-3 transition-all duration-200 rounded-lg mx-2 ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                <FaComments className="mr-3 text-lg" />
                <span className="font-medium">Chat Messages</span>
              </NavLink>
            </div>

            {/* Dropdowns Section */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Categories</div>

            {/* Profiles Dropdown */}
            <div className="mx-2">
              <button 
                onClick={toggleUser} 
                className="flex items-center px-4 py-3 w-full text-left transition-all duration-200 hover:bg-gray-700 rounded-lg"
              >
                <AiOutlineUser className="mr-3 text-lg" />
                <span className="font-medium">Profiles</span>
                <AiOutlineDown className={`ml-auto transition-transform duration-200 ${isUserOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isUserOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-8 py-2 space-y-1">
                  <NavLink to="/user/male-profiles" className={({ isActive }) => `flex items-center px-4 py-2 transition-all duration-200 rounded-lg ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                    <span>Male Profiles</span>
                  </NavLink>
                  <NavLink to="/user/female-profiles" className={({ isActive }) => `flex items-center px-4 py-2 transition-all duration-200 rounded-lg ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                    <span>Female Profiles</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Bureau Dropdown */}
            <div className="mx-2">
              <button 
                onClick={toggleBureau} 
                className="flex items-center px-4 py-3 w-full text-left transition-all duration-200 hover:bg-gray-700 rounded-lg"
              >
                <FaBuilding className="mr-3 text-lg" />
                <span className="font-medium">Bureau</span>
                <AiOutlineDown className={`ml-auto transition-transform duration-200 ${isBureauOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isBureauOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-8 py-2 space-y-1">
                  <NavLink to="/bureau/manage" className={({ isActive }) => `flex items-center px-4 py-2 transition-all duration-200 rounded-lg ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                    <span>Manage Bureau</span>
                  </NavLink>
                  <NavLink to="/edit-bureau-terms" className={({ isActive }) => `flex items-center px-4 py-2 transition-all duration-200 rounded-lg ${isActive ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"}`}>
                    <span>Terms & Conditions</span>
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Distributors Dropdown */}
            <div className="mx-2">
              <button 
                onClick={toggleDistributors} 
                className="flex items-center px-4 py-3 w-full text-left transition-all duration-200 hover:bg-gray-700 rounded-lg"
              >
                <FaUsers className="mr-3 text-lg" />
                <span className="font-medium">Distributors</span>
                <AiOutlineDown className={`ml-auto transition-transform duration-200 ${isDistributorsOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isDistributorsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-8 py-2 space-y-1">
                  <NavLink to="/distributors/create" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Create Distributor
                  </NavLink>
                  <NavLink to="/distributors/manage" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Manage Distributors
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Settings Dropdown */}
            <div className="mx-2 mb-4">
              <button 
                onClick={toggleSettings} 
                className="flex items-center px-4 py-3 w-full text-left transition-all duration-200 hover:bg-gray-700 rounded-lg"
              >
                <AiOutlineSetting className="mr-3 text-lg" />
                <span className="font-medium">Settings</span>
                <AiOutlineDown className={`ml-auto transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-8 py-2 space-y-1">
                  <NavLink to="/settings/cast" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Cast
                  </NavLink>
                  <NavLink to="/settings/sub-caste" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Sub Caste
                  </NavLink>
                  <NavLink to="/settings/education" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Education
                  </NavLink>
                  <NavLink to="/settings/occupation" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Occupation
                  </NavLink>
                  <NavLink to="/settings/country" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Country
                  </NavLink>
                  <NavLink to="/settings/state" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    State
                  </NavLink>
                  <NavLink to="/settings/city" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    City
                  </NavLink>
                  <NavLink to="/settings/star" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200">
                    Star
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;