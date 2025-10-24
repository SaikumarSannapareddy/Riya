import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopNavbar from "../components/Gnavbar";
import Bottomnav from "../components/Bottomnav";
import PrivateRoute from "../components/PrivateRoute";

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);

  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData2, setModalData2] = useState(null);
  
  const [searchTerm3, setSearchTerm3] = useState("");
  const [modalData3, setModalData3] = useState(null);

  // Add gender selection
  const [selectedGender, setSelectedGender] = useState("");

  const [city, setCity] = useState([]);
  const [education, setEducation] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [caste, setCaste] = useState([]);
  const [subcaste, setSubcaste] = useState([]);

  // Initialize with "Any" as default for all fields
  const [selectedOptions, setSelectedOptions] = useState({
    height: { value: "4", label: "4" }, // Default value for height
    Religion_Preferences: ["Any"],
    Caste_Preferences: ["Any"],
    Sub_Caste_Preferences: ["Any"],
    Mother_Toungue_Preferences: ["Any"],
    Marital_Status_Preferences: ["Any"],
    children_PreferenceOptions: ["Any"],
    Created_by_preference: ["Any"],
    Physical_status_preference: ["Any"],
    Eating_habits_preference: ["Any"]
  });
  
  const [selectedOptions2, setSelectedOptions2] = useState({
    Education_Preferences: ["Any"],
    Occupation_Preference: ["Any"],
    Job_Location_Preference: ["Any"],
    Anuual_Income_Preference: ["Any"],
    Partner_Family_Preference: ["Any"],
    Setelled_Location_Preference: ["Any"]
  });
  
  const [selectedOptions3, setSelectedOptions3] = useState({
    Country_Preference: ["Any"],
    State_Preference: ["Any"],
    City_Preference: ["Any"],
    Citizenship_Preference: ["Any"]
  });

  // Range inputs for age and height
  const [ageRange, setAgeRange] = useState({ min: 18, max: 60 });
  const [heightRange, setHeightRange] = useState({ min: 4.0, max: 6.5 });

  const dropdownOptions = {
     heightRange: (() => {
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
   Age_Preference: Array.from({ length: 63 }, (_, i) => {
    const value = i + 18;
    return { value, label: `${value} years` };
  }),
    Religion_Preferences: [
      { value: "hindu", label: "Hindu" },
      { value: "muslim", label: "Muslim" },
      { value: "christian", label: "Christian" },
      { value: "sikh", label: "Sikh" },
      { value: "buddhist", label: "Buddhist" },
      { value: "jain", label: "Jain" },
      { value: "parsi", label: "Parsi" },
      { value: "other", label: "Other" },
    ],
    Caste_Preferences: [
      ...caste.map((caste) => ({ value: caste.caste, label: caste.caste })),
    ],
    Sub_Caste_Preferences: [
      ...subcaste.map((caste) => ({ value: caste.sub_caste, label: caste.sub_caste })),
    ],
    Mother_Toungue_Preferences: [
      { value: "bengali", label: "Bengali" },
      { value: "english", label: "English" },
      { value: "hindi", label: "Hindi" },
      { value: "kannada", label: "Kannada" },
      { value: "marathi", label: "Marathi" },
      { value: "tamil", label: "Tamil" },
      { value: "telugu", label: "Telugu" },
    ],
    Marital_Status_Preferences: [
      { value: "Never Married", label: "Never Married" },
      { value: "married", label: "Waiting For Divorce" },
      { value: "widowed", label: "Widowed" },
      { value: "divorced", label: "Divorced" },
    
    ],
    children_PreferenceOptions: [
      { value: "no_children", label: "No children" },
      { value: "want_children", label: "Want children" },
      { value: "has_children", label: "Has children" },
      { value: "not_sure_yet", label: "Not sure yet" },
    ],
    Created_by_preference: [
      { value: "self", label: "Self" },
      { value: "father", label: "Father" },
      { value: "mother", label: "Mother" },
      { value: "friend", label: "Friend" },
      { value: "relatives", label: "Relatives" },
      { value: "sister", label: "Sister" },
      { value: "brother", label: "Brother" },
    ],
    Physical_status_preference: [
      { value: "normal", label: "Normal" },
      { value: "physically_challenged", label: "Physically Challenged" },
    ],
    Eating_habits_preference: [
      { value: "vegetarian", label: "Vegetarian" },
      { value: "non_vegetarian", label: "Non-Vegetarian" },
      { value: "eggetarian", label: "Eggetarian" },
      { value: "jain", label: "Jain" },
    ],
  };

  const dropdownOptions2 = {
    Education_Preferences: [
      ...education.map((education) => ({ value: education.education, label: education.education })),
    ],
    Occupation_Preference: [
      ...occupation.map((occupation) => ({ value: occupation.occupation, label: occupation.occupation })),
    ],
    Job_Location_Preference: [
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
    Anuual_Income_Preference: [
      ...annualIncome.map((annual_income) => ({ value: annual_income.annual_income, label: annual_income.annual_income })),
    ],
    Partner_Family_Preference: [
      { value: "Joint_Family", label: "Joint Family" },
      { value: "Nuclear_Family", label: "Nuclear Family" },
      { value: "Family-Oriented_Partner", label: "Family-Oriented Partner" },
      { value: "Independent_Partner", label: "Independent Partner" },
      { value: "Living_with_Parents", label: "Living with Parents" },
    ],
    Setelled_Location_Preference: [
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
  };

  const dropdownOptions3 = {
    Country_Preference: [
      ...country.map((job_location) => ({ value: job_location.country, label: job_location.country })),
    ],
    State_Preference: [
      ...state.map((job_location) => ({ value: job_location.state, label: job_location.state })),
    ],
    City_Preference: [
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
    Citizenship_Preference: [
      { value: "Indian", label: "Indian" },
      { value: "NRI", label: "NRI" },
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

    fetchData("http://localhost:3200/api/city", setCity, "city");
    fetchData("http://localhost:3200/api/education", setEducation, "education");
    fetchData("http://localhost:3200/api/annual_income", setAnnualIncome, "anuualincome");
    fetchData("http://localhost:3200/api/occupation", setOccupation, "occupation");
    fetchData("http://localhost:3200/api/caste", setCaste, "caste");
    fetchData("http://localhost:3200/api/sub_caste", setSubcaste, "subcaste");
    fetchData("http://localhost:3200/api/country", setCountry, "country");
    fetchData("http://localhost:3200/api/state", setState, "state");
  }, []);

  const openModal = (key) => setModalData({ key, options: dropdownOptions[key] });
  const closeModal = () => setModalData(null);

  const openModal2 = (key) => setModalData2({ key, options: dropdownOptions2[key] });
  const closeModal2 = () => setModalData2(null);

  const openModal3 = (key) => setModalData3({ key, options: dropdownOptions3[key] });
  const closeModal3 = () => setModalData3(null);

  useEffect(() => {
    if (modalData) {
      setSearchTerm("");
    }
  }, [modalData]);

  useEffect(() => {
    if (modalData2) {
      setSearchTerm2("");
    }
  }, [modalData2]);

  useEffect(() => {
    if (modalData3) {
      setSearchTerm3("");
    }
  }, [modalData3]);

  const handleCheckboxChange = (event, option, key) => {
    const { checked } = event.target;
    const currentOptions = selectedOptions[key] || [];
    
    if (checked) {
      // Remove "Any" if it exists and add the selected option
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions({ ...selectedOptions, [key]: updatedSelectedOptions });
    } else {
      // Remove the option, if no options left, add "Any"
      const updatedSelectedOptions = currentOptions.filter((value) => value !== option.value);
      if (updatedSelectedOptions.length === 0) {
        setSelectedOptions({ ...selectedOptions, [key]: ["Any"] });
      } else {
        setSelectedOptions({ ...selectedOptions, [key]: updatedSelectedOptions });
      }
    }
  };

  const handleSelectAllChange = (event, key) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: dropdownOptions[key].map((option) => option.value),
      }));
    } else {
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: ["Any"],
      }));
    }
  };

  const handleCheckboxChange2 = (event, option, key) => {
    const { checked } = event.target;
    const currentOptions = selectedOptions2[key] || [];
    
    if (checked) {
      // Remove "Any" if it exists and add the selected option
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions2({ ...selectedOptions2, [key]: updatedSelectedOptions });
    } else {
      // Remove the option, if no options left, add "Any"
      const updatedSelectedOptions = currentOptions.filter((value) => value !== option.value);
      if (updatedSelectedOptions.length === 0) {
        setSelectedOptions2({ ...selectedOptions2, [key]: ["Any"] });
      } else {
        setSelectedOptions2({ ...selectedOptions2, [key]: updatedSelectedOptions });
      }
    }
  };

  const handleSelectAllChange2 = (event, key) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedOptions2((prevSelectedOptions2) => ({
        ...prevSelectedOptions2,
        [key]: dropdownOptions2[key].map((option) => option.value),
      }));
    } else {
      setSelectedOptions2((prevSelectedOptions2) => ({
        ...prevSelectedOptions2,
        [key]: ["Any"],
      }));
    }
  };

  const handleCheckboxChange3 = (event, option, key) => {
    const { checked } = event.target;
    const currentOptions = selectedOptions3[key] || [];
    
    if (checked) {
      // Remove "Any" if it exists and add the selected option
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions3({ ...selectedOptions3, [key]: updatedSelectedOptions });
    } else {
      // Remove the option, if no options left, add "Any"
      const updatedSelectedOptions = currentOptions.filter((value) => value !== option.value);
      if (updatedSelectedOptions.length === 0) {
        setSelectedOptions3({ ...selectedOptions3, [key]: ["Any"] });
      } else {
        setSelectedOptions3({ ...selectedOptions3, [key]: updatedSelectedOptions });
      }
    }
  };

  const handleSelectAllChange3 = (event, key) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedOptions3((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: dropdownOptions3[key].map((option) => option.value),
      }));
    } else {
      setSelectedOptions3((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: ["Any"],
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (modalData) {
      const allSelected =
        selectedOptions[modalData.key]?.length === modalData.options.length &&
        !selectedOptions[modalData.key]?.includes("Any");
      const checkbox = document.getElementById("selectAllCheckbox");
      if (checkbox) {
        checkbox.checked = allSelected;
      }
    }
  }, [selectedOptions, modalData]);

  useEffect(() => {
    if (modalData2) {
      const allSelected2 =
        selectedOptions2[modalData2.key]?.length === modalData2.options.length &&
        !selectedOptions2[modalData2.key]?.includes("Any");
      const checkbox = document.getElementById("selectAllCheckbox2");
      if (checkbox) {
        checkbox.checked = allSelected2;
      }
    }
  }, [selectedOptions2, modalData2]);

  useEffect(() => {
    if (modalData3) {
      const allSelected3 =
        selectedOptions3[modalData3.key]?.length === modalData3.options.length &&
        !selectedOptions3[modalData3.key]?.includes("Any");
      const checkbox = document.getElementById("selectAllCheckbox3");
      if (checkbox) {
        checkbox.checked = allSelected3;
      }
    }
  }, [selectedOptions3, modalData3]);

  // Check if marital status is "Never Married" to conditionally show children options
  const isNeverMarried = selectedOptions.Marital_Status_Preferences?.includes("Never Married");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate gender selection
    if (!selectedGender) {
      alert("Please select a gender to search for.");
      return;
    }

    function processPreferences(preferences, defaultValue = "Any") {
      // If preferences is "Any" or empty array, return "Any"
      if (!preferences || preferences.length === 0 || (preferences.length === 1 && preferences[0] === "Any")) {
        return "Any";
      }
      // If all items are "Any", return "Any"
      if (preferences.every(item => item === "Any")) {
        return "Any";
      }
      // Filter out "Any" and join the rest
      const filteredPreferences = preferences.filter(item => item !== "Any");
      return filteredPreferences.length > 0 ? filteredPreferences.join(",") : "Any";
    }
  
    const searchData = {
      // Gender selection (required)
      gender: selectedGender,
      
      // Caste & Religion Preferences
      religionPreferences: processPreferences(selectedOptions.Religion_Preferences),
      castePreferences: processPreferences(selectedOptions.Caste_Preferences),
      subCastePreferences: processPreferences(selectedOptions.Sub_Caste_Preferences),
      motherTonguePreferences: processPreferences(selectedOptions.Mother_Toungue_Preferences),
      maritalStatusPreferences: processPreferences(selectedOptions.Marital_Status_Preferences),
      childrenPreferences: isNeverMarried ? "no_children" : processPreferences(selectedOptions.children_PreferenceOptions),
      
      // Basic Details Preferences
      ageMin: ageRange.min,
      ageMax: ageRange.max,
      heightMin: heightRange.min,
      heightMax: heightRange.max,
      createdByPreferences: processPreferences(selectedOptions.Created_by_preference),
      physicalStatusPreferences: processPreferences(selectedOptions.Physical_status_preference),
      eatingHabitsPreferences: processPreferences(selectedOptions.Eating_habits_preference),
      
      // Profession & Income Preferences
      educationPreferences: processPreferences(selectedOptions2.Education_Preferences),
      occupationPreferences: processPreferences(selectedOptions2.Occupation_Preference),
      jobLocationPreferences: processPreferences(selectedOptions2.Job_Location_Preference),
      annualIncomePreferences: processPreferences(selectedOptions2.Anuual_Income_Preference),
      familyPreferences: processPreferences(selectedOptions2.Partner_Family_Preference),
      settledLocationPreferences: processPreferences(selectedOptions2.Setelled_Location_Preference),
      
      // Location Preferences
      countryPreferences: processPreferences(selectedOptions3.Country_Preference),
      statePreferences: processPreferences(selectedOptions3.State_Preference),
      cityPreferences: processPreferences(selectedOptions3.City_Preference),
      citizenshipPreferences: processPreferences(selectedOptions3.Citizenship_Preference),
    };
  
    try {
      // Navigate to search results with the search data
      navigate('/advanced-search-results', { state: { searchData } });
    } catch (error) {
      console.error("Error processing search:", error);
      alert("An error occurred while processing your search.");
    }
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col bg-white min-h-screen">
        <TopNavbar />
        
        <div className="flex-1 p-4 mt-20 mb-20">
          {/* Full Width Header */}
          <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 mb-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  onClick={() => navigate('/search')}
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
                <div>
                  <h1 className="text-2xl font-bold">Advanced Search</h1>
                  <p className="text-blue-100 text-sm">Find your perfect match with detailed preferences</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-blue-100 text-sm">Live Search</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 px-3 py-6">
              {/* Gender Selection - Required */}
              <section className="shadow-2xl bg-white px-2 py-4 rounded">
                <div className="text-center pb-3">
                  <button type="button" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-md">
                    * Select Gender to Search For *
                  </button>
                </div>
                
                <div className="mb-[20px] rounded-lg">
                  <label className="block text-red-500 font-medium mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedGender("male")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedGender === "male"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👨</div>
                        <div className="font-semibold">Male</div>
                        <div className="text-sm text-gray-600">Search for Male profiles</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedGender("female")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedGender === "female"
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👩</div>
                        <div className="font-semibold">Female</div>
                        <div className="text-sm text-gray-600">Search for Female profiles</div>
                      </div>
                    </button>
                  </div>
                  
                  {selectedGender && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-center font-medium">
                        Searching for {selectedGender === "male" ? "Male" : "Female"} profiles
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Block 1: Caste & Religion Preferences */}
              <section className="shadow-2xl bg-white px-2 py-4 rounded">
                <div className="text-center pb-3">
                  <button type="button" className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-md">
                    * Caste & Religion Preferences *
                  </button>
                </div>
                
                {Object.keys(dropdownOptions).map((key) => (
                  <div key={key} className="mb-[20px] rounded-lg">
                    <label className="block text-red-500 font-medium mb-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div
                      className="flex flex-col w-full rounded-lg border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => openModal(key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-md font-medium">
                          {Array.isArray(selectedOptions[key]) &&
                          Array.isArray(dropdownOptions[key]) &&
                          selectedOptions[key]?.length === dropdownOptions[key]?.length
                            ? "Any"
                            : selectedOptions[key]?.length > 0 && !selectedOptions[key]?.every(item => item === "Any")
                            ? dropdownOptions[key]
                                ?.filter((opt) => selectedOptions[key]?.includes(opt.value))
                                .map((opt) => opt.label)
                                .join(", ")
                            : "Any"}
                        </span>
                        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Age Range */}
               <div className="mb-[20px] rounded-lg">
                    <label className="block text-red-500 font-medium mb-2">Age Preference</label>
                    <div
                      className="flex flex-col w-full rounded-lg border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => openModal("Age_Preference")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-md font-medium">
                          {ageRange.min} - {ageRange.max} years
                        </span>
                        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                      </div>
                    </div>
                  </div>

                {/* Height Range */}
              <div className="mb-[20px] rounded-lg">
  <label className="block text-red-500 font-medium mb-2">Height Preference</label>
  <div
    className="flex flex-col w-full rounded-lg border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
    onClick={() => openModal("heightRange")}
  >
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-md font-medium">
        {heightRange.min} - {heightRange.max} ft
      </span>
      <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
    </div>
  </div>
</div>
              </section>

              {/* Block 2: Profession & Income Preferences */}
              <section className="shadow-2xl bg-white px-2 py-4 rounded">
                <div className="text-center pb-3">
                  <button type="button" className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all font-semibold shadow-md">
                    * Profession & Income Preferences *
                  </button>
                </div>
                
                {Object.keys(dropdownOptions2).map((key) => (
                  <div key={key} className="mb-[20px] rounded-lg">
                    <label className="block text-red-500 font-medium mb-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div
                      className="flex flex-col w-full rounded-lg border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => openModal2(key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-md font-medium">
                          {Array.isArray(selectedOptions2[key]) &&
                          Array.isArray(dropdownOptions2[key]) &&
                          selectedOptions2[key]?.length === dropdownOptions2[key]?.length
                            ? "Any"
                            : selectedOptions2[key]?.length > 0 && !selectedOptions2[key]?.every(item => item === "Any")
                            ? dropdownOptions2[key]
                                ?.filter((opt) => selectedOptions2[key]?.includes(opt.value))
                                .map((opt) => opt.label)
                                .join(", ")
                            : "Any"}
                        </span>
                        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Income Range - REMOVED: Use Annual Income Preferences dropdown instead */}
                {/* The income data is stored as text (e.g., "3 - 4 lakhs") not numbers */}
                <div className="mb-[20px] rounded-lg">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm text-center">
                      💡 <strong>Tip:</strong> Use "Annual Income Preferences" dropdown above for income filtering
                    </p>
                  </div>
                </div>

                {/* Property Value Range - REMOVED: Use Property Value Preferences instead */}
                {/* Property values may also be stored as text descriptions */}
                <div className="mb-[20px] rounded-lg">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm text-center">
                      💡 <strong>Tip:</strong> Use "Total Property Value Preferences" dropdown above for property filtering
                    </p>
                  </div>
                </div>
              </section>

              {/* Block 3: Location Preferences */}
              <section className="shadow-2xl bg-white px-2 py-4 rounded">
                <div className="text-center pb-3">
                  <button type="button" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all font-semibold shadow-md">
                    * Location Preferences *
                  </button>
                </div>
                
                {Object.keys(dropdownOptions3).map((key) => (
                  <div key={key} className="mb-[20px] rounded-lg">
                    <label className="block text-red-500 font-medium mb-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div
                      className="flex flex-col w-full rounded-lg border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => openModal3(key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-md font-medium">
                          {Array.isArray(selectedOptions3[key]) &&
                          Array.isArray(dropdownOptions3[key]) &&
                          selectedOptions3[key]?.length === dropdownOptions3[key]?.length
                            ? "Any"
                            : selectedOptions3[key]?.length > 0 && !selectedOptions3[key]?.every(item => item === "Any")
                            ? dropdownOptions3[key]
                                ?.filter((opt) => selectedOptions3[key]?.includes(opt.value))
                                .map((opt) => opt.label)
                                .join(", ")
                            : "Any"}
                        </span>
                        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <div className="text-center pb-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-md"
                >
                  Search Profiles
                </button>
              </div>
            </form>

            {/* Modal 1 */}
            {modalData && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                  <h2 className="text-lg font-bold mb-4 capitalize text-center">
                    Select {modalData.key}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      id="selectAllCheckbox"
                      type="checkbox"
                      checked={
                        selectedOptions[modalData.key]?.length ===
                        dropdownOptions[modalData.key].length &&
                        !selectedOptions[modalData.key]?.includes("Any")
                      }
                      onChange={(e) => handleSelectAllChange(e, modalData.key)}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <label className="block text-gray-700">Any</label>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder={`Search ${modalData.key}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                    {modalData.options
                      .filter((option) =>
                        option.label.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((option, index) => (
                        <div key={index}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedOptions[modalData.key]?.includes(option.value) && option.value !== "Any"}
                              onChange={(e) => handleCheckboxChange(e, option, modalData.key)}
                              className="form-checkbox h-4 w-4 text-red-600"
                            />
                            <label className="block text-gray-700">{option.label}</label>
                          </div>
                          <hr className="border-gray-200 mt-3 mb-3" />
                        </div>
                      ))}
                  </div>
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
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      id="selectAllCheckbox2"
                      type="checkbox"
                      checked={
                        selectedOptions2[modalData2.key]?.length ===
                        dropdownOptions2[modalData2.key].length &&
                        !selectedOptions2[modalData2.key]?.includes("Any")
                      }
                      onChange={(e) => handleSelectAllChange2(e, modalData2.key)}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <label className="block text-gray-700">Any</label>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder={`Search ${modalData2.key}`}
                    value={searchTerm2}
                    onChange={(e) => setSearchTerm2(e.target.value)}
                  />
                  <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                    {modalData2.options
                      .filter((option) =>
                        option.label.toLowerCase().includes(searchTerm2.toLowerCase())
                      )
                      .map((option, index) => (
                        <div key={index}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedOptions2[modalData2.key]?.includes(option.value) && option.value !== "Any"}
                              onChange={(e) => handleCheckboxChange2(e, option, modalData2.key)}
                              className="form-checkbox h-4 w-4 text-red-600"
                            />
                            <label className="block text-gray-700">{option.label}</label>
                          </div>
                          <hr className="border-gray-200 mt-3 mb-3" />
                        </div>
                      ))}
                  </div>
                  <button
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={closeModal2}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Modal 3 */}
            {modalData3 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                  <h2 className="text-lg font-bold mb-4 capitalize text-center">
                    Select {modalData3.key}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      id="selectAllCheckbox3"
                      type="checkbox"
                      checked={
                        selectedOptions3[modalData3.key]?.length ===
                        dropdownOptions3[modalData3.key].length &&
                        !selectedOptions3[modalData3.key]?.includes("Any")
                      }
                      onChange={(e) => handleSelectAllChange3(e, modalData3.key)}
                      className="form-checkbox h-4 w-4 text-red-600"
                    />
                    <label className="block text-gray-700">Any</label>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder={`Search ${modalData3.key}`}
                    value={searchTerm3}
                    onChange={(e) => setSearchTerm3(e.target.value)}
                  />
                  <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                    {modalData3.options
                      .filter((option) =>
                        option.label.toLowerCase().includes(searchTerm3.toLowerCase())
                      )
                      .map((option, index) => (
                        <div key={index}>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedOptions3[modalData3.key]?.includes(option.value) && option.value !== "Any"}
                              onChange={(e) => handleCheckboxChange3(e, option, modalData3.key)}
                              className="form-checkbox h-4 w-4 text-red-600"
                            />
                            <label className="block text-gray-700">{option.label}</label>
                          </div>
                          <hr className="border-gray-200 mt-3 mb-3" />
                        </div>
                      ))}
                  </div>
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

        <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default AdvancedSearch; 