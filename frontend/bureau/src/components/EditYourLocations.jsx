import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Eye, MapPin, Phone, User } from "lucide-react";
import apiClient, { apiEndpoints } from "./Apis";
import TopNavbar from "../components/Gnavbar";
import Bottomnav from "../components/Bottomnav";

const EditYourLocations = () => {
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const bureauId = localStorage.getItem("bureauId");

  const [locationData, setLocationData] = useState({
    bureau_id: bureauId,
    branch_manager_name: "", 
    contact_details: "",
    house_no: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    google_map_link: "",
  });

  const fetchLocations = () => {
    apiClient
      .get(apiEndpoints.location)
      .then((response) => {
        console.log("API Response:", response.data);
        const numericBureauId = Number(bureauId);
        const filteredLocations = response.data.filter(
          (location) => Number(location.bureau_id) === numericBureauId
        );
        console.log("Filtered Locations:", filteredLocations);
        setLocations(filteredLocations);
      })
      .catch((error) => {
        console.error(
          "Error fetching locations:",
          error.response ? error.response.data : error.message
        );
      });
  };

  useEffect(() => {
    fetchLocations();
  }, [bureauId]);

  const openModal = (index = null, isViewOnly = false) => {
    if (index !== null) {
      setLocationData(locations[index]);
      setEditingIndex(index);
      setViewOnly(isViewOnly);
    } else {
      setLocationData({
        bureau_id: bureauId,
        branch_manager_name: "",
        contact_details: "",
        house_no: "",
        street: "",
        city: "",
        district: "",
        state: "",
        country: "",
        google_map_link: "",
      });
      setEditingIndex(null);
      setViewOnly(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
    setViewOnly(false);
  };

  const handleChange = (e) => {
    setLocationData({ ...locationData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingIndex !== null) {
        const id = locations[editingIndex].id;
        await apiClient.put(`${apiEndpoints.location}/${id}`, locationData);
      } else {
        await apiClient.post(`${apiEndpoints.location}`, locationData);
      }
      fetchLocations();
      closeModal();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`${apiEndpoints.location}/${id}`);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <TopNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 mt-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Location Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and organize your business locations</p>
        </div>
        
        <button
          onClick={() => openModal()}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl flex items-center gap-3 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus size={20} /> Add New Location
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {locations.length > 0 ? (
            locations.map((loc, index) => (
              <div
                key={loc.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="bg-white/20 rounded-full p-2">
                      <User size={20} />
                    </div>
                    <h3 className="font-bold text-lg">{loc.branch_manager_name}</h3>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-600 rounded-full p-2">
                      <Phone size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Contact Details</p>
                      <span className="text-gray-700 font-medium">{loc.contact_details}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-100 text-rose-600 rounded-full p-2 mt-1">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Location Address</p>
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {[loc.house_no, loc.street, loc.city, loc.district, loc.state, loc.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      {loc.google_map_link && (
                        <a
                          href={loc.google_map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline transition-colors"
                        >
                          📍 View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openModal(index, true)}
                      className="p-3 bg-gradient-to-r from-slate-400 to-slate-500 text-white rounded-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal(index)}
                      className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="p-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <MapPin size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No locations found</h3>
                <p className="text-gray-500">Get started by adding your first location</p>
              </div>
            </div>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl w-[90%] max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
              {/* Header - Fixed */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex-shrink-0">
                <h2 className="text-2xl font-bold">
                  {viewOnly ? "📍 View Location" : editingIndex !== null ? "✏️ Edit Location" : "➕ Add New Location"}
                </h2>
              </div>
              
              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.keys(locationData).filter(key => key !== 'id' && key !== 'bureau_id').map((key) => (
                    <div key={key} className="flex flex-col">
                      <label htmlFor={key} className="mb-2 text-sm font-semibold text-gray-700">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        id={key}
                        name={key}
                        value={locationData[key]}
                        onChange={handleChange}
                        placeholder={key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim()}
                        className="p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white w-full transition-all duration-200 outline-none"
                        disabled={viewOnly}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Close
                  </button>
                  
                  {!viewOnly && (
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Bottomnav />
    </div>
  );
};

export default EditYourLocations;