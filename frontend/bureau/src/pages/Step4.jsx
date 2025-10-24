import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis1";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import { RiArrowRightSLine } from "react-icons/ri";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";

const Step4 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navigate = useNavigate(); // Navigation hook

  // Function to randomly select 10 skills from the available skills
  const getRandomSkills = (skillsArray, count = 10) => {
    if (!skillsArray || skillsArray.length === 0) return [];
    const shuffled = [...skillsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, skillsArray.length)).map(skill => skill.skill);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalData2, setModalData2] = useState(null);
  const [modalData3, setModalData3] = useState(null);

  
  const [city, setCity] = useState([]);
  const [education, setEducation] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [extraSkills, setExtraSkills] = useState([]);

  const [languages, setLanguages] = useState([]);
  const [gotrams, setGotrams] = useState([]);

  const
   [selectedOptions, setSelectedOptions] = useState({
    Business_Location: [], // Default for languages known (can be multiple)
  });

  const
  [selectedOptions3, setSelectedOptions3] = useState({
   extraSkills: [], // Default for languages known (can be multiple)
 });

  const [selectedOptions2, setSelectedOptions2] = useState({
    Employment_Status: { value: "privateEmployee", label: "Private Employee" }, // Default to Private Employee
    Anuual_Income: { value: "15-lakhs", label: "15-lakhs" }, // Default to 15-lakhs
  });

  const dropdownOptions = {
    Business_Location: [
     
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
  
  };
  const dropdownOptions3 = {

    extraSkills: [
     
      ...extraSkills.map((skill) => ({ value: skill.skill, label: skill.skill })),
    ],
  };
  const dropdownOptions2 = {
    Education: [
     
      ...education.map((education) => ({ value: education.education, label: education.education })),
    ],
    Employment_Status:[
      { value: "privateEmployee", label: "Private Employee" },
      { value: "govtEmployee", label: "Government Employee" },
      { value: "business", label: "Business" },
    ],
    occupation: [
    
      ...occupation.map((occupation) => ({ value: occupation.occupation, label: occupation.occupation })),
    ],
    
   
    Anuual_Income: [
     
      ...annualIncome.map((annual_income) => ({ value: annual_income.annual_income, label: annual_income.annual_income })),
    ],
    Job_Location: [
     
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
  
    
    Any_Other_Bussiness:[
      { value: "", label: "Select Business" }, // Placeholder option
      { value: "null", label: "None" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      
    ],
    Other_Business_Income: [
     
      ...annualIncome.map((business_income) => ({ value: business_income.annual_income, label: business_income.annual_income })),
    ],

  };


  const handleSelect = (selectedOption2) => {
    setSelectedOptions2({ ...selectedOptions2, [modalData2.key]: selectedOption2 });
    closeModal2();
  };

  const handleSelect2 = (selectedOption3) => {
    setSelectedOptions3({ ...selectedOptions2, [modalData3.key]: selectedOption3 });
    closeModal3();
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

    fetchData("http://localhost:3200/api/city", setCity, "city");
    fetchData("http://localhost:3200/api/education", setEducation, "education");
    fetchData("http://localhost:3200/api/annual_income", setAnnualIncome, "anuualincome");
    fetchData("http://localhost:3200/api/extra_skills", setExtraSkills, "extraskills");
    fetchData("http://localhost:3200/api/occupation", setOccupation, "occupation");
    fetchData("http://localhost:3200/api/city", setCity, "city");
  }, []);

  // Set random 10 extra skills as default after data is fetched
  useEffect(() => {
    if (extraSkills.length > 0) {
      const randomSkills = getRandomSkills(extraSkills, 10);
      setSelectedOptions3(prev => ({
        ...prev,
        extraSkills: randomSkills
      }));
    }
  }, [extraSkills]);
  
  const handleModalSelect = (selectedOption, key) => {
    setSelectedOptions2((prev) => ({ ...prev, [key]: selectedOption }));
    setModalData2(null);
  };

  const openModal = (key) => setModalData({ key, options: dropdownOptions[key] });
  const closeModal = () => setModalData(null);

  const openModal2 = (key) => setModalData2({ key, options: dropdownOptions2[key] });
  const closeModal2 = () => setModalData2(null);
  
  const openModal3 = (key) => setModalData3({ key, options: dropdownOptions3[key] });
  const closeModal3 = () => setModalData3(null);

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


  useEffect(() => {
    if (modalData3) {
      setSearchTerm3(""); // Reset search term when opening a new modal
    }
  }, [modalData3]);

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
      ? [...selectedOptions.Business_Location, option.value]
      : selectedOptions.Business_Location.filter((lang) => lang !== option.value);

    setSelectedOptions({ ...selectedOptions, Business_Location: updatedSelectedOptions });
  };

  const handleCheckboxChange2 = (event, option) => {
    const { checked } = event.target;
    const updatedSelectedOptions3 = checked
      ? [...selectedOptions3.extraSkills, option.value]
      : selectedOptions3.extraSkills.filter((skill) => skill !== option.value);

    setSelectedOptions3({ ...selectedOptions3, extraSkills: updatedSelectedOptions3 });
  };

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      // Select all options
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        Business_Location: dropdownOptions.Business_Location.map((option) => option.value),
      }));
    } else {
      // Deselect all options
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        Business_Location: [],
      }));
    }
  };


  const handleSelectAllChange2 = (event) => {
    const { checked } = event.target;
    if (checked) {
      // Select all options
      setSelectedOptions3((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        extraSkills: dropdownOptions.extraSkills.map((option) => option.value),
      }));
    } else {
      // Deselect all options
      setSelectedOptions3((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        extraSkills: [],
      }));
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create formattedOptions, allowing empty values
    const formattedOptions = {
      education: selectedOptions2.Education?.value || '',
      employmentStatus: selectedOptions2.Employment_Status?.value || '',
      occupation: selectedOptions2.occupation?.value || '',
      annualIncome: selectedOptions2.Anuual_Income?.value || '',
      jobLocation: selectedOptions2.Job_Location?.value || '',
      otherBusinessIncome: selectedOptions2.Other_Business_Income?.value || '',
      otherBusiness: selectedOptions2.Any_Other_Bussiness?.value || '',
    };
  
   
  
    const dataToSend = {
      ...formattedOptions,
      extraTalentedSkills: selectedOptions3.extraSkills || '',
      businessLocation: selectedOptions.Business_Location || '',
      step1: 1,
      step2: 1,
      step3: 1,
      step4:1,
    };
  
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }
  
      const endpoint = `${apiEndpoints.update}/${userId}`;
      const response = await apiClient.put(endpoint, dataToSend, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        alert("Details updated successfully!");
        localStorage.setItem("userId", userId);
        navigate(`/step5`);
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error.message); // Log specific error message
      alert("An error occurred while updating details.");
    }
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
              Step 4 -
            </h1>
            <h5 className="font-semibold text-white">Education Details</h5>
          </div>
        </div>
        <form
          className="space-y-6 mt-20 py-4 px-3 z-99"
          onSubmit={handleSubmit}
        >

          {/* second objects */}
{Object.keys(dropdownOptions2).map((key) => (
        <>
       <div className="mb-[-20px]">
       <label className="block text-red-500 font-medium mb-2">
  {key.replace(/_/g, ' ')}
</label>

</div>

    <div
      key={key}
      className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer rounded-lg hover:shadow-lg transition-all"
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
{Object.keys(dropdownOptions).map((key) => (
            <div key={key} className="mb-[-20px] rounded-lg">
              <label className="block text-red-500 font-medium mb-2 capitalize">
                {key}
              </label>

              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openModal(key)}
              >
                <div className="flex items-center justify-between rounded">
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
                  <span className="text-gray-500 text-md font-medium">
                    {selectedOptions3[key]?.length
                      ? dropdownOptions3[key]
                          .filter((opt) => selectedOptions3[key].includes(opt.value))
                          .map((skill) => skill.label)
                          .join(", ")
                      : `Select ${key}`}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>
          ))}

          {/* Add other fields similarly */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800"
          >
            Submit
          </button>
        </form>
           {/* Modal for Selecting Languages */}
           {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
              <h2 className="text-lg font-bold mb-4 capitalize text-center">
                Select {modalData.key}
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
                        checked={selectedOptions.Business_Location.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, option)}
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
                        checked={selectedOptions3.extraSkills.includes(option.value)}
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
                onClick={closeModal3}
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

export default Step4;
