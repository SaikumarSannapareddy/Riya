import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    height: { value: "3.1", label: "3.1 ft" },
    weight: { value: "30", label: "30 kg" },
    Physical_State: { value: "", label: "Select" },
    Eating_Habits: { value: "", label: "Select" },
    Smoking_Habits: { value: "", label: "Select" },
    Drinking_Habits: { value: "", label: "Select" },
  });

  const dropdownOptions = {
    height: Array.from({ length: 41 }, (_, i) => {
      const value = (3.1 + i * 0.1).toFixed(1);
      return { value, label: `${value} ft` };
    }),
    weight: Array.from({ length: 171 }, (_, i) => {
      const value = (30 + i);
      return { value: value.toString(), label: `${value} kg` };
    }),
    Physical_State: [
      { value: "", label: "Select" },
      { value: "normal", label: "Normal" },
      { value: "slim", label: "Slim" },
      { value: "challenged", label: "Challenged" },
    ],
    Eating_Habits: [
      { value: "", label: "Select" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "nonVegetarian", label: "Non-Vegetarian" },
      { value: "eggetarian", label: "Eggetarian" },
    ],
    Smoking_Habits: [
      { value: "", label: "Select" },
      { value: "no", label: "No" },
      { value: "occasionally", label: "Occasional" },
      { value: "yes", label: "Yes" },
    ],
    Drinking_Habits: [
      { value: "", label: "Select" },
      { value: "no", label: "No" },
      { value: "occasionally", label: "Occasional" },
      { value: "yes", label: "Yes" },
    ],
  };

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    time: "",
    maritalStatus: "",
    maleKids: "",
    femaleKids: "",
    hasRelatives: "",
    height: "",
    weight: "",
    physicalState: "",
    eatingHabits: "",
    smokingHabits: "",
    drinkingHabits: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await apiClient2.get(apiEndpoints2.userData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          const userData = response.data.user;
          
          // Update form data
          setFormData({
            fullName: userData.fullName || "",
            dateOfBirth: userData.dateOfBirth || "",
            time: userData.time || "",
            maritalStatus: userData.maritalStatus || "",
            maleKids: userData.maleKids || "",
            femaleKids: userData.femaleKids || "",
            hasRelatives: userData.hasRelatives || "",
            height: userData.height || "",
            weight: userData.weight || "",
            physicalState: userData.physicalState || "",
            eatingHabits: userData.eatingHabits || "",
            smokingHabits: userData.smokingHabits || "",
            drinkingHabits: userData.drinkingHabits || "",
          });

          // Update selected dropdown options
          setSelectedOptions({
            height: { value: userData.height || "3.1", label: `${userData.height || "3.1"} ft` },
            weight: { value: userData.weight || "30", label: `${userData.weight || "30"} kg` },
            Physical_State: dropdownOptions.Physical_State.find(option => option.value === userData.physicalState) || { value: "", label: "Select" },
            Eating_Habits: dropdownOptions.Eating_Habits.find(option => option.value === userData.eatingHabits) || { value: "", label: "Select" },
            Smoking_Habits: dropdownOptions.Smoking_Habits.find(option => option.value === userData.smokingHabits) || { value: "", label: "Select" },
            Drinking_Habits: dropdownOptions.Drinking_Habits.find(option => option.value === userData.drinkingHabits) || { value: "", label: "Select" },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const openModal = (key) => {
    setModalData({ key, options: dropdownOptions[key] });
  };

  const closeModal = () => {
    setModalData(null);
    setSearchTerm("");
  };

  const handleSelect = (selectedOption) => {
    setSelectedOptions({ ...selectedOptions, [modalData.key]: selectedOption });
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Extract only `value` from selectedOptions
      const formattedOptions = {
        height: selectedOptions.height.value,
        weight: selectedOptions.weight.value,
        physicalState: selectedOptions.Physical_State.value,
        eatingHabits: selectedOptions.Eating_Habits.value,
        smokingHabits: selectedOptions.Smoking_Habits.value,
        drinkingHabits: selectedOptions.Drinking_Habits.value,
      };

      const formDataToSend = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        time: formData.time,
        maritalStatus: formData.maritalStatus,
        maleKids: formData.maleKids,
        femaleKids: formData.femaleKids,
        hasRelatives: formData.hasRelatives,
        ...formattedOptions,
      };

      const response = await apiClient2.put(apiEndpoints2.updateUser, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert("Personal details updated successfully!");
        // Update local storage with new data
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : {};
        const updatedUser = { ...user, ...formDataToSend };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        navigate(-1);
      } else {
        alert("Failed to update personal details.");
      }
    } catch (error) {
      console.error("Error updating personal details:", error);
      alert("An error occurred while updating personal details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">
            Edit Personal Details
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  handleChange({ target: { name: "fullName", value } });
                }}
                placeholder="Enter your full name"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date of Birth
              </label>
              <input
                placeholder="Enter Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Birth Time
              </label>
              <input
                placeholder="Enter Birth Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={(e) =>
                  setFormData({ ...formData, maritalStatus: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Marital Status</option>
                <option value="neverMarried">Never Married</option>
                <option value="awaitingDivorce">Awaiting Divorce</option>
                <option value="divorced">Divorced</option>
                <option value="widow">Widow</option>
              </select>
            </div>

            {formData.maritalStatus !== "neverMarried" && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Male Kids
                  </label>
                  <select
                    name="maleKids"
                    value={formData.maleKids}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Female Kids
                  </label>
                  <select
                    name="femaleKids"
                    value={formData.femaleKids}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Are the born children with you?
                  </label>
                  <select
                    name="hasRelatives"
                    value={formData.hasRelatives}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </>
            )}

            {Object.keys(dropdownOptions).map((key) => (
              <div key={key}>
                <div className="mb-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    {key.replace(/_/g, ' ')}
                  </label>
                </div>
                <div
                  className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                  onClick={() => openModal(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">
                      {selectedOptions[key]?.label || `Select ${key.replace(/_/g, ' ')}`}
                    </span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Personal Details"}
            </button>
          </form>

          {/* Modal for dropdown selections */}
          {modalData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">
                  Select {modalData.key.replace(/_/g, ' ')}
                </h2>

                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder={`Search ${modalData.key.replace(/_/g, ' ')}`}
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

                <button
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPersonalDetails; 