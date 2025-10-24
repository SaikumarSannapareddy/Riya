import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "./Apis";
import Loader from "./Loader";

const CreateDistributor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    createdAt: new Date().toISOString().slice(0, 19),
    location: "",
    paymentStatus: 0,
    companyName: "",
    owner_profile: "", // Empty initially, should be populated with the file
    documents: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files, // Store the selected file(s)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobileNumber ||
      !formData.password ||
      !formData.companyName
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true); // Show loader
    const formDataObj = new FormData();
    for (const key in formData) {
      if (key === "documents" && formData.documents) {
        Array.from(formData.documents).forEach((file) =>
          formDataObj.append("documents", file)
        );
      }

      if (key === "owner_profile" && formData.owner_profile?.length > 0) {
        formDataObj.append("owner_profile", formData.owner_profile[0]);
      }

      if (key !== "documents" && key !== "owner_profile") {
        formDataObj.append(key, formData[key]);
      }
    }

    try {
      const response = await apiClient.post(
        apiEndpoints.Createdistributers,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        window.alert("Distributor created successfully!");
        navigate("/distributors/manage");
      } else {
        window.alert(
          response.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      window.alert(
        "An error occurred. Please try again or check if the distributor already exists."
      );
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
        Create Distributor
      </h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {loading && <Loader />} {/* Show loader if loading */}
      <form onSubmit={handleSubmit}>
        {/* Other form fields... */}

        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-600"
          >
            Full Name
          </label>
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
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
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-600"
          >
            Mobile Number
          </label>
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
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
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-600"
          >
            Location
          </label>
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

        {/* Company Name and Payment Status in a row */}
        <div className="mb-4 flex space-x-4">
          {/* Company Name */}
          <div className="w-1/2">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-600"
            >
              Company Name
            </label>
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
            <label
              htmlFor="paymentStatus"
              className="block text-sm font-medium text-gray-600"
            >
              Payment Status
            </label>
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

        {/* Owner profile */}
        <div className="mb-4">
          <label
            htmlFor="documents"
            className="block text-sm font-medium text-gray-600"
          >
            Owner Profile
          </label>
          <input
            type="file"
            id="owner_profile"
            name="owner_profile"
            onChange={handleFileChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Created At */}
        <div className="mb-4">
          <label
            htmlFor="createdAt"
            className="block text-sm font-medium text-gray-600"
          >
            Created At
          </label>
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
        {/* Documents Upload */}
        <div className="mb-4">
          <label
            htmlFor="documents"
            className="block text-sm font-medium text-gray-600"
          >
            Upload Documents
          </label>
          <input
            type="file"
            id="documents"
            name="documents"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg focus:outline-none"
          >
            {loading ? "Creating..." : "Create Distributor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDistributor;
