import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaHeart
} from "react-icons/fa";

const BottomNavbar = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full px-1 pb-safe z-40">
      <nav className="bg-white dark:bg-gray-900 rounded-t-xl shadow-lg border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center h-16">
            <NavItem 
              icon={<FaCalendarAlt />} 
              label="Plan" 
              path="/my-plan" 
              isActive={location.pathname === '/my-plan'} 
            />
            <NavItem 
              icon={<FaHeart />} 
              label="Matches" 
              path="/my-preferences" 
              isActive={location.pathname === '/matches'} 
            />
            <NavItem 
              icon={<FaHome />} 
              label="Home" 
              path="/home" 
              isActive={location.pathname === '/home'} 
            />
            <NavItem 
              icon={<FaSearch />} 
              label="Search" 
              path="/advanced-search" 
              isActive={location.pathname === '/advanced-search' || location.pathname === '/advanced-search-results'} 
            />
            <NavItem 
              icon={<FaUser />} 
              label="Profile" 
              path="/my-profile" 
              isActive={location.pathname === '/my-profile'} 
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, path, isActive }) {
  // Active and inactive styles
  const activeIconClass = "scale-110 text-blue-600 dark:text-blue-400";
  const inactiveIconClass = "text-gray-600 dark:text-gray-400";
  
  const activeLabelClass = "text-blue-600 font-medium dark:text-blue-400";
  const inactiveLabelClass = "text-gray-600 dark:text-gray-400";
  
  const activeNavClass = "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-600 after:dark:bg-blue-400 after:rounded-full";
  
  return (
    <Link 
      to={path} 
      className={`relative flex flex-col items-center justify-center w-full max-w-20 py-1 transition-all duration-200 hover:text-blue-500 ${isActive ? activeNavClass : ""}`}
    >
      <div className={`text-xl mb-1 transition-all duration-200 ${isActive ? activeIconClass : inactiveIconClass}`}>
        {icon}
      </div>
      <span className={`text-xs transition-all duration-200 ${isActive ? activeLabelClass : inactiveLabelClass}`}>
        {label}
      </span>
      
      {isActive && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-b-full opacity-80" />
      )}
    </Link>
  );
}

export default BottomNavbar;