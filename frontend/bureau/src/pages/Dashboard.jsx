// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Gnavbar";
import Buttons from "../components/Buttons";
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col min-h-screen">
        <TopNavbar />
        <div className="flex-1 overflow-y-auto">
          <Buttons />
        </div>
        <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
