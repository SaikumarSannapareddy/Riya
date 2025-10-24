import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EMPLOYEE_STATUS = [
  { value: "private_employee", label: "Private Employee" },
  { value: "govt_employee", label: "Government Employee" },
  { value: "business", label: "Business" },
  { value: "not_employee", label: "Not Employee" },
  { value: "expired", label: "Expired" },
];

const rangeOptions = (max) => Array.from({ length: max + 1 }, (_, i) => ({ value: String(i), label: String(i) }));

const EditFamilyDetails = () => {
  const navigate = useNavigate();

  // Modals
  const [modal, setModal] = useState(null); // { key, options }
  const [search, setSearch] = useState("");

  // Lists
  const [cities, setCities] = useState([]);
  const [occupations, setOccupations] = useState([]);

  // Defaults to match screenshots
  const [selected, setSelected] = useState({
    Father_Employee: { value: "expired", label: "Expired" },
    Father_Occupation: null,
    Mother_Employee: { value: "not_employee", label: "Not Employee" },
    Mother_Occupation: null,
    Proper_Location: { value: "Guntur", label: "Guntur" },
    Setteled_Location: null,
  });

  const [form, setForm] = useState({
    totalBrothers: "1",
    youngerBrothers: "",
    elderBrothers: "",
    marriedBrothers: "",
    totalSisters: "1",
    youngerSisters: "",
    elderSisters: "",
    marriedSisters: "1",
    familyValue: "add_another",
    familyType: "nuclear",
    familyStatus: "",
  });

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdowns = useMemo(() => {
    const uniq = (arr, getKey) => {
      const seen = new Set();
      return arr.filter((it) => {
        const k = getKey(it);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };
    return {
      Father_Employee: EMPLOYEE_STATUS,
      Mother_Employee: EMPLOYEE_STATUS,
      Father_Occupation: uniq(occupations.map((o, i) => ({ value: o.occupation, label: o.occupation, _k: `${o.occupation}__${i}` })), (o) => o.value),
      Mother_Occupation: uniq(occupations.map((o, i) => ({ value: o.occupation, label: o.occupation, _k: `${o.occupation}__${i}` })), (o) => o.value),
      Proper_Location: uniq(cities.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
      Setteled_Location: uniq(cities.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
    };
  }, [cities, occupations]);

  const openModal = (key) => setModal({ key, options: dropdowns[key] || [] });
  const closeModal = () => setModal(null);

  const handleSelect = (option) => {
    setSelected((prev) => ({ ...prev, [modal.key]: option }));
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Load lists
  useEffect(() => {
    const base = "https://localhost:3300/api";
    Promise.all([axios.get(`${base}/city`), axios.get(`${base}/occupation`)]).then(([c, o]) => {
      setCities(c.data || []);
      setOccupations(o.data || []);
    });
  }, []);

  // Get user id only
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
      fatherEmployee: selected.Father_Employee?.value || "",
      fatherOccupied: selected.Father_Occupation?.value || "",
      motherEmployee: selected.Mother_Employee?.value || "",
      motherOccupied: selected.Mother_Occupation?.value || "",
      originalLocation: selected.Proper_Location?.value || "",
      selectedLocation: selected.Setteled_Location?.value || "",
      totalBrothers: form.totalBrothers,
      marriedBrothers: form.marriedBrothers,
      totalSisters: form.totalSisters,
      marriedSisters: form.marriedSisters,
      familyValue: form.familyValue,
      familyType: form.familyType,
      familyStatus: form.familyStatus,
      youngerBrothers: form.youngerBrothers,
      elderBrothers: form.elderBrothers,
      youngerSisters: form.youngerSisters,
      elderSisters: form.elderSisters,
      step5: 1,
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
        alert("Family details updated successfully!");
        navigate(-1);
      } else {
        alert("Failed to update details.");
      }
    } catch (err) {
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Family Details</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
            {(["Father_Employee", "Father_Occupation", "Mother_Employee", "Mother_Occupation"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => openModal(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{selected[key]?.label || `Select ${key.replace(/_/g, " ")}`}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Brothers */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Total Brothers</label>
              <select name="totalBrothers" value={form.totalBrothers} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                {rangeOptions(10).map((o) => (
                  <option key={`tb_${o.value}`} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Number of Younger Brothers</label>
                <select name="youngerBrothers" value={form.youngerBrothers} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select</option>
                  {rangeOptions(10).map((o) => (
                    <option key={`ybr_${o.value}`} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Number of Elder Brothers</label>
                <select name="elderBrothers" value={form.elderBrothers} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select</option>
                  {rangeOptions(10).map((o) => (
                    <option key={`ebr_${o.value}`} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Married Brothers</label>
              <select name="marriedBrothers" value={form.marriedBrothers} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                <option value="">Select</option>
                {rangeOptions(10).map((o) => (
                  <option key={`mbr_${o.value}`} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Sisters */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Total Sisters</label>
              <select name="totalSisters" value={form.totalSisters} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                {rangeOptions(10).map((o) => (
                  <option key={`ts_${o.value}`} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Number of Younger Sisters</label>
                <select name="youngerSisters" value={form.youngerSisters} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select</option>
                  {rangeOptions(10).map((o) => (
                    <option key={`ysr_${o.value}`} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Number of Elder Sisters</label>
                <select name="elderSisters" value={form.elderSisters} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                  <option value="">Select</option>
                  {rangeOptions(10).map((o) => (
                    <option key={`esr_${o.value}`} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Married Sisters</label>
              <select name="marriedSisters" value={form.marriedSisters} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white">
                {rangeOptions(10).map((o) => (
                  <option key={`msr_${o.value}`} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Family value/type/status */}
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Family Value</label>
              <div className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg bg-white text-gray-500">{form.familyValue}</div>
            </div>
            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Family Type</label>
              <div className="flex flex-col w-full border px-3 border-gray-300 py-3 rounded-lg bg-white text-gray-500">{form.familyType}</div>
            </div>

            {/* Locations */}
            {(["Proper_Location", "Setteled_Location"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => openModal(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{selected[key]?.label || `Select ${key.replace(/_/g, " ")}`}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading || !userId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal.key.replace(/_/g, " ")}`} value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal.options || [])
                    .filter((o) => (o.label || "").toLowerCase().includes(search.toLowerCase()))
                    .map((option, idx) => (
                      <div key={option._k || `${option.value}__${idx}`}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => handleSelect(option)}>
                          {option.label}
                        </button>
                        <hr className="border-gray-200 mt-3 mb-3" />
                      </div>
                    ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFamilyDetails; 