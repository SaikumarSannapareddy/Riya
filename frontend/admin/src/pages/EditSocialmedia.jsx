import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import PrivateRoute from "../components/PrivateRoute";
import apiClient, { apiEndpoints } from "../components/Apis";

const AdminDashboard = ({ isSidebarOpen, toggleSidebar }) => {
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch social media links on component mount
  useEffect(() => {
    fetchSocialMediaLinks();
  }, []);

  const fetchSocialMediaLinks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setTwitter(response.data.twitter);
      setYoutube(response.data.youtube);
      setInstagram(response.data.instagram);
      setFacebook(response.data.facebook);
      setError(null);
    } catch (err) {
      console.error("Error fetching social media links:", err);
      setError("Failed to fetch social media links. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateSocialMediaLinks = async () => {
    try {
      setLoading(true);
      await apiClient.put(apiEndpoints.updateSocialmedia, { 
        twitter,
        youtube,
        instagram,
        facebook
      });
      setSuccessMessage("Social media links updated successfully!");
      setIsEditing(false);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating social media links:", err);
      setError("Failed to update social media links. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSocialMediaLinks();
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-grow">
            <div className="flex-grow p-6 bg-gray-100">
              {/* Social Media Links Management Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Social Media Settings</h2>
                
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
                  <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                        <input
                          type="url"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://twitter.com/yourusername"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                        <input
                          type="url"
                          value={youtube}
                          onChange={(e) => setYoutube(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://youtube.com/c/yourchannel"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input
                          type="url"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://instagram.com/yourusername"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                        <input
                          type="url"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://facebook.com/yourpage"
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Twitter:</span>
                          <span className="text-gray-700">{twitter || "Not set"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">YouTube:</span>
                          <span className="text-gray-700">{youtube || "Not set"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Instagram:</span>
                          <span className="text-gray-700">{instagram || "Not set"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Facebook:</span>
                          <span className="text-gray-700">{facebook || "Not set"}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Edit Social Media Links
                        </button>
                      </div>
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