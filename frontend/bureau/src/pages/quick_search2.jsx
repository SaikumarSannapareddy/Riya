// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/Gnavbar";
import Quicksearch from "../components/quick-search2"
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
      <div className="flex flex-col bg-white">
       
        <Quicksearch />
     
      </div>
  );
};

export default AdminDashboard;
