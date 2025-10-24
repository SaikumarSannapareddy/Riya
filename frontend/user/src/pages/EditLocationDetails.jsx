import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditLocationDetails = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selected, setSelected] = useState({
    country: { value: "India", label: "India" },
    state: { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    city: { value: "Guntur", label: "Guntur" },
  });

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const options = useMemo(
    () => ({
      country: countries.map((c, i) => ({ value: c.country, label: c.country, _k: `${c.country}__${i}` })),
      state: states.map((s, i) => ({ value: s.state, label: s.state, _k: `${s.state}__${i}` })),
      city: cities.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })),
    }),
    [countries, states, cities]
  );

  const openModal = (key) => setModal({ key, options: options[key] || [] });
  const closeModal = () => setModal(null);

  useEffect(() => {
    const base = "https://localhost:3300/api";
    Promise.all([axios.get(`${base}/country`), axios.get(`${base}/state`), axios.get(`${base}/city`)]).then(
      ([c, s, ci]) => {
        setCountries(c.data || []);
        setStates(s.data || []);
        setCities(ci.data || []);
      }
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiClient2
      .get(apiEndpoints2.userData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data?.success && res.data.user) setUserId(res.data.user._id);
      });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const payload = {
      country: selected.country?.value || "",
      state: selected.state?.value || "",
      district: selected.city?.value || "",
      step8: 1,
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiClient2.put(`${apiEndpoints2.user}/${userId}`, payload, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.status === 200) {
        alert("Location details updated successfully!");
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
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Location Details</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
          <form onSubmit={submit} className="space-y-6 py-6 px-4">
            {(["country", "state", "city"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => openModal(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{selected[key]?.label || `Select ${key}`}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading || !userId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60">{loading ? "Updating..." : "Update Location Details"}</button>
          </form>

          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal.key}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal.key}`} value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal.options || [])
                    .filter((o) => (o.label || "").toLowerCase().includes(search.toLowerCase()))
                    .map((option, idx) => (
                      <div key={option._k || `${option.value}__${idx}`}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => { setSelected((p) => ({ ...p, [modal.key]: option })); closeModal(); }}>{option.label}</button>
                        <hr className="border-gray-200 mt-3 mb-3" />
                      </div>
                    ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={() => closeModal()}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditLocationDetails; 