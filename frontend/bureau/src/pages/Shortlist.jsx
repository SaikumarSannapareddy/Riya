// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Gnavbar";
import Buttons from "../components/short-list";
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar />
        <Buttons />
     
     <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
