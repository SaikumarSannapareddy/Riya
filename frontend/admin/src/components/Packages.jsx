import React, { useState, useEffect } from "react";
import { 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaUpload,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import apiClient, { apiEndpoints, Uploads } from "./Apis";

const PackageManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    status: "active"
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get(apiEndpoints.packageBanners);
      console.log('Fetched banners:', response.data);
      console.log('Banner count:', response.data.length);
      if (response.data.length > 0) {
        console.log('First banner:', response.data[0]);
        console.log('Image path:', response.data[0].image_path);
        console.log('Image filename:', response.data[0].image_path.split('/').pop());
        console.log('Full image URL:', `${Uploads}/${response.data[0].image_path}`);
      }
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to fetch banners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesStatus = statusFilter === "all" || banner.status === statusFilter;
    return matchesStatus;
  });

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation - only require image for new banners
    if (!editingBanner && !selectedImage) {
      setError('Please select an image');
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingBanner) {
        // Update existing banner - can update status without changing image
        const updateData = new FormData();
        updateData.append('status', formData.status);
        
        if (selectedImage) {
          updateData.append('image', selectedImage);
        }
        
        await apiClient.put(`${apiEndpoints.packageBanners}/${editingBanner.id}`, updateData, {
          headers: {
            'Content-Type': undefined,
          },
        });
        setError("");
        alert('Banner updated successfully!');
      } else {
        // Create new banner - requires image
        if (!selectedImage) {
          setError('Please select an image');
          setSubmitting(false);
          return;
        }
        
        const createData = new FormData();
        createData.append('status', formData.status);
        createData.append('image', selectedImage);
        
        // Debug: Log what's being sent
        console.log('Selected Image:', selectedImage);
        console.log('FormData entries:');
        for (let [key, value] of createData.entries()) {
          console.log(key, value);
        }
        
        await apiClient.post(apiEndpoints.packageBanners, createData, {
          headers: {
            'Content-Type': undefined,
          },
        });
        setError("");
        alert('Banner created successfully!');
      }

      // Reset form and refresh data
      handleCancel();
      fetchBanners();
    } catch (error) {
      console.error('Error submitting banner:', error);
      setError(error.response?.data?.error || 'Failed to submit banner. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      status: banner.status
    });
    setImagePreview(`${Uploads}/${banner.image_path}`);
    setSelectedImage(null);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

          try {
        await apiClient.delete(`${apiEndpoints.packageBanners}/${id}`);
      alert('Banner deleted successfully!');
      fetchBanners();
      } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner. Please try again.');
    }
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiClient.patch(`${apiEndpoints.packageBanners}/${id}/status`, { status: newStatus });
      alert(`Banner status updated to ${newStatus}!`);
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
      alert('Failed to update banner status. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingBanner(null);
    setFormData({
      status: "active"
    });
    setSelectedImage(null);
    setImagePreview(null);
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
                <h1 className="text-3xl font-bold text-gray-800">Package Banner Management</h1>
                <p className="text-gray-600 mt-1">Manage banner images for package display</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add New Banner</span>
              </button>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image {!editingBanner && '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-gray-600">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <FaUpload className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
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
                      <FaPlus className="w-4 h-4" />
                    )}
                    <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Banners Grid */}
            {loading ? (
              <div className="text-center py-12">
                <FaSpinner className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading banners...</p>
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-12">
                <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No banners found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBanners.map((banner) => (
                  <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={`${Uploads}/${banner.image_path}`}
                        alt="Banner"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {banner.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>Created: {formatDate(banner.created_at)}</span>
                        <span>Updated: {formatDate(banner.updated_at)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
                        >
                          <FaEdit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(banner.id, banner.status)}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors duration-200 ${
                            banner.status === 'active'
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {banner.status === 'active' ? <FaEyeSlash className="w-3 h-3 mr-1" /> : <FaEye className="w-3 h-3 mr-1" />}
                          {banner.status === 'active' ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
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

export default PackageManagement;