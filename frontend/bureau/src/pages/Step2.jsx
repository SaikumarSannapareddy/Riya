import React, { useState, useEffect } from "react";

import { RiArrowRightSLine } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const Personal_Details_Form = () => {

  const [modalData, setModalData] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    height: { value: "5.5", label: "5.5 ft" }, // Default value for height
    weight: { value: "65", label: "65 kg" }, // Default value for weight
    Physical_State: { value: "normal", label: "Normal" }, // Default for physical state
    Eating_Habits: { value: "nonVegetarian", label: "Non-Vegetarian" }, // Default for eating habits
    Smoking_Habits: { value: "no", label: "No" }, // Default for smoking habits
    Drinking_Habits: { value: "no", label: "No" }, // Default for drinking habits
  });

  const navigate = useNavigate();

  // Calculate max date (20 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Get default date (20 years ago from today)
  const getDefaultDate = () => {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return defaultDate.toISOString().split('T')[0];
  };

  // Get current time for default birth time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Returns HH:MM format
  };

  const dropdownOptions = {
     height: (() => {
    const heights = [];
    for (let feet = 3; feet <= 7; feet++) {      // Feet range
      for (let inch = 0; inch <= 11; inch++) {   // Inches range
        const inchDecimal = inch < 10 ? `0${inch}` : `${inch}`; // pad 0 for 0-9
        const value = `${feet}.${inchDecimal}`; // e.g., 3.10, 3.11
        heights.push({ value, label: `${value} ft` });
      }
    }
    return heights;
  })(),
    weight: Array.from({ length: 171 }, (_, i) => {
      const value = (30 + i); // Generate weights from 30 to 200
      return { value: value.toString(), label: `${value} kg` };
    }),
    Physical_State: [
      { value: "", label: "Select" },
      { value: "normal", label: "Normal" },
      { value: "slim", label: "Slim" },
      { value: "challenged", label: "Challenged" },
    ],
    Eating_Habits: [
      { value: "", label: "Select" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "nonVegetarian", label: "Non-Vegetarian" },
      { value: "eggetarian", label: "Eggetarian" },
    ],
    Smoking_Habits: [
      { value: "", label: "Select" },
      { value: "no", label: "No" },
      { value: "occasionally", label: "Occasional" },
      { value: "yes", label: "Yes" },
    ],
    Drinking_Habits: [
      { value: "", label: "Select" },
      { value: "no", label: "No" },
      { value: "occasionally", label: "Occasional" },
      { value: "yes", label: "Yes" },
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
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: getDefaultDate(), // Default to 20 years ago
    time: getCurrentTime(), // Default to current time
    maritalStatus: "neverMarried", // Default to Never Married
    maleKids: "",
    femaleKids: "",
    hasRelatives: "",
    height: "",
    weight: "",
    physicalState: "",
    eatingHabits: "",
    smokingHabits: "",
    drinkingHabits: "",
    step1: "",
    step2: "",
  });

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/add-profile";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Extract only `value` from selectedOptions
    const formattedOptions = {
      height: selectedOptions.height.value,
      weight: selectedOptions.weight.value,
      physicalState: selectedOptions.Physical_State.value,
      eatingHabits: selectedOptions.Eating_Habits.value,
      smokingHabits: selectedOptions.Smoking_Habits.value,
      drinkingHabits: selectedOptions.Drinking_Habits.value,
    };
  
    const formDataToSend = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      time: formData.time,
      maritalStatus: formData.maritalStatus,
      maleKids: formData.maleKids,
      femaleKids: formData.femaleKids,
      hasRelatives: formData.hasRelatives,
      ...formattedOptions, // Spread the formatted options here
      step1: 1,
      step2: 1,
    };
  
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
  
      // Construct the URL with userId
      const endpoint = `${apiEndpoints.update}/${userId}`;
  
      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        alert("Details updated successfully!");
        navigate('/step3')
        // Navigate to Step 3 if needed
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    }
  };
  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.375rem",
      border: "1px solid #c4d4e2",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0, // Remove extra padding
      boxShadow: "0 10px 6px rgba(0, 0, 0, 0.9)", // Example box-shadow
      border: "2px solid #000000",
    }),
    option: (provided, state) => ({
      ...provided, // Add underline
      padding: "0.75rem", // Ensure enough padding for readability
      backgroundColor: state.isFocused ? "#f0f8ff" : "#ffffff", // Highlight on hover
      color: "#000", // Text color
      cursor: "pointer", // Change cursor on hover
      
      borderBottom: "1px solid #c4d4e2",
      borderRadius: "13px"
    }),
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-red-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg ">
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
            Step 2 -
          </h1><br />

        </div>
        <h5 className="font-semibold text-white">Personal Details</h5>
      </div>

        <form className="space-y-6 px-3 mt-20 py-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-red-500 font-medium mb-2">
              Full Name
            </label>

            <input
  required
  type="text"
  name="fullName"
  value={formData.fullName}
  onChange={(e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allows only letters and spaces
    handleChange({ target: { name: "fullName", value } });
  }}
  placeholder="Enter your full name"
  className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
  onInvalid={(e) => e.target.setCustomValidity("Please enter your full name")}
  onInput={(e) => e.target.setCustomValidity("")}
/>

          </div>

          <div>
            <label className="block text-red-500 font-medium mb-2">
              Date of Birth
            </label>
            <input
            placeholder="Enter Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={getMaxDate()}
              className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
            />
          </div>

          <div>
            <label className="block text-red-500 font-medium mb-2">
              Birth Time
            </label>
            <input
              placeholder="Enter Birth Time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
            />
          </div>

          <div>
            <label className="block text-red-500 font-medium mb-2">
              Marital Status
            </label>

            <select
  name="maritalStatus"
  value={formData.maritalStatus}
  onChange={(e) =>
    setFormData({ ...formData, maritalStatus: e.target.value })
  }
  className="border border-gray-200 p-2 py-4 rounded-md w-full"
  styles={customStyles}
>
  <option value="">Select Marital Status</option>
  <option value="neverMarried" selected>Never Married</option>
  <option value="awaitingDivorce">Awaiting Divorce</option>
  <option value="divorced">Divorced</option>
  <option value="widow">Widow</option>
  
</select>
          </div>

          {formData.maritalStatus !== "neverMarried" && (
            <>
              <div>
                <label className="block text-red-500 font-medium mb-2">
                  Male Kids
                </label>
                <select
                  name="maleKids"
                  value={formData.maleKids}
                  onChange={handleChange}
                  className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                >
                  <option value="">Select</option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-red-500 font-medium mb-2">
                  Female Kids
                </label>
                <select
                  name="femaleKids"
                  value={formData.femaleKids}
                  onChange={handleChange}
                  className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                >
                  <option value="">Select</option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-red-500 font-medium mb-2">
                  Are the born children with you?
                </label>
                <select
                  name="hasRelatives"
                  value={formData.hasRelatives}
                  onChange={handleChange}
                  className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </>
          )}
     {/* Height Dropdown */}
{/* <div className="mb-4">
  <label className="block text-red-500 font-medium mb-2">
    Height
  </label>
  <select
    name="height"
    value={selectedOptions.height.value}
    onChange={(e) =>
      setSelectedOptions({
        ...selectedOptions,
        height: { value: e.target.value, label: e.target.value + " ft" },
      })
    }
    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
  >
    {dropdownOptions.height.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div> */}

{Object.keys(dropdownOptions).map((key) => (
  <div key={key} className="mb-4">
    <label className="block text-red-500 font-medium mb-2">
      {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
    </label>
    <div
      className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
      onClick={() => openModal(key)}
    >
      <div className="flex items-center justify-between ">
        <span className="text-gray-500 text-md font-medium">
          {selectedOptions[key]?.label || `Select ${key}`}
        </span>
        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
      </div>
    </div>
  </div>
))}


          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Next
          </button>
        </form>
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
      </div>
    </div>
  );
};

export default Personal_Details_Form;


