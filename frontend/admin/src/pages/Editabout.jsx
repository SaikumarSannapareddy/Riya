import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import PrivateRoute from "../components/PrivateRoute";
import apiClient, { apiEndpoints } from "../components/Apis";

const BusinessDescription = ({ isSidebarOpen, toggleSidebar }) => {
  const [about, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch business description on component mount
  useEffect(() => {
    fetchBusinessDescription();
  }, []);

  const fetchBusinessDescription = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setDescription(response.data.about);
      setError(null);
    } catch (err) {
      console.error("Error fetching business description:", err);
      setError("Failed to fetch business description. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessDescription = async () => {
    try {
      setLoading(true);
      await apiClient.put(apiEndpoints.updateBusinessabout, { about });
      setSuccessMessage("Business description updated successfully!");
      setIsEditing(false);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating business description:", err);
      setError("Failed to update business description. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessDescription();
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-grow">
            <div className="flex-grow p-6 bg-gray-100">
              {/* Business Description Management Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Business Description</h2>
                
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

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">About Your Business</h3>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <textarea
                          value={about}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter business description"
                          rows="6"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col">
                      <div className="bg-gray-50 p-4 rounded-md mb-3">
                        {about ? (
                          <p className="text-gray-700 whitespace-pre-wrap">{about}</p>
                        ) : (
                          <p className="text-gray-500 italic">No business description set</p>
                        )}
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 self-end"
                      >
                        Edit About
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

export default BusinessDescription;