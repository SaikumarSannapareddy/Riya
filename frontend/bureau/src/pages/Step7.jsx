import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import axios from "axios";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";


const Apartment_Flat_Details = () => {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState(null);
  const [modalData2, setModalData2] = useState(null);
  const [modalData3, setModalData3] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");

  const [city, setCity] = useState([]);

  const [formData, setFormData] = useState({
    numberOfFlats: "",
    flatType: "",
    flatValue: "",
    flatLocation: [],
    agricultureLand: "",
    agricultureLandValue: "",
    agricultureLandLocation: [],
    anyMoreProperties: "",
    propertyNames: "",
    totalPropertiesValue: "",
  });
  const Agriculture_Land_Value = [
    { value: 100000, label: "1 Lakh" },
    ...Array.from({ length: 9 }, (_, i) => ({
      value: (i + 2) * 100000,
      label: `${i + 2} Lakhs`,
    })),
    // Adding 20,30,40,50,60,70,80,90 lakhs
    { value: 2000000, label: "20 Lakhs" },
    { value: 3000000, label: "30 Lakhs" },
    { value: 4000000, label: "40 Lakhs" },
    { value: 5000000, label: "50 Lakhs" },
    { value: 6000000, label: "60 Lakhs" },
    { value: 7000000, label: "70 Lakhs" },
    { value: 8000000, label: "80 Lakhs" },
    { value: 9000000, label: "90 Lakhs" },
    // 1 Cr to 5 Cr
    ...Array.from({ length: 5 }, (_, i) => ({
      value: (i + 1) * 10000000,
      label: `${i + 1} Cr`,
    })),
    // 5 Cr to 500 Cr with 5 Cr increments
    ...Array.from({ length: 99 }, (_, i) => ({
      value: (i + 1) * 50000000 + 50000000, // Starting from 10 Cr (5+5) and incrementing by 5 Cr
      label: `${(i + 1) * 5 + 5} Cr`,
    })),
  ]
  const dropdownOptions = {
    Number_Of_Apartment_Flats: [
   
      ...Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`,
      })),
      { value: "more", label: "More" },
    ],
    Flat_Type: [
   
      ...Array.from({ length: 10 }, (_, i) => ({
        value: `${i + 1}bhk`,
        label: `${i + 1} BHK`,
      })),
    ],
    Flat_Value: [
      // 10 lakhs to 1 crore (in 10 lakh increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 1000000).map((value) => ({
        value: value,
        label: `₹${(value / 100000).toFixed(1)} Lakhs`,
      })),
      // 1 crore to 10 crores (in 1 crore increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 10000000).map((value) => ({
        value: value,
        label: `₹${(value / 10000000).toFixed(1)} Crores`,
      })),
      // 10 crores to 100 crores (in 10 crore increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 100000000).map((value) => ({
        value: value,
        label: `₹${(value / 10000000).toFixed(1)} Crores`,
      })),
    ],
    Agriculture_Land: [
    
      ...Array.from({ length: 100 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} Acres`,
      })),
    ],
    Agriculture_Land_Value,
    
    Total_Properties_Value: [
      // 10 lakhs to 1 crore (in 10 lakh increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 1000000).map((value) => ({
        value: value,
        label: `₹${(value / 100000).toFixed(1)} Lakhs`,
      })),
      // 1 crore to 10 crores (in 1 crore increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 10000000).map((value) => ({
        value: value,
        label: `₹${(value / 10000000).toFixed(1)} Crores`,
      })),
      // 10 crores to 100 crores (in 10 crore increments)
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 100000000).map((value) => ({
        value: value,
        label: `₹${(value / 10000000).toFixed(1)} Crores`,
      })),
    ],    Anymore_Properties: [
    
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownOptions2 = {
    Flat_Location: [

      ...city.map((flat_location) => ({ value: flat_location.city, label: flat_location.city })),
    ],

  };
  const dropdownOptions3 = {
    Agriculture_Land_Location: [

      ...city.map((agriculture_land_location) => ({ value: agriculture_land_location.city, label: agriculture_land_location.city })),
    ],

  };

  const [selectedOptions, setSelectedOptions] = useState({

  });

  const
    [selectedOptions2, setSelectedOptions2] = useState({
      Flat_Location: [], // Default for languages known (can be multiple)
    });

  const
    [selectedOptions3, setSelectedOptions3] = useState({
      Agriculture_Land_Location: [], // Default for languages known (can be multiple)
    });

  const openModal = (key) => {
    setModalData({ key, options: dropdownOptions[key] });
  };

  const openModal2 = (key) => {
    setModalData2({ key, options: dropdownOptions2[key] });
  };

  const openModal3 = (key) => {
    setModalData3({ key, options: dropdownOptions3[key] });
  };

  const closeModal = () => {
    setModalData(null);
    setSearchTerm("");
  };
  const closeModal2 = () => {
    setModalData2(null);
    setSearchTerm2("");
  };
  const closeModal3 = () => {
    setModalData3(null);
    setSearchTerm3("");
  };

  const handleSelect1 = (selectedList) => {
    setFormData({
      ...formData,
      languagesKnown: selectedList,
    });
    // Optionally, close the dropdown after selection
    setDropdownOpen(false); // Control visibility based on your specific component
  };

  const handleSelect = (selectedOption) => {
    setSelectedOptions({ ...selectedOptions, [modalData.key]: selectedOption });
    closeModal();
  };

  const handleSelect2 = (selectedOption2) => {
    setSelectedOptions2({ ...selectedOptions2, [modalData2.key]: selectedOption2 });
    closeModal2();
  };

  const handleSelect3 = (selectedOption3) => {
    setSelectedOptions3({ ...selectedOptions3, [modalData3.key]: selectedOption3 });
    closeModal3();
  };


  const handleCloseDropdown = () => {
    // Close the dropdown when the close button is clicked
    setDropdownOpen(false); // Adjust according to your component's API
  };

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/step6";
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formattedOptions = {

      numberOfFlats: selectedOptions.Number_Of_Apartment_Flats?.value || '',
      flatType: selectedOptions.Flat_Type?.value || '',
      flatValue: parseFloat(selectedOptions.Flat_Value?.value) || 0,
      agricultureLand: parseInt(selectedOptions.Agriculture_Land?.value) || 0,
      agricultureLandValue: parseFloat(selectedOptions.Agriculture_Land_Value?.value) || 0,
      anyMoreProperties: selectedOptions.Anymore_Properties?.value || "no",
      totalPropertiesValue: parseFloat(selectedOptions.Total_Properties_Value?.value) || 0,
     
    };

    const formDataToSend = {
      // Updated flatLocation to be just an array of strings (city names)
      ...formattedOptions,
      flatLocation: selectedOptions2.Flat_Location,
      agricultureLandLocation: selectedOptions3.Agriculture_Land_Location,

      // Including step flags
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      step5: 1,
      step6: 1,
      step7: 1,
    };

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const endpoint = `${apiEndpoints.update}/${userId}`;

      // Send the PUT request to update the data
      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Details updated successfully!");

        // Store the userId in localStorage for the next step
        localStorage.setItem("userId", userId);

        // Navigate to Step 7 (or next step)
        navigate("/step8", { state: { userId } });
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [cityData] = await Promise.all([
          axios.get("http://localhost:3200/api/city"),
        ]);
        setCity(cityData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      }
    };

    fetchAllData();
  }, []);

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
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid #c4d4e2", // Add underline
      padding: "0.75rem", // Ensure enough padding for readability
      backgroundColor: state.isFocused ? "#f0f8ff" : "#ffffff", // Highlight on hover
      color: "#000", // Text color
      cursor: "pointer", // Change cursor on hover
    }),
  };

  const customStyle = {
    chips: {
      background: "#5a67d8", // Customize selected value (chips) style
      color: "white",
    },
    option: {
      color: "#000", // Style dropdown options
      borderBottom: "1px solid #e2e8f0", // Line under each option
      padding: "10px",
    },
    searchBox: {
      border: "1px solid #cbd5e0", // Customize search box border
      borderRadius: "0.375rem",
      padding: "16px",
    },
    closeIcon: {
      color: "red", // Style close icon
    },
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  const handleCheckboxChange2 = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions2 = checked
      ? [...selectedOptions2.Flat_Location, option.value]
      : selectedOptions2.Flat_Location.filter((lang) => lang !== option.value);

    setSelectedOptions2({ ...selectedOptions2, Flat_Location: updatedSelectedOptions2 });
  };

  const handleCheckboxChange3 = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions3 = checked
      ? [...selectedOptions3.Agriculture_Land_Location, option.value]
      : selectedOptions3.Agriculture_Land_Location.filter((skill) => skill !== option.value);

    setSelectedOptions3({ ...selectedOptions3, Agriculture_Land_Location: updatedSelectedOptions3 });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">

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
            <h1 className="text-2xl font-bold text-center text-white py-3">
              Step 7 -
            </h1>
            <h5 className="font-semibold text-white">Agriculture & Flat Details</h5>
          </div>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-20 px-3 py-4">

          {Object.keys(dropdownOptions).map((key) => (
            <>
              <div className="mb-[-20px]">
                <label className="block text-red-500 font-medium mb-2">
                {key.replace(/_/g, ' ')}
                </label>
              </div>

              <div
                key={key}
                className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openModal(key)}
              >

                <div className="flex items-center justify-between rounded-lg">
                  <span className="text-gray-500 text-md ">
                    {selectedOptions[key]?.label || `Select ${key}`}
                  </span>
                  <RiArrowDownSLine className="text-3xl text-gray-300 ml-3" />
                </div>
              </div>
            </>
          ))}

       

          {Object.keys(dropdownOptions2).map((key) => (
            <div key={key} className="mb-[-20px] rounded-lg">
              <label className="block text-red-500 font-medium mb-2 capitalize">
              {key.replace(/_/g, ' ')}
              </label>

              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openModal2(key)}
              >
                <div className="flex items-center justify-between rounded">
                  <span className="text-gray-500 text-md ">
                    {selectedOptions2[key]?.length
                      ? dropdownOptions2[key]
                        .filter((opt) => selectedOptions2[key].includes(opt.value))
                        .map((lang) => lang.label)
                        .join(", ")
                      : `Select ${key}`}
                  </span>
                  <RiArrowDownSLine className="text-3xl text-gray-300 ml-3" />
                </div>
              </div>
            </div>
          ))}

          {Object.keys(dropdownOptions3).map((key) => (
            <div key={key} className="mb-[-20px] rounded-lg">
              <label className="block text-red-500 font-medium mb-2 capitalize">
              {key.replace(/_/g, ' ')}
              </label>

              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openModal3(key)}
              >
                <div className="flex items-center justify-between rounded">
                  <span className="text-gray-500 text-md ">
                    {selectedOptions3[key]?.length
                      ? dropdownOptions3[key]
                        .filter((opt) => selectedOptions3[key].includes(opt.value))
                        .map((skill) => skill.label)
                        .join(", ")
                      : `Select ${key}`}
                  </span>
                  <RiArrowDownSLine className="text-3xl text-gray-300 ml-3" />
                </div>
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Next
            </button>
          </div>
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
                Continue
              </button>
            </div>
          </div>
        )}
        {modalData3 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData3.key}
              </h2>

              {/* "Select All" Checkbox */}
              {/* <div className="flex items-center space-x-2 mb-4">
                <input
                  id="selectAllCheckbox"
                  type="checkbox"
                  checked={
                    selectedOptions.languagesKnown.length ===
                    dropdownOptions.languagesKnown.length
                  }
                  onChange={handleSelectAllChange}
                  className="form-checkbox h-4 w-4 text-red-600"
                />
                <label className="block text-gray-700">Select All</label>
              </div> */}

              {/* Search Bar */}
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder={`Search ${modalData3.key}`}
                value={searchTerm3}
                onChange={(e) => setSearchTerm3(e.target.value)}
              />

              {/* Options List */}
              <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                {modalData3.options
                  .filter((option) =>
                    option.label.toLowerCase().includes(searchTerm3.toLowerCase())
                  )
                  .map((option, index) => (
                    <>
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedOptions3.Agriculture_Land_Location.includes(option.value)}
                          onChange={(e) => handleCheckboxChange3(e, option)}
                          className="form-checkbox h-4 w-4 text-red-600"
                        />
                        <label className="block text-gray-700">{option.label}</label>

                      </div>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </>

                  ))}
              </div>

              {/* Close Button */}
              <button
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={closeModal3}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {modalData2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData2.key}
              </h2>

              {/* "Select All" Checkbox */}
              {/* <div className="flex items-center space-x-2 mb-4">
                <input
                  id="selectAllCheckbox"
                  type="checkbox"
                  checked={
                    selectedOptions.languagesKnown.length ===
                    dropdownOptions.languagesKnown.length
                  }
                  onChange={handleSelectAllChange}
                  className="form-checkbox h-4 w-4 text-red-600"
                />
                <label className="block text-gray-700">Select All</label>
              </div> */}

              {/* Search Bar */}
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder={`Search ${modalData2.key}`}
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
              />

              {/* Options List */}
              <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                {modalData2.options
                  .filter((option) =>
                    option.label.toLowerCase().includes(searchTerm2.toLowerCase())
                  )
                  .map((option, index) => (
                    <>
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedOptions2.Flat_Location.includes(option.value)}
                          onChange={(e) => handleCheckboxChange2(e, option)}
                          className="form-checkbox h-4 w-4 text-red-600"
                        />
                        <label className="block text-gray-700">{option.label}</label>

                      </div>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </>

                  ))}
              </div>

              {/* Close Button */}
              <button
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={closeModal2}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apartment_Flat_Details;
