// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Gnavbar";
import Editpasswords from "../components/edit_password"
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar />
        <Editpasswords />
     
     <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
