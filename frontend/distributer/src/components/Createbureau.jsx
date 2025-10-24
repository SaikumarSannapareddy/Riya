import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import apiClient, { apiEndpoints } from "./Apis";

const CreateBureau = () => {
  const navigate = useNavigate();
  const distributorId = localStorage.getItem("distributorId");
  const [formData, setFormData] = useState({
    bureauName: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    password: "",
    about: "",
    location: "",
    paymentStatus: 0,
    distributorId: distributorId,
    documents: [],
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      documents: e.target.files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      
      // Append form fields that match backend expectations
      formDataObj.append('bureauName', formData.bureauName);
      formDataObj.append('ownerName', formData.ownerName);
      formDataObj.append('mobileNumber', formData.mobileNumber);
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('about', formData.about);
      formDataObj.append('location', formData.location);
      formDataObj.append('paymentStatus', formData.paymentStatus);
      formDataObj.append('distributorId', formData.distributorId);
      
      // Append documents
      if (formData.documents) {
        Array.from(formData.documents).forEach((file) => {
          formDataObj.append("documents", file);
        });
      }

      const response = await apiClient.post(apiEndpoints.CreateBureau, formDataObj);
      if (response.status === 201) {
        alert("Bureau created successfully!");
        navigate("/bureau/manage");
      } else {
        alert(response.data?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create Bureau</h2>
      {loading && <Loader />}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block text-gray-700 font-medium mb-2">Bureau Name *</label>
        <input 
          type="text" 
          name="bureauName" 
          placeholder="Enter bureau name" 
          value={formData.bureauName} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">Owner Name *</label>
        <input 
          type="text" 
          name="ownerName" 
          placeholder="Enter owner name" 
          value={formData.ownerName} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
        <input 
          type="tel" 
          name="mobileNumber" 
          placeholder="Enter mobile number" 
          value={formData.mobileNumber} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">Email *</label>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter email address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">Password *</label>
        <input 
          type="password" 
          name="password" 
          placeholder="Create a secure password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">About Bureau *</label>
        <textarea 
          name="about" 
          placeholder="Describe your bureau services and specialties" 
          value={formData.about} 
          onChange={handleChange} 
          required 
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
        ></textarea>
        
        <label className="block text-gray-700 font-medium mb-2">Location *</label>
        <input 
          type="text" 
          name="location" 
          placeholder="Enter bureau location" 
          value={formData.location} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        
        <label className="block text-gray-700 font-medium mb-2">Payment Status</label>
        <select 
          name="paymentStatus" 
          value={formData.paymentStatus} 
          onChange={handleChange} 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="0">Unpaid</option>
          <option value="1">Paid</option>
        </select>

        <label className="block text-gray-700 font-medium mb-2">Upload Documents</label>
        <input 
          type="file" 
          multiple 
          name="documents" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
        />
        <p className="text-sm text-gray-500 mb-6">You can upload multiple files (PDF, DOC, DOCX, JPG, JPEG, PNG)</p>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? "Creating Bureau..." : "Create Bureau"}
        </button>
      </form>
    </div>
  );
};

export default CreateBureau;