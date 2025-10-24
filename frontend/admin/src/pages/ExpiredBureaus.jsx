// src/pages/ExpiredBureaus.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ExpiredBureausComponent from "../components/ExpiredBureaus";
import PrivateRoute from "../components/PrivateRoute";

const ExpiredBureaus = () => {
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
              <ExpiredBureausComponent />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ExpiredBureaus; 