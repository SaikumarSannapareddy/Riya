import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, Banner } from './Apis';

import Loader from './Loader';

const BureauImageUpload = () => {
  const navigate = useNavigate();
  const bureauId = localStorage.getItem("bureauId");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // For storing current image from welcomeImageBanner
  const [loading, setLoading] = useState(true); // Loader for fetching current image
  const [uploading, setUploading] = useState(false); // Loader for upload process

  // Fetch the existing bureau image on component mount
  useEffect(() => {
    const fetchBureauImage = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data.bureauProfiles[0];
        setCurrentImage(bureauData.welcomeImageBanner); // Assuming welcomeImageBanner has the current image URL
      } catch (error) {
        console.error("Error fetching bureau image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBureauImage();
  }, [bureauId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set uploading loader to true
    setUploading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("bureauId", bureauId);
    formDataToSend.append("image", image); // Appending image file to FormData

    try {
      const response = await apiClient.put(`${apiEndpoints.Bureauimageupdate}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        window.alert("Image uploaded successfully!");
        setCurrentImage(preview); // Update current image to the new preview after upload
        setPreview(null); // Reset preview
        setUploading(false); // Stop uploading loader
        window.location.reload(); // Reload the page
      } else {
        window.alert("Failed to upload image.");
        setUploading(false); // Stop uploading loader
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("There was an error uploading the image.");
      setUploading(false); // Stop uploading loader
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
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg h-auto">
            <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-8">
              Upload Bureau Welcome Banner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Image Display */}
              {currentImage && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700">Current Image:</h3>
                  <img 
                    src={`${Banner}/${currentImage}`} 
                    alt="Current Bureau" 
                    className="mt-2 w-32 h-32 object-cover rounded-md" 
                  />
                </div>
              )}

              {/* Image Upload Field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Upload New Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 w-full px-4 py-2 border border-black rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              {/* New Image Preview */}
              {preview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">New Image Preview:</h3>
                  <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-yellow-500 text-white py-2 rounded-md"
                  disabled={uploading} // Disable button when uploading
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BureauImageUpload;
