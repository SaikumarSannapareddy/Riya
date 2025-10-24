import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import PrivateRoute from "../components/PrivateRoute";
import apiClient, { apiEndpoints, Uploads } from "../components/Apis";

const AdminDashboard = ({ isSidebarOpen, toggleSidebar }) => {
  const [bname, setBname] = useState("");
  const [logo, setLogo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [logoSuccessMessage, setLogoSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch business name and logo on component mount
  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setBname(response.data.bname);
      
      // Set logo if available
      if (response.data.logo) {
        setLogo(response.data.logo);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching business details:", err);
      setError("Failed to fetch business details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessName = async () => {
    try {
      setLoading(true);
      await apiClient.put(apiEndpoints.updateBusinessName, { bname });
      setSuccessMessage("Business name updated successfully!");
      setIsEditing(false);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating business name:", err);
      setError("Failed to update business name. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessName();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setLogoError("Please select a logo image");
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      setLogoLoading(true);
      const response = await apiClient.put(
        apiEndpoints.updateLogo, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setLogo(response.data.logo);
      setLogoSuccessMessage("Logo updated successfully!");
      setIsEditingLogo(false);
      setLogoError(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setLogoSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating logo:", err);
      setLogoError("Failed to update logo. Please try again later.");
    } finally {
      setLogoLoading(false);
    }
  };

  const cancelLogoEdit = () => {
    setIsEditingLogo(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setLogoError(null);
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-grow">
            <div className="flex-grow p-6 bg-gray-100">
              {/* Business Settings Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Business Settings</h2>
                
                {loading && <p className="text-gray-600">Loading...</p>}
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                  </div>
                )}

             
                {/* Logo Management Section */}
                <div className="mb-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Business Logo</h3>
                  
                  {logoError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {logoError}
                    </div>
                  )}
                  
                  {logoSuccessMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      {logoSuccessMessage}
                    </div>
                  )}
                  
                  {isEditingLogo ? (
                    <form onSubmit={uploadLogo} className="space-y-4">
                      <div className="mb-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoChange}
                          accept="image/*"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {previewUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <img 
                            src={previewUrl} 
                            alt="Logo Preview" 
                            className="h-24 object-contain border border-gray-300 rounded-md p-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={logoLoading}
                        >
                          {logoLoading ? "Uploading..." : "Upload Logo"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelLogoEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          disabled={logoLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {logo ? (
                          <img 
                          
                             src={`${Uploads}/${logo}`}
                           
                            className="h-16 object-contain border border-gray-300 rounded-md p-2 mr-4"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-16 w-36 bg-gray-100 border border-gray-300 rounded-md p-2 mr-4">
                            <p className="text-gray-500 text-sm">No logo uploaded</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditingLogo(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        {logo ? "Change Logo" : "Add Logo"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default AdminDashboard;