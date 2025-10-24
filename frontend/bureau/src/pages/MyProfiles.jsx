import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Import back icon
import { useNavigate } from "react-router-dom"; // Import navigate function for back navigation
import apiClient, { apiEndpoints } from '../components/Apis';
import Loader from '../components/Loader';
import TopNavbar from "../components/Gnavbar";


const MyProfiles = () => {
  const navigate = useNavigate(); // Initialize navigate function for back button
  const bureauId = localStorage.getItem("bureauId");

  const [formData, setFormData] = useState({
    bureauName: "",
    mobileNumber: "",
    about: "",
    location: "", 
    email: "",
    // facebook: "",
    // instagram: "",
    // linkedin: "",
    // youtube: "",
    // twitter: "",
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
        <div>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ">
      <TopNavbar />

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
              Bureau Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bureau Name */}
              <div>
                <label htmlFor="bureauName" className="block text-sm font-medium text-gray-700">
                  Bureau Name
                </label>
                <input
                  type="text"
                  id="bureauName"
                  name="bureauName"
                  value={formData.bureauName}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* About */}
              <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* Social Media Links */}
              {/* {["facebook", "instagram", "linkedin", "youtube", "twitter"].map((platform) => (
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
              ))} */}

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
        </div>
    
    
          </div>

    </>
  );
};

export default MyProfiles;
