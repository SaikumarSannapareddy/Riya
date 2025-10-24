import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditAgricultureFlat = () => {
  const navigate = useNavigate();

  const [modal1, setModal1] = useState(null);
  const [modal2, setModal2] = useState(null);
  const [modal3, setModal3] = useState(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");

  const [city, setCity] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [sel1, setSel1] = useState({
    Number_Of_Plots: null,
    Flat_Type: null,
    Flat_Value: null,
    Agriculture_Land: null,
    Agriculture_Land_Value: null,
    Total_Properties_Value: null,
    Anymore_Properties: { value: "no", label: "No" },
  });
  const [sel2, setSel2] = useState({ Flat_Location: [] });
  const [sel3, setSel3] = useState({ Agriculture_Land_Location: [] });

  const money = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => (i + 1) * 1000000)
        .concat(Array.from({ length: 10 }, (_, i) => (i + 1) * 10000000))
        .concat(Array.from({ length: 10 }, (_, i) => (i + 1) * 100000000)),
    []
  );

  const options1 = useMemo(() => {
    return {
      Number_Of_Plots: Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1), _k: `n_${i}` })),
      Flat_Type: Array.from({ length: 10 }, (_, i) => ({ value: `${i + 1}bhk`, label: `${i + 1} BHK`, _k: `t_${i}` })),
      Flat_Value: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `fv_${i}` })),
      Agriculture_Land: Array.from({ length: 100 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} Acres`, _k: `a_${i}` })),
      Agriculture_Land_Value: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `av_${i}` })),
      Total_Properties_Value: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `tp_${i}` })),
      Anymore_Properties: [
        { value: "yes", label: "Yes", _k: "ap_yes" },
        { value: "no", label: "No", _k: "ap_no" },
      ],
    };
  }, [money]);

  const optionsLoc = useMemo(() => {
    const uniq = (arr, getKey) => {
      const s = new Set();
      return arr.filter((it) => {
        const k = getKey(it);
        if (s.has(k)) return false;
        s.add(k);
        return true;
      });
    };
    return {
      Flat_Location: uniq(city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
      Agriculture_Land_Location: uniq(city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
    };
  }, [city]);

  const open1 = (key) => setModal1({ key, options: options1[key] || [] });
  const close1 = () => setModal1(null);
  const open2 = (key) => setModal2({ key, options: optionsLoc[key] || [] });
  const close2 = () => setModal2(null);
  const open3 = (key) => setModal3({ key, options: optionsLoc[key] || [] });
  const close3 = () => setModal3(null);

  useEffect(() => {
    axios.get("https://localhost:3300/api/city").then((r) => setCity(r.data || []));
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
      openPlots: sel1.Number_Of_Plots?.value || "",
      flatType: sel1.Flat_Type?.value || "",
      flatValue: sel1.Flat_Value ? parseFloat(sel1.Flat_Value.value) : 0,
      agricultureLand: sel1.Agriculture_Land ? parseInt(sel1.Agriculture_Land.value) : 0,
      agricultureLandValue: sel1.Agriculture_Land_Value ? parseFloat(sel1.Agriculture_Land_Value.value) : 0,
      anyMoreProperties: sel1.Anymore_Properties?.value || "no",
      totalPropertiesValue: sel1.Total_Properties_Value ? parseFloat(sel1.Total_Properties_Value.value) : 0,
      flatLocation: sel2.Flat_Location || [],
      agricultureLandLocation: sel3.Agriculture_Land_Location || [],
      step7: 1,
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiClient2.put(`${apiEndpoints2.user}/${userId}`, payload, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.status === 200) {
        alert("Agriculture & Flat details updated successfully!");
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
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Agriculture & Flat Details</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={submit} className="space-y-6 py-6 px-4">
            {(["Number_Of_Plots", "Flat_Type", "Flat_Value", "Agriculture_Land", "Agriculture_Land_Value", "Total_Properties_Value", "Anymore_Properties"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open1(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{sel1[key]?.label || `Select ${key.replace(/_/g, " ")}`}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Flat_Location</label>
              <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open2("Flat_Location")}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">{sel2.Flat_Location.length ? sel2.Flat_Location.join(", ") : "Select Flat_Location"}</span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>

            <div className="mb-[-8px]">
              <label className="block text-gray-700 font-medium mb-2">Agriculture_Land_Location</label>
              <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open3("Agriculture_Land_Location")}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-md font-medium">{sel3.Agriculture_Land_Location.length ? sel3.Agriculture_Land_Location.join(", ") : "Select Agriculture_Land_Location"}</span>
                  <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !userId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">{loading ? "Updating..." : "Update"}</button>
          </form>

          {modal1 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal1.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal1.key.replace(/_/g, " ")}`} value={search1} onChange={(e) => setSearch1(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal1.options || []).filter((o) => o.label.toLowerCase().includes(search1.toLowerCase())).map((option, idx) => (
                    <div key={option._k || `${option.value}__${idx}`}>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => { setSel1((p) => ({ ...p, [modal1.key]: option })); close1(); }}>{option.label}</button>
                      <hr className="border-gray-200 mt-3 mb-3" />
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close1}>Close</button>
              </div>
            </div>
          )}

          {modal2 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal2.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal2.key.replace(/_/g, " ")}`} value={search2} onChange={(e) => setSearch2(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal2.options || []).filter((o) => o.label.toLowerCase().includes(search2.toLowerCase())).map((option, idx) => (
                    <label key={option._k || `${option.value}__${idx}`} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={sel2.Flat_Location.includes(option.value)} onChange={(e) => {
                        const checked = e.target.checked; setSel2((p) => ({ ...p, Flat_Location: checked ? [...p.Flat_Location, option.value] : p.Flat_Location.filter((v) => v !== option.value) }));
                      }} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close2}>Close</button>
              </div>
            </div>
          )}

          {modal3 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal3.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal3.key.replace(/_/g, " ")}`} value={search3} onChange={(e) => setSearch3(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal3.options || []).filter((o) => o.label.toLowerCase().includes(search3.toLowerCase())).map((option, idx) => (
                    <label key={option._k || `${option.value}__${idx}`} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={sel3.Agriculture_Land_Location.includes(option.value)} onChange={(e) => {
                        const checked = e.target.checked; setSel3((p) => ({ ...p, Agriculture_Land_Location: checked ? [...p.Agriculture_Land_Location, option.value] : p.Agriculture_Land_Location.filter((v) => v !== option.value) }));
                      }} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close3}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAgricultureFlat; 