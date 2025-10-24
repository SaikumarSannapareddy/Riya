import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from "../components/Loader2";

const Step1 = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cropperRef = useRef(null);

  // Compress image to target size
  const compressImage = (file, targetSizeKB = 750) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Initial quality and size reduction
          let quality = 0.9;
          let width = img.width;
          let height = img.height;

          const compressAndCheck = () => {
            // Reset canvas
            canvas.width = width;
            canvas.height = height;

            // Draw image with current quality
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob((blob) => {
              if (blob.size <= targetSizeKB * 1024) {
                resolve(blob);
              } else {
                // Reduce quality or dimensions
                if (quality > 0.1) {
                  quality -= 0.1;
                } else {
                  // If quality is too low, reduce dimensions
                  width = Math.round(width * 0.9);
                  height = Math.round(height * 0.9);
                  quality = 0.9;
                }
                compressAndCheck();
              }
            }, 'image/jpeg', quality);
          };

          compressAndCheck();
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image selection
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image first
        const compressedFile = await compressImage(file);
        
        const previewUrl = URL.createObjectURL(compressedFile);
        setImage(compressedFile);
        setImagePreview(previewUrl);
      } catch (error) {
        console.error("Image compression error:", error);
        alert("Failed to compress image. Please try again.");
      }
    }
  };

  // Convert base64 to Blob
  const base64ToBlob = (base64Data, contentType = "image/jpeg") => {
    const byteCharacters = atob(base64Data.split(",")[1]);
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
  };

  // Handle cropping the image
  const onCrop = useCallback((cropper) => {
    try {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const croppedUrl = canvas.toDataURL();
        setCroppedImage(croppedUrl);
      }
    } catch (error) {
      console.error("Cropping error:", error);
    }
  }, []);

  // Save the cropped image
  const saveCroppedImage = async () => {
    if (!croppedImage) {
      alert("Please crop the image before saving.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    setLoading(true);
    try {
      // Convert cropped image to Blob
      const croppedBlob = base64ToBlob(croppedImage);

      // Compress the cropped image again to ensure size
      const compressedBlob = await compressImage(croppedBlob);

      const formData = new FormData();
      formData.append("image", compressedBlob, "cropped-image.jpg");

      const endpoint = `${apiEndpoints.userImageupdate}/${userId}`;

      const response = await apiClient.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      {/* Top Header */}
      <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center">
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
            Upload User Image
          </h1>
        </div>
      </div>

      {/* Upload Section */}
      <div className="p-6 pt-20 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Upload and Crop Your Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200"
        />
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

        {image && (
          <div className="w-full max-w-lg mt-6 bg-black">
            <Cropper
              ref={cropperRef}
              src={imagePreview}
              onChange={onCrop}
              stencilProps={{
                grid: false,
              }}
              defaultSize={{
                width: 500,
                height: 500,
              }}
              minSize={{
                width: 100,
                height: 100,
              }}
              boundaryStyle={{
                height: 400,
                width: '100%',
                border: '2px solid red', 
              }}
              className="w-full h-[400px]"
            />
          </div>
        )}

        {croppedImage && (
          <div className="mt-4">
            <h3 className="text-center font-semibold">Cropped Image Preview Go Bottom Top Save:</h3>
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="h-full w-full rounded object-cover mx-auto border border-red-300"
            />
          </div>
        )}

        {loading && (
         <Loader />
        )}
      </div>
    </>
  );
};

export default Step1;