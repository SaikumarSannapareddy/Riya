import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import TopNavbar from "../components/Gnavbar";
import Bottomnav from "../components/Bottomnav";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, Banner } from "../components/Apis";

const NavbarLogo = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const bureauId = localStorage.getItem("bureauId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data.bureauProfiles[0];
        setCurrentLogo(bureauData.navbarLogo);
      } catch (error) {
        setCurrentLogo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLogo();
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
    const formData = new FormData();
    formData.append("bureauId", bureauId);
    formData.append("image", image);
    try {
      const response = await apiClient.put(apiEndpoints.NavbarLogoUpdate, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.status === 200) {
        window.alert("Logo uploaded successfully!");
        setCurrentLogo(response.data.logoUrl);
        setPreview(null);
        setUploading(false);
        window.location.reload();
      } else {
        window.alert("Failed to upload logo.");
        setUploading(false);
      }
    } catch (error) {
      window.alert("There was an error uploading the logo.");
      setUploading(false);
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
        <h2 className="text-center text-xl font-bold text-purple-700 mb-4">
          Upload Navbar Logo
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : currentLogo ? (
          <div className="mb-4">
            <img
              src={Banner + currentLogo}
              alt="Current Logo"
              className="w-full h-32 object-contain rounded bg-gray-50 border"
            />
            <p className="text-center text-sm text-gray-600 mt-2">Current Navbar Logo</p>
          </div>
        ) : (
          <div className="mb-4 text-center text-gray-500">No logo uploaded yet</div>
        )}
        <label className="block text-gray-700 mb-2">Upload New Logo</label>
        <input
          type="file"
          accept="image/*"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          onChange={handleImageChange}
        />
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-32 object-contain rounded bg-gray-50 border" />
            <p className="text-center text-xs text-gray-500 mt-1">Preview</p>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!image || uploading}
          className={`w-full py-2 rounded ${image && !uploading ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {uploading ? 'Uploading...' : 'Upload Logo'}
        </button>
      </div>
      <Bottomnav />
    </div>
  );
};

export default NavbarLogo; 