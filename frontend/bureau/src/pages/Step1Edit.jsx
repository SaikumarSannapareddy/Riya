import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from "../components/Loader2";

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
 const { id } = useParams(); // Get the ID from the URL
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
    compressImage(image, async (compressedBlob) => {
      const formData = new FormData();
      formData.append("image", compressedBlob, "compressed-cropped-image.jpg");

      try {
        const endpoint = `${apiEndpoints.userImageupdate}/${id}`;

        const response = await apiClient.put(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setLoading(false);

        if (response.data?.image) {
          alert("Image uploaded and updated successfully!");
          localStorage.setItem("userId", id);
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
    navigate(-1); // Navigate to the previous page
  };
  return (
    <>
      {/* Top Header */}
      <div className="w-full z-50 bg-purple-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              onClick={handleBackClick}
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
      <div className="p-6 pt-20 flex flex-col items-center bg-purple-50 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Upload and Crop Your Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border file:border-purple-300 file:text-purple-700 file:bg-purple-100 hover:file:bg-purple-200"
        />
         <div className="mt-6 flex gap-4">
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={saveCroppedImage}
            disabled={loading}
          >
            Set New Profile Picture
          </button>
          <button
            className="bg-purple-300 text-white px-6 py-2 rounded-lg hover:bg-purple-400 transition"
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
            <h3 className="text-center font-semibold">Cropped Image Preview Go Bottom Top Save:</h3>
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="h-full w-full rounded object-cover mx-auto border border-purple-200"
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
