import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import Select from "react-select";
import { RiArrowRightSLine } from "react-icons/ri";

const LocationDetails = () => {
  // Initial state values
  const initialFormData = {
    country: "",
    state: "",
    district: "",
    citizenship: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  // Country, State, and District Data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalData2, setModalData2] = useState(null);


  const dropdownOptions = {
    country: [
      ...countries.map((country) => ({ value: country.country, label: country.country }))
    ],
    state: [
      ...states.map((state) => ({ value: state.state, label: state.state }))
    ],
    city: [
      ...city.map((city) => ({ value: city.city, label: city.city }))
    ],
 
  }

  const [selectedOptions2, setSelectedOptions2] = useState({
    country: null,
    state: null,
    city: null,
    citizenship : null
  })

  const handleSelect = (selectedOption2) => {
    setSelectedOptions2({ ...selectedOptions2, [modalData2.key]: selectedOption2 });
    closeModal2();
  };

  const handleModalSelect = (selectedOption, key) => {
    setSelectedOptions2((prev) => ({ ...prev, [key]: selectedOption }));
    setModalData2(null);
  };

  // const openModal = (key) => setModalData({ key, options: dropdownOptions[key] });
  // const closeModal = () => setModalData(null);

  const openModal2 = (key) => setModalData2({ key, options: dropdownOptions[key] });
  const closeModal2 = () => setModalData2(null);

  useEffect(() => {
    if (modalData) {
      setSearchTerm(""); // Reset search term when opening a new modal
    }
  }, [modalData]);

  useEffect(() => {
    if (modalData2) {
      setSearchTerm2(""); // Reset search term when opening a new modal
    }
  }, [modalData2]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);


  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/step7";
    }
  };

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the form data with updated family property fields
    const formDataToSend = {
      // country: formData.country?.value || "",
      // state: formData.state?.value || "",
      // district: formData.district?.value || "",
      // citizenship: formData.citizenship,

      country: selectedOptions2.country?.value || '',
      state: selectedOptions2.state?.value || '',
      district: selectedOptions2.city?.value || '',
      // Including step flags to indicate progress
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      step5: 1,
      step6: 1,
      step7: 1,
      step8: 1,
    };

    try {
      const userId = localStorage.getItem("userId");
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

        // Navigate to Step 7 (or next step)
        navigate(-1);
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/country"
        );
        console.log("Fetched countriies data: ", response.data); // Log the API response
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching cuntries data:", error);
        alert("Error fetching countries data."); // Provide feedback to the user
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/state"
        );
        console.log("Fetched states data: ", response.data); // Log the API response
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states data:", error);
        alert("Error fetching states data."); // Provide feedback to the user
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        );
        console.log("Fetched city data: ", response.data); // Log the API response
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
        const [cityData, countryData, stateData] = await Promise.all([
          axios.get("https://localhost:3300/api/city"),
          axios.get("https://localhost:3300/api/country"),
          axios.get("https://localhost:3300/api/state"),
        ]);
        setCity(cityData.data);
        setCountries(countryData.data);
        setStates(stateData.data);
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
  

          // Set original and settled location only if dropdownOptions exist
          setSelectedOptions2((prevState) => ({
            country: dropdownOptions?.country?.find(option => option.value === data.country) || prevState.country,
            state: dropdownOptions?.state?.find(option => option.value === data.state) || prevState.state,
            city: dropdownOptions?.city?.find(option => option.value === data.district) || prevState.city,
            
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
  
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
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
              Step 8 -
            </h1>
            <h5 className="font-semibold text-white">Location Details</h5>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-4">

          {Object.keys(dropdownOptions).map((key) => (
            <>
              <div className="mb-[-20px]">
                <label className="block text-red-500 font-medium mb-2">
                  {key}
                </label>
              </div>

              <div
                key={key}
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                onClick={() => openModal2(key)}
              >

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">
                    {selectedOptions2[key]?.label || `Select ${key}`}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </>
          ))}
          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Update Location Details
            </button>
          </div>
        </form>
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
                onClick={closeModal2}
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

export default LocationDetails;
