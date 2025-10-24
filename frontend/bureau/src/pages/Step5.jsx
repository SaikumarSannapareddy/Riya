import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import axios from "axios";
import Select from "react-select";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";

const Family_Details = () => {
  
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalData2, setModalData2] = useState(null);
  const [searchTerm2, setSearchTerm2] = useState("");

  const [location, setLocation] = useState([]);
  const [occupation, setOccupation] = useState([]);

  const [formData, setFormData] = useState({
    fatherEmployee: "",
    fatherOccupied: "",
    motherEmployee: "",
    motherOccupied: "",
    totalBrothers: "2", // Default to 2
    marriedBrothers: "",
    totalSisters: "2", // Default to 2
    marriedSisters: "",
    familyValue: "add_another", // Default to add another
    familyType: "nuclear", // Default to nuclear
    familyStatus: "", // New field for family status
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
    Father_Employee: { value: "private_employee", label: "Private Employee" }, // Default to Private Employee
    Mother_Employee: { value: "not_employee", label: "Not Employee" }, // Default to Not Employee
  });

  const dropdownOptions = {
    Proper_Location: [
     
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
    
    Family_Status: [
      { value: "poor_family", label: "Poor Family" },
      { value: "middle_class", label: "Middle Class" },
      { value: "upper_middle_class", label: "Upper Middle Class" },
      { value: "rich_family", label: "Rich Family" },
      { value: "ias_family", label: "IAS Family" },
      { value: "ips_family", label: "IPS Family" },
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

    fetchData("http://localhost:3200/api/city", setLocation, "location");
    fetchData("http://localhost:3200/api/occupation", setOccupation, "occupation");
 
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

  const handleSelectChange = (selectedOption, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOptions = {
      originalLocation: selectedOptions.Proper_Location?.value || '',
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
      familyStatus: formData.familyStatus, // Add family status
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

        // Navigate to Step 5
        navigate("/step6", { state: { userId } });
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
          "http://localhost:3200/api/city"
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
          "http://localhost:3200/api/occupation"
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
          axios.get("http://localhost:3200/api/city"),
          axios.get("http://localhost:3200/api/occupation"),
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
          {Object.keys(dropdownOptions2).map((key) => {
            // Skip Father_Occupation if Father_Employee is not employed/retired/expired
            if (key === 'Father_Occupation' && 
                selectedOptions2.Father_Employee?.value && 
                ['not_employee', 'retired_employee', 'expaired'].includes(selectedOptions2.Father_Employee.value)) {
              return null;
            }
            
            // Skip Mother_Occupation if Mother_Employee is not employed/retired/expired/home_maker
            if (key === 'Mother_Occupation' && 
                selectedOptions2.Mother_Employee?.value && 
                ['not_employee', 'retired_employee', 'expaired', 'home_maker'].includes(selectedOptions2.Mother_Employee.value)) {
              return null;
            }
            
            return (
              <>
                <div className="mb-[-20px]">
                  <label className="block text-red-500 font-medium mb-2">
                  {key.replace(/_/g, ' ')}
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
            );
          })}
  

      

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
  <select
  name="totalBrothers"
  value={formData.totalBrothers || ""}
  className="border border-gray-200 p-2 py-4 rounded-md mt-4 text-gray-600 w-full"
  styles={customStyles}
  onChange={(e) =>
    setFormData({
      ...formData,
      totalBrothers: e.target.value,
      youngerBrothers: "",
      elderBrothers: "",
      marriedBrothers: "", // Clear dependent fields
    })
  }
>
  <option value="">Select Total Brothers</option>
  <option value="0">No Brothers</option>
  {[...Array(10).keys()].map((i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>

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
  <select
  name="totalBrothers"
  value={formData.totalSisters || ""}
  className="border border-gray-200 p-2 py-4 rounded-md mt-4 text-gray-600 w-full"
  styles={customStyles}
  onChange={(e) =>
    setFormData({
      ...formData,
      totalSisters: e.target.value,
      youngerBrothers: "",
      elderBrothers: "",
      marriedBrothers: "", // Clear dependent fields
    })
  }
>
  <option value="">Select Total Sisters</option>
  <option value="0">No Sisters</option>
  {[...Array(10).keys()].map((i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>

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
{/* Family Value */}
<div>
  <label htmlFor="familyValue" className="text-red-500 font-medium mb-2">
    Family Value
  </label>
  <select
    name="familyValue"
     className="border border-gray-200 p-2 py-4 rounded-md mt-4 text-gray-600 w-full"
    value={formData.familyValue || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        familyValue: e.target.value, // Update selected value
      })
    }
  >
    <option value="">Select Family Value</option>
    <option value="orthodox">Orthodox</option>
    <option value="traditional">Traditional</option>
    <option value="moderate">Moderate</option>
    <option value="liberal">Liberal</option>
    <option value="add_another">Add Another</option>
  </select>
</div>

{/* Family Type */}
<div>
  <label htmlFor="familyType" className="text-red-500 font-medium mb-2">
    Family Type
  </label>
  <select
    name="familyType"
     className="border border-gray-200 p-2 py-4 rounded-md mt-4 text-gray-600 w-full"
    value={formData.familyType || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        familyType: e.target.value, // Update selected value
      })
    }
  >
    <option value="">Select Family Type</option>
    <option value="joint">Joint</option>
    <option value="nuclear">Nuclear</option>
  </select>
</div>

{/* Family Status */}
<div>
  <label htmlFor="familyStatus" className="text-red-500 font-medium mb-2">
    Family Status
  </label>
  <select
    name="familyStatus"
     className="border border-gray-200 p-2 py-4 rounded-md mt-4 text-gray-600 w-full"
    value={formData.familyStatus || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        familyStatus: e.target.value, // Update selected value
      })
    }
  >
    <option value="">Select Family Status</option>
    <option value="poor_family">Poor Family</option>
    <option value="middle_class">Middle Class</option>
    <option value="upper_middle_class">Upper Middle Class</option>
    <option value="rich_family">Rich Family</option>
    <option value="ias_family">IAS Family</option>
    <option value="ips_family">IPS Family</option>
  </select>
</div>


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
