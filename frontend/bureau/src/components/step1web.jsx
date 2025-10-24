import React, { useState, useEffect, useCallback, useRef } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [bureauId, setUserId] = useState(id);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const cropperRef = useRef(null);


  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate(-1); // Redirects to the previous page
    } else {
      setUserId(id);
    }
  }, [id, navigate]);

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

  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSearch = () => {
    const payload = Object.keys(selectedOptions).reduce((acc, key) => {
      acc[key] = selectedOptions[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create image preview
      setImage(file); // Set the image file
      setImagePreview(previewUrl); // Set the image preview
    }
  };

  // Handle cropping the image
  const onCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas(); // Get cropped canvas
      if (croppedCanvas) {
        const croppedUrl = croppedCanvas.toDataURL(); // Get cropped image as base64
        setCroppedImage(croppedUrl); // Save cropped image to state
      }
    }
  };

  // Convert base64 to Blob
  const base64ToBlob = (base64Data) => {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: "image/jpeg" }); // Change MIME type if needed
  };

  // Save the cropped image
  const saveCroppedImage = () => {
    if (!croppedImage) {
      alert("Please crop the image before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("bureauId", bureauId);
    formData.append("step1", 1);

    // Convert the cropped image from base64 to Blob and append to FormData
    const croppedBlob = base64ToBlob(croppedImage);
    formData.append("image", croppedBlob, "cropped-image.jpg");

    // Start loading animation
    setLoading(true);

    try {
      apiClient
        .post(apiEndpoints.register, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // Stop loading animation
          setLoading(false);

          if (response?.data?.userId) {
            const { userId } = response.data;

            // Store the userId in localStorage
            localStorage.setItem("userId", userId);

            // If you want to store a different ID related to the image submission:
            if (response?.data?.imageId) {
              localStorage.setItem("imageId", response.data.imageId);
            }

          } else {
            alert("Failed to submit form.");
          }
        })
        .catch((error) => {
          // Stop loading animation on error
          setLoading(false);
          console.error("Error:", error.message || error);
          alert("An error occurred while submitting the form.");
        });
    } catch (error) {
      // Stop loading animation on error
      setLoading(false);
      console.error("Error:", error.message || error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Generate a 7-digit unique number for martialId
  const generateMartialId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };
  // Generate martialId before sending the form data
  const martialId = generateMartialId();

  const handleSubmit = async () => {
    // Step 1: Validate image upload
    if (!croppedImage && !image) {
      alert('Please upload and crop an image');
      return;
    }

    // Step 2: Retrieve the userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      alert('User ID not found in localStorage.');
      return;
    }

    // Step 3: Prepare the FormData to send to the backend
    const formData = new FormData();
    formData.append('userId', storedUserId);
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
    formData.append('step1', 1);

    // Step 4: Log the FormData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      // Step 5: Log the full request URL before sending
      console.log('Sending PUT request to:', `${apiEndpoints.update}/${storedUserId}`);

      // Step 6: Sending PUT request to update user data
      const updateResponse = await apiClient.put(`${apiEndpoints.update}/${storedUserId}`, formData);
      console.log('API Response:', updateResponse);

      // Step 7: Check if the response contains success data
      if (updateResponse?.data) {
        if (updateResponse.data.message) {
          alert('User updated successfully!');
          navigate('/step2');
        } else {
          alert('Failed to update user data.');
        }
      } else {
        alert('No response data received from the API.');
      }
    } catch (error) {
      // Step 8: Error handling if the PUT request fails
      console.error('Error:', error.message || error);
      alert('An error occurred while updating the user.');
    }
  };



  return (
    <>
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
            <>
              <div className="mb-[-20px]">
                <label className="text-lg font-semibold capitalize text-gray-800">
                  {key}
                </label>
              </div>

              <div
                key={key}
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
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

          {/* Image cropping */}
          <div className="grid grid-cols-1 gap-6 mb-6 mt-14">
            <div>
              <div className="flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Upload and Crop User Image</h1>
                {/* Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block mb-4 text-sm file:border file:rounded file:px-3 file:py-2 file:bg-gray-100 file:cursor-pointer hover:file:bg-gray-200"
                />

                {/* Image Cropper */}
                {image && (
                  <div className="w-full max-w-lg mt-4">
                    <Cropper
                      ref={cropperRef}
                      src={imagePreview}
                      style={{ width: "100%", height: 400 }}
                      aspectRatio={1} // Adjust aspect ratio as needed
                      guides={false}
                      crop={onCrop}
                    />
                  </div>
                )}

                {/* Image Preview */}
                {croppedImage && (
                  <div className="mt-4 text-center">
                    <img
                      src={croppedImage}
                      alt="Cropped Preview"
                      className="h-24 w-24 object-cover mb-4 mx-auto border border-gray-300 rounded"
                    />
                  </div>
                )}

                {/* Loading Spinner */}
                {loading && (
                  <div className="flex justify-center items-center mt-4">
                    <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-center items-center w-full space-x-4">
                  {/* Save Crop Button */}
                  <button
                    type="button"
                    onClick={saveCroppedImage}
                    className="flex items-center justify-center px-6 py-2 w-full max-w-sm bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 hover:shadow-md transition"
                    disabled={loading} // Disable the button while loading
                  >
                    Save Crop
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => setCroppedImage(null)}
                    className="flex items-center justify-center px-6 py-2 w-full max-w-sm bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 hover:shadow-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image croppimg */}

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
              placeholder="Ex :-95"
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