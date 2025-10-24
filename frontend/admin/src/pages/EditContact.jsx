import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import PrivateRoute from "../components/PrivateRoute";
import apiClient, { apiEndpoints } from "../components/Apis";

const AdminDashboard = ({ isSidebarOpen, toggleSidebar }) => {
  const [bemail, setBemail] = useState("");
  const [bnumber, setBnumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch business details on component mount
  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setBemail(response.data.bemail);
      setBnumber(response.data.bnumber);
      setError(null);
    } catch (err) {
      console.error("Error fetching business details:", err);
      setError("Failed to fetch business details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessDetails = async () => {
    try {
      setLoading(true);
      await apiClient.put(apiEndpoints.updateContact, { 
        bemail,
        bnumber
      });
      setSuccessMessage("Business details updated successfully!");
      setIsEditing(false);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating business details:", err);
      setError("Failed to update business details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessDetails();
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-grow">
            <div className="flex-grow p-6 bg-gray-100">
              {/* Business Details Management Section */}
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

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                        <input
                          type="email"
                          value={bemail}
                          onChange={(e) => setBemail(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter business email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone Number</label>
                        <input
                          type="tel"
                          value={bnumber}
                          onChange={(e) => setBnumber(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter business phone number"
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Business Email:</span>
                          <span className="text-gray-700">{bemail || "No business email set"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700 mr-2">Business Phone:</span>
                          <span className="text-gray-700">{bnumber || "No business phone set"}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Edit Contact Info
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