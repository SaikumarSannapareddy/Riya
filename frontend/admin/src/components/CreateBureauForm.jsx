import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Navbar from "./Navbar";
import apiClient, { apiEndpoints } from "./Apis";

const CreateBureauForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bureauName: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    password: "",
    about: "",
    location: "",
    distributorId: 48, // Default distributor ID as requested
  });
  
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [existingBureaus, setExistingBureaus] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBureau, setCreatedBureau] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch existing bureaus to check for duplicates
  useEffect(() => {
    if (showForm) {
      fetchExistingBureaus();
    }
  }, [showForm]);

  const fetchExistingBureaus = async () => {
    try {
      const response = await apiClient.get(apiEndpoints.BureauManage);
      if (response.data.bureauProfiles) {
        setExistingBureaus(response.data.bureauProfiles);
      }
    } catch (error) {
      console.error("Error fetching existing bureaus:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const checkDuplicates = () => {
    const existingMobile = existingBureaus.find(
      bureau => bureau.mobileNumber === formData.mobileNumber
    );
    
    const existingEmail = existingBureaus.find(
      bureau => bureau.email === formData.email
    );

    if (existingMobile) {
      alert("Mobile number already exists! Please use a different mobile number.");
      return false;
    }

    if (existingEmail) {
      alert("Email already exists! Please use a different email address.");
      return false;
    }

    return true;
  };

  const takeScreenshot = () => {
    // Create a canvas element to capture the modal content
    const modalContent = document.getElementById('success-modal-content');
    if (!modalContent) return;

    // Use html2canvas to capture the modal
    import('html2canvas').then(html2canvas => {
      html2canvas.default(modalContent).then(canvas => {
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bureau-login-details-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      });
    }).catch(err => {
      console.error('Error taking screenshot:', err);
      alert('Screenshot feature not available. Please manually save the details.');
    });
  };

  const handleLogin = () => {
    window.location.href = "https://matrimonystudio.in/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for duplicates before submitting
    if (!checkDuplicates()) {
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();
      
      // Append form fields that match backend expectations
      formDataObj.append('bureauName', formData.bureauName);
      formDataObj.append('ownerName', formData.ownerName);
      formDataObj.append('mobileNumber', formData.mobileNumber);
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('about', formData.about);
      formDataObj.append('location', formData.location);
      formDataObj.append('distributorId', formData.distributorId);

      const response = await apiClient.post(apiEndpoints.CreateBureau, formDataObj);
      if (response.status === 201) {
        // Store the created bureau details
        setCreatedBureau({
          bureauId: response.data.bureauId || 'Generated ID',
          mobileNumber: formData.mobileNumber,
          password: formData.password,
          bureauName: formData.bureauName
        });
        setShowSuccessModal(true);
      } else {
        alert(response.data?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Do you want to start a new matrimony business?</h1>
              <p className="text-lg text-gray-600 mb-8">Create your own matrimony bureau and start helping people find their perfect match.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Matrimony Bureau
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-700">Create Bureau</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ← Back
              </button>
            </div>
            
            {loading && <Loader />}
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Enter Matrimony Business Name *</label>
                  <input 
                    type="text" 
                    name="bureauName" 
                    placeholder="Enter bureau name" 
                    value={formData.bureauName} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Owner Name *</label>
                  <input 
                    type="text" 
                    name="ownerName" 
                    placeholder="Enter owner name" 
                    value={formData.ownerName} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
                  <input 
                    type="tel" 
                    name="mobileNumber" 
                    placeholder="Enter mobile number" 
                    value={formData.mobileNumber} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter email address" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password *</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Create a secure password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location *</label>
                  <textarea 
                    name="location" 
                    placeholder="Enter bureau location details" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">About Bureau *</label>
                <textarea 
                  name="about" 
                  placeholder="Describe your bureau services and specialties" 
                  value={formData.about} 
                  onChange={handleChange} 
                  required 
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                ></textarea>
              </div>

              <div className="mt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Creating Bureau..." : "Create Matrimony Business App"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" id="success-modal-content">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Your Matrimony Business App Successfully Created!
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Login Details:</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Bureau ID:</span> <span className="text-gray-600">{createdBureau?.bureauId}</span></div>
                  <div><span className="font-medium">Mobile Number:</span> <span className="text-gray-600">{createdBureau?.mobileNumber}</span></div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Password:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">
                        {showPassword ? createdBureau?.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                      >
                        {showPassword ? '🙈 Hide' : '👁️ Show'}
                      </button>
                    </div>
                  </div>
                  <div><span className="font-medium">Bureau Name:</span> <span className="text-gray-600">{createdBureau?.bureauName}</span></div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={takeScreenshot}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  📸 Take Screenshot of Login Details
                </button>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  🚀 Login to Dashboard
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBureauForm; 