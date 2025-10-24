import React, { useState, useEffect } from "react";
import { 
  FaSpinner,
  FaCog
} from "react-icons/fa";
import apiClient, { apiEndpoints } from './Apis';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all services and filter active ones
  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching all services from:', apiEndpoints.adminServices);
      const response = await apiClient.get(apiEndpoints.adminServices);
      console.log('All services response:', response);
      console.log('All services data:', response.data);
      
      // Filter active services on frontend
      const activeServices = response.data.filter(service => service.status === 'active');
      console.log('Active services filtered:', activeServices);
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Comprehensive matrimony services tailored for you</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            // Loading cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <FaCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Available</h3>
              <p className="text-gray-500">Check back later for our latest service offerings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {services.length > 0 && (
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8">Choose the perfect service for your matrimony needs</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Contact Us Today
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services; 