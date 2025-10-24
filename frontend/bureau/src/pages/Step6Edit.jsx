import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import axios from "axios";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";

const Family_Property_Details = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [modalData, setModalData] = useState(null);
  const [modalData2, setModalData2] = useState(null);
  const [modalData3, setModalData3] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");
  const [location, setLocation] = useState([]);

  const [city, setCity] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({

  });
  const
    [selectedOptions2, setSelectedOptions2] = useState({
      House_Location: [], // Default for languages known (can be multiple)
    });

  const
    [selectedOptions3, setSelectedOptions3] = useState({
      Plot_Location: [], // Default for languages known (can be multiple)
    });
  const dropdownOptions = {
    House_Type: [
      { value: "groundFloor", label: "Ground Floor" },
      { value: "g+1", label: "G+1" },
      { value: "g+2", label: "G+2" },
      { value: "g+3", label: "G+3" },
      { value: "g+4", label: "G+4" },
      { value: "g+5", label: "G+5" },
      { value: "g+6", label: "G+6" },
      { value: "g+7", label: "G+7" },
      { value: "g+8", label: "G+8" },
      { value: "g+9", label: "G+9" },
      { value: "g+10", label: "G+10" },
    ],
    No_Of_Houses: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
    ],
    Own_House_sq_Yard: [
      ...Array.from(
        { length: 1000 - 70 + 1 },
        (_, index) => 70 + index
      ).map((sqFeet) => ({
        value: sqFeet,
        label: `${sqFeet} Yards`,
      })),
    ],
    Own_House_Total_Value: [
      ...Array.from(
        { length: 200 },
        (_, index) => 50000 + index * 50000
      ).map((value) => ({
        value: value,
        label: `₹${value.toLocaleString("en-IN")}`,
      })),
    ],
    Commercial_Shops: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
    ],
    Shops_Sq_Yards: [
      ...Array.from(
        { length: 1000 - 70 + 1 },
        (_, index) => 70 + index
      ).map((sqFeet) => ({
        value: sqFeet,
        label: `${sqFeet} Yards`,
      })),
    ],
    Monthly_Rent: [
      ...Array.from(
        { length: 200 },
        (_, index) => 50000 + index * 50000
      ).map((value) => ({
        value: value,
        label: `₹${value.toLocaleString("en-IN")}`,
      })),
    ],
    Open_Plots: [
      ...Array.from({ length: 20 }, (_, i) => i + 1).map((value) => ({
        value: value,
        label: value.toString(),
      })),
    ],
    Open_Plots_Sq_Yards: [
      ...Array.from(
        { length: 1000 - 70 + 1 },
        (_, index) => 70 + index
      ).map((sqFeet) => ({
        value: sqFeet,
        label: `${sqFeet} Yards`,
      })),
    ],
    Open_Plots_total_value: [
      ...Array.from(
        { length: 200 },
        (_, index) => 50000 + index * 50000
      ).map((value) => ({
        value: value,
        label: `₹${value.toLocaleString("en-IN")}`,
      })),
    ],

  };
  const dropdownOptions2 = {
    House_Location: [

      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],

  };
  const dropdownOptions3 = {
    Plot_Location: [

      ...city.map((plot_location) => ({ value: plot_location.city, label: plot_location.city })),
    ],

  };
   const [formData, setFormData] = useState({
  
    });
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


    fetchData("https://localhost:3300/api/city", setCity, "city");
  }, []);
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
          setSelectedOptions2({
          
            House_Location: Array.isArray(data.houseLocation) ? data.houseLocation : [],
          });
          setSelectedOptions3({
          
            Plot_Location: Array.isArray(data.openPlotsLocation) ? data.openPlotsLocation : [],
          });
  
          // Set original and settled location only if dropdownOptions exist
          setSelectedOptions(prevState => ({
            House_Type: dropdownOptions?.House_Type?.find(option => option.value === data.houseType) || prevState.House_Type,
            Own_House_sq_Yard: dropdownOptions?.Own_House_sq_Yard?.find(option => option.value === data.houseSqFeet) || prevState.Own_House_sq_Yard,
            Shops_Sq_Yards: dropdownOptions?.Shops_Sq_Yards?.find(option => option.value === data.shopssqyards) || prevState.Shops_Sq_Yards,
            Monthly_Rent: dropdownOptions?.Monthly_Rent?.find(option => option.value === data.monthlyRent) || prevState.Monthly_Rent,
            Commercial_Shops: dropdownOptions?.Commercial_Shops?.find(option => option.value === data.commercialshops) || prevState.Commercial_Shops,
            Own_House_Total_Value: dropdownOptions?.Own_House_Total_Value?.find(option => option.value === data.houseValue) || prevState.Own_House_Total_Value,
            No_Of_Houses: dropdownOptions?.No_Of_Houses?.find(option => option.value === data.numberOfHouses) || prevState.No_Of_Houses,
            Open_Plots: dropdownOptions?.Open_Plots?.find(option => option.value === data.openPlots) || prevState.Open_Plots,
            Open_Plots_Sq_Yards: dropdownOptions?.Open_Plots_Sq_Yards?.find(option => option.value === data.openPlotsSqFeet) || prevState.Open_Plots_Sq_Yards,
            Open_Plots_total_value: dropdownOptions?.Open_Plots_total_value?.find(option => option.value === data.openPlotsValue) || prevState.Open_Plots_total_value,
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
  

  const handleSearch = () => {
    const payload = Object.keys(selectedOptions).reduce((acc, key) => {
      acc[key] = selectedOptions[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/step5";
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);



  const handleCloseDropdown = () => {
    // Close the dropdown when the close button is clicked
    setDropdownOpen(false); // Adjust according to your component's API
  };




  const handleSubmit = async (e) => {
    e.preventDefault();



    const formattedOptions = {

      houseType: selectedOptions.House_Type?.value || '',
      houseSqFeet: selectedOptions.Own_House_sq_Yard?.value || '',
      houseValue: selectedOptions.Own_House_Total_Value?.value || '',
      monthlyRent: selectedOptions.Monthly_Rent?.value || '',
      openPlots: selectedOptions.Open_Plots?.value || '',
      openPlotsSqFeet: selectedOptions.Open_Plots_Sq_Yards?.value || '',
      openPlotsValue: selectedOptions.Open_Plots_total_value?.value || '',
      numberOfHouses: selectedOptions.No_Of_Houses?.value || '',
      commercialshops: selectedOptions.Commercial_Shops?.value || '',
      shopssqyards: selectedOptions.Shops_Sq_Yards?.value || '',
    };

    // Send the form data with updated family property fields
    const formDataToSend = {
      ...formattedOptions,
      houseLocation: selectedOptions2.House_Location,

      openPlotsLocation: selectedOptions3.Plot_Location,
      // Including step flags to indicate progress
      step1: 1,
      step2: 1,
      step3: 1,
      step4: 1,
      step5: 1,
      step6: 1, // You can modify this flag to indicate step 5 completion
    };

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
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
        

        // Navigate to Step 7 (or next step)
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
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  const handleCheckboxChange2 = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions2 = checked
      ? [...selectedOptions2.House_Location, option.value]
      : selectedOptions2.House_Location.filter((lang) => lang !== option.value);

    setSelectedOptions2({ ...selectedOptions2, House_Location: updatedSelectedOptions2 });
  };

  const handleCheckboxChange3 = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions3 = checked
      ? [...selectedOptions3.Plot_Location, option.value]
      : selectedOptions3.Plot_Location.filter((skill) => skill !== option.value);

    setSelectedOptions3({ ...selectedOptions3, Plot_Location: updatedSelectedOptions3 });
  };
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
              Step 6 -
            </h1>
            <h5 className="font-semibold text-white">Property Details</h5>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-20 py-4 px-3">
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
          {/* Second objects 2 */}
          {Object.keys(dropdownOptions2).map((key) => (
            <div key={key} className="mb-[-20px] rounded-lg">
              <label className="block text-red-500 font-medium mb-2 capitalize">
                {key}
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
                {key}
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



          {/* Next Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Update Property Details
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
                          checked={selectedOptions3.Plot_Location.includes(option.value)}
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
                          checked={selectedOptions2.House_Location.includes(option.value)}
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

export default Family_Property_Details;