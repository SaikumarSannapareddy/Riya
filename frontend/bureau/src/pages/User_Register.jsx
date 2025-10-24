import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from '../components/Loader2';
import TermsModal from '../components/TermsModal';

const User_Register = () => {
  // Generate a 6-digit numeric password at component initialization
  const generateNumericPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const generatedPassword = generateNumericPassword();

  const [modalData, setModalData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    gender: { value: "", label: "Select Gender" },
    createdBy: { value: "Self", label: "Self" },
    profileStatus: { value: "Indian profile", label: "Indian Profile" },
    servicePreference: null,
    paymentStatus: { value: "", label: "Select Payment Status" }, // add this
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatedPassword);
  const [countryCode, setCountryCode] = useState("+91");
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 
    const [isMobileExists, setIsMobileExists] = useState(false);
  
 
  const [isLoading, setLoading] = useState(false); // Loading state
 
  const bureauuId = localStorage.getItem("bureauId");

 const checkMobileNumber = async (number) => {
  if (!number || number.length < 10) return;

  try {
    const response = await apiClient.get(apiEndpoints.checkMobile, {
      params: { mobileNumber: number },
    });

    if (response.data.exists) {
      setIsMobileExists(true);
      alert("This mobile number already exists!");
    } else {
      setIsMobileExists(false);
    }
  } catch (err) {
    console.error("Mobile check error:", err);
  }
};



  const dropdownOptions = {
    gender: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    createdBy: [
      { value: "Self", label: "Self" },
      { value: "Father", label: "Father" },
      { value: "Mother", label: "Mother" },
      { value: "Friend", label: "Friend" },
      { value: "Relatives", label: "Relatives" },
      { value: "Sister", label: "Sister" },
      { value: "Brother", label: "Brother" },
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

  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard');
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
  
    if (!selectedOptions.createdBy?.value) {
      missingFields.push("Created By");
    }
  
 
  
    if (!selectedOptions.profileStatus?.value) {
      missingFields.push("Profile Status");
    }
  
  
    // If any fields are missing, show an alert with specific field names
    if (missingFields.length > 0) {
      alert(`The following fields are missing: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }
  
    // Rest of the submit logic remains the same...
    const formData = new FormData();
    formData.append("gender", selectedOptions.gender.value);
    formData.append("createdBy", selectedOptions.createdBy.value);
    formData.append("paymentStatus", selectedOptions.paymentStatus.value);
    formData.append("profileStatus", selectedOptions.profileStatus.value);
    formData.append("servicePreference", selectedOptions.servicePreference?.value);
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
  
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  useEffect(() => {
  if (phoneNumber.length === 10) {
    checkMobileNumber(phoneNumber);
  } else {
    setIsMobileExists(false);
  }
}, [phoneNumber]);


  return (
    <>
     {isLoading && <Loader />} {/* Properly use the imported Loader */}
      <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Back Arrow Icon */}
          <button 
            className="flex items-center"
            onClick={handleBack}
          >
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
            Step 1 -
          </h1><br />

        </div>
        <h5 className="font-semibold text-white">Personal Details</h5>
      </div>
      <div className="p-6 w-full mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-6 mt-14">
          {Object.keys(dropdownOptions).map((key) => (
            key !== 'imagePrivacy' && (
              <>
                <div className="mb-[-20px]">
                  <label className="text-lg font-semibold capitalize text-gray-800">
                    {key}
                  </label>
                </div>

                <div
                  key={key}
                  className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                  onClick={() => openModal(key)}
                >

                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 text-md font-medium">
                      {selectedOptions[key]?.label || `Select ${key}`}
                    </span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </>
            )
          ))}

          {/* Phone Number Input */}
          <div className="flex items-center w-full border-b border-gray-300 py-3">
            <label className="text-lg font-semibold capitalize text-gray-800 mr-4">
              Customer Contact Number
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-white"
            >
              <option value="+1">+1</option>
              <option value="+91">+91</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input
              type="tel"
                maxLength={10} 
              pattern="[0-9]{10}"
              placeholder="Ex :-98XXXXXXXX"
              value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ''))} // allow only numbers
    onBlur={() => checkMobileNumber(phoneNumber)}

  className={`w-full p-2 ml-2 border rounded ${
    isMobileExists ? "border-red-500" : "border-gray-300"
  }`}             required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 py-3">
            <label className="text-lg font-semibold capitalize text-gray-800">
              Password (Auto-generated)
            </label>
            <div className="relative w-full">
              <input
              required
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password will be auto-generated"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                readOnly
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500" />
                ) : (
                  <AiOutlineEye className="text-gray-500" />
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 ml-2">
              Password: {password}
            </div>
          </div>
        </div>

 
        <div className="flex items-center w-full mb-8">
        <input
  type="checkbox"
  id="terms"
  className="mr-2"
  required
  defaultChecked
/>

          <label
            htmlFor="terms"
            className="text-md font-semibold capitalize text-red-400  cursor-pointer"
            onClick={() => setShowTerms(!showTerms)}
          >
            I agree to the terms and conditions
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center w-full">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center px-6 py-2 w-full max-w-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 hover:shadow-md transition"
          >
            Submit
          </button>
        </div>
        {/* Modal for Selecting Options */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData.key}
              </h2> 

              {/* Search Bar */}
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder={`Search ${modalData.key}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Options List */}
              <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                {modalData.options
                  .filter((option) =>
                    option.label.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((option, index) => (
                    <div key={index}>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </button>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </div>
                  ))}
              </div>

              {/* Close Button */}
              <button
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for Terms and Conditions */}
        {showTerms && (
          <TermsModal
            isOpen={showTerms}
            onClose={() => setShowTerms(false)}
          />
        )}
      </div>
     
    </>
  );
};

export default User_Register;
