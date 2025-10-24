import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes, FaLink, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from './Apis';
import Loader from './Loader';

const CustomizedLinksManagement = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteLink, setDeleteLink] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    url_link: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    if (!bureauId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use POST request with bureau_id in body
      const response = await apiClient.post(`${apiEndpoints.customizedLinks}/fetch`, {
        bureau_id: bureauId
      });
      if (response.data.success) {
        setLinks(response.data.links || []);
      } else {
        setError(response.data.message || 'Error fetching customized links'); 
      }
    } catch (error) {
      console.error('Error fetching customized links:', error);
      setError('Error fetching customized links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/edit-buttons');
  };

  const openCreateModal = () => {
    setEditingLink(null);
    setFormData({
      title: '',
      url_link: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url_link: link.url_link,
      status: link.status
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (link) => {
    setDeleteLink(link);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setFormData({
      title: '',
      url_link: '',
      status: 'active'
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteLink(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.url_link.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!validateUrl(formData.url_link)) {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setSubmitting(true);
    
    try {
      let response;
      if (editingLink) {
        // Update existing link
        response = await apiClient.put(
          `${apiEndpoints.customizedLinks}/${editingLink.id}`,
          {
            bureau_id: bureauId,
            title: formData.title.trim(),
            url_link: formData.url_link.trim(),
            status: formData.status
          }
        );
      } else {
        // Create new link
        response = await apiClient.post(
          apiEndpoints.customizedLinks,
          {
            bureau_id: bureauId,
            title: formData.title.trim(),
            url_link: formData.url_link.trim(),
            status: formData.status
          }
        );
      }

      if (response.data.success) {
        const message = editingLink 
          ? 'Customized link updated successfully!' 
          : 'Customized link created successfully!';
        alert(message);
        closeModal();
        fetchLinks();
      } else {
        alert(response.data.message || 'Error saving customized link');
      }
    } catch (error) {
      console.error('Error saving customized link:', error);
      const errorMessage = error.response?.data?.message || 'Error saving customized link. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteLink) return;
    
    setSubmitting(true);
    
    try {
      // Use DELETE request with bureau_id in body
      const response = await apiClient.delete(`${apiEndpoints.customizedLinks}/${deleteLink.id}`, {
        data: { bureau_id: bureauId }
      });
      
      if (response.data.success) {
        alert('Customized link deleted successfully!');
        closeDeleteModal();
        fetchLinks();
      } else {
        alert(response.data.message || 'Error deleting customized link');
      }
    } catch (error) {
      console.error('Error deleting customized link:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting customized link. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (link) => {
    try {
      const newStatus = link.status === 'active' ? 'inactive' : 'active';
      const response = await apiClient.patch(`${apiEndpoints.customizedLinks}/${link.id}/status`, {
        status: newStatus,
        bureau_id: bureauId
      });
      
      if (response.data.success) {
        fetchLinks();
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

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
          <h1 className="text-3xl font-bold text-gray-800">Customized Links Management</h1>
        </div>

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Link
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

        {/* Links Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <div
                key={link.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  link.status === 'inactive' ? 'opacity-60' : ''
                }`}
              >
                {/* Header with Status Badge */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {link.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">URL:</p>
                    <div className="flex items-center space-x-2">
                      <a
                        href={link.url_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm truncate flex-1"
                        title={link.url_link}
                      >
                        {link.url_link}
                      </a>
                      <button
                        onClick={() => openLink(link.url_link)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Open Link"
                      >
                        <FaExternalLinkAlt size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">
                    Created: {formatDate(link.created_at)}
                  </p>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(link)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(link)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => toggleStatus(link)}
                      className={`p-1 rounded ${
                        link.status === 'active'
                          ? 'text-green-600 hover:text-green-800'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title={link.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {link.status === 'active' ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Links */}
        {!loading && links.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaLink size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Customized Links Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add important links that your clients can access from your website.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Link
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
                  {editingLink ? 'Edit Customized Link' : 'Add New Customized Link'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter title name"
                    required
                  />
                </div>

                {/* URL Link */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Link *
                  </label>
                  <input
                    type="url"
                    name="url_link"
                    value={formData.url_link}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please include http:// or https:// in the URL
                  </p>
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
                        {editingLink ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingLink ? 'Update Link' : 'Create Link'
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
                <h2 className="text-xl font-bold text-red-600">Delete Customized Link</h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {deleteLink && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the link "<strong>{deleteLink.title}</strong>"?
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
                    'Delete Link'
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

export default CustomizedLinksManagement; 