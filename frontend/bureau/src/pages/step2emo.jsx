import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints

const Step2Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

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
    step1: "",
    step2: "",
  });

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
          setFormData((prevData) => ({
            ...prevData,
            ...response.data,
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
  }, [id]);

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      navigate(-1);
    }
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

    const formDataToSend = {
      ...formData,
      step1: 1,
      step2: 1,
    };

    try {
      if (!id) {
        throw new Error("ID not found in URL");
      }

      const endpoint = `${apiEndpoints.update}/${id}`;
      console.log("Submitting data to endpoint:", endpoint);

      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Update Response:", response);

      if (response.status === 200) {
        alert("Details updated successfully!");
        navigate(`/edit-profile/${id}`, { state: { userId: id } });
      } else {
        console.error("Failed to update details:", response);
        alert("Failed to update details. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred while updating details:", error);
      alert("An error occurred while updating details.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
        <div className="flex items-center mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full p-4">
          <button onClick={handleBack} className="p-2">
            <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
          </button>
          <h2 className="text-2xl font-semibold text-white ml-4">
            Step 2: Personal Details
          </h2>
        </div>

        <form className="space-y-6 px-3 mt-20 py-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            />
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            />
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Birth Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            />
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Marital Status
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              <option value="neverMarried">Never Married</option>
              <option value="awaitingDivorce">Awaiting Divorce</option>
              <option value="divorced">Divorced</option>
              <option value="widow">Widow</option>
            </select>
          </div>

          {formData.maritalStatus !== "neverMarried" && (
            <>
              <div>
                <label className="block text-indigo-500 font-medium mb-2">
                  Male Kids
                </label>
                <select
                  name="maleKids"
                  value={formData.maleKids}
                  onChange={handleChange}
                  className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
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
                <label className="block text-indigo-500 font-medium mb-2">
                  Female Kids
                </label>
                <select
                  name="femaleKids"
                  value={formData.femaleKids}
                  onChange={handleChange}
                  className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
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
                <label className="block text-indigo-500 font-medium mb-2">
                  Are the born children with you?
                </label>
                <select
                  name="hasRelatives"
                  value={formData.hasRelatives}
                  onChange={handleChange}
                  className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Height (in feet)
            </label>
            <select
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              {Array.from({ length: 31 }, (_, i) =>
                (4.0 + i * 0.1).toFixed(1)
              ).map((h) => (
                <option key={h} value={h}>
                  {h} ft
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Weight (in kg)
            </label>
            <select
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              {Array.from({ length: 171 }, (_, i) => i + 30).map((w) => (
                <option key={w} value={w}>
                  {w} kg
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Physical State
            </label>
            <select
              name="physicalState"
              value={formData.physicalState}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="slim">Slim</option>
              <option value="challenged">Challenged</option>
            </select>
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Eating Habits
            </label>
            <select
              name="eatingHabits"
              value={formData.eatingHabits}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="nonVegetarian">Non-Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Smoking Habits
            </label>
            <select
              name="smokingHabits"
              value={formData.smokingHabits}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="occasionally">Occasional</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-indigo-500 font-medium mb-2">
              Drinking Habits
            </label>
            <select
              name="drinkingHabits"
              value={formData.drinkingHabits}
              onChange={handleChange}
              className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="occasionally">Occasional</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step2Edit;
