import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import TopNavbar from "../components/Gnavbar";
import Bottomnav from "../components/Bottomnav";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "./Apis";

const EditYourImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const bureauId = localStorage.getItem("bureauId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileImage();
  }, []);

  // Fetch the profile image from the backend
  const fetchProfileImage = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.profiles, {
        headers: { bureauId },
      });

      // Check if profile_img exists and is not null 
      if (response.data.profile_img) {
        setProfileImage(`data:image/jpeg;base64,${response.data.profile_img}`);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImage(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Optional: Add image size and type validation
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }
 
      if (file.size > maxSize) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          // Resize if too large
          const maxDimension = 1024;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          let quality = 0.85;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          // Reduce quality until under maxSizeKB or minimum quality
          while (dataUrl.length / 1024 > maxSizeKB && quality > 0.4) {
            quality -= 0.05;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          if (dataUrl.length / 1024 > maxSizeKB) {
            reject(new Error('Could not compress image below 500KB.'));
          } else {
            // Convert dataURL to Blob
            fetch(dataUrl)
              .then(res => res.blob())
              .then(blob => {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              });
          }
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }
    let fileToUpload = selectedFile;
    if (selectedFile.size > 500 * 1024) {
      try {
        fileToUpload = await compressImage(selectedFile, 500);
      } catch (err) {
        alert("Image is too large and could not be compressed below 500KB. Please choose a smaller image.");
        return;
      }
    }
    const formData = new FormData();
    formData.append("profile_img", fileToUpload);
    try {
      await apiClient.post(apiEndpoints.profiles, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          bureauId,
        },
      });
      alert("Image uploaded successfully!");
      fetchProfileImage(); // Refresh profile image after upload
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="flex justify-center mt-20 min-h-screen bg-gray-100">
      <TopNavbar />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div
          className="flex items-center text-blue-600 cursor-pointer mb-4"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> <span>Back</span>
        </div>
        <h2 className="text-center text-xl font-bold text-yellow-700 mb-4">
          Upload Your Image
        </h2>

        {profileImage ? (
          <div className="mb-4">
            <img
              src={profileImage}
              alt="Current Profile"
              className="w-full h-40 object-cover rounded"
            />
            <p className="text-center text-sm text-gray-600 mt-2">Current Profile Image</p>
          </div>
        ) : (
          <div className="mb-4 text-center text-gray-500">
            No profile image uploaded yet
          </div>
        )}

        <label className="block text-gray-700 mb-2">Upload New Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`w-full py-2 rounded ${
            selectedFile 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Upload Image
        </button>
      </div>
      <Bottomnav />
    </div>
  );
};

export default EditYourImage;