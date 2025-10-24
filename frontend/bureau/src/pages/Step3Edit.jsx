import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate for navigation
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints


const Step3 = () => {
  const navigate = useNavigate(); // Navigation hook

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalData2, setModalData2] = useState(null);

  
  const [castes, setCastes] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [raasi, setRaasi] = useState([]);
  const [star, setStar] = useState([]);


  const [languages, setLanguages] = useState([]);
  const [gotrams, setGotrams] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({
    Languages_Known: [], // Default for languages known (can be multiple)
  });
const { id } = useParams(); // Get the ID from the URL

  const [selectedOptions2, setSelectedOptions2] = useState({
    religion: null, // Default for religion
    Mother_Tongue: null, // Default for mother tongue
    caste: null, // Default value for caste (to be fetched from API)
    subcaste: null, // Default value for sub-caste (to be fetched from API)
    raasi: null, // Default value for raasi (to be fetched from API)
    star: null, // Default value for star (to be fetched from API)
  });
  const [formData, setFormData] = useState({

  });
  const dropdownOptions = {
    Languages_Known: [
      { value: "bengali", label: "Bengali" },
      { value: "english", label: "English" },
      { value: "hindi", label: "Hindi" },
      { value: "kannada", label: "Kannada" },
      { value: "marathi", label: "Marathi" },
      { value: "tamil", label: "Tamil" },
      { value: "telugu", label: "Telugu" },
    ],
  };

  const dropdownOptions2 = {
    religion: [
      { value: "buddhist", label: "Buddhist" },
      { value: "christian", label: "Christian" },
      { value: "hindu", label: "Hindu" },
      { value: "muslim", label: "Muslim" },
      { value: "sikh", label: "Sikh" },
    ],
    Mother_Tongue: [
      { value: "bengali", label: "Bengali" },
      { value: "english", label: "English" },
      { value: "hindi", label: "Hindi" },
      { value: "kannada", label: "Kannada" },
      { value: "marathi", label: "Marathi" },
      { value: "tamil", label: "Tamil" },
      { value: "telugu", label: "Telugu" },
    ],
   
    caste: [
     
      ...castes.map((caste) => ({ value: caste.caste, label: caste.caste })),
    ],
    subcaste: [
     
      ...subCastes.map((subcaste) => ({ value: subcaste.sub_caste, label: subcaste.sub_caste })),
    ],
    raasi: [
    
      ...raasi.map((raasi) => ({ value: raasi.raasi, label: raasi.raasi })),
    ],
    star: [
   
      ...star.map((star) => ({ value: star.star, label: star.star })),
    ],
  };


  const handleSelect = (selectedOption2) => {
    setSelectedOptions2({ ...selectedOptions2, [modalData2.key]: selectedOption2 });
    closeModal2();
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

    fetchData("https://localhost:3300/api/star", setStar, "star");
    fetchData("https://localhost:3300/api/raasi", setRaasi, "raasi");
    fetchData("https://localhost:3300/api/sub_caste", setSubCastes, "subcaste");
    fetchData("https://localhost:3300/api/caste", setCastes, "caste");
  }, []);
  
  const handleModalSelect = (selectedOption, key) => {
    setSelectedOptions2((prev) => ({ ...prev, [key]: selectedOption }));
    setModalData2(null);
  };

  const openModal = (key) => setModalData({ key, options: dropdownOptions[key] });
  const closeModal = () => setModalData(null);

  const openModal2 = (key) => setModalData2({ key, options: dropdownOptions2[key] });
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


  const handleCheckboxChange = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions = checked
      ? [...selectedOptions.Languages_Known, option.value]
      : selectedOptions.Languages_Known.filter((lang) => lang !== option.value);

    setSelectedOptions({ ...selectedOptions, Languages_Known: updatedSelectedOptions });
  };

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      // Select all options
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        Languages_Known: dropdownOptions.Languages_Known.map((option) => option.value),
      }));
    } else {
      // Deselect all options
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        Languages_Known: [],
      }));
    }
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
  
        if (response.status === 200 && response.data) {
          const data = response.data;
  
          // Update form data
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));
  
          // Ensure dropdown data is available
          if (castes.length > 0 && subCastes.length > 0 && raasi.length > 0 && star.length > 0) {
            setSelectedOptions2({
              religion: dropdownOptions2.religion.find(option => option.value === data.religion) || { value: "", label: "Select" },
              caste: dropdownOptions2.caste.find(option => option.value === data.caste) || { value: "", label: "Select" },
              subcaste: dropdownOptions2.subcaste.find(option => option.value === data.subcaste) || { value: "", label: "Select" },
              raasi: dropdownOptions2.raasi.find(option => option.value === data.raasi) || { value: "", label: "Select" },
              star: dropdownOptions2.star.find(option => option.value === data.star) || { value: "", label: "Select" },
              Mother_Tongue: dropdownOptions2.Mother_Tongue.find(option => option.value === data.motherTongue) || { value: "", label: "Select" },
            });
          }
  
          setSelectedOptions({
            Languages_Known: Array.isArray(data.languagesKnown) ? data.languagesKnown : [],
          });
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
  }, [id, castes, subCastes, raasi, star]); // Dependencies ensure data is loaded
  
  
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  useEffect(() => {
    // Check if "Select All" should be checked or not
    if (modalData) {
      const allSelected =
        selectedOptions.Languages_Known.length === dropdownOptions.Languages_Known.length;
      document.getElementById("selectAllCheckbox").checked = allSelected;
    }
  }, [selectedOptions.Languages_Known, modalData]);

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create formattedOptions, allowing empty values
    const formattedOptions = {
      religion: selectedOptions2.religion?.value || '',
      motherTongue: selectedOptions2.Mother_Tongue?.value || '',
      caste: selectedOptions2.caste?.value || '',
      subcaste: selectedOptions2.subcaste?.value || '',
      raasi: selectedOptions2.raasi?.value || '',
      star: selectedOptions2.star?.value || '',
    };
  
   
  
    const dataToSend = {
      ...formattedOptions,
      languagesKnown: selectedOptions.Languages_Known || '',
      step1: 1,
      step2: 1,
      step3: 1,
    };
  
    try {
      const userId = localStorage.getItem("userId");
      if (!id) {
        throw new Error("User ID not found in local storage");
      }
  
      const endpoint = `${apiEndpoints.update}/${id}`;
      const response = await apiClient.put(endpoint, dataToSend, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        alert("Details updated successfully!");
        localStorage.setItem("userId", id);
        navigate(-1);
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error.message); // Log specific error message
      alert("An error occurred while updating details.");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-red-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
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
              Step 3 -
            </h1>
            <h5 className="font-semibold text-white">Religion & caste</h5>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-20 py-4 px-3">
          {Object.keys(dropdownOptions).map((key) => (
            <div key={key} className="mb-[-20px]">
              <label className="block text-red-500 font-medium mb-2 capitalize">
                {key}
              </label>

              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                onClick={() => openModal(key)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">
                    {selectedOptions[key]?.length
                      ? dropdownOptions[key]
                          .filter((opt) => selectedOptions[key].includes(opt.value))
                          .map((lang) => lang.label)
                          .join(", ")
                      : `Select ${key}`}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>
          ))}
{/* second objects */}
{Object.keys(dropdownOptions2).map((key) => (
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

{/* Second objects 2 */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Update Religion and  Caste Details
          </button>
        </form>

        {/* Modal for Selecting Languages */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData.key}
              </h2>

              {/* "Select All" Checkbox */}
              <div className="flex items-center space-x-2 mb-4">
                <input
                  id="selectAllCheckbox"
                  type="checkbox"
                  checked={
                    selectedOptions.Languages_Known.length ===
                    dropdownOptions.Languages_Known.length
                  }
                  onChange={handleSelectAllChange}
                  className="form-checkbox h-4 w-4 text-red-600"
                />
                <label className="block text-gray-700">Select All</label>
              </div>

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
                    <>
                      <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.Languages_Known.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, option)}
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <label className="block text-gray-700">{option.label}</label>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </div>
                          <hr className="border-gray-200 mt-3 mb-3" />
                    </>
                  
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
           {/* Modal for Selecting Options */}
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
                    <>
                        <div key={index}>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </button>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </div>
                 
                    </>
                
                    
                  ))}
              </div>

              {/* Close Button */}
              <button
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={closeModal2}
              >
                continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
