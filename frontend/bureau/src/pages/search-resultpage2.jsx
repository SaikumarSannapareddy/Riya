// src/components/AdminDashboard.jsx
import React from "react";
import TopNavbar from "../components/Gnavbar";
import Editwebsite from "../components/search-result2"
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import Bottomnav  from "../components/Bottomnav";
const AdminDashboard = () => {
  return (
   
      <div className="flex flex-col h-screen">
       
        <Editwebsite />
     
   
      </div>
  
  );
};

export default AdminDashboard;
