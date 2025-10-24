import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import apiClient2, { apiEndpoints2 } from '../components/Apismongo';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import { FaSpinner } from 'react-icons/fa';



const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData2, setModalData2] = useState(null);
  const [searchTerm3, setSearchTerm3] = useState("");
  const [modalData3, setModalData3] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dropdown options for different categories
  const dropdownOptions = {
    Religion_Preferences: [
      { value: "Hindu", label: "Hindu" },
      { value: "Muslim", label: "Muslim" },
      { value: "Christian", label: "Christian" },
      { value: "Sikh", label: "Sikh" },
      { value: "Buddhist", label: "Buddhist" },
      { value: "Jain", label: "Jain" },
      { value: "Other", label: "Other" }
    ],
    Caste_Preferences: [
      { value: "Brahmin", label: "Brahmin" },
      { value: "Kshatriya", label: "Kshatriya" },
      { value: "Vaishya", label: "Vaishya" },
      { value: "Shudra", label: "Shudra" },
      { value: "Other", label: "Other" }
    ],
    Sub_Caste_Preferences: [
      { value: "Iyer", label: "Iyer" },
      { value: "Iyengar", label: "Iyengar" },
      { value: "Other", label: "Other" }
    ],
    Mother_Toungue_Preferences: [
      { value: "Hindi", label: "Hindi" },
      { value: "English", label: "English" },
      { value: "Tamil", label: "Tamil" },
      { value: "Telugu", label: "Telugu" },
      { value: "Kannada", label: "Kannada" },
      { value: "Malayalam", label: "Malayalam" },
      { value: "Bengali", label: "Bengali" },
      { value: "Marathi", label: "Marathi" },
      { value: "Gujarati", label: "Gujarati" },
      { value: "Punjabi", label: "Punjabi" },
      { value: "Other", label: "Other" }
    ],
    Marital_Status_Preferences: [
      { value: "Never Married", label: "Never Married" },
      { value: "Divorced", label: "Divorced" },
      { value: "Widowed", label: "Widowed" },
      { value: "Awaiting Divorce", label: "Awaiting Divorce" }
    ],
    children_PreferenceOptions: [
      { value: "no_children", label: "No Children" },
      { value: "has_children", label: "Has Children" },
      { value: "want_children", label: "Want Children" }
    ],
    Created_by_preference: [
      { value: "Self", label: "Self" },
      { value: "Parent", label: "Parent" },
      { value: "Sibling", label: "Sibling" },
      { value: "Relative", label: "Relative" },
      { value: "Friend", label: "Friend" }
    ],
    Physical_status_preference: [
      { value: "Normal", label: "Normal" },
      { value: "Physically Challenged", label: "Physically Challenged" }
    ],
    Eating_habits_preference: [
      { value: "Vegetarian", label: "Vegetarian" },
      { value: "Non-Vegetarian", label: "Non-Vegetarian" },
      { value: "Eggetarian", label: "Eggetarian" },
      { value: "Jain", label: "Jain" }
    ]
  };

  const dropdownOptions2 = {
    Education_Preferences: [
      { value: "High School", label: "High School" },
      { value: "Bachelor's Degree", label: "Bachelor's Degree" },
      { value: "Master's Degree", label: "Master's Degree" },
      { value: "PhD", label: "PhD" },
      { value: "Diploma", label: "Diploma" },
      { value: "Other", label: "Other" }
    ],
    Occupation_Preference: [
      { value: "Software Engineer", label: "Software Engineer" },
      { value: "Doctor", label: "Doctor" },
      { value: "Teacher", label: "Teacher" },
      { value: "Business Owner", label: "Business Owner" },
      { value: "Government Employee", label: "Government Employee" },
      { value: "Private Employee", label: "Private Employee" },
      { value: "Other", label: "Other" }
    ],
    Job_Location_Preference: [
      { value: "Bangalore", label: "Bangalore" },
      { value: "Mumbai", label: "Mumbai" },
      { value: "Delhi", label: "Delhi" },
      { value: "Chennai", label: "Chennai" },
      { value: "Hyderabad", label: "Hyderabad" },
      { value: "Pune", label: "Pune" },
      { value: "Other", label: "Other" }
    ],
    Anuual_Income_Preference: [
      { value: "1 - 2 lakhs", label: "1 - 2 lakhs" },
      { value: "2 - 3 lakhs", label: "2 - 3 lakhs" },
      { value: "3 - 4 lakhs", label: "3 - 4 lakhs" },
      { value: "4 - 5 lakhs", label: "4 - 5 lakhs" },
      { value: "5 - 6 lakhs", label: "5 - 6 lakhs" },
      { value: "6+ lakhs", label: "6+ lakhs" }
    ],
    Partner_Family_Preference: [
      { value: "Joint Family", label: "Joint Family" },
      { value: "Nuclear Family", label: "Nuclear Family" }
    ],
    Setelled_Location_Preference: [
      { value: "India", label: "India" },
      { value: "USA", label: "USA" },
      { value: "UK", label: "UK" },
      { value: "Canada", label: "Canada" },
      { value: "Australia", label: "Australia" },
      { value: "Other", label: "Other" }
    ]
  };

  const dropdownOptions3 = {
    Country_Preference: [
      { value: "India", label: "India" },
      { value: "USA", label: "USA" },
      { value: "UK", label: "UK" },
      { value: "Canada", label: "Canada" },
      { value: "Australia", label: "Australia" },
      { value: "Other", label: "Other" }
    ],
    State_Preference: [
      { value: "Karnataka", label: "Karnataka" },
      { value: "Maharashtra", label: "Maharashtra" },
      { value: "Tamil Nadu", label: "Tamil Nadu" },
      { value: "Andhra Pradesh", label: "Andhra Pradesh" },
      { value: "Telangana", label: "Telangana" },
      { value: "Kerala", label: "Kerala" },
      { value: "Other", label: "Other" }
    ],
    City_Preference: [
      { value: "Bangalore", label: "Bangalore" },
      { value: "Mumbai", label: "Mumbai" },
      { value: "Chennai", label: "Chennai" },
      { value: "Hyderabad", label: "Hyderabad" },
      { value: "Pune", label: "Pune" },
      { value: "Other", label: "Other" }
    ],
    Citizenship_Preference: [
      { value: "Indian", label: "Indian" },
      { value: "NRI", label: "NRI" },
      { value: "OCI", label: "OCI" },
      { value: "Other", label: "Other" }
    ]
  };

  // Initialize with "Any" as default for all fields
  const [selectedOptions, setSelectedOptions] = useState({
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (storedUserData.martialId && storedUserData.bureauId) {
        setUserData(storedUserData);
        setLoading(false);
      } else {
        const response = await apiClient2.get(apiEndpoints2.userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setUserData(response.data.user);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions({ ...selectedOptions, [key]: updatedSelectedOptions });
    } else {
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
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions2({ ...selectedOptions2, [key]: updatedSelectedOptions });
    } else {
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
      setSelectedOptions2((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: dropdownOptions2[key].map((option) => option.value),
      }));
    } else {
      setSelectedOptions2((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [key]: ["Any"],
      }));
    }
  };

  const handleCheckboxChange3 = (event, option, key) => {
    const { checked } = event.target;
    const currentOptions = selectedOptions3[key] || [];
    
    if (checked) {
      const updatedSelectedOptions = currentOptions
        .filter(value => value !== "Any")
        .concat(option.value);
      setSelectedOptions3({ ...selectedOptions3, [key]: updatedSelectedOptions });
    } else {
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

  const processPreferences = (preferences) => {
    if (!preferences || preferences.length === 0 || preferences.includes("Any")) {
      return "Any";
    }
    return preferences.join(", ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userData) {
      alert("Please wait while we load your profile data.");
      return;
    }

    // Automatically determine opposite gender
    const oppositeGender = userData.gender?.toLowerCase() === 'male' ? 'female' : 'male';

    const searchData = {
      gender: oppositeGender,
      ageMin: ageRange.min,
      ageMax: ageRange.max,
      heightMin: heightRange.min,
      heightMax: heightRange.max,
      religionPreferences: processPreferences(selectedOptions.Religion_Preferences),
      castePreferences: processPreferences(selectedOptions.Caste_Preferences),
      subCastePreferences: processPreferences(selectedOptions.Sub_Caste_Preferences),
      motherTonguePreferences: processPreferences(selectedOptions.Mother_Toungue_Preferences),
      maritalStatusPreferences: processPreferences(selectedOptions.Marital_Status_Preferences),
      childrenPreferences: processPreferences(selectedOptions.children_PreferenceOptions),
      createdByPreferences: processPreferences(selectedOptions.Created_by_preference),
      physicalStatusPreferences: processPreferences(selectedOptions.Physical_status_preference),
      eatingHabitsPreferences: processPreferences(selectedOptions.Eating_habits_preference),
      educationPreferences: processPreferences(selectedOptions2.Education_Preferences),
      occupationPreferences: processPreferences(selectedOptions2.Occupation_Preference),
      jobLocationPreferences: processPreferences(selectedOptions2.Job_Location_Preference),
      annualIncomePreferences: processPreferences(selectedOptions2.Anuual_Income_Preference),
      familyPreferences: processPreferences(selectedOptions2.Partner_Family_Preference),
      settledLocationPreferences: processPreferences(selectedOptions2.Setelled_Location_Preference),
      countryPreferences: processPreferences(selectedOptions3.Country_Preference),
      statePreferences: processPreferences(selectedOptions3.State_Preference),
      cityPreferences: processPreferences(selectedOptions3.City_Preference),
      citizenshipPreferences: processPreferences(selectedOptions3.Citizenship_Preference),
    };
  
    try {
      navigate('/advanced-search-results', { state: { searchData } });
    } catch (error) {
      console.error("Error processing search:", error);
      alert("An error occurred while processing your search.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-sm mx-auto my-12 mt-30 space-y-4">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 mb-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
              onClick={() => navigate('/home')}
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
              <p className="text-blue-100 text-sm">
                Searching for: {userData?.gender?.toLowerCase() === 'male' ? 'Female' : 'Male'} profiles
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age Range */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Age Range</h2>
                <p className="text-sm text-gray-600">Select your preferred age range</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Age Display */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">{ageRange.min}</span>
                  <p className="text-xs text-gray-600">Min Age</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-indigo-600">{ageRange.max}</span>
                  <p className="text-xs text-gray-600">Max Age</p>
                </div>
              </div>

              {/* Age Range Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Age Range</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="number"
                        min="18"
                        max="70"
                        value={ageRange.min}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 18 && value <= ageRange.max) {
                            setAgeRange({ ...ageRange, min: value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="number"
                        min="18"
                        max="70"
                        value={ageRange.max}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= ageRange.min && value <= 70) {
                            setAgeRange({ ...ageRange, max: value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>18 years</span>
                    <span>70 years</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Height Range */}
          <section className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Height Range</h2>
                <p className="text-sm text-gray-600">Select your preferred height range</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Height Display */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">{heightRange.min.toFixed(1)}</span>
                  <p className="text-xs text-gray-600">Min Height (ft)</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-emerald-600">{heightRange.max.toFixed(1)}</span>
                  <p className="text-xs text-gray-600">Max Height (ft)</p>
                </div>
              </div>

              {/* Height Range Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Height Range</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="number"
                        min="4.0"
                        max="7.0"
                        step="0.1"
                        value={heightRange.min}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= 4.0 && value <= heightRange.max) {
                            setHeightRange({ ...heightRange, min: value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="number"
                        min="4.0"
                        max="7.0"
                        step="0.1"
                        value={heightRange.max}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= heightRange.min && value <= 7.0) {
                            setHeightRange({ ...heightRange, max: value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>4.0 ft</span>
                    <span>7.0 ft</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Preferences */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Preferences</h2>
            <div className="space-y-4">
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
            </div>
          </section>

          {/* Professional Preferences */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Preferences</h2>
            <div className="space-y-4">
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
            </div>
          </section>

          {/* Location Preferences */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Location Preferences</h2>
            <div className="space-y-4">
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
            </div>
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
      <BottomNavbar />
    </>
  );
};

export default AdvancedSearch; 