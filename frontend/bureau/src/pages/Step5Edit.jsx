import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import axios from "axios";
import Select from "react-select";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";

const Family_Details = () => {
  
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  
  const { id } = useParams(); // Get the ID from the URL

  const [modalData2, setModalData2] = useState(null);
  const [searchTerm2, setSearchTerm2] = useState("");

  const [location, setLocation] = useState([]);
  const [occupation, setOccupation] = useState([]);

  const [formData, setFormData] = useState({
    fatherEmployee: "",
    fatherOccupied: "",
    motherEmployee: "",
    motherOccupied: "",
    totalBrothers: "",
    marriedBrothers: "",
    totalSisters: "",
    marriedSisters: "",
    familyValue: "",
    familyType: "",
    originalLocation: "",
    selectedLocation: "",

    youngerBrothers: "",
    elderBrothers: "",
    youngerSisters: "",
    elderSisters: "",
  });

  const [selectedOptions, setSelectedOptions] = useState({

    servicePreference: null,
    imagePrivacy: null,

  });

  const [selectedOptions2, setSelectedOptions2] = useState({


  });

  const dropdownOptions = {
    Original_Location: [
     
      ...location.map((caste) => ({ value: caste.city, label: caste.city })),
    ],
    Setteled_Location: [
     
      ...location.map((subcaste) => ({ value: subcaste.city, label: subcaste.city })),
    ],
  };

  const dropdownOptions2 = {
    Father_Employee: [
      { value: "not_employee", label: "Not Employee" },
      { value: "govt_employee", label: "Govt Employee" },
      { value: "private_employee", label: "Private Employee" },
      { value: "business_owner", label: "Business Owner" },
      { value: "self_employe", label: "Self Employee" },
      { value: "retired_employee", label: "Retired Employee" },
      { value: "expaired", label: "Expired" },
    ],
    
    Father_Occupation: [
     
      ...occupation.map((subcaste) => ({ value: subcaste.occupation, label: subcaste.occupation })),
    ],

    Mother_Employee: [
      { value: "not_employee", label: "Not Employee" },
      { value: "govt_employee", label: "Govt Employee" },
      { value: "private_employee", label: "Private Employee" },
      { value: "business_owner", label: "Business Owner" },
      { value: "self_employe", label: "Self Employee" },
      { value: "retired_employee", label: "Retired Employee" },
      { value: "expaired", label: "Expired" },
      { value: "home_maker", label: "Home Maker" },
    ],
    Mother_Occupation: [
     
      ...occupation.map((subcaste) => ({ value: subcaste.occupation, label: subcaste.occupation })),
    ],
    
  };

  useEffect(() => {
    const fetchData = async (url, setState, label) => {
      try {
        const response = await axios.get(url);
        setState(response.data);
      } catch (error) {
        console.error(`Error fetching ${label} data:`, error);
        alert(`Error fetching ${label} data.`);
      }
    };

    fetchData("https://localhost:3300/api/city", setLocation, "location");
    fetchData("https://localhost:3300/api/occupation", setOccupation, "occupation");
 
  }, []);
  const openModal = (key) => {
    setModalData({ key, options: dropdownOptions[key] });
  };

  const openModal2 = (key) => {
    setModalData2({ key, options: dropdownOptions2[key] });
  };

  const closeModal = () => {
    setModalData(null);
    setSearchTerm("");
  };

  
  const closeModal2 = () => {
    setModalData2(null);
    setSearchTerm2("");
  };

  const handleSelect = (selectedOption) => {
    setSelectedOptions({ ...selectedOptions, [modalData.key]: selectedOption });
    closeModal();
  };

  const handleSelect2 = (selectedOption) => {
    setSelectedOptions2({ ...selectedOptions2, [modalData2.key]: selectedOption });
    closeModal2();
  };

  const handleSearch = () => {
    const payload = Object.keys(selectedOptions).reduce((acc, key) => {
      acc[key] = selectedOptions[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };

  const handleSearch2 = () => {
    const payload = Object.keys(selectedOptions2).reduce((acc, key) => {
      acc[key] = selectedOptions2[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };



  const [city, setCity] = useState([]);

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/step4";
    }
  };

  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Generate options for Married Brothers/Sisters based on the selected total
  const generateOptions = (maxValue) => {
    return [...Array(maxValue + 1).keys()].map((i) => (
      <option key={i} value={i}>
        {i}
      </option>
    ));
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          console.error("ID not found in URL");
          alert("User ID is missing. Please check the URL and try again.");
          return;
        }
  
        const endpoint = `${apiEndpoints.user}/${id}`;
        console.log("Fetching data from endpoint:", endpoint);
  
        const response = await apiClient.get(endpoint);
        console.log("API Response:", response);
  
        if (response?.status === 200 && response?.data) {
          const data = response.data;
  
          if (typeof data !== "object" || data === null) {
            console.error("Invalid data received:", data);
            alert("Unexpected data format received from server.");
            return;
          }
  
          // Update form data
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));
  
          // Set dropdown values only if dropdownOptions2 exists
          setSelectedOptions2(prevState => ({
            Father_Employee: dropdownOptions2?.Father_Employee?.find(option => option.value === data.fatherEmployee) || prevState.Father_Employee,
            Father_Occupation: dropdownOptions2?.Father_Occupation?.find(option => option.value === data.fatherOccupied) || prevState.Father_Occupation,
            Mother_Employee: dropdownOptions2?.Mother_Employee?.find(option => option.value === data.motherEmployee) || prevState.Mother_Employee,
            Mother_Occupation: dropdownOptions2?.Mother_Occupation?.find(option => option.value === data.motherOccupied) || prevState.Mother_Occupation,
          }));
  
          // Set original and settled location only if dropdownOptions exist
          setSelectedOptions(prevState => ({
            Original_Location: dropdownOptions?.Original_Location?.find(option => option.value === data.originalLocation) || prevState.Original_Location,
            Setteled_Location: dropdownOptions?.Setteled_Location?.find(option => option.value === data.selectedLocation) || prevState.Setteled_Location,
          }));
        } else {
          console.error("Unexpected response format or status:", response);
          alert("Unable to fetch user details. Please try again later.");
        }
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
        alert("An error occurred while fetching user details.");
      }
    };
  
    fetchData();
  }, [id, city]); // ✅ Only re-fetch when `id` changes
  

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOptions = {
      originalLocation: selectedOptions.Original_Location?.value || '',
      selectedLocation: selectedOptions.Setteled_Location?.value || '',

    };
    const formattedOptions2 = {
      fatherEmployee: selectedOptions2.Father_Employee?.value || '',
      fatherOccupied: selectedOptions2.Father_Occupation?.value || '',
      motherEmployee: selectedOptions2.Mother_Employee?.value || '',
      motherOccupied: selectedOptions2.Mother_Occupation?.value || '',

    };
    const formDataToSend = {

      totalBrothers: formData.totalBrothers,
      marriedBrothers: formData.marriedBrothers,
      totalSisters: formData.totalSisters,
      marriedSisters: formData.marriedSisters,
      familyValue: formData.familyValue,
      familyType: formData.familyType,
      youngerBrothers: formData.youngerBrothers,
      elderBrothers: formData.elderBrothers,
      youngerSisters: formData.youngerSisters,
      elderSisters: formData.elderSisters,
      ...formattedOptions,
      ...formattedOptions2,

      // Including previously existing fields
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      step5: 1, // You can modify this flag to indicate step 5 completion
    };

    try {
     
      if (!id) {
        throw new Error("User ID not found in local storage");
      }

      const endpoint = `${apiEndpoints.update}/${id}`;

      // Send the PUT request to update the data
      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Details updated successfully!");

        // Store the userId in localStorage for the next step
        localStorage.setItem("userId", id);

        // Navigate to Step 5
        navigate(-1); // Navigate to the previous page
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    }
  };

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        );
     
        setCity(response.data);
      } catch (error) {
        console.error("Error fetching city data:", error);
        alert("Error fetching city data."); // Provide feedback to the user
      }
    };
    fetchCity();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch education data

        const occupation = await axios.get(
          "https://localhost:3300/api/occupation"
        );
     
        setOccupation(occupation.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please try again later.");
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [cityData, occupationData] = await Promise.all([
          axios.get("https://localhost:3300/api/city"),
          axios.get("https://localhost:3300/api/occupation"),
        ]);
        setCity(cityData.data);
        setOccupation(occupationData.data);
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
      border: ""
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0, // Remove extra padding
      boxShadow: "0 20px 20px rgba(0, 0, 0, 0.9)", // Example box-shadow
      border: "2px solid #000000",
      borderRadius: "20px "
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
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-red-100">
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
              onClick={handleBackClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
            <h1 className="text-2xl font-bold text-center text-white py-3">
              Step 5 -
            </h1>
            <h5 className="font-semibold text-white">Family Details</h5>
          </div>
        </div>
        <form
          className="flex flex-col gap-6  py-4 px-3 mt-20"
          onSubmit={handleSubmit}
        >
          {/* Father Employee */}
          {Object.keys(dropdownOptions2).map((key) => (
            <>
              <div className="mb-[-20px]">
                <label className="block text-red-500 font-medium mb-2">
                  {key}
                </label>
              </div>

              <div
                key={key}
                className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openModal2(key)}
              >

                <div className="flex items-center justify-between rounded-lg">
                  <span className="text-gray-500 text-md ">
                    {selectedOptions2[key]?.label || `Select ${key}`}
                  </span>
                  <RiArrowDownSLine className="text-3xl text-gray-300 ml-3" />
                </div>
              </div>
            </>
          ))}
  

      

          {/* Total Brothers */}
          <div>
            {/* Total Brothers */}
            {/* Total Brothers */}
            <div>
  <label
    htmlFor="totalBrothers"
    className="text-red-500 font-medium mb-2"
  >
    Total Brothers
  </label>
  <Select
    name="totalBrothers"
    value={
      formData.totalBrothers
        ? { label: formData.totalBrothers, value: formData.totalBrothers }
        : null // Placeholder when no value is selected
    }
    onChange={(selectedOption) =>
      setFormData({
        ...formData,
        totalBrothers: selectedOption ? selectedOption.value : "",
        youngerBrothers: "",
        elderBrothers: "",
        marriedBrothers: "", // Clear dependent fields
      })
    }
    options={[
      { value: "", label: "Select Total Brothers" }, // Placeholder
      { value: "0", label: "No Brothers" },
      ...[...Array(10).keys()].map((i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      })),
    ]}
    placeholder="Search Total Brothers"
    styles={customStyles}
  />
</div>


            {/* Younger and Elder Brothers */}
            {formData.totalBrothers && formData.totalBrothers !== "0" && (
              <>
                <div className="mt-4">
                  <label
                    htmlFor="youngerBrothers"
                    className="text-red-500 font-medium mb-2"
                  >
                    Number of Younger Brothers
                  </label>
                  <select
                    id="youngerBrothers"
                    name="youngerBrothers"
                    value={formData.youngerBrothers}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalBrothers))}
                  </select>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="elderBrothers"
                    className="text-red-500 font-medium mb-2"
                  >
                    Number of Elder Brothers
                  </label>
                  <select
                    id="elderBrothers"
                    name="elderBrothers"
                    value={formData.elderBrothers}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalBrothers))}
                  </select>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="marriedBrothers"
                    className="text-red-500 font-medium mb-2"
                  >
                    Married Brothers
                  </label>
                  <select
                    id="marriedBrothers"
                    name="marriedBrothers"
                    value={formData.marriedBrothers}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalBrothers))}
                  </select>
                </div>
              </>
            )}

            {/* Total Sisters */}
            <div className="mt-6">
  <label
    htmlFor="totalSisters"
    className="text-red-500 font-medium mb-2"
  >
    Total Sisters
  </label>
  <Select
    name="totalSisters"
    value={
      formData.totalSisters
        ? { label: formData.totalSisters, value: formData.totalSisters }
        : null // Placeholder when no value is selected
    }
    onChange={(selectedOption) =>
      setFormData({
        ...formData,
        totalSisters: selectedOption ? selectedOption.value : "",
        youngerSisters: "", // Reset dependent fields
        elderSisters: "",
        marriedSisters: "",
      })
    }
    options={[
      { value: "", label: "Select Total Sisters" }, // Placeholder
      { value: "0", label: "No Sisters" },
      ...[...Array(10).keys()].map((i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      })),
    ]}
    placeholder="Search Total Sisters"
    styles={customStyles}
  />
</div>


            {/* Younger and Elder Sisters */}
            {formData.totalSisters && formData.totalSisters !== "0" && (
              <>
                <div className="mt-4">
                  <label
                    htmlFor="youngerSisters"
                    className="text-red-500 font-medium mb-2"
                  >
                    Number of Younger Sisters
                  </label>
                  <select
                    id="youngerSisters"
                    name="youngerSisters"
                    value={formData.youngerSisters}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalSisters))}
                  </select>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="elderSisters"
                    className="text-red-500 font-medium mb-2"
                  >
                    Number of Elder Sisters
                  </label>
                  <select
                    id="elderSisters"
                    name="elderSisters"
                    value={formData.elderSisters}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalSisters))}
                  </select>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="marriedSisters"
                    className="text-red-500 font-medium mb-2"
                  >
                    Married Sisters
                  </label>
                  <select
                    id="marriedSisters"
                    name="marriedSisters"
                    value={formData.marriedSisters}
                    onChange={handleChange}
                    className="w-full p-4 border border-[#c4d4e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4d4e2] bg-white"
                  >
                    <option value="">Select</option>
                    {generateOptions(parseInt(formData.totalSisters))}
                  </select>
                </div>
              </>
            )}
          </div>

         {/* Family Value */}
<div>
  <label
    htmlFor="familyValue"
    className="text-red-500 font-medium mb-2"
  >
    Family Value
  </label>
  <Select
    name="familyValue"
    value={
      formData.familyValue
        ? { label: formData.familyValue, value: formData.familyValue }
        : null // Make sure the value is null when no option is selected
    }
    onChange={(selectedOption) =>
      setFormData({
        ...formData,
        familyValue: selectedOption ? selectedOption.value : "", // Set value to empty string if nothing selected
      })
    }
    options={[
      { value: "", label: "Select Family Value" }, // Placeholder option
      { value: "orthodox", label: "Orthodox" },
      { value: "traditional", label: "Traditional" },
    ]}
    placeholder="Search Family Value" // This will now apply as the value is null initially
    styles={customStyles}
  />
</div>

        {/* Family Type */}
<div>
  <label
    htmlFor="familyType"
    className="text-red-500 font-medium mb-2"
  >
    Family Type
  </label>
  <Select
    name="familyType"
    value={
      formData.familyType
        ? { label: formData.familyType, value: formData.familyType }
        : null // Make sure the value is null when no option is selected
    }
    onChange={(selectedOption) =>
      setFormData({
        ...formData,
        familyType: selectedOption ? selectedOption.value : "", // Set value to empty string if nothing selected
      })
    }
    options={[
      { value: "", label: "Select Family Type" }, // Placeholder option
      { value: "joint", label: "Joint" },
      { value: "nuclear", label: "Nuclear" },
    ]}
    placeholder="Select Family Type" // This will now apply as the value is null initially
    styles={customStyles}
  />
</div>


{Object.keys(dropdownOptions).map((key) => (
            <>
              <div className="mb-[-20px]">
                <label className="block text-red-500 font-medium mb-2">
                  {key}
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

          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-medium text-lg focus:outline-none hover:bg-red-700"
          >
            Submit
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
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Modal 2 */}
        {modalData2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData2.key}
              </h2>

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
                    <div key={index}>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => handleSelect2(option)}
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

export default Family_Details;
