import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon
import { useNavigate } from "react-router-dom"; // Import navigate function for back navigation
import apiClient, { apiEndpoints } from './Apis';
import Loader from './Loader';

const EditSocialMediaPages = () => {
  const navigate = useNavigate(); // Initialize navigate function for back button
  const bureauId = localStorage.getItem("bureauId");

  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    bureauId: bureauId,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data.bureauProfiles[0];

        setFormData({
           bureauName: bureauData.bureauName || "",
          mobileNumber: bureauData.mobileNumber || "",
          about: bureauData.about || "",
          location: bureauData.location || "",
          email: bureauData.email || "",
          facebook: bureauData.facebook || "", 
          instagram: bureauData.instagram || "",
          linkedin: bureauData.linkedin || "",
          youtube: bureauData.youtube || "",
          twitter: bureauData.twitter || "",
          bureauId: bureauData.bureauId || bureauId,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [bureauId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await apiClient.put(`${apiEndpoints.Bureauupdate}`, formDataToSend);
      if (response.status === 200) {
        window.alert("Bureau information updated successfully!");
      } else {
        window.alert("Failed to update bureau information.");
      }
    } catch (error) {
      console.error("Error updating bureau information:", error);
      window.alert("There was an error updating the bureau information.");
    }
  };

  return (
    <> 
      {loading ? (
        <Loader />
      ) : (
        <div className="h-auto bg-gray-100 py-10 px-4 mt-20 mb-20">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back 
          </button>

          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg h-auto">
            <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-8">
              Social Media Pages 
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            

              {/* Social Media Links */}
              {["facebook", "instagram", "linkedin", "youtube", "twitter"].map((platform) => (
                <div key={platform}>
                  <label htmlFor={platform} className="block text-sm font-medium text-gray-700">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} Link
                  </label>
                  <input
                    type="url"
                    id={platform}
                    name={platform}
                    value={formData[platform]}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              ))}

              {/* Submit Button */}
              <div>
                <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded-md">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditSocialMediaPages;
