import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom"; // Import useNavigate for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import Select from "react-select";
import chroma from "chroma-js";

const Step3 = () => {
  const navigate = useNavigate(); // Hook for navigating to next step
  const { id } = useParams(); // Get the ID from the URL

  // State to hold form data
  const [formData, setFormData] = useState({
    religion: "",
    motherTongue: "",
    languagesKnown: [],
    caste: "",
    subcaste: "",
    gotram: "",
    raasi: "",
    star: "",
    step1: "",
    step2: "",
    step3: "",
  });
  const [castes, setCastes] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [raasi, setRaasi] = useState([]);
  const [star, setStar] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [gotrams, setGotrams] = useState([]);

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      navigate(-1);
    }
  };


  // Handle input changes for text fields and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedLanguagesKnown = checked
          ? [...prevData.languagesKnown, value]
          : prevData.languagesKnown.filter((language) => language !== value);
        return { ...prevData, languagesKnown: updatedLanguagesKnown };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      religion: formData.religion,
      motherTongue: formData.motherTongue,
      languagesKnown: formData.languagesKnown,
      caste: formData.caste,
      subcaste: formData.subcaste,
      gotram: formData.gotram,
      raasi: formData.raasi,
      star: formData.star,
      step1: 1,
      step2: 1,
      step3: 1,
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
        navigate(`/edit-profile/${id}`, { state: { userId } });
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error.message); // Log specific error message
      alert("An error occurred while updating details.");
    }
  };

  useEffect(() => {
    const fetchCastes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/caste"
        );
        setCastes(response.data);
      } catch (error) {
        console.error("Error fetching caste data:", error);
        alert("Error fetching caste data."); // Provide feedback to the user
      }
    };
    fetchCastes();
  }, []);

  useEffect(() => {
    const fetchSubCaste = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/sub_caste"
        );
        setSubCastes(response.data);
      } catch (error) {
        console.error("Error fetching sub-caste data:", error);
        alert("Error fetching sub-caste data.");
      }
    };
    fetchSubCaste();
  }, []);

  useEffect(() => {
    const fetchRaasi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/raasi"
        );
        setRaasi(response.data);
      } catch (error) {
        console.error("Error fetching raasi data:", error);
        alert("Error fetching raasi data.");
      }
    };
    fetchRaasi();
  }, []);

  useEffect(() => {
    const fetchStar = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/star"
        );
        setStar(response.data);
      } catch (error) {
        console.error("Error fetching star data:", error);
        alert("Error fetching star data.");
      }
    };
    fetchStar();
  }, []);




  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #c4d4e2',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#ffffff',
      zIndex: 9999,
    }),
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg ">
        <div className="flex items-center mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full p-4">
          <button onClick={handleBack} className="p-2">
            <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
          </button>
          <h2 className="text-2xl font-semibold text-white ml-4">
            Step 3: Additional Details
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-14 py-4 px-3">
          {/* Religion Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Religion</label>
            <Select
              name="religion"
              value={{ label: formData.religion, value: formData.religion }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, religion: selectedOption.value })
              }
              options={[
                { label: "Buddhist", value: "buddhist" },
                { label: "Christian", value: "christian" },
                { label: "Hindu", value: "hindu" },
                { label: "Muslim", value: "muslim" },
                { label: "Sikh", value: "sikh" },
              ]}
              styles={customStyles}
            />
          </div>

          {/* Mother Tongue Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Mother Tongue</label>
            <Select
              name="motherTongue"
              value={{ label: formData.motherTongue, value: formData.motherTongue }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, motherTongue: selectedOption.value })
              }
              options={[
                { label: "Bengali", value: "bengali" },
                { label: "English", value: "english" },
                { label: "Hindi", value: "hindi" },
                { label: "Kannada", value: "kannada" },
                { label: "Marathi", value: "marathi" },
                { label: "Tamil", value: "tamil" },
                { label: "Telugu", value: "telugu" },
              ]}
              styles={customStyles}
            />
          </div>

          {/* Languages Known (Multi-Select) */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Languages Known</label>
            <Select
              isMulti
              name="languagesKnown"
              value={formData.languagesKnown.map((lang) => ({ label: lang, value: lang }))}
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  languagesKnown: selectedOptions.map((option) => option.value),
                })
              }
              options={[
                { label: "Bengali", value: "bengali" },
                { label: "English", value: "english" },
                { label: "Hindi", value: "hindi" },
                { label: "Kannada", value: "kannada" },
                { label: "Marathi", value: "marathi" },
                { label: "Tamil", value: "tamil" },
                { label: "Telugu", value: "telugu" },
              ]}
              styles={customStyles}
            />
          </div>

          {/* Caste Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Caste</label>
            <Select
              name="caste"
              value={{ label: formData.caste, value: formData.caste }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, caste: selectedOption.value })
              }
              options={castes.map((casteItem) => ({
                label: casteItem.caste,
                value: casteItem.caste,
              }))}
              styles={customStyles}
            />
          </div>

          {/* Subcaste Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Subcaste</label>
            <Select
              name="subcaste"
              value={{ label: formData.subcaste, value: formData.subcaste }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, subcaste: selectedOption.value })
              }
              options={subCastes.map((subCaste) => ({
                label: subCaste.sub_caste,
                value: subCaste.sub_caste,
              }))}
              styles={customStyles}
            />
          </div>

          {/* Gotram Dropdown */}
          <div>

            <div>
              <label className="block text-indigo-500 font-medium mb-2">Gotram</label>
              <input
                type="text"
                name="gotram"
                value={formData.gotram}
                onChange={(e) =>
                  setFormData({ ...formData, gotram: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Gotram"
              />
            </div>

          </div>

          {/* Raasi Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Raasi</label>
            <Select
              name="raasi"
              value={{ label: formData.raasi, value: formData.raasi }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, raasi: selectedOption.value })
              }
              options={raasi.map((raasiItem) => ({
                label: raasiItem.raasi,
                value: raasiItem.raasi,
              }))}
              styles={customStyles}
            />
          </div>

          {/* Star Dropdown */}
          <div>
            <label className="block text-indigo-500 font-medium mb-2">Star</label>
            <Select
              name="star"
              value={{ label: formData.star, value: formData.star }}
              onChange={(selectedOption) =>
                setFormData({ ...formData, star: selectedOption.value })
              }
              options={star.map((starItem) => ({
                label: starItem.star,
                value: starItem.star,
              }))}
              styles={customStyles}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step3;
