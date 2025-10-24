import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const LANG_OPTIONS = [
  { value: "bengali", label: "Bengali" },
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "kannada", label: "Kannada" },
  { value: "marathi", label: "Marathi" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
];

const RELIGION_OPTIONS = [
  { value: "buddhist", label: "Buddhist" },
  { value: "christian", label: "Christian" },
  { value: "hindu", label: "Hindu" },
  { value: "muslim", label: "Muslim" },
  { value: "sikh", label: "Sikh" },
];

const MOTHER_TONGUE_OPTIONS = [
  { value: "bengali", label: "Bengali" },
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "kannada", label: "Kannada" },
  { value: "marathi", label: "Marathi" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
];

const EditReligionCaste = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [modalData, setModalData] = useState(null); // Languages
  const [modalData2, setModalData2] = useState(null); // Other dropdowns

  const [castes, setCastes] = useState([]);
  const [subCastes, setSubCastes] = useState([]);
  const [raasi, setRaasi] = useState([]);
  const [star, setStar] = useState([]);

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    Languages_Known: [],
  });

  const [selectedOptions2, setSelectedOptions2] = useState({
    religion: { value: "hindu", label: "Hindu" },
    Mother_Tongue: { value: "telugu", label: "Telugu" },
    caste: null,
    subcaste: null,
    raasi: null,
    star: null,
  });

  const [formData, setFormData] = useState({
    gotram: "",
  });

  // Build options for the second modal based on fetched data
  const dropdownOptions2 = useMemo(
    () => ({
      religion: RELIGION_OPTIONS,
      Mother_Tongue: MOTHER_TONGUE_OPTIONS,
      caste: castes.map((c) => ({ value: c.caste, label: c.caste })),
      subcaste: subCastes.map((sc) => ({ value: sc.sub_caste, label: sc.sub_caste })),
      raasi: raasi.map((r) => ({ value: r.raasi, label: `${r.raasi} (${r.raasi_telugu})` })),
      star: star.map((s) => ({ value: s.star, label: s.star })),
    }),
    [castes, subCastes, raasi, star]
  );

  const openModal = (key) => setModalData({ key, options: LANG_OPTIONS });
  const closeModal = () => setModalData(null);
  const openModal2 = (key) => setModalData2({ key, options: dropdownOptions2[key] || [] });
  const closeModal2 = () => setModalData2(null);

  const handleCheckboxChange = (event, option) => {
    const { checked } = event.target;
    setSelectedOptions((prev) => {
      const list = new Set(prev.Languages_Known);
      if (checked) list.add(option.value);
      else list.delete(option.value);
      return { ...prev, Languages_Known: Array.from(list) };
    });
  };

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectedOptions((prev) => ({
      ...prev,
      Languages_Known: checked ? LANG_OPTIONS.map((o) => o.value) : [],
    }));
  };

  const handleSelect = (selectedOption) => {
    setSelectedOptions2((prev) => ({ ...prev, [modalData2.key]: selectedOption }));
    closeModal2();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch dropdown data from MySQL-backed public API
  useEffect(() => {
    const fetchData = async (url, setState) => {
      try {
        const res = await axios.get(url);
        setState(res.data);
      } catch (err) {
        console.error("Error fetching", url, err);
      }
    };
    fetchData("https://localhost:3300/api/star", setStar);
    fetchData("https://localhost:3300/api/raasi", setRaasi);
    fetchData("https://localhost:3300/api/sub_caste", setSubCastes);
    fetchData("https://localhost:3300/api/caste", setCastes);
  }, []);

  // Prefill from current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await apiClient2.get(apiEndpoints2.userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success && res.data.user) {
          const u = res.data.user;
          setUserId(u._id);
          // languages
          setSelectedOptions({
            Languages_Known: Array.isArray(u.languagesKnown) ? u.languagesKnown : [],
          });
          // religion + mother tongue
          const rel = RELIGION_OPTIONS.find((r) => r.value === (u.religion || "").toLowerCase());
          const mt = MOTHER_TONGUE_OPTIONS.find((m) => m.value === (u.motherTongue || "").toLowerCase());
          // dynamic dropdowns will be resolved after lists arrive as well
          setSelectedOptions2((prev) => ({
            ...prev,
            religion: rel || prev.religion,
            Mother_Tongue: mt || prev.Mother_Tongue,
          }));
          setFormData({ gotram: u.gotram || "" });
        }
      } catch (err) {
        console.error("Error loading user", err);
      }
    };
    loadUser();
  }, [navigate]);

  // When lists change, try to preselect caste/subcaste/raasi/star based on userData in localStorage (if any cached)
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (!userData) return;
      const newVals = {};
      if (userData.caste) {
        const v = dropdownOptions2.caste?.find((o) => o.value === userData.caste);
        if (v) newVals.caste = v;
      }
      if (userData.subcaste) {
        const v = dropdownOptions2.subcaste?.find((o) => o.value === userData.subcaste);
        if (v) newVals.subcaste = v;
      }
      if (userData.raasi) {
        const v = dropdownOptions2.raasi?.find((o) => o.value === userData.raasi);
        if (v) newVals.raasi = v;
      }
      if (userData.star) {
        const v = dropdownOptions2.star?.find((o) => o.value === userData.star);
        if (v) newVals.star = v;
      }
      if (Object.keys(newVals).length) {
        setSelectedOptions2((prev) => ({ ...prev, ...newVals }));
      }
    } catch (_) {}
  }, [dropdownOptions2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    if (!selectedOptions2.caste?.value) {
      alert("Please select a caste");
      return;
    }
    if (!selectedOptions2.subcaste?.value) {
      alert("Please select a subcaste");
      return;
    }

    const payload = {
      religion: selectedOptions2.religion?.value || "",
      motherTongue: selectedOptions2.Mother_Tongue?.value || "",
      languagesKnown: selectedOptions.Languages_Known || [],
      caste: selectedOptions2.caste?.value || "",
      subcaste: selectedOptions2.subcaste?.value || "",
      raasi: selectedOptions2.raasi?.value || "",
      star: selectedOptions2.star?.value || "",
      gotram: formData.gotram || "",
      step3: 1,
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
        alert("Religion & caste details updated successfully!");
        // Merge into cached userData for quick prefill elsewhere
        const userData = localStorage.getItem("userData");
        const user = userData ? JSON.parse(userData) : {};
        const updated = { ...user, ...payload };
        localStorage.setItem("userData", JSON.stringify(updated));
        navigate(-1);
      } else {
        alert("Failed to update details.");
      }
    } catch (err) {
      console.error("Error updating religion & caste", err);
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
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Religion & Caste</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
            {/* Languages Known */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Languages Known</label>
              <div
                className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                onClick={() => openModal("Languages_Known")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">
                    {selectedOptions.Languages_Known.length
                      ? LANG_OPTIONS.filter((opt) => selectedOptions.Languages_Known.includes(opt.value))
                          .map((x) => x.label)
                          .join(", ")
                      : "Select Languages_Known"}
                  </span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>

            {/* Other dropdowns */}
            {(["religion", "Mother_Tongue", "caste", "subcaste", "raasi", "star"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">
                  {key.replace(/_/g, " ")} {(key === "caste" || key === "subcaste") && <span className="text-red-600">*</span>}
                </label>
                <div
                  className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg"
                  onClick={() => openModal2(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">
                      {selectedOptions2[key]?.label || `Select ${key.replace(/_/g, " ")}`}
                    </span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Gothram */}
            {selectedOptions2.subcaste && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Gothram Name</label>
                <input
                  type="text"
                  name="gotram"
                  value={formData.gotram}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    handleChange({ target: { name: "gotram", value } });
                  }}
                  placeholder="Enter your Gothram name"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !userId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Caste & Religion Details"}
            </button>
          </form>

          {/* Languages Modal */}
          {modalData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modalData.key.replace(/_/g, " ")}</h2>

                {/* Select all */}
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    id="selectAllCheckbox"
                    type="checkbox"
                    checked={selectedOptions.Languages_Known.length === LANG_OPTIONS.length}
                    onChange={handleSelectAllChange}
                    className="form-checkbox h-4 w-4 text-red-600"
                  />
                  <label className="block text-gray-700">Select All</label>
                </div>

                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder={`Search ${modalData.key.replace(/_/g, " ")}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {LANG_OPTIONS.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase())).map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.Languages_Known.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, option)}
                        className="form-checkbox h-4 w-4 text-red-600"
                      />
                      <label className="block text-gray-700">{option.label}</label>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Other Dropdown Modal */}
          {modalData2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modalData2.key.replace(/_/g, " ")}</h2>

                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder={`Search ${modalData2.key.replace(/_/g, " ")}`}
                  value={searchTerm2}
                  onChange={(e) => setSearchTerm2(e.target.value)}
                />

                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modalData2.options || [])
                    .filter((option) => option.label.toLowerCase().includes(searchTerm2.toLowerCase()))
                    .map((option) => (
                      <div key={option.value}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => handleSelect(option)}>
                          {option.label}
                        </button>
                        <hr className="border-gray-200 mt-3 mb-3" />
                      </div>
                    ))}
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={closeModal2}>
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

export default EditReligionCaste; 