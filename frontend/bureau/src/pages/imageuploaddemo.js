import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import apiClient, { apiEndpoints } from "../components/Apis1";

const Step1 = () => {
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

  // Convert base64 to Blob
  function base64ToBlob(base64Data, contentType = 'image/jpeg') {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  // Save the cropped image
  const saveCroppedImage = async () => {
    if (!croppedImage) {
      alert("Please crop the image before saving.");
      return;
    }

    const formData = new FormData();
    const imageBlob = base64ToBlob(croppedImage);  // Convert base64 to Blob
    formData.append("image", imageBlob, "cropped-image.jpg");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${apiEndpoints.userImageupdate}/${userId}`;

      const response = await apiClient.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Ensure this is set
        },
      });

      setLoading(false);

      if (response.data?.image) {
        alert("Image uploaded and updated successfully!");
        localStorage.setItem("userId", userId);

        navigate("/step2");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setImage(null);
    setImagePreview(null);
    setCroppedImage(null);
  };

  return (
    <>
        <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Back Arrow Icon */}
          <button className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Step Title */}
          <h1 className="text-2xl font-bold text-center text-white py-3">
            Upload User Image
          </h1><br />

        </div>
     
      </div>

      <div className="p-6 pt-20 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Upload and Crop Your Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200"
        />

        {image && (
          <div className="w-full max-w-lg mt-6">
            <Cropper
              ref={cropperRef}
              src={imagePreview}
              style={{ height: 400, width: "100%" }}
              aspectRatio={1}
              guides={false}
              crop={onCrop}
            />
          </div>
        )}

        {croppedImage && (
          <div className="mt-4">
            <h3 className="text-center font-semibold">Cropped Image:</h3>
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="h-32 w-32 rounded object-cover mx-auto border border-gray-300"
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            onClick={saveCroppedImage}
            disabled={loading}
          >
            Save Cropped Image
          </button>
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={cancelCrop}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Step1;
