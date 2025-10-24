import React, { useState } from "react";
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints

const PhotoUploadForm = () => {
  const [images, setImages] = useState(Array(10).fill(null)); // 10 mini-boxes
  const [currentIndex, setCurrentIndex] = useState(null); // Current mini-box index

  // Handle Image Selection
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentIndex(index);

    // Update images array with the uploaded file object
    setImages(prev => {
      const updatedImages = [...prev];
      updatedImages[index] = file;
      return updatedImages;
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID is missing!");
        return;
      }
      formData.append("userId", userId);

      // Append all images to formData
      images.forEach((image, index) => {
        if (image) {
          formData.append("images[]", image, `image_${index}.jpeg`);
        }
      });

      // Log FormData to check
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const endpoint = `${apiEndpoints.usergallery}/${userId}/gallery`;
      const response = await apiClient.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Gallery updated successfully!");
        setImages(Array(10).fill(null)); // Reset images after successful upload
      } else {
        alert("Failed to update gallery.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Photos</h2>
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative border rounded w-20 h-20 flex items-center justify-center bg-gray-100"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt={`Box ${index}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setCurrentIndex(index)} // No cropping, just set the current box
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, index)}
                />
                <span className="text-gray-500 text-sm">+</span>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default PhotoUploadForm;
