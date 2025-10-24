import React, { useState } from "react";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { FaBuilding, FaUsers } from "react-icons/fa";
import { NavLink } from "react-router-dom"; // Import NavLink

const Sidebar = () => {
  const [isDistributorsOpen, setDistributorsOpen] = useState(false);
  const [isBureauOpen, setBureauOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);

  // Toggle dropdowns
  const toggleDistributors = () => setDistributorsOpen(!isDistributorsOpen);
  const toggleBureau = () => setBureauOpen(!isBureauOpen);
  const toggleUser = () => setUserOpen(!isUserOpen);

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <nav className="mt-10">
        {/* Dashboard Link */}
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <AiOutlineDashboard className="mr-3" />
          <span>Dashboard</span>
        </NavLink>

        {/* Distributors Dropdown */}
        <div>
          <button
            onClick={toggleDistributors}
            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700"
          >
            <FaUsers className="mr-3" />
            <span>Distributors</span>
          </button>
          {isDistributorsOpen && (
            <div className="pl-8">
              <NavLink
                to="/distributors/create"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Create Distributor</span>
              </NavLink>
              <NavLink
                to="/distributors/manage"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Manage Distributors</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Bureau Dropdown */}
        <div>
          <button
            onClick={toggleBureau}
            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700"
          >
            <FaBuilding className="mr-3" />
            <span>Bureau</span>
          </button>
          {isBureauOpen && (
            <div className="pl-8">
              <NavLink
                to="/bureau/create"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Create Bureau</span>
              </NavLink>
              <NavLink
                to="/bureau/manage"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Manage Bureau</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Users Dropdown */}
        <div>
          <button
            onClick={toggleUser}
            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700"
          >
            <AiOutlineUser className="mr-3" />
            <span>Users</span>
          </button>
          {isUserOpen && (
            <div className="pl-8">
              <NavLink
                to="/user/create"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Create User</span>
              </NavLink>
              <NavLink
                to="/user/manage"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
                }
              >
                <span>Manage Users</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
