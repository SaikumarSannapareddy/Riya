// src/components/DropdownMenu.jsx
import React, { useState } from "react";
import { AiOutlineUser, AiFillCaretDown } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to login page
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("bureauId");
    navigate("/adminlogin"); // Redirect to login page after logout
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center">
        <AiOutlineUser className="mr-2" />
        <AiFillCaretDown />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-md z-20">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">My Profile</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Change Password</a>
          <a href="#" onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">
            LogOut
          </a>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
