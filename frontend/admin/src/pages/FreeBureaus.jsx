// src/pages/FreeBureaus.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import FreeBureausComponent from "../components/FreeBureaus";
import PrivateRoute from "../components/PrivateRoute";

const FreeBureaus = () => {
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
              <FreeBureausComponent />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default FreeBureaus; 