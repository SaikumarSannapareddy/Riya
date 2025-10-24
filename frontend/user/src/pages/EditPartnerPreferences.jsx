import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import axios from "axios";
import apiClient2, { apiEndpoints2 } from "../components/Apismongo";

const EditPartnerPreferences = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(null);
  const [modal2, setModal2] = useState(null);
  const [modal3, setModal3] = useState(null);
  const [modal4, setModal4] = useState(null);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [search4, setSearch4] = useState("");

  const [city, setCity] = useState([]);
  const [education, setEducation] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [caste, setCaste] = useState([]);
  const [subcaste, setSubcaste] = useState([]);

  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [pref1, setPref1] = useState({});
  const [pref2, setPref2] = useState({});
  const [pref3, setPref3] = useState({});
  const [pref4, setPref4] = useState({});

  const opts1 = useMemo(
    () => ({
      Religion_Preferences: [
        { value: "hindu", label: "Hindu" },
        { value: "muslim", label: "Muslim" },
        { value: "christian", label: "Christian" },
        { value: "sikh", label: "Sikh" },
        { value: "buddhist", label: "Buddhist" },
        { value: "jain", label: "Jain" },
        { value: "parsi", label: "Parsi" },
        { value: "other", label: "Other" },
      ],
      Caste_Preferences: caste.map((x, i) => ({ value: x.caste, label: x.caste, _k: `${x.caste}__${i}` })),
      Sub_Caste_Preferences: subcaste.map((x, i) => ({ value: x.sub_caste, label: x.sub_caste, _k: `${x.sub_caste}__${i}` })),
      Mother_Toungue_Preferences: [
        { value: "bengali", label: "Bengali" },
        { value: "english", label: "English" },
        { value: "hindi", label: "Hindi" },
        { value: "kannada", label: "Kannada" },
        { value: "marathi", label: "Marathi" },
        { value: "tamil", label: "Tamil" },
        { value: "telugu", label: "Telugu" },
      ],
      Marital_Status_Preferences: [
        { value: "Never Married", label: "Never Married" },
        { value: "married", label: "Married" },
        { value: "divorced", label: "Divorced" },
        { value: "widowed", label: "Widowed" },
      ],
      children_PreferenceOptions: [
        { value: "no_children", label: "No children" },
        { value: "want_children", label: "Want children" },
        { value: "has_children", label: "Has children" },
        { value: "not_sure_yet", label: "Not sure yet" },
      ],
      Age_Preferences: [
        { value: "18_24", label: "18-24" },
        { value: "25_30", label: "25-30" },
        { value: "31_35", label: "31-35" },
        { value: "36_40", label: "36-40" },
        { value: "41_50", label: "41-50" },
        { value: "51_and_above", label: "51 and above" },
      ],
      Height_Preferences: Array.from({ length: 26 }, (_, i) => ({ value: (4 + i * 0.1).toFixed(1), label: `${(4 + i * 0.1).toFixed(1)} ft`, _k: `h_${i}` })),
      Created_by_preference: [
        { value: "self", label: "Self" },
        { value: "father", label: "Father" },
        { value: "mother", label: "Mother" },
        { value: "friend", label: "Friend" },
        { value: "relatives", label: "Relatives" },
        { value: "sister", label: "Sister" },
        { value: "brother", label: "Brother" },
        { value: "other_mediator", label: "Other Mediator" },
      ],
    }),
    [caste, subcaste]
  );

  const opts2 = useMemo(
    () => ({
      Education_Preferences: education.map((x, i) => ({ value: x.education, label: x.education, _k: `${x.education}__${i}` })),
      Occupation_Preference: occupation.map((x, i) => ({ value: x.occupation, label: x.occupation, _k: `${x.occupation}__${i}` })),
      Job_Location_Preference: city.map((x, i) => ({ value: x.city, label: x.city, _k: `${x.city}__${i}` })),
      Anuual_Income_Preference: annualIncome.map((x, i) => ({ value: x.annual_income, label: x.annual_income, _k: `${x.annual_income}__${i}` })),
      Partner_Family_Preference: [
        { value: "Joint_Family", label: "Joint Family", _k: "pf_j" },
        { value: "Nuclear_Family", label: "Nuclear Family", _k: "pf_n" },
        { value: "Family-Oriented_Partner", label: "Family-Oriented Partner", _k: "pf_fop" },
        { value: "Independent_Partner", label: "Independent Partner", _k: "pf_ip" },
        { value: "Living_with_Parents", label: "Living with Parents", _k: "pf_lwp" },
      ],
      Setelled_Location_Preference: city.map((x, i) => ({ value: x.city, label: x.city, _k: `${x.city}__${i}` })),
    }),
    [education, occupation, city, annualIncome]
  );

  const opts3 = useMemo(
    () => ({
      House_Type_Preference: [
        { value: "GroundFloor", label: "Ground Floor", _k: "ht_gf" },
        { value: "g+1", label: "G+1", _k: "ht_g1" },
        { value: "g+2", label: "G+2", _k: "ht_g2" },
        { value: "g+3", label: "G+3", _k: "ht_g3" },
        { value: "g+4", label: "G+4", _k: "ht_g4" },
        { value: "g+5", label: "G+5", _k: "ht_g5" },
        { value: "g+6", label: "G+6", _k: "ht_g6" },
        { value: "g+7", label: "G+7", _k: "ht_g7" },
        { value: "g+8", label: "G+8", _k: "ht_g8" },
        { value: "g+9", label: "G+9", _k: "ht_g9" },
        { value: "g+10", label: "G+10", _k: "ht_g10" },
      ],
      Own_House_sq_Yard_Preference: Array.from({ length: 1000 - 70 + 1 }, (_, i) => 70 + i).map((v, i) => ({ value: String(v), label: `${v} Yards`, _k: `oy_${i}` })),
      Monthly_Rent_Preference: Array.from({ length: 200 }, (_, i) => 50000 + i * 50000).map((v, i) => ({ value: String(v), label: `₹${v.toLocaleString("en-IN")}`, _k: `mr_${i}` })),
      Open_Plots_Preference: Array.from({ length: 20 }, (_, i) => i + 1).map((v, i) => ({ value: String(v), label: String(v), _k: `op_${i}` })),
      Apartment_Flats_Preference: Array.from({ length: 20 }, (_, i) => i + 1).map((v, i) => ({ value: String(v), label: String(v), _k: `af_${i}` })),
      Own_Location_Preference: city.map((x, i) => ({ value: x.city, label: x.city, _k: `${x.city}__${i}` })),
      Agriculture_Land_Preference: Array.from({ length: 1000 - 70 + 1 }, (_, i) => 70 + i).map((v, i) => ({ value: String(v), label: `${v} Acres`, _k: `al_${i}` })),
      Total_Property_Value_Preference: annualIncome.map((x, i) => ({ value: x.annual_income, label: x.annual_income, _k: `${x.annual_income}__${i}` })),
    }),
    [city, annualIncome]
  );

  const opts4 = useMemo(
    () => ({
      Country_Preference: country.map((x, i) => ({ value: x.country, label: x.country, _k: `${x.country}__${i}` })),
      State_Preference: state.map((x, i) => ({ value: x.state, label: x.state, _k: `${x.state}__${i}` })),
      City_Preference: city.map((x, i) => ({ value: x.city, label: x.city, _k: `${x.city}__${i}` })),
      Citizenship_Preference: [
        { value: "Indian", label: "Indian", _k: "cit_in" },
        { value: "NRI", label: "NRI", _k: "cit_nri" },
      ],
    }),
    [country, state, city]
  );

  // load lists
  useEffect(() => {
    const base = "https://localhost:3300/api";
    Promise.all([
      axios.get(`${base}/city`),
      axios.get(`${base}/education`),
      axios.get(`${base}/annual_income`),
      axios.get(`${base}/occupation`),
      axios.get(`${base}/caste`),
      axios.get(`${base}/sub_caste`),
      axios.get(`${base}/country`),
      axios.get(`${base}/state`),
    ]).then(([ci, ed, ai, oc, ca, sc, co, st]) => {
      setCity(ci.data || []);
      setEducation(ed.data || []);
      setAnnualIncome(ai.data || []);
      setOccupation(oc.data || []);
      setCaste(ca.data || []);
      setSubcaste(sc.data || []);
      setCountry(co.data || []);
      setState(st.data || []);
    });
  }, []);

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
    const joinOrAny = (arr) => (arr && arr.length > 0 ? arr.join(",") : "Any");
    const payload = {
      partnerCreatedBy: pref1.Created_by_preference || "Any",
      religionPreferences: joinOrAny(pref1.Religion_Preferences),
      castePreferences: joinOrAny(pref1.Caste_Preferences),
      subCastePreferences: joinOrAny(pref1.Sub_Caste_Preferences),
      maritalStatusPreferences: pref1.Marital_Status_Preferences || "Any",
      childrenPreferences: joinOrAny(pref1.children_PreferenceOptions),
      motherTonguePreferences: pref1.Mother_Toungue_Preferences || "Any",
      agePreferences: joinOrAny(pref1.Age_Preferences),
      heightPreferences: joinOrAny(pref1.Height_Preferences),
      partnerEducationPreferences: joinOrAny(pref2.Education_Preferences),
      partnerOccupationPreferences: joinOrAny(pref2.Occupation_Preference),
      partnerJobLocationPreferences: joinOrAny(pref2.Job_Location_Preference),
      partnerAnnualIncome: pref2.Anuual_Income_Preference || "Any",
      familyPreferences: pref2.Partner_Family_Preference || "Any",
      settledLocationPreferences: joinOrAny(pref2.Setelled_Location_Preference),
      ownHousePreferences: joinOrAny(pref3.House_Type_Preference),
      squareYardPreferences: joinOrAny(pref3.Own_House_sq_Yard_Preference),
      monthlyRentPreferences: joinOrAny(pref3.Monthly_Rent_Preference),
      plotPreference: pref3.Open_Plots_Preference || "Any",
      flatPreference: joinOrAny(pref3.Apartment_Flats_Preference),
      ownLocationPreferences: joinOrAny(pref3.Own_Location_Preference),
      agricultureLandPreference: pref3.Agriculture_Land_Preference || "Any",
      totalPropertyValuePreference: pref3.Total_Property_Value_Preference || "Any",
      countryLocationPreferences: joinOrAny(pref4.Country_Preference),
      stateLocationPreferences: joinOrAny(pref4.State_Preference),
      cityLocationPreferences: joinOrAny(pref4.City_Preference),
      citizenshipPreferences: joinOrAny(pref4.Citizenship_Preference),
      step9: 1,
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await apiClient2.put(`${apiEndpoints2.user}/${userId}`, payload, {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.status === 200) { alert("Partner preferences updated successfully!"); navigate(-1); } else { alert("Failed to update details."); }
    } catch (err) { alert("An error occurred while updating details."); } finally { setLoading(false); }
  };

  const open = (key) => setModal({ key, options: opts1[key] || [] });
  const close = () => setModal(null);
  const open2 = (key) => setModal2({ key, options: opts2[key] || [] });
  const close2 = () => setModal2(null);
  const open3 = (key) => setModal3({ key, options: opts3[key] || [] });
  const close3 = () => setModal3(null);
  const open4 = (key) => setModal4({ key, options: opts4[key] || [] });
  const close4 = () => setModal4(null);

  const onToggle = (setState, key, value, checked) => {
    setState((prev) => {
      const list = new Set(prev[key] || []);
      if (checked) list.add(value); else list.delete(value);
      return { ...prev, [key]: Array.from(list) };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Partner Preferences</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
          <form onSubmit={submit} className="space-y-6 py-6 px-4">
            {/* Block 1 */}
            <div className="text-center pb-2 pt-2">
              <div className="w-[90%] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-semibold shadow">* Caste & Religion Preferences *</div>
            </div>
            {Object.keys(opts1).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{Array.isArray(pref1[key]) && pref1[key].length > 0 ? opts1[key].filter((o) => pref1[key].includes(o.value)).map((o) => o.label).join(", ") : "Any"}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Block 2 */}
            <div className="text-center pb-2 pt-4">
              <div className="w-[90%] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-semibold shadow">* Education & Job Preferences *</div>
            </div>
            {Object.keys(opts2).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open2(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{Array.isArray(pref2[key]) && pref2[key].length > 0 ? opts2[key].filter((o) => pref2[key].includes(o.value)).map((o) => o.label).join(", ") : "Any"}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Block 3 */}
            <div className="text-center pb-2 pt-4">
              <div className="w-[90%] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-semibold shadow">* Property Preferences *</div>
            </div>
            {Object.keys(opts3).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open3(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{Array.isArray(pref3[key]) && pref3[key].length > 0 ? opts3[key].filter((o) => pref3[key].includes(o.value)).map((o) => o.label).join(", ") : "Any"}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Block 4 */}
            <div className="text-center pb-2 pt-4">
              <div className="w-[90%] mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-semibold shadow">* Location Preferences *</div>
            </div>
            {Object.keys(opts4).map((key) => (
              <div key={key} className="mb-[-8px]">
                <label className="block text-gray-700 font-medium mb-2">{key.replace(/_/g, " ")}</label>
                <div className="flex flex-col w-full border px-3 border-gray-300 py-3 cursor-pointer hover:shadow-lg transition-all rounded-lg" onClick={() => open4(key)}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-md font-medium">{Array.isArray(pref4[key]) && pref4[key].length > 0 ? opts4[key].filter((o) => pref4[key].includes(o.value)).map((o) => o.label).join(", ") : "Any"}</span>
                    <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
                  </div>
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading || !userId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">{loading ? "Updating..." : "Update Partner Preferences"}</button>
          </form>

          {/* Modal templates */}
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal.key.replace(/_/g, " ")}`} value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal.options || []).filter((o) => o.label.toLowerCase().includes(search.toLowerCase())).map((option, idx) => (
                    <label key={option._k || `${option.value}__${idx}`} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={(pref1[modal.key] || []).includes(option.value)} onChange={(e) => onToggle(setPref1, modal.key, option.value, e.target.checked)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close}>Close</button>
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
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={(pref2[modal2.key] || []).includes(option.value)} onChange={(e) => onToggle(setPref2, modal2.key, option.value, e.target.checked)} />
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
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={(pref3[modal3.key] || []).includes(option.value)} onChange={(e) => onToggle(setPref3, modal3.key, option.value, e.target.checked)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close3}>Close</button>
              </div>
            </div>
          )}

          {modal4 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg m-5">
                <h2 className="text-lg font-bold mb-4 capitalize text-center">Select {modal4.key.replace(/_/g, " ")}</h2>
                <input type="text" className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder={`Search ${modal4.key.replace(/_/g, " ")}`} value={search4} onChange={(e) => setSearch4(e.target.value)} />
                <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
                  {(modal4.options || []).filter((o) => o.label.toLowerCase().includes(search4.toLowerCase())).map((option, idx) => (
                    <label key={option._k || `${option.value}__${idx}`} className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-red-600" checked={(pref4[modal4.key] || []).includes(option.value)} onChange={(e) => onToggle(setPref4, modal4.key, option.value, e.target.checked)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={close4}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPartnerPreferences; 