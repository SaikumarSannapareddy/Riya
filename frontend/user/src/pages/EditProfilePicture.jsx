import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditProfilePicture = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cropperRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(previewUrl);
    }
  };

  // Auto-compress image to 500KB using canvas
  const compressImage = (file, callback) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaleFactor = Math.sqrt(500 * 1024 / file.size); // Scale based on 500KB limit

      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => callback(blob),
        "image/jpeg",
        0.7 // Compression quality
      );
    };
  };

  // Handle cropping the image
  const onCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedUrl = croppedCanvas.toDataURL();
        setCroppedImage(croppedUrl);
      }
    }
  };

  // Save the cropped image
  const saveCroppedImage = async () => {
    if (!croppedImage) {
      alert("Please crop the image before saving.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login again.");
      navigate('/login');
      return;
    }

    setLoading(true);
    compressImage(image, async (compressedBlob) => {
      const formData = new FormData();
      formData.append("image", compressedBlob, "compressed-cropped-image.jpg");

      try {
        // Get user data to get the user ID
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        
        if (!user || !user._id) {
          alert("User data not found. Please login again.");
          navigate('/login');
          return;
        }

        const endpoint = `${apiEndpoints2.userImageupdate}/${user._id}`;

        const response = await apiClient2.put(endpoint, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
        });

        setLoading(false);

        if (response.data?.image) {
          alert("Image uploaded and updated successfully!");
          // Update local storage with new image
          const updatedUser = { ...user, image: response.data.image };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          navigate(-1);
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        alert("An error occurred while uploading the image.");
      }
    });
  };

  // Cancel cropping
  const cancelCrop = () => {
    setImage(null);
    setImagePreview(null);
    setCroppedImage(null);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">
            Edit Profile Picture
          </h1>
        </div>
      </div>

      {/* Upload Section */}
      <div className="p-6 pt-20 flex flex-col items-center bg-white rounded-lg shadow-lg mx-4 mt-4">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Upload and Crop Your Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border file:border-blue-300 file:text-blue-700 file:bg-blue-100 hover:file:bg-blue-200"
        />
        
        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            onClick={saveCroppedImage}
            disabled={loading || !croppedImage}
          >
            {loading ? "Uploading..." : "Set New Profile Picture"}
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={cancelCrop}
          >
            Cancel
          </button>
        </div>

        {image && (
          <div className="w-full max-w-lg mt-6">
            <Cropper
              ref={cropperRef}
              src={imagePreview}
              style={{ height: 400, width: "100%" }}
              aspectRatio={null}
              guides={false}
              crop={onCrop}
            />
          </div>
        )}

        {croppedImage && (
          <div className="mt-4">
            <h3 className="text-center font-semibold mb-2">Cropped Image Preview:</h3>
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="h-48 w-48 rounded object-cover mx-auto border border-gray-200"
            />
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePicture; 