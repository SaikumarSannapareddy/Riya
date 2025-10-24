import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from './Apis';
import Loader from './Loader';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteTestimonial, setDeleteTestimonial] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    if (!bureauId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`${apiEndpoints.testimonials}/fetch`, {
        bureau_id: bureauId
      });
      
      if (response.data.success) {
        setTestimonials(response.data.testimonials || []);
      } else {
        setError(response.data.message || 'Error fetching testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Error fetching testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/edit-buttons');
  };

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      message: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      message: testimonial.message,
      status: testimonial.status
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (testimonial) => {
    setDeleteTestimonial(testimonial);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      message: '',
      status: 'active'
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTestimonial(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      let response;
      const requestData = {
        bureau_id: bureauId,
        name: formData.name.trim(),
        message: formData.message.trim(),
        status: formData.status
      };
      
      if (editingTestimonial) {
        // Update existing testimonial
        response = await apiClient.put(
          `${apiEndpoints.testimonials}/${editingTestimonial.id}`,
          requestData
        );
      } else {
        // Create new testimonial
        response = await apiClient.post(
          apiEndpoints.testimonials,
          requestData
        );
      }

      if (response.data.success) {
        const message = editingTestimonial 
          ? 'Testimonial updated successfully!' 
          : 'Testimonial created successfully!';
        alert(message);
        closeModal();
        fetchTestimonials();
      } else {
        alert(response.data.message || 'Error saving testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.response?.data?.message || 'Error saving testimonial. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTestimonial) return;
    
    setSubmitting(true);
    
    try {
      const response = await apiClient.delete(`${apiEndpoints.testimonials}/${deleteTestimonial.id}`, {
        data: { bureau_id: bureauId }
      });
      
      if (response.data.success) {
        alert('Testimonial deleted successfully!');
        closeDeleteModal();
        fetchTestimonials();
      } else {
        alert(response.data.message || 'Error deleting testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting testimonial. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (testimonial) => {
    try {
      const newStatus = testimonial.status === 'active' ? 'inactive' : 'active';
      const response = await apiClient.patch(`${apiEndpoints.testimonials}/${testimonial.id}/status`, {
        status: newStatus,
        bureau_id: bureauId
      });
      
      if (response.data.success) {
        fetchTestimonials();
      } else {
        alert(response.data.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
        </div>

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Testimonial
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  testimonial.status === 'inactive' ? 'opacity-60' : ''
                }`}
              >
                {/* Header with Status Badge */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {testimonial.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                    "{testimonial.message}"
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Created: {formatDate(testimonial.created_at)}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(testimonial)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(testimonial)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => toggleStatus(testimonial)}
                      className={`p-1 rounded ${
                        testimonial.status === 'active'
                          ? 'text-green-600 hover:text-green-800'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title={testimonial.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {testimonial.status === 'active' ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Testimonials */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaUser size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Testimonials Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start building trust by adding testimonials from your satisfied clients.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Testimonial
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the testimonial message"
                    required
                  />
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingTestimonial ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600">Delete Testimonial</h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {deleteTestimonial && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the testimonial from <strong>{deleteTestimonial.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Testimonial'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement; 