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

  // Slider images state
  const [sliderImages, setSliderImages] = useState([]);
  const [sliderImageLoading, setSliderImageLoading] = useState(false);
  const [sliderImageError, setSliderImageError] = useState(null);
  const [sliderSuccessMessage, setSliderSuccessMessage] = useState("");
  const [selectedSliderFile, setSelectedSliderFile] = useState(null);
  const [sliderPreviewUrl, setSliderPreviewUrl] = useState(null);
  const sliderFileInputRef = useRef(null);

  // Fetch business name, logo, and slider images on component mount
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
      
      // Set slider images if available
      if (response.data.sliderImages) {
        setSliderImages(response.data.sliderImages);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching business details:", err);
      setError("Failed to fetch business details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessName();
  };


  // Slider Image Handlers
  const handleSliderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSliderFile(file);
      
      // Create preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setSliderPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const uploadSliderImage = async (e) => {
    e.preventDefault();
    
    if (!selectedSliderFile) {
      setSliderImageError("Please select an image");
      return;
    }

    // Check if we already have 5 slider images
    if (sliderImages.length >= 5) {
      setSliderImageError("Maximum limit of 5 slider images has been reached. Delete an existing image before adding a new one.");
      return;
    }

    const formData = new FormData();
    formData.append('sliderImage', selectedSliderFile);

    try {
      setSliderImageLoading(true);
      const response = await apiClient.put(
        apiEndpoints.Sliderimages, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Add the new slider image to the state
      setSliderImages([...sliderImages, response.data.image]);
      setSliderSuccessMessage("Slider image uploaded successfully!");
      setSliderImageError(null);
      setSelectedSliderFile(null);
      setSliderPreviewUrl(null);
      
      // Clear file input
      if (sliderFileInputRef.current) {
        sliderFileInputRef.current.value = "";
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSliderSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error uploading slider image:", err);
      setSliderImageError("Failed to upload slider image. Please try again later.");
    } finally {
      setSliderImageLoading(false);
    }
  };

  const deleteSliderImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slider image?")) {
      return;
    }

    try {
      setSliderImageLoading(true);
      await apiClient.delete(`${apiEndpoints.Sliderimages}/${id}`);
      
      // Remove the deleted image from the state
      setSliderImages(sliderImages.filter(img => img.id !== id));
      setSliderSuccessMessage("Slider image deleted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSliderSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting slider image:", err);
      setSliderImageError("Failed to delete slider image. Please try again later.");
    } finally {
      setSliderImageLoading(false);
    }
  };

  const cancelSliderImageUpload = () => {
    setSelectedSliderFile(null);
    setSliderPreviewUrl(null);
    setSliderImageError(null);
    
    // Clear file input
    if (sliderFileInputRef.current) {
      sliderFileInputRef.current.value = "";
    }
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
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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

              </div>

              {/* Slider Images Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Slider Images</h2>
                <p className="text-gray-600 mb-4">
                  You can upload up to 5 slider images that will be displayed on your website's homepage.
                </p>
                
                {sliderImageError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {sliderImageError}
                  </div>
                )}
                
                {sliderSuccessMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {sliderSuccessMessage}
                  </div>
                )}
                
                {/* Current Slider Images */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Current Slider Images ({sliderImages.length}/5)</h3>
                  
                  {sliderImages.length === 0 ? (
                    <p className="text-gray-500">No slider images uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sliderImages.map((image) => (
                        <div key={image.id} className="relative border border-gray-300 rounded-md overflow-hidden">
                          <img 
                            src={`${Uploads}/${image.path}`}
                            alt={`Slider Image ${image.id}`}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={() => deleteSliderImage(image.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={sliderImageLoading}
                            title="Delete image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Upload New Slider Image */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Upload New Slider Image</h3>
                  
                  {sliderImages.length >= 5 ? (
                    <p className="text-amber-600">
                      Maximum limit of 5 slider images reached. Delete an existing image before adding a new one.
                    </p>
                  ) : (
                    <form onSubmit={uploadSliderImage} className="space-y-4">
                      <div className="mb-4">
                        <input
                          type="file"
                          ref={sliderFileInputRef}
                          onChange={handleSliderImageChange}
                          accept="image/*"
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {sliderPreviewUrl && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <img 
                            src={sliderPreviewUrl} 
                            alt="Slider Image Preview" 
                            className="h-48 object-contain border border-gray-300 rounded-md p-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={sliderImageLoading || !selectedSliderFile}
                        >
                          {sliderImageLoading ? "Uploading..." : "Upload Image"}
                        </button>
                        
                        {selectedSliderFile && (
                          <button
                            type="button"
                            onClick={cancelSliderImageUpload}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={sliderImageLoading}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
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