import React, { useState, useEffect } from 'react';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from './Apis1';

const Edit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const steps = [
    { id: 1, title: 'Step 1 : Profile Picture', key: 'step1' },
    { id: 2, title: 'Step 2 : Personal Details 2', key: 'step2' },
    { id: 3, title: 'Step 3 : Religion & caste', key: 'step3' },
    { id: 4, title: 'Step 4 : Education Details', key: 'step4' },
    { id: 5, title: 'Step 5 : Family Details', key: 'step5' },
    { id: 6, title: 'Step 6 : Property Details', key: 'step6' },
    { id: 7, title: 'Step 7 : Agriculture Flat Details', key: 'step7' },
    { id: 8, title: 'Step 8 : Location Details', key: 'step8' },
    { id: 9, title: 'Step 9 : Partner Preferences', key: 'step9' },
    { id: 10, title: 'Step 10 : Edit Gallery', key: 'gallery' },
  ];

  const userId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.user}/${userId}`);
        if (response.headers['content-type'].includes('application/json')) {
          setProfile(response.data);
        } else {
          setError('Expected JSON response, but got something else.');
        }
      } catch (err) {
        setError('Error fetching profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleNavigation = (stepId) => {
    if (profile?._id) {
      navigate(`/step_${stepId}_edit/${profile._id}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Header with Back Button */}
          <div className="mb-8">
            <div className="flex items-center mb-4 fixed top-0 bg-white w-full py-5">
              <FaArrowLeft
                className="mr-2 text-gray-600 cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-2xl font-semibold">Edit Form</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 mb-6 mt-16">
              <div className="flex-1">
                <label className="block text-lg font-semibold mb-2">
                  MaritalID: {profile?.martialId || 'Loading...'}
                </label>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto mb-4">
              <button
                className="w-full flex items-center justify-between p-4 rounded-lg shadow-md text-lg font-semibold hover:opacity-90 bg-blue-600 text-white"
                onClick={() => navigate(`/user-register-edit/${profile?._id}`)}
              >
                <span>Edit Mobile, Email & Password</span>
                <FaEdit />
              </button>
            </div>
          {/* Step Buttons */}
          <div className="flex flex-wrap gap-6">
            {steps.map((step) => {
              const isPending = profile?.[step.key] === 0 || profile?.[step.key] == null;
              return (
                <div key={step.id} className="w-full sm:w-auto mb-4">
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-lg shadow-md text-lg font-semibold hover:opacity-90 ${
                      isPending ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white'
                    }`}
                    onClick={() => handleNavigation(step.id)}
                  >
                    <span>{step.title}</span>
                    {isPending && <span className="text-xs ml-2">(Pending)</span>}
                    <FaEdit />
                  </button>
                </div>
              );
            })}
            {/* New Edit Details Button */}
          
          </div>
        </>
      )}
    </div>
  );
};

export default Edit;
