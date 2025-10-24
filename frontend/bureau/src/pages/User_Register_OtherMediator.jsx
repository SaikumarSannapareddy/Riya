import React, { useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from '../components/Loader2';
import TermsModal from '../components/TermsModal';

// Generate a 6-character password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate a 6-digit numeric password
const generateNumericPassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Step1 = () => {
  const [modalData, setModalData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    gender: { value: "", label: "Select Gender" },
    profileStatus: { value: "Indian profile", label: "Indian Profile" },
    servicePreference: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(generateNumericPassword());
  const [countryCode, setCountryCode] = useState("+91");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
 const { id } = useParams(); 
 
 const [isLoading, setLoading] = useState(false); // Loading state
 
const bureauuId = localStorage.getItem("bureauId");

  const dropdownOptions = {
    gender: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    profileStatus: [
      { value: "Indian profile", label: "Indian Profile" },
      { value: "Nri profile", label: "NRI Profile" },
    ],
  };

  const openModal = (key) => {
    setModalData({ key, options: dropdownOptions[key] });
  };

  const closeModal = () => {
    setModalData(null);
    setSearchTerm("");
  };

  const handleSelect = (selectedOption) => {
    setSelectedOptions({ ...selectedOptions, [modalData.key]: selectedOption });
    closeModal();
  };

  const handleSearch = () => {
    const payload = Object.keys(selectedOptions).reduce((acc, key) => {
      acc[key] = selectedOptions[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };



  // Generate a 7-digit unique number for martialId
  const generateMartialId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

  // Generate martialId before sending the form data
  const martialId = generateMartialId();

  const handleSubmit = async () => {
    // Start loading animation
    setLoading(true);
  
    // Create an array to store missing fields
    const missingFields = [];
  
    // Check each required field and add to missingFields if empty
    if (!phoneNumber.trim()) {
      missingFields.push("Phone Number");
    }
  
    if (!password.trim()) {
      missingFields.push("Password");
    }
  
    if (!selectedOptions.gender?.value) {
      missingFields.push("Gender");
    }
  
    if (!selectedOptions.profileStatus?.value) {
      missingFields.push("Profile Status");
    }
  
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }
  
    // Use the same submission method as the original User_Register.jsx
    const formData = new FormData();
    formData.append("gender", selectedOptions.gender.value);
    formData.append("createdBy", "Other Mediater Profile");
    formData.append("paymentStatus", "Free Profile");
    formData.append("profileStatus", selectedOptions.profileStatus.value);
    formData.append("servicePreference", selectedOptions.servicePreference?.value || "");
    formData.append("mobileNumber", phoneNumber);
    formData.append("countryCode", countryCode);
    formData.append("password", password);
    formData.append("martialId", martialId);
    formData.append("bureauId", bureauuId);
  
    try {
      const response = await apiClient.post(apiEndpoints.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response?.data?.userId) {
        const { userId } = response.data;
        setLoading(false);
        localStorage.setItem("userId", userId);
        console.log("User ID stored:", userId);
        navigate("/user-image");
        alert("Registration successful!");
      } else {
        setLoading(false);
        console.error("Error submitting form:", response?.statusText || "Unknown error");
        alert("Failed to submit form.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.message || error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button and Step 1 */}
      <div className="bg-red-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-gray-200 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold">Step 1</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Other Mediator Profile</h1>
          <p className="text-gray-600">Step 1: Basic Information</p>
        </div>

        {/* Gender Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <button
            onClick={() => openModal("gender")}
            className="w-full p-3 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedOptions.gender?.label || "Select Gender"}
            <RiArrowRightSLine className="float-right text-gray-400" />
          </button>
        </div>

        {/* Profile Status Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Status *
          </label>
          <button
            onClick={() => openModal("profileStatus")}
            className="w-full p-3 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedOptions.profileStatus?.label || "Select Profile Status"}
            <RiArrowRightSLine className="float-right text-gray-400" />
          </button>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mediater Contact Details *
          </label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="p-3 border border-r-0 border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
              <option value="+86">+86</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password * <span className="text-xs text-gray-500">(Auto-generated numeric)</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              className="w-full p-3 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Password will be auto-generated"
              required
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="button"
                onClick={() => setPassword(generateNumericPassword())}
                className="mr-2 p-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                title="Generate new password"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">A 6-digit numeric password has been auto-generated. You can regenerate it if needed.</p>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Terms and Conditions
              </button>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !termsAccepted}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-300 ${
            isLoading || !termsAccepted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Profile...
            </div>
          ) : (
            "Create Profile"
          )}
        </button>

        {/* Modal for dropdown selections */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Select {modalData.key.charAt(0).toUpperCase() + modalData.key.slice(1)}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="max-h-60 overflow-y-auto">
                {modalData.options
                  .filter((option) =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded-md"
                    >
                      {option.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Terms Modal */}
        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </div>
    </>
  );
};

export default Step1; 