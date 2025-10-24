import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BiShow, BiHide } from "react-icons/bi";
import apiClient, { apiEndpoints } from "../components/Apis1";
import { useNavigate } from "react-router-dom";

import PrivateRoute from "../components/PrivateRoute";

const bureauuId = localStorage.getItem("bureauId");
const User_Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gender: "",
    createdBy: "",
    paymentStatus: "",
    image: null,
    imagePrivacy: "",
    countryCode: "",
    mobileNumber: "",
    email: "",
    password: "",
    bureauId: bureauuId,
    step1: 1,
    martialId: "",
    profileStatus: "",
    servicePreference: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Generate a 7-digit unique number for martialId
  const generateMartialId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for required fields
    if (!formData.password || !formData.mobileNumber) {
      setError("password, and mobile number are required");
      return;
    }

    // Generate martialId before sending the form data
    const martialId = generateMartialId();

    // Prepare the form data for submission, including martialId
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Add martialId to form data
    formDataToSend.append("martialId", martialId);

    try {
      setLoading(true);
      setError("");

      // Use apiClient.post with the register endpoint from apiEndpoints
      const response = await apiClient.post(
        apiEndpoints.register,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        }
      );

      // Check if the response has a userId
      const { userId } = response.data;
      if (userId) {
        // Store the user ID in local storage
        localStorage.setItem("userId", userId);
        console.log("User ID stored:", userId);
      }

      // Handle success (you can redirect or show a success message)
      alert("Registration successful!");

      // Navigate to the second form and pass the userId in the state
      navigate("/step2", { state: { userId } });
    } catch (err) {
      // Handle error
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <PrivateRoute>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg  my-5 ">
        <div className="flex items-center mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full p-4">
  <button onClick={handleBack} className="p-2">
    <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
  </button>
  <h2 className="text-2xl font-semibold text-white ml-4">
    Step 1: Personal Details
  </h2>
</div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 px-3 mt-20">
            {/* Gender */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Created By */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Created By
              </label>
              <select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="">Select created</option>
                <option value="self">Self</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="friend">Friend</option>
                <option value="relatives">Relatives</option>

                <option value="sister">Sister</option>
                <option value="brother">Brother</option>
                <option value="other_mediater">Other Mediater</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="free">Free Member</option>
                <option value="paid">Paid Member</option>
              </select>
            </div>

            {/* Profile Status */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Profile Status
              </label>
              <select
                name="profileStatus"
                value={formData.profileStatus}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="local">Local Profile</option>
                <option value="nri">NRI Profile</option>
              </select>
            </div>

            {/* Service Preference */}
            <div className="mt-4">
              <label className="block text-indigo-500 font-medium mb-2">
                Service Preference
              </label>
              <select
                name="servicePreference"
                value={formData.servicePreference}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="online">Only Online Service</option>
                <option value="offline">Only Offline Service</option>
                <option value="both">Online/Offline Service</option>
              </select>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Upload User Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              />
            </div>

            {/* Image Privacy */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Image Privacy
              </label>
              <select
                name="imagePrivacy"
                value={formData.imagePrivacy}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              >
                <option value="all" selected>
                  Publish to All Members
                </option>
                <option value="accepted">Only Accepted Members</option>
                <option value="none">Do Not Publish</option>
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Mobile Number
              </label>
              <div className="flex space-x-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-1/3 p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                >
                  <option value="+91" selected>
                    +91 (India)
                  </option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (Australia)</option>
                </select>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-2/3 p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-indigo-500 font-medium mb-2">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? (
                    <BiHide className="h-6 w-6" />
                  ) : (
                    <BiShow className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Bureau ID */}
            {/* Terms and Conditions */}
            <div className="mt-6">
              <label className="inline-flex items-center">
                <input
                required
                  type="checkbox"
                  name="termsAccepted"
                  className="w-5 h-5 text-indigo-500 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700 text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="text-indigo-500 underline hover:text-indigo-700"
                  >
                    Terms and Conditions
                  </button>
                  .
                </span>
              </label>
            </div>
  {/* Modal for Terms and Conditions */}
  {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                Terms and Conditions
              </h3>
              <p className="text-gray-700 mb-4">
                Here are the terms and conditions. You must agree to these terms
                to proceed with registration.
              </p>
              <button
                onClick={toggleModal}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                value="Next"
                disabled={loading}
                className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default User_Register;
