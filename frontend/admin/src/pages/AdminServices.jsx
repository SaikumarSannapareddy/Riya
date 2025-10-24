import React, { useState, useEffect } from "react";
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaTimes as FaClose
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import apiClient, { apiEndpoints } from "../components/Apis";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active"
  });

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(apiEndpoints.adminServices);
      console.log('Fetched services:', response.data);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingService) {
        // Update existing service
        await apiClient.put(`${apiEndpoints.adminServices}/${editingService.id}`, formData);
        setError("");
        alert('Service updated successfully!');
      } else {
        // Create new service
        await apiClient.post(apiEndpoints.adminServices, formData);
        setError("");
        alert('Service created successfully!');
      }

      // Reset form and refresh data
      handleCancel();
      fetchServices();
    } catch (error) {
      console.error('Error submitting service:', error);
      setError(error.response?.data?.error || 'Failed to submit service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      status: service.status
    });
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await apiClient.delete(`${apiEndpoints.adminServices}/${id}`);
      alert('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiClient.patch(`${apiEndpoints.adminServicesStatus}/${id}/status`, { status: newStatus });
      alert(`Service status updated to ${newStatus}!`);
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      status: "active"
    });
    setError("");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-grow p-4 md:p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
                <p className="text-gray-600 mt-1">Manage your matrimony services</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter service title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter service description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    {submitting ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaCheck className="w-4 h-4" />
                    )}
                    <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Services List */}
            {loading ? (
              <div className="text-center py-12">
                <FaSpinner className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPlus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Found</h3>
                <p className="text-gray-500">Start by adding your first service.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>Created: {formatDate(service.created_at)}</span>
                        <span>Updated: {formatDate(service.updated_at)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
                        >
                          <FaEdit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(service.id, service.status)}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors duration-200 ${
                            service.status === 'active'
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {service.status === 'active' ? <FaEyeSlash className="w-3 h-3 mr-1" /> : <FaEye className="w-3 h-3 mr-1" />}
                          {service.status === 'active' ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
                        >
                          <FaTrash className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices; 