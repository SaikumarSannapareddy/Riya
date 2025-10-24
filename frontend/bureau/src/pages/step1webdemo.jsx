import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis1";

const Step1 = () => {
  const [modalData, setModalData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    gender: { value: "male", label: "Male" },
    createdBy: { value: "self", label: "Self" },
    paymentStatus: { value: "Free Profile", label: "Free Member" }, // Default value
    profileStatus: { value: "local profile", label: "Local Profile" },
    servicePreference: null,
    imagePrivacy: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
 const { id } = useParams(); 
  const [bureauId, setUserId] = useState(id);

  const dropdownOptions = {
    gender: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    createdBy: [
      { value: "", label: "Select Created" },
      { value: "self", label: "Self" },
      { value: "father", label: "Father" },
      { value: "mother", label: "Mother" },
      { value: "friend", label: "Friend" },
      { value: "relatives", label: "Relatives" },
      { value: "sister", label: "Sister" },
      { value: "brother", label: "Brother" },
      { value: "other_mediater", label: "Other Mediater" },
    ],
    paymentStatus: [
      { value: "Free Profile", label: "Free Member" },
      { value: "Paid Profile", label: "Paid Member" },
    ],
    profileStatus: [
      { value: "local profile", label: "Local Profile" },
      { value: "nri profile", label: "NRI Profile" },
    ],
    servicePreference: [
      { value: "online", label: "Only Online Service" },
      { value: "offline", label: "Only Offline Service" },
      { value: "Online & Offline", label: "Online/Offline Service" },
    ],
    imagePrivacy: [
      { value: "all", label: "Publish to All Members" },
      { value: "accepted", label: "Only Accepted Members" },
      { value: "none", label: "Do Not Publish" },
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create image preview
      setImage(file); // Set the image file
      setImagePreview(previewUrl); // Set the image preview
    }
  };

  // Generate a 7-digit unique number for martialId
  const generateMartialId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };
  // Generate martialId before sending the form data
  const martialId = generateMartialId();
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('gender', selectedOptions.gender.value);
    formData.append('createdBy', selectedOptions.createdBy.value);
    formData.append('paymentStatus', selectedOptions.paymentStatus.value);
    formData.append('profileStatus', selectedOptions.profileStatus.value);
    formData.append('servicePreference', selectedOptions.servicePreference?.value || '');
    formData.append('imagePrivacy', selectedOptions.imagePrivacy?.value || '');
    formData.append('phoneNumber', phoneNumber);
    formData.append('countryCode', countryCode);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('martialId', martialId);
    formData.append('bureauId', bureauId);
    formData.append("image", image); // Attach the selected image
    try {
      const response = await apiClient.post(apiEndpoints.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data?.userId) {
        const { userId } = response.data;

        // Store the user ID in local storage
        localStorage.setItem('userId', userId);
        console.log('User ID stored:', userId);
        navigate('/step2')

        // Handle success
        alert('Registration successful!');
      } else {
        console.error('Error submitting form:', response?.statusText || 'Unknown error');
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
      alert('An error occurred while submitting the form.');
    }
  };


  return (
    <>
      <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* Back Arrow Icon */}
          <button className="flex items-center">
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
                  <span className="text-gray-500 text-md font-medium">
                    {selectedOptions[key]?.label || `Select ${key}`}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </>
          ))}

          <label className="text-lg font-semibold capitalize text-gray-800">
            Upload Profile Image
          </label>
          {/* User Image Upload */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 py-1">

            <label className="flex items-center cursor-pointer">

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block mb-4 text-sm file:border file:rounded file:px-3 file:py-2 file:bg-red-600 file:text-white file:cursor-pointer hover:file:bg-red-700 file:border-red-500"
              />

            </label>
          </div>
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 text-center">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="h-56 w-80 object-cover mb-4 mx-auto border border-gray-300 rounded"
              />
            </div>
          )}
          {/* Phone Number Input */}
          <div className="flex items-center w-full border-b border-gray-300 py-3">
            <label className="text-lg font-semibold capitalize text-gray-800 mr-4">
              Phone Number
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
              pattern="[0-9]{10}"
              placeholder="Ex :-98XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 ml-2 border border-gray-300 rounded"
            />
          </div>
          {/* Email Input */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 py-3">
            <label className="text-lg font-semibold capitalize text-gray-800">
              Email Id
            </label>
            <div className="relative w-full">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
                className="w-full p-2 border border-gray-300 rounded"
              />

            </div>
          </div>

          {/* Password Input */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 py-3">
            <label className="text-lg font-semibold capitalize text-gray-800">
              Create Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
        </div>


        <div className="flex items-center w-full mb-8">
          <input
            type="checkbox"
            id="terms"
            className="mr-2"

          />
          <label
            htmlFor="terms"
            className="text-md font-semibold capitalize text-red-400 text-gray-800 cursor-pointer"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
              <p className="text-gray-700 mb-4">
                Please read and agree to the terms and conditions before submitting.
              </p>
              <button
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => setShowTerms(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Step1;
