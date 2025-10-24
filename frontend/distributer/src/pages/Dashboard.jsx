// src/components/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "../components/PrivateRoute"; // Import PrivateRoute

const AdminDashboard = () => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen w-auto">
        <TopNavbar />
        <div className="flex flex-grow">
          {/* Sidebar */}
          <Sidebar />
          <div className="flex w-auto flex-col flex-grow">
            {/* Main Content */}
            <div className="flex-grow p-6 bg-gray-100">
              <Dashboard />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;
