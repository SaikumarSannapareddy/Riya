import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "privateEmployee", label: "Private Employee" },
  { value: "govtEmployee", label: "Government Employee" },
  { value: "business", label: "Business" },
];

const OTHER_BUSINESS_OPTIONS = [
  { value: "null", label: "None" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

const EditEducationDetails = () => {
  const navigate = useNavigate();

  const [modalSingle, setModalSingle] = useState(null); // for single-select fields
  const [modalMulti, setModalMulti] = useState(null); // for multi-select fields
  const [searchSingle, setSearchSingle] = useState("");
  const [searchMulti, setSearchMulti] = useState("");

  const [education, setEducation] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [city, setCity] = useState([]);
  const [extraSkills, setExtraSkills] = useState([]);

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Single-select values
  const [selectedSingles, setSelectedSingles] = useState({
    Education: { value: "Bcom", label: "Bcom" },
    Employment_Status: EMPLOYMENT_STATUS_OPTIONS[0],
    occupation: null,
    Anuual_Income: null,
    Job_Location: null,
    Any_Other_Bussiness: OTHER_BUSINESS_OPTIONS[0],
    Other_Business_Income: null,
  });

  // Multi-select values
  const [selectedMultis, setSelectedMultis] = useState({
    Business_Location: [],
    extraSkills: ["Others"],
  });

  const singleOptions = useMemo(() => {
    const uniq = (arr, getKey) => {
      const seen = new Set();
      return arr.filter((item) => {
        const k = getKey(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };

    return {
      Education: uniq(
        education.map((e, i) => ({ value: e.education, label: e.education, _k: `${e.education}__${i}` })),
        (o) => o.value
      ),
      Employment_Status: EMPLOYMENT_STATUS_OPTIONS,
      occupation: uniq(
        occupation.map((o, i) => ({ value: o.occupation, label: o.occupation, _k: `${o.occupation}__${i}` })),
        (o) => o.value
      ),
      Anuual_Income: uniq(
        annualIncome.map((x, i) => ({ value: x.annual_income, label: x.annual_income, _k: `${x.annual_income}__${i}` })),
        (o) => o.value
      ),
      Job_Location: uniq(
        city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })),
        (o) => o.value
      ),
      Any_Other_Bussiness: OTHER_BUSINESS_OPTIONS,
      Other_Business_Income: uniq(
        annualIncome.map((x, i) => ({ value: x.annual_income, label: x.annual_income, _k: `${x.annual_income}__${i}` })),
        (o) => o.value
      ),
    };
  }, [education, occupation, annualIncome, city]);

  const multiOptions = useMemo(() => {
    const uniq = (arr, getKey) => {
      const seen = new Set();
      return arr.filter((item) => {
        const k = getKey(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };
    return {
      Business_Location: uniq(
        city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })),
        (o) => o.value
      ),
      extraSkills: uniq(
        extraSkills.map((s, i) => ({ value: s.skill, label: s.skill, _k: `${s.skill}__${i}` })),
        (o) => o.value
      ),
    };
  }, [city, extraSkills]);

  const openSingle = (key) => setModalSingle({ key, options: singleOptions[key] || [] });
  const closeSingle = () => setModalSingle(null);
  const openMulti = (key) => setModalMulti({ key, options: multiOptions[key] || [] });
  const closeMulti = () => setModalMulti(null);

  const handleSingleSelect = (option) => {
    setSelectedSingles((prev) => ({ ...prev, [modalSingle.key]: option }));
    closeSingle();
  };

  const handleMultiToggle = (optionValue, checked) => {
    setSelectedMultis((prev) => {
      const set = new Set(prev[modalMulti.key] || []);
      if (checked) set.add(optionValue);
      else set.delete(optionValue);
      return { ...prev, [modalMulti.key]: Array.from(set) };
    });
  };

  // Fetch option lists
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const base = "https://localhost:3300/api";
        const [ed, occ, inc, c, sk] = await Promise.all([
          axios.get(`${base}/education`),
          axios.get(`${base}/occupation`),
          axios.get(`${base}/annual_income`),
          axios.get(`${base}/city`),
          axios.get(`${base}/extra_skills`),
        ]);
        setEducation(ed.data || []);
        setOccupation(occ.data || []);
        setAnnualIncome(inc.data || []);
        setCity(c.data || []);
        setExtraSkills(sk.data || []);
      } catch (err) {
        console.error("Error fetching education dropdown data", err);
      }
    };
    fetchAll();
  }, []);

  // Keep initial display exactly as requested; only set userId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiClient2
      .get(apiEndpoints2.userData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data?.success && res.data.user) setUserId(res.data.user._id);
      })
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const payload = {
      education: selectedSingles.Education?.value || "",
      employmentStatus: selectedSingles.Employment_Status?.value || "",
      occupation: selectedSingles.occupation?.value || "",
      annualIncome: selectedSingles.Anuual_Income?.value || "",
      jobLocation: selectedSingles.Job_Location?.value || "",
      otherBusiness: selectedSingles.Any_Other_Bussiness?.value || "null",
      otherBusinessIncome: selectedSingles.Other_Business_Income?.value || "",
      businessLocation: selectedMultis.Business_Location || [],
      extraTalentedSkills: selectedMultis.extraSkills || [],
      step4: 1,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiClient2.put(`${apiEndpoints2.user}/${userId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.status === 200) {
        alert("Education details updated successfully!");
        const userData = localStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : {};
        localStorage.setItem("userData", JSON.stringify({ ...user, ...payload }));
        navigate(-1);
      } else {
        alert("Failed to update details.");
      }
    } catch (err) {
      console.error("Error updating education details", err);
      alert("An error occurred while updating details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={() => navigate(-1)}>
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
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Education Details</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
            {(["Education", "Employment_Status", "occupation", "Anuual_Income", "Job_Location", "Any_Other_Bussiness", "Other_Business_Income"]) .map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div
                  className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                  onClick={() => openSingle(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">
                      {selectedSingles[key]?.label || `Select ${key.replace(/_/g, " ")}`}
                    </span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Business Location (multi) */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Business_Location</label>
              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                onClick={() => openMulti("Business_Location")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">
                    {selectedMultis.Business_Location.length
                      ? selectedMultis.Business_Location.join(", ")
                      : "Select Business_Location"}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>

            {/* Extra Skills (multi) */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">ExtraSkills</label>
              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                onClick={() => openMulti("extraSkills")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">
                    {selectedMultis.extraSkills.length
                      ? selectedMultis.extraSkills.join(", ")
                      : "Others"}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !userId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Education Details"}
            </button>
          </form>

          {/* Single-select modal */}
          {modalSingle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modalSingle.key.replace(/_/g, " ")}</h2>

                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder={`Search ${modalSingle.key.replace(/_/g, " ")}`}
                  value={searchSingle}
                  onChange={(e) => setSearchSingle(e.target.value)}
                />

                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modalSingle.options || [])
                    .filter((o) => o.label.toLowerCase().includes(searchSingle.toLowerCase()))
                    .map((option, idx) => (
                      <div key={option._k || `${option.value}__${idx}`}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => handleSingleSelect(option)}>
                          {option.label}
                        </button>
                        <hr className="border-gray-200 mt-3 mb-3" />
                      </div>
                    ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={closeSingle}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Multi-select modal */}
          {modalMulti && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modalMulti.key.replace(/_/g, " ")}</h2>

                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder={`Search ${modalMulti.key.replace(/_/g, " ")}`}
                  value={searchMulti}
                  onChange={(e) => setSearchMulti(e.target.value)}
                />

                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modalMulti.options || [])
                    .filter((o) => o.label.toLowerCase().includes(searchMulti.toLowerCase()))
                    .map((option, idx) => (
                      <label key={option._k || `${option.value}__${idx}`} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-red-600"
                          checked={(selectedMultis[modalMulti.key] || []).includes(option.value)}
                          onChange={(e) => handleMultiToggle(option.value, e.target.checked)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={closeMulti}>
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

export default EditEducationDetails; 