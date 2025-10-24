// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Gnavbar";
import Quicksearch from "../components/quick-search"
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col bg-white">
        <TopNavbar />
        <Quicksearch />
     
     <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
