// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
// import Manage from "../components/Managebureau";
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute
import ProfilesDashboard from "../components/Distributerreviews";

const BureauDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar />
        <div className="flex flex-grow">
          {/* Sidebar */}
          <Sidebar />
          <div className="flex flex-col flex-grow">
            {/* Main Content */}
            <div className="flex-grow p-6 bg-gray-100">
              {/* <Manage /> */}
              <ProfilesDashboard /> 
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default BureauDashboard;
