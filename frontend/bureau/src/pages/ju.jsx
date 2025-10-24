import React, { useState, useEffect } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";

const Step9 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);

  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData2, setModalData2] = useState(null);
  
  const [searchTerm3, setSearchTerm3] = useState("");
  const [modalData3, setModalData3] = useState(null);

  const [city, setCity] = useState([]);
  const [education, setEducation] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [extraSkills, setExtraSkills] = useState([]);
  const [caste, setCaste] = useState([]);
  const [subcaste, setSubcaste] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({

  });
  const [selectedOptions2, setSelectedOptions2] = useState({

  });
  const [selectedOptions3, setSelectedOptions3] = useState({

  });


  const dropdownOptions = {
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

    Mother_Toungue: [
      { value: "bengali", label: "Bengali" },
      { value: "english", label: "English" },
      { value: "hindi", label: "Hindi" },
      { value: "kannada", label: "Kannada" },
      { value: "marathi", label: "Marathi" },
      { value: "tamil", label: "Tamil" },
      { value: "telugu", label: "Telugu" },
    ],

    Marital_Status_Preferences : [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
      { value: "separated", label: "Separated" },
    ],
    
    children_PreferenceOptions : [
      { value: "no_children", label: "No children" },
      { value: "want_children", label: "Want children" },
      { value: "has_children", label: "Has children" },
      { value: "not_sure_yet", label: "Not sure yet" },
    ],
    
    Age_Preferences : [
      { value: "18_24", label: "18-24" },
      { value: "25_30", label: "25-30" },
      { value: "31_35", label: "31-35" },
      { value: "36_40", label: "36-40" },
      { value: "41_50", label: "41-50" },
      { value: "51_and_above", label: "51 and above" },
    ],
    

    Height_Preferences: [
      ...Array.from({ length: 26 }, (_, i) => ({
        value: (4 + i * 0.1).toFixed(1),
        label: `${(4 + i * 0.1).toFixed(1)} ft`,
      })),
    ],
    Partner_Created_Preferences: [
      { value: "self", label: "Self" },
      { value: "father", label: "Father" },
      { value: "mother", label: "Mother" },
      { value: "friend", label: "Friend" },
      { value: "relatives", label: "Relatives" },
      { value: "sister", label: "Sister" },
      { value: "brother", label: "Brother" },
    ],
    Partner_Service_Preferences: [
      { value: "only_online", label: "Only Online Service" },
      { value: "only_offline", label: "Only Offline Service" },
      { value: "online_offline", label: "Online/Offline Service" },
    ],
  };
  const dropdownOptions2 = {

    Education_Preferences: [
    
      ...education.map((education) => ({ value: education.education, label: education.education })),
    ],
    Employee_Preference: [
    
      ...occupation.map((occupation) => ({ value: occupation.occupation, label: occupation.occupation })),
    ],
    Job_Location_Preference: [
     
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],
    Anuual_Income_Preference: [
     
      ...annualIncome.map((annual_income) => ({ value: annual_income.annual_income, label: annual_income.annual_income })),
    ],
    employmentStatus: [
      { value: "privateEmployee", label: "Private Employee" },
      { value: "govtEmployee", label: "Government Employee" },
      { value: "business", label: "Business" },
    ],
  
    Anuual_Income_Preferenc: [
     
      ...annualIncome.map((annual_income) => ({ value: annual_income.annual_income, label: annual_income.annual_income })),
    ],
    Setelled_Location_Preference: [
     
      ...city.map((job_location) => ({ value: job_location.city, label: job_location.city })),
    ],

  };

  const dropdownOptions3 = {

    House_Type_Preference: [
      { value: "GroundFloor", label: "Ground Floor" },
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
    Own_House_sq_Yard_Preference: [
      ...Array.from(
        { length: 1000 - 70 + 1 },
        (_, index) => 70 + index
      ).map((sqFeet) => ({
        value: sqFeet,
        label: `${sqFeet} Yards`,
      })),
    ],
    Monthly_Rent_Preference: [
      { value: "", label: "Select total value", isDisabled: true }, // Disabled option as a placeholder
      ...Array.from(
        { length: 200 },
        (_, index) => 50000 + index * 50000
      ).map((value) => ({
        value: value,
        label: `₹${value.toLocaleString("en-IN")}`,
      })),
    ],
    Open_Plots_Preference: [
      { value: "", label: "Select Number of Open Plots", isDisabled: true }, // Disabled option as a placeholder
      ...Array.from({ length: 20 }, (_, i) => i + 1).map((value) => ({
        value: value,
        label: value.toString(),
      })),
    ],
    Open_Plots_Sq_Yards_Preference: [
      { value: "", label: "Select total sq yard of open plots", isDisabled: true }, // Disabled option as a placeholder
      ...Array.from(
        { length: 1000 - 70 + 1 },
        (_, index) => 70 + index
      ).map((sqFeet) => ({
        value: sqFeet,
        label: `${sqFeet} Yards`,
      })),
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

    fetchData("https://localhost:3300/api/city", setCity, "city");
    fetchData("https://localhost:3300/api/education", setEducation, "education");
    fetchData("https://localhost:3300/api/annual_income", setAnnualIncome, "anuualincome");
    fetchData("https://localhost:3300/api/extra_skills", setExtraSkills, "extraskills");
    fetchData("https://localhost:3300/api/occupation", setOccupation, "occupation");
    fetchData("https://localhost:3300/api/caste", setCaste, "caste");
    fetchData("https://localhost:3300/api/sub_caste", setSubcaste, "subcaste");
    fetchData("https://localhost:3300/api/education", setEducation, "education");
  }, []);

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

  const handleCheckboxChange = (event, option, key) => {
    const { checked } = event.target;
    const updatedSelectedOptions = checked
      ? [...selectedOptions[key], option.value]
      : selectedOptions[key].filter((value) => value !== option.value);

    setSelectedOptions({ ...selectedOptions, [key]: updatedSelectedOptions });
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
        [key]: [],
      }));
    }
  };

  const handleCheckboxChange2 = (event, option, key) => {
    const { checked } = event.target;
    const updatedSelectedOptions2 = checked
      ? [...selectedOptions2[key], option.value]
      : selectedOptions2[key].filter((value) => value !== option.value);

    setSelectedOptions2({ ...selectedOptions2, [key]: updatedSelectedOptions2 });
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
        [key]: [],
      }));
    }
  };


  const handleCheckboxChange3 = (event, option, key) => {
    const { checked } = event.target;
    const updatedSelectedOptions3 = checked
      ? [...selectedOptions3[key], option.value]
      : selectedOptions3[key].filter((value) => value !== option.value);

    setSelectedOptions3({ ...selectedOptions3, [key]: updatedSelectedOptions3 });
  };

  const handleSelectAllChange3 = (event, key) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedOptions3((prevSelectedOptions3) => ({
        ...prevSelectedOptions3,
        [key]: dropdownOptions3[key].map((option) => option.value),
      }));
    } else {
      setSelectedOptions3((prevSelectedOptions3) => ({
        ...prevSelectedOptions3,
        [key]: [],
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top
  }, []);

  useEffect(() => {
    if (modalData) {
      const allSelected =
        selectedOptions[modalData.key]?.length === modalData.options.length;
      document.getElementById("selectAllCheckbox").checked = allSelected;
    }
  }, [selectedOptions, modalData]);

  useEffect(() => {
    if (modalData2) {
      const allSelected2 =
        selectedOptions2[modalData2.key]?.length === modalData2.options.length;
      document.getElementById("selectAllCheckbox2").checked = allSelected2;
    }
  }, [selectedOptions2, modalData2]);

  useEffect(() => {
    if (modalData3) {
      const allSelected3 =
        selectedOptions3[modalData3.key]?.length === modalData3.options.length;
      document.getElementById("selectAllCheckbox3").checked = allSelected3;
    }
  }, [selectedOptions3, modalData3]);


  
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
        <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
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
              Step 9 -
            </h1>
            <h5 className="font-semibold text-white">Partner Preferences</h5>
          </div>
        </div>
        <form className="space-y-6 px-3 mt-24 z-[49]">
  {/* Block 1 caste and religion */}
<section className="shadow-2xl bd-white px-2 py-4 rounded">
<div className="text-center pb-3">
            <button
              className="w-full bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition-colors font-semibold"
            >
              * Caste & Religion Preferences *
            </button>
          </div>
          {Object.keys(dropdownOptions).map((key) => (
  <div key={key} className="mb-[20px] rounded-lg">
    <label className="block text-red-500 font-medium mb-2 capitalize">
      {key}
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
            : selectedOptions[key]?.length > 0
            ? dropdownOptions[key]
                ?.filter((opt) => selectedOptions[key]?.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : `Select ${key}`}
        </span>
        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
      </div>
      
    </div>
  </div>
))}


</section>

  {/* Block 1 Ends Here */}

    {/* Block 2 caste and religion */}
<section className="shadow-2xl bd-white px-2 py-4 rounded">
<div className="text-center pb-3">
            <button
              className="w-full bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition-colors font-semibold"
            >
              * Education & Job Preferences *
            </button>
          </div>
          {Object.keys(dropdownOptions2).map((key) => (
  <div key={key} className="mb-[20px] rounded-lg">
    <label className="block text-red-500 font-medium mb-2 capitalize">
      {key}
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
            : selectedOptions2[key]?.length > 0
            ? dropdownOptions2[key]
                ?.filter((opt) => selectedOptions2[key]?.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : `Select ${key}`}
        </span>
        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
      </div>
      
    </div>
  </div>
))}


</section>

  {/* Block 2 Ends Here */}

   {/* Block 3 caste and religion */}
<section className="shadow-2xl bd-white px-2 py-4 rounded">
<div className="text-center pb-3">
            <button
              className="w-full bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition-colors font-semibold"
            >
              * Property Preferences *
            </button>
          </div>
          {Object.keys(dropdownOptions3).map((key) => (
  <div key={key} className="mb-[20px] rounded-lg">
    <label className="block text-red-500 font-medium mb-2 capitalize">
      {key}
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
            : selectedOptions3[key]?.length > 0
            ? dropdownOptions3[key]
                ?.filter((opt) => selectedOptions3[key]?.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            : `Select ${key}`}
        </span>
        <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
      </div>
      
    </div>
  </div>
))}


</section>

  {/* Block 2 Ends Here */}
          <div className="text-center pb-3">
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Submit
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
                    dropdownOptions[modalData.key].length
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
                <>
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions[modalData.key]?.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, option, modalData.key)}
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <label className="block text-gray-700">{option.label}</label>
                    </div>
                    <hr className="border-gray-200 mt-3 mb-3" />
                </>
                       
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
                    dropdownOptions2[modalData2.key].length
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
                <>
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions2[modalData2.key]?.includes(option.value)}
                        onChange={(e) => handleCheckboxChange2(e, option, modalData2.key)}
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <label className="block text-gray-700">{option.label}</label>
                    </div>
                    <hr className="border-gray-200 mt-3 mb-3" />
                </>
                       
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
    {/* Modal 2 */}

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
                    dropdownOptions3[modalData3.key].length
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
                <>
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions3[modalData3.key]?.includes(option.value)}
                        onChange={(e) => handleCheckboxChange3(e, option, modalData3.key)}
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <label className="block text-gray-700">{option.label}</label>
                    </div>
                    <hr className="border-gray-200 mt-3 mb-3" />
                </>
                       
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
    {/* Modal 3 */}
      </div>
    </div>
  );
};

export default Step9;
