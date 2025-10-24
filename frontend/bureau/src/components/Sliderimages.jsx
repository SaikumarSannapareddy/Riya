import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, Banner } from './Apis';
import Loader from './Loader';

const BureauImageUpload = () => {
  const navigate = useNavigate();
  const bureauId = localStorage.getItem("bureauId");
  

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control modal visibility
  const [imageIdToDelete, setImageIdToDelete] = useState(null); // State to store the image ID to delete

  useEffect(() => { 
    const fetchBannerImages = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.BureauGetsliderimages}/${bureauId}`);
        console.log(response.data);
        // Check if the response contains the expected data structure
        if (response.data && response.data.data) {
          setBannerImages(response.data.data); // Assuming response.data.data contains the images array
        } else {
          setBannerImages([]);
        }
      } catch (error) {
        console.error("Error fetching banner images:", error);
        setBannerImages([]);
      }
    };

    if (bureauId) {
      fetchBannerImages();
    }
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
    setUploading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("bureauId", bureauId);
    formDataToSend.append("image", image);

    try {
      const response = await apiClient.post(`${apiEndpoints.BureauSliderimages}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        window.alert("Image uploaded successfully!");
        setPreview(null);
        setUploading(false);
        window.location.reload();
      } else {
        window.alert("Failed to upload image.");
        setUploading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      window.alert("There was an error uploading the image.");
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false); // Close modal

    try {
      const response = await apiClient.delete(`${apiEndpoints.DeleteSliderimage}/${imageIdToDelete}`);
      if (response.status === 200) {
        window.alert("Image deleted successfully!");
        setBannerImages(bannerImages.filter((image) => image.id !== imageIdToDelete)); // Update state by removing the deleted image
      } else {
        window.alert("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      window.alert("There was an error deleting the image.");
    }
  };

  return (
    <>
      {uploading ? (
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
              Upload / Manage Slider Images
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Display All Banner Images as Thumbnails */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Slider Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {bannerImages.length > 0 ? (
                  bannerImages.map((image, index) => {
                    const imageUrl = `${Banner}${image.imageUrl}`;
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Banner ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md cursor-pointer"
                        />
                        {/* Delete Icon */}
                        <button
                          onClick={() => { setImageIdToDelete(image.id); setShowDeleteModal(true); }}
                          className="absolute top-0 right-0 text-white bg-red-600 p-1 rounded-full shadow-md hover:bg-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>No images found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Are you sure you want to delete this image?</h3>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BureauImageUpload;
