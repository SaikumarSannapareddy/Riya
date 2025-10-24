// src/components/AdminDashboard.jsx
import React from "react";
import TopNavbar from "../components/Gnavbar";
import Editwebsite from "../components/Editwebsite"
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar />
        <Editwebsite />
     
     <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
