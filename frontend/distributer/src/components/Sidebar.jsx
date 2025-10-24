import React, { useState } from "react";
import { AiOutlineDashboard, AiOutlineUser, AiOutlineDown, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaBuilding, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isBureauOpen, setBureauOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar
  const toggleBureau = () => setBureauOpen(!isBureauOpen);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button at the top */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-white bg-gray-900 fixed top-0 left-0 z-30"
      >
        <AiOutlineMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col z-40`}
        style={{ height: '100vh' }} // Ensure sidebar takes full height of the viewport
      >
        {/* Close Button when Sidebar is Open */}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <AiOutlineClose />
          </button>
        )}

        {/* Header */}
        <div className="bg-gray-900 text-center py-4 text-lg font-semibold">
          Riyta Matrimony
        </div>

        <nav className="mt-4 px-2">
          {/* Dashboard Link */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 transition-colors duration-200 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <AiOutlineDashboard className="mr-3" />
            <span>Dashboard</span>
          </NavLink>

         

          {/* Bureau Dropdown */}
          <div>
            <button
              onClick={toggleBureau}
              className="flex items-center px-4 py-2 w-full text-left transition-colors duration-200 hover:bg-gray-700"
            >
              <FaBuilding className="mr-3" />
              <span>Bureau</span>
              <AiOutlineDown
                className={`ml-auto transition-transform ${
                  isBureauOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isBureauOpen && (
              <div className="pl-8 transition-all duration-300">
                <NavLink
                  to="/bureau/create"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 transition-colors duration-200 rounded ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <span>Create Bureau</span>
                </NavLink>
                <NavLink
                  to="/bureau/manage"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 transition-colors duration-200 rounded ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <span>Manage Bureau</span>
                </NavLink>
              </div>
            )}
          </div>

          
        </nav>
      </div>

      {/* Overlay for Sidebar on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;
