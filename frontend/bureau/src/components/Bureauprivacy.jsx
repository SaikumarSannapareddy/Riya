import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from './Apis';
import Loader from './Loader';

const BureauForm = () => {
  const navigate = useNavigate();
  const bureauId = localStorage.getItem("bureauId");

  const [otherbuttons, setOtherbuttons] = useState("show");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileSettings = async () => {
      try {
        const response = await apiClient.post(apiEndpoints.bureaubuttonfetch, {
          bureauId: bureauId,
        });
        console.log("Reafds",response)

        const bureauData = response.data;

        console.log("bureau Data",bureauData)
        
        // Ensure we're setting the correct string value
        setOtherbuttons(bureauData.otherbuttons || "show");
      } catch (error) {
        console.error("Error fetching profile settings:", error);
        // Set default value on error
        setOtherbuttons("show");
      } finally {
        setLoading(false);
      }
    };

    if (bureauId) {
      fetchProfileSettings();
    } else {
      setLoading(false);
    }
  }, [bureauId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send as JSON instead of FormData for consistency
      const response = await apiClient.put(apiEndpoints.bureaubutton, {
        bureauId: bureauId,
        otherbuttons: otherbuttons // This will be "show" or "hide"
      });
      
      if (response.status === 200) {
        window.alert("Profile visibility settings updated successfully!");
      } else {
        window.alert("Failed to update profile visibility settings.");
      }
    } catch (error) {
      console.error("Error updating profile visibility settings:", error);
      window.alert("There was an error updating the profile visibility settings.");
    }
  };

  // Helper function to get display text
  const getStatusText = () => {
    return otherbuttons === "show" 
      ? "Other profiles are currently visible" 
      : "Other profiles are currently hidden";
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-auto bg-gray-100 py-10 px-4 mt-20 mb-20">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg h-auto">
            <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-8">
              Profile Visibility Settings
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Visibility Toggle */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Other Profiles Visibility
                </h3>
                
                <div className="space-y-4">
                  {/* Show Other Profiles Option */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={otherbuttons === "show"}
                      onChange={() => setOtherbuttons("show")}
                      className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Show Other Profiles</span>
                      <p className="text-xs text-gray-500">Other users can see and interact with other profiles</p>
                    </div>
                  </label>

                  {/* Hide Other Profiles Option */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={otherbuttons === "hide"}
                      onChange={() => setOtherbuttons("hide")}
                      className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Hide Other Profiles</span>
                      <p className="text-xs text-gray-500">Other profiles will be hidden from view</p>
                    </div>
                  </label>
                </div>

                {/* Current Status Indicator */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Current Status:</span> {getStatusText()}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-md font-medium transition duration-200"
                >
                  Update Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BureauForm;