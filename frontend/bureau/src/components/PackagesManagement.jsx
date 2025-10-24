import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaArrowLeft, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from './Apis';
import TopNavbar from './Gnavbar';
import BottomNavBar from './Bottomnav';

const PackagesManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    features: [], // Change to array
    is_active: true
  });

  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  // API Functions
  const getPackages = async (bureauId) => {
    return await apiClient.post(`${apiEndpoints.getBureauPackages}/${bureauId}`);
  };

  const createPackage = async (packageData) => {
    return await apiClient.post(`${apiEndpoints.createUpdatePackage}`, packageData);
  };

  const updatePackage = async (packageId, packageData) => {
    return await apiClient.put(`${apiEndpoints.createUpdatePackage}/${packageId}`, packageData);
  };

  const deletePackage = async (packageId) => {
    return await apiClient.delete(`${apiEndpoints.createUpdatePackage}/${packageId}`);
  };

  const activatePackage = async (packageId) => {
    return await apiClient.post(`${apiEndpoints.activatePackage}/${packageId}/activate`);
  };

  const deactivatePackage = async (packageId) => {
    return await apiClient.post(`${apiEndpoints.deactivatePackage}/${packageId}/deactivate`);
  };

  useEffect(() => {
    if (!bureauId) {
      toast.error('Bureau ID not found. Please login again.');
      navigate('/login');
      return;
    }
    fetchPackages();
  }, [bureauId, navigate]);

  const fetchPackages = async () => {
    if (!bureauId) return;
    
    try {
      setLoading(true);
      const response = await getPackages(bureauId);
      
      // Enhanced data validation
      let packagesData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          packagesData = response.data;
        } else if (Array.isArray(response.data.packages)) {
          // In case the API returns { packages: [...] }
          packagesData = response.data.packages;
        } else if (Array.isArray(response.data.data)) {
          // In case the API returns { data: [...] }
          packagesData = response.data.data;
        }
      }
      
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
      // Ensure packages is always an array even on error
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/edit-buttons');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.features];
      updated[index] = value;
      return { ...prev, features: updated };
    });
  };
  const handleAddFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };
  const handleRemoveFeature = (index) => {
    setFormData(prev => {
      const updated = [...prev.features];
      updated.splice(index, 1);
      return { ...prev, features: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.duration.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const packageData = {
        ...formData,
        bureau_id: bureauId,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim() !== ''), // Clean empty
      };

      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData);
        toast.success('Package updated successfully');
      } else {
        await createPackage(packageData);
        toast.success('Package created successfully');
      }

      setShowForm(false);
      setEditingPackage(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        features: [],
        is_active: true
      });
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error(editingPackage ? 'Failed to update package' : 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    let featuresArr = [];
    if (Array.isArray(pkg.features)) {
      featuresArr = pkg.features;
    } else if (typeof pkg.features === 'string') {
      try {
        featuresArr = JSON.parse(pkg.features);
        if (!Array.isArray(featuresArr)) featuresArr = pkg.features.split(',');
      } catch {
        featuresArr = pkg.features.split(',');
      }
    }
    setFormData({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      features: featuresArr.map(f => f.trim()),
      is_active: pkg.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        setLoading(true);
        await deletePackage(id);
        toast.success('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error('Failed to delete package');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (pkg) => {
    try {
      setLoading(true);
      if (pkg.is_active) {
        await deactivatePackage(pkg.id);
        toast.success('Package deactivated successfully');
      } else {
        await activatePackage(pkg.id);
        toast.success('Package activated successfully');
      }
      fetchPackages();
    } catch (error) {
      console.error('Error toggling package status:', error);
      toast.error('Failed to update package status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      features: [],
      is_active: true
    });
  };

  if (!bureauId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500">Bureau ID not found. Please login again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Edit Buttons
            </button>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Packages Management</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300"
              >
                <FaPlus /> Add Package
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        maxLength="255"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validity *
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        maxLength="100"
                        placeholder="e.g., 3 months, 6 months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      maxLength="500"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <small className="text-gray-500">Max 500 characters</small>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={feature}
                            onChange={e => handleFeatureChange(idx, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Feature ${idx + 1}`}
                            maxLength={200}
                          />
                          <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700"><FaMinus /></button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddFeature} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"><FaPlus /> Add Feature</button>
                    </div>
                    <small className="text-gray-500">Add each feature as a separate point</small>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingPackage ? 'Update' : 'Create')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Packages List */}
            {loading && !showForm ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading packages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add defensive check to ensure packages is an array */}
                {Array.isArray(packages) && packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{pkg.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            pkg.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {pkg.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(pkg)}
                          className={`transition duration-300 ${
                            pkg.is_active 
                              ? 'text-red-500 hover:text-red-700' 
                              : 'text-green-500 hover:text-green-700'
                          }`}
                          title={pkg.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {pkg.is_active ? <FaTimes /> : <FaCheck />}
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm">{pkg.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{parseFloat(pkg.price).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">{pkg.duration} Validity</span>
                      </div>
                      
                      {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <FaCheck className="text-green-500 text-xs" />
                                {feature}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {pkg.features && typeof pkg.features === 'string' && pkg.features.trim() !== '' && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                            {(function() {
                              let arr;
                              try {
                                arr = JSON.parse(pkg.features);
                                if (!Array.isArray(arr)) arr = pkg.features.split(',');
                              } catch {
                                arr = pkg.features.split(',');
                              }
                              return arr.map((feature, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <FaCheck className="text-green-500 text-xs" />
                                  {feature.trim()}
                                </li>
                              ));
                            })()}
                          </ol>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(pkg.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!Array.isArray(packages) || packages.length === 0) && !loading && !showForm && (
              <div className="text-center py-8">
                <p className="text-gray-500">No packages found. Create your first package!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default PackagesManagement;