import React, { useState, useEffect } from "react";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaTimes,
  FaSpinner,
  FaBuilding
} from "react-icons/fa";
import apiClient, { apiEndpoints } from './Apis';

const OfficeLocations = () => {
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    address: "",
    pincode: "",
    houseno: "",
    bnumber: "",
    bemail: ""
  });

  // Fetch business details for current office
  const fetchBusinessDetails = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setBusinessDetails({
        address: response.data.address || "",
        pincode: response.data.pincode || "",
        houseno: response.data.houseno || "",
        bnumber: response.data.bnumber || "",
        bemail: response.data.bemail || ""
      });
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  // Fetch all locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.locationlinks);
      setLocations(response.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const handleViewMore = () => {
    fetchLocations();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Office Locations Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Office Location</h2>
            <p className="text-lg text-gray-600">Visit us at our main office or explore our branch locations</p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Current Office Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-6">
                  <FaBuilding className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Main Office</h3>
                  <p className="text-gray-600">Headquarters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                    <p className="text-gray-600">
                      {businessDetails.houseno && `${businessDetails.houseno}, `}
                      {businessDetails.address}
                      {businessDetails.pincode && (
                        <span className="block mt-1">
                          <FaMapMarkerAlt className="w-3 h-3 inline mr-1" />
                          {businessDetails.pincode}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  {businessDetails.bnumber && (
                    <div className="flex items-center space-x-4">
                      <FaPhone className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Phone</h4>
                        <a href={`tel:${businessDetails.bnumber}`} className="text-blue-600 hover:text-blue-800">
                          {businessDetails.bnumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {businessDetails.bemail && (
                    <div className="flex items-center space-x-4">
                      <FaEnvelope className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Email</h4>
                        <a href={`mailto:${businessDetails.bemail}`} className="text-blue-600 hover:text-blue-800">
                          {businessDetails.bemail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View More Button */}
            <div className="text-center">
              <button
                onClick={handleViewMore}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto space-x-3"
              >
                <FaMapMarkerAlt className="w-5 h-5" />
                <span>View More Branch Locations</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                  {locations.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">All Branch Locations</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <FaSpinner className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Loading locations...</p>
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Branch Locations</h3>
                  <p className="text-gray-500">Check back later for our branch locations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {locations.map((location, index) => (
                    <div key={location.id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <FaBuilding className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {location.title || `Branch ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">Branch Office</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {location.description && (
                          <p className="text-gray-600 text-sm">
                            {location.description}
                          </p>
                        )}
                        
                        {location.videoLink && (
                          <div className="mt-4">
                            <a
                              href={location.videoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                              View Location Details
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfficeLocations; 