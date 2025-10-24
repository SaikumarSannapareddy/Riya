import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus } from 'react-icons/fa';
import apiClient, { apiEndpoints } from './Apis';
import TopNavbar from "../components/Gnavbar";
import Bottomnav from "../components/Bottomnav";

const EditYourServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const bureauId = localStorage.getItem('bureauId');

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.services}/${bureauId}`);
        console.log("API Response:", response.data);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        window.alert("Failed to fetch services. Please try again later.");
      }
    };
    fetchServices();
  }, [bureauId]);

  // Add new service
  const handleAddService = async () => {
    if (newService.trim()) {
      try {
        const response = await apiClient.post(apiEndpoints.services, {
          bureau_id: bureauId,
          Servicename: newService,
        });

        setServices([...services, { id: response.data.serviceId, Servicename: newService }]);
        setNewService("");
        window.alert("Service added successfully!");
      } catch (error) {
        console.error("Error adding service:", error);
        window.alert("Failed to add service. Please try again.");
      }
    } else {
      window.alert("Service name cannot be empty.");
    }
  };

  // Delete a service
  const handleDelete = async (id) => {
    try {
      const response = await apiClient.delete(`${apiEndpoints.services}/${id}`);
      if (response.status === 200) {
        setServices(services.filter(service => service.id !== id));
        window.alert("Service deleted successfully!");
      } else {
        window.alert("Failed to delete service. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      window.alert("Failed to delete service. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <TopNavbar/>

      <h1 className="text-2xl font-bold mb-6">Manage Your Services</h1>

      {/* Add New Service Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Enter service name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddService}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Existing Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.Servicename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900 transition duration-150"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Bottomnav/>
    </div>
  );
};

export default EditYourServices;
