import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection after form submission

const CreateDistributor = () => {
  const navigate = useNavigate(); // Hook for navigation after successful submission
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    createdAt: new Date().toISOString().slice(0, 19), // Set current date and time as default
    location: "",
    paymentStatus: 0, // 0 = Unpaid, 1 = Paid
    distributorId: "",
    companyName: "",
  });
  const [error, setError] = useState(""); // To display error messages

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.mobileNumber || !formData.password || !formData.companyName) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/distributor/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the distributor list or other page upon success
        navigate("/distributors/manage");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Create Distributor</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter email"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-600">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter mobile number"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter password"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-600">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter location"
            required
          />
        </div>

        {/* Distributor ID */}
        <div className="mb-4">
          <label htmlFor="distributorId" className="block text-sm font-medium text-gray-600">Distributor ID</label>
          <input
            type="text"
            id="distributorId"
            name="distributorId"
            value={formData.distributorId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter distributor ID"
            required
          />
        </div>

        {/* Company Name and Payment Status in a row */}
        <div className="mb-4 flex space-x-4">
          {/* Company Name */}
          <div className="w-1/2">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-600">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Payment Status */}
          <div className="w-1/2">
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-600">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value={0}>Unpaid</option>
              <option value={1}>Paid</option>
            </select>
          </div>
        </div>

        {/* Created At */}
        <div className="mb-4">
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-600">Created At</label>
          <input
            type="datetime-local"
            id="createdAt"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg focus:outline-none"
          >
            Create Distributor
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDistributor;
