import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditPropertyDetails = () => {
  const navigate = useNavigate();

  const [modal1, setModal1] = useState(null); // for house/plots numeric dropdowns
  const [modal2, setModal2] = useState(null); // for location pickers
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const [city, setCity] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Defaults as per screenshots
  const [sel1, setSel1] = useState({
    House_Type: null,
    No_Of_Houses: null,
    Own_House_sq_Yard: null,
    Own_House_Total_Value: null,
    Commercial_Shops: null,
    Shops_Sq_Yards: null,
    Monthly_Rent: null,
    Open_Plots: null,
    Open_Plots_Sq_Yards: null,
    Open_Plots_total_value: null,
  });

  const [sel2, setSel2] = useState({
    House_Location: null,
    Plot_Location: null,
  });

  const options1 = useMemo(() => {
    const money = Array.from({ length: 200 }, (_, i) => 50000 + i * 50000);
    const yards = Array.from({ length: 1000 - 70 + 1 }, (_, i) => 70 + i);
    const count10 = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
    const mk = (arr, suffix) => arr.map((v, i) => ({ value: String(v), label: suffix ? `${v} ${suffix}` : String(v), _k: `${v}__${i}` }));
    return {
      House_Type: [
        { value: "groundFloor", label: "Ground Floor" },
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
      No_Of_Houses: mk(count10),
      Own_House_sq_Yard: mk(yards, "Yards"),
      Own_House_Total_Value: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `${v}__${i}` })),
      Commercial_Shops: mk(count10),
      Shops_Sq_Yards: mk(yards, "Yards"),
      Monthly_Rent: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `${v}__${i}` })),
      Open_Plots: mk(count10),
      Open_Plots_Sq_Yards: mk(yards, "Yards"),
      Open_Plots_total_value: money.map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `${v}__${i}` })),
    };
  }, []);

  const options2 = useMemo(() => {
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
      House_Location: uniq(city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
      Plot_Location: uniq(city.map((c, i) => ({ value: c.city, label: c.city, _k: `${c.city}__${i}` })), (o) => o.value),
    };
  }, [city]);

  const open1 = (key) => setModal1({ key, options: options1[key] || [] });
  const close1 = () => setModal1(null);
  const open2 = (key) => setModal2({ key, options: options2[key] || [] });
  const close2 = () => setModal2(null);

  // Load cities
  useEffect(() => {
    axios.get("https://localhost:3300/api/city").then((r) => setCity(r.data || []));
  }, []);

  // user id only
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    apiClient2.get(apiEndpoints2.userData, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      if (res.data?.success && res.data.user) setUserId(res.data.user._id);
    });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const payload = {
      houseType: sel1.House_Type?.value || "",
      houseSqFeet: sel1.Own_House_sq_Yard?.value || "",
      houseValue: sel1.Own_House_Total_Value?.value || "",
      monthlyRent: sel1.Monthly_Rent?.value || "",
      openPlots: sel1.Open_Plots?.value || "",
      openPlotsSqFeet: sel1.Open_Plots_Sq_Yards?.value || "",
      openPlotsValue: sel1.Open_Plots_total_value?.value || "",
      numberOfHouses: sel1.No_Of_Houses?.value || "",
      commercialshops: sel1.Commercial_Shops?.value || "",
      shopssqyards: sel1.Shops_Sq_Yards?.value || "",
      houseLocation: sel2.House_Location?.value || "",
      openPlotsLocation: sel2.Plot_Location?.value || "",
      step6: 1,
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiClient2.put(`${apiEndpoints2.user}/${userId}`, payload, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.status === 200) {
        alert("Property details updated successfully!");
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
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Property Details</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={submit} className="space-y-6 py-6 px-4">
            {(["House_Type", "No_Of_Houses", "Own_House_sq_Yard", "Own_House_Total_Value", "Commercial_Shops", "Shops_Sq_Yards", "Monthly_Rent", "Open_Plots", "Open_Plots_Sq_Yards", "Open_Plots_total_value"]).map((key) => (
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

            {(["House_Location", "Plot_Location"]).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open2(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{sel2[key]?.label || `Select ${key.replace(/_/g, " ")}`}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading || !userId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Updating..." : "Update Property Details"}
            </button>
          </form>

          {/* Modals */}
          {modal1 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal1.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal1.key.replace(/_/g, " ")}`} value={search1} onChange={(e) => setSearch1(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal1.options || [])
                    .filter((o) => o.label.toLowerCase().includes(search1.toLowerCase()))
                    .map((option, idx) => (
                      <div key={option._k || `${option.value}__${idx}`}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => { setSel1((p) => ({ ...p, [modal1.key]: option })); close1(); }}>
                          {option.label}
                        </button>
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
                  {(modal2.options || [])
                    .filter((o) => o.label.toLowerCase().includes(search2.toLowerCase()))
                    .map((option, idx) => (
                      <div key={option._k || `${option.value}__${idx}`}>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition" onClick={() => { setSel2((p) => ({ ...p, [modal2.key]: option })); close2(); }}>
                          {option.label}
                        </button>
                        <hr className="border-gray-200 mt-3 mb-3" />
                      </div>
                    ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close2}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPropertyDetails;