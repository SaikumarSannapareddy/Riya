import React, { useState, useEffect } from 'react';
import { FaTimes, FaCrown, FaUser, FaCheck, FaEdit } from 'react-icons/fa';
import apiClient, { apiEndpoints } from './Apis1';

const ServicePreferenceModal = ({ isOpen, onClose, profile, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    // Only Online Service
    payingAmount: '',
    visibleContactNumbers: '',
    validityDays: '',
    
    // Only Offline Service
    registrationFees: '',
    goodwillAmount: '',
    
    // Online & Offline Service
    onlinePayingAmount: '',
    offlineRegistrationFees: '',
    offlineGoodwillAmount: '',
    combinedValidityDays: '',
    combinedVisibleContactNumbers: ''
  });
  
  const [contactVisibility, setContactVisibility] = useState({
    showMobile: false,
    showEmail: false,
    showWhatsapp: false
  });
  
  const [contactCounter, setContactCounter] = useState(0);
  const [notes, setNotes] = useState('');
  const [availableProfiles, setAvailableProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Service options
  const serviceOptions = [
    { value: 'only_online', label: 'Only Online Service', icon: '🌐', description: 'Online profiles only' },
    { value: 'only_offline', label: 'Only Offline Service', icon: '🏢', description: 'Offline bureau service' },
    { value: 'online_offline', label: 'Online & Offline Service', icon: '🔄', description: 'Both online and offline' }
  ];

  // Validity days options
  const validityDaysOptions = [
    { value: 30, label: '30 Days' },
    { value: 60, label: '60 Days' },
    { value: 90, label: '90 Days' },
    { value: 180, label: '180 Days' },
    { value: 365, label: '1 Year' }
  ];

  // Visible contact numbers options
  const contactNumbersOptions = [
    { value: 5, label: '5 Profiles' },
    { value: 10, label: '10 Profiles' },
    { value: 20, label: '20 Profiles' },
    { value: 50, label: '50 Profiles' },
    { value: 100, label: '100 Profiles' },
    { value: -1, label: 'Unlimited' }
  ];

  // Fetch package details
  useEffect(() => {
    if (isOpen && profile?._id) {
      fetchPackageDetails();
      fetchAvailableProfiles();
    }
  }, [isOpen, profile]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${apiEndpoints.getPackageDetails}/${profile._id}`);
      
      if (response.data.success) {
        const packageData = response.data.data;
        setPackageDetails(packageData);
        
        // Set selected service based on package data or user's current service preference
        if (packageData) {
          setSelectedService(packageData.servicePreference);
          setFormData(packageData.packageDetails);
          setContactVisibility(packageData.contactVisibility);
          setContactCounter(packageData.contactCounter || 0);
          setNotes(packageData.notes || '');
        } else {
          // No package data means free user
          setSelectedService('free');
          setFormData({
            payingAmount: 0,
            visibleContactNumbers: 0,
            validityDays: 0,
            registrationFees: 0,
            goodwillAmount: 0,
            onlinePayingAmount: 0,
            offlineRegistrationFees: 0,
            offlineGoodwillAmount: 0,
            combinedValidityDays: 0,
            combinedVisibleContactNumbers: 0
          });
          setContactCounter(0);
        }
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      // If error, assume free user
      setSelectedService('free');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProfiles = async () => {
    try {
      const bureauId = localStorage.getItem('bureauId');
      const response = await apiClient.get(`${apiEndpoints.getAvailableProfiles}/${bureauId}`);
      
      if (response.data.success) {
        setAvailableProfiles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching available profiles:', error);
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    // Initialize package details for selected service
    if (!formData.payingAmount && !formData.registrationFees && !formData.onlinePayingAmount) {
      setFormData(prev => ({
        ...prev,
        payingAmount: service === 'only_online' ? 1000 : 0,
        registrationFees: service === 'only_offline' ? 500 : 0,
        goodwillAmount: service === 'only_offline' ? 200 : 0,
        onlinePayingAmount: service === 'online_offline' ? 1500 : 0,
        offlineRegistrationFees: service === 'online_offline' ? 500 : 0,
        offlineGoodwillAmount: service === 'online_offline' ? 200 : 0,
        validityDays: 30,
        combinedValidityDays: service === 'online_offline' ? 30 : 0,
        visibleContactNumbers: service === 'only_online' ? 10 : 0,
        combinedVisibleContactNumbers: service === 'online_offline' ? 10 : 0
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactVisibilityChange = (field) => {
    setContactVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // For online/offline/both services, create/update package details
      const packageData = {
        userId: profile._id,
        servicePreference: selectedService,
        packageDetails: formData,
        contactVisibility: contactVisibility,
        contactCounter: contactCounter,
        notes: notes
      };
      const response = await apiClient.post(apiEndpoints.createUpdatePackage, packageData);
      if (response.data.success) {
        alert('Package created and activated successfully!');
        await fetchPackageDetails();
        onSuccess && onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to save package details');
      }
    } catch (error) {
      console.error('Error saving package details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving package details. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.post(`${apiEndpoints.activatePackage}/${profile._id}/activate`, {
        paymentStatus: 'completed'
      });
      
      if (response.data.success) {
        alert('Package activated successfully!');
        // Refresh package details
        await fetchPackageDetails();
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error activating package:', error);
      alert('Error activating package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to move this profile to free membership?')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post(`${apiEndpoints.deactivatePackage}/${profile._id}/deactivate`);
      
      if (response.data.success) {
        alert('Profile moved to free membership successfully!');
        // Refresh package details
        await fetchPackageDetails();
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error deactivating package:', error);
      alert('Error deactivating package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <FaCrown className="mr-2 text-yellow-500" />
            Service Preference & Package Management
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <img
              src={profile?.image ? `http://localhost:3200/api/uploads/${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
              alt="Profile"
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{profile?.fullName}</h3>
              <p className="text-gray-600">ID: {profile?.martialId}</p>
              <p className="text-gray-600">Current Status: {packageDetails?.membershipType === 'paid' ? 'Paid Member' : 'Free Member'}</p>
            </div>
          </div>
        </div>

        {/* Current Package Status */}
        {packageDetails && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Current Package Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Service:</span> {packageDetails.servicePreference}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-1 ${packageDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {packageDetails.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="font-medium">Payment:</span> 
                <span className={`ml-1 ${
                  packageDetails.paymentStatus === 'completed' ? 'text-green-600' : 
                  packageDetails.paymentStatus === 'expired' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {packageDetails.paymentStatus}
                </span>
              </div>
              <div>
                <span className="font-medium">Views:</span> {packageDetails.viewsCount || 0}
              </div>
              {packageDetails.expiresAt && (
                <div className="md:col-span-2">
                  <span className="font-medium">Expires:</span> {new Date(packageDetails.expiresAt).toLocaleDateString()}
                  {new Date(packageDetails.expiresAt) < new Date() && (
                    <span className="ml-2 text-red-600 font-medium">(EXPIRED)</span>
                  )}
                </div>
              )}
              {packageDetails.activatedAt && (
                <div className="md:col-span-2">
                  <span className="font-medium">Activated:</span> {new Date(packageDetails.activatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {/* Status Management */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-medium mb-2">Manage Status</h4>
              <div className="flex flex-wrap gap-2">
                <select
                  value={packageDetails.isActive ? 'active' : 'inactive'}
                  onChange={async (e) => {
                    try {
                      const newStatus = e.target.value === 'active';
                      const response = await apiClient.put(`${apiEndpoints.createUpdatePackage}/${packageDetails._id}`, {
                        isActive: newStatus,
                        paymentStatus: newStatus ? 'completed' : 'pending'
                      });
                      
                      if (response.data.success) {
                        alert(`Status changed to ${newStatus ? 'Active' : 'Inactive'} successfully!`);
                        // Refresh package details
                        await fetchPackageDetails();
                        onSuccess && onSuccess();
                      }
                    } catch (error) {
                      console.error('Error updating status:', error);
                      alert('Error updating status. Please try again.');
                    }
                  }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                </select>
                
                <select
                  value={packageDetails.paymentStatus || 'pending'}
                  onChange={async (e) => {
                    try {
                      const response = await apiClient.put(`${apiEndpoints.createUpdatePackage}/${packageDetails._id}`, {
                        paymentStatus: e.target.value
                      });
                      
                      if (response.data.success) {
                        alert(`Payment status changed to ${e.target.value} successfully!`);
                        // Refresh package details
                        await fetchPackageDetails();
                        onSuccess && onSuccess();
                      }
                    } catch (error) {
                      console.error('Error updating payment status:', error);
                      alert('Error updating payment status. Please try again.');
                    }
                  }}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Service Preference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceOptions.map((service) => (
              <div
                key={service.value}
                onClick={() => handleServiceChange(service.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedService === service.value
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <div>
                    <p className="font-medium">{service.label}</p>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Details Form - Only show for paid services */}
        {selectedService && selectedService !== 'free' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Package Details</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="mr-1" />
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Only Online Service */}
                {selectedService === 'only_online' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Only Online Service Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Paying Amount (₹)</label>
                        <input
                          type="number"
                          value={formData.payingAmount}
                          onChange={(e) => handleInputChange('payingAmount', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Visible Contact Numbers</label>
                        <select
                          value={formData.visibleContactNumbers}
                          onChange={(e) => handleInputChange('visibleContactNumbers', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          {contactNumbersOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Validity Days</label>
                        <select
                          value={formData.validityDays}
                          onChange={(e) => handleInputChange('validityDays', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          {validityDaysOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Only Offline Service */}
                {selectedService === 'only_offline' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Only Offline Service Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Registration Fees (₹)</label>
                        <input
                          type="number"
                          value={formData.registrationFees}
                          onChange={(e) => handleInputChange('registrationFees', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter fees"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Goodwill Amount (₹)</label>
                        <input
                          type="number"
                          value={formData.goodwillAmount}
                          onChange={(e) => handleInputChange('goodwillAmount', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Validity Days</label>
                        <select
                          value={formData.validityDays}
                          onChange={(e) => handleInputChange('validityDays', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          {validityDaysOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Online & Offline Service */}
                {selectedService === 'online_offline' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Online & Offline Service Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Online Paying Amount (₹)</label>
                        <input
                          type="number"
                          value={formData.onlinePayingAmount}
                          onChange={(e) => handleInputChange('onlinePayingAmount', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Offline Registration Fees (₹)</label>
                        <input
                          type="number"
                          value={formData.offlineRegistrationFees}
                          onChange={(e) => handleInputChange('offlineRegistrationFees', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter fees"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Offline Goodwill Amount (₹)</label>
                        <input
                          type="number"
                          value={formData.offlineGoodwillAmount}
                          onChange={(e) => handleInputChange('offlineGoodwillAmount', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Combined Validity Days</label>
                        <select
                          value={formData.combinedValidityDays}
                          onChange={(e) => handleInputChange('combinedValidityDays', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          {validityDaysOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Combined Visible Contact Numbers</label>
                        <select
                          value={formData.combinedVisibleContactNumbers}
                          onChange={(e) => handleInputChange('combinedVisibleContactNumbers', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select</option>
                          {contactNumbersOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Visibility Settings - Only for paid services */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Contact Counter</h4>
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Contacts</label>
                    <input
                      type="number"
                      value={contactCounter}
                      onChange={(e) => setContactCounter(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter number of contacts"
                      min="0"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Number of contacts this profile can view
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Click "Edit" to modify package details</p>
              </div>
            )}
          </div>
        )}

        {/* Available Profiles for Contact - Only for paid online services */}
        {selectedService === 'only_online' && availableProfiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Available Profiles for Contact Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                These profiles have paid online service and can view contact details:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableProfiles.slice(0, 6).map((pkg) => (
                  <div key={pkg._id} className="flex items-center p-2 bg-white rounded">
                    <img
                      src={pkg.userId?.image ? `http://localhost:3200/api/uploads/${pkg.userId.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                      alt="Profile"
                      className="w-8 h-8 object-cover rounded-full mr-2"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{pkg.userId?.fullName}</p>
                      <p className="text-gray-600">{pkg.userId?.martialId}</p>
                    </div>
                  </div>
                ))}
              </div>
              {availableProfiles.length > 6 && (
                <p className="text-sm text-gray-600 mt-2">
                  And {availableProfiles.length - 6} more profiles...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {/* Save Package Details Button - for paid services */}
          {isEditing && selectedService !== 'free' && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Package Details'}
            </button>
          )}
          
          {/* Activate Paid Package Button - for free users selecting paid service */}
          {selectedService !== 'free' && (!packageDetails || packageDetails.membershipType === 'free') && (
            <button
              onClick={handleActivate}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Activating...' : 'Activate Paid Package'}
            </button>
          )}
          
          {/* Deactivate Paid Package Button - for paid users */}
          {packageDetails?.membershipType === 'paid' && packageDetails?.isActive && selectedService !== 'free' && (
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Deactivate Package'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePreferenceModal; 