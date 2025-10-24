import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import ManageVideos from "../components/ManageVideos";
import PrivateRoute from "../components/PrivateRoute";

const ManageVideosPage = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-grow">
            <div className="flex-grow p-6 bg-gray-100">
              <ManageVideos />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ManageVideosPage; 