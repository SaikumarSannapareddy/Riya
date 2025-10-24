import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../components/Apis';

const Membership = () => {
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [alertType, setAlertType] = useState('info');
  const bureauId = localStorage.getItem('bureauId');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(
          `${apiEndpoints.bureaudetails}?bureauId=${bureauId}`
        );
        const data = response.data;
        console.log('Membership data:', data);

        if (data.bureauProfiles?.length > 0) {
          const bureauInfo = data.bureauProfiles[0];

          const expiry = bureauInfo.expiryDate
            ? new Date(bureauInfo.expiryDate)
            : null;
          const now = new Date();

          let accountType = 'Free';
          let validityMessage = 'You are in Free account';
          let alert = 'info';

          if (expiry) {
            if (expiry < now) {
              accountType = 'Expired';
              validityMessage =
                'Account expired - turned to free account. Please upgrade your plan.';
              alert = 'danger';
            } else {
              const oneMonthFromNow = new Date();
              oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
              if (expiry <= oneMonthFromNow) {
                accountType = 'Expiring Soon';
                validityMessage = `Your plan will expire soon. Valid until: ${expiry.toLocaleDateString()}`;
                alert = 'warning';
              } else {
                accountType = 'Paid';
                validityMessage = `Paid Member - Valid until: ${expiry.toLocaleDateString()}`;
                alert = 'success';
              }
            }
          }

          setAlertType(alert);

          setMembership({
            bureauName: bureauInfo.bureauName,
            joiningDate: bureauInfo.createdAt,
            expiryDate: bureauInfo.expiryDate,
            accountType,
            validityMessage,
            welcomeBanner: bureauInfo.welcomeImageBanner,
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [bureauId]);

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-400';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center mb-6 border-b pb-3">
          <FaArrowLeft
            className="mr-3 text-gray-600 cursor-pointer hover:text-gray-800 transition"
            size={20}
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold text-gray-800">Membership Plan</h1>
        </div>

        {/* Data Section */}
        {membership ? (
          <div>
          
            <div
              className={`border-l-4 rounded-md p-4 mb-4 ${getAlertColor(alertType)}`}
            >
              <p className="text-sm leading-relaxed font-medium">
                {membership.validityMessage}
              </p>
            </div>

            {/* Only show fields that exist */}
            <div className="space-y-3 text-gray-700">
              {membership.bureauName && (
                <p className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{membership.bureauName}</span>
                </p>
              )}

              {membership.joiningDate && (
                <p className="flex justify-between">
                  <span className="font-medium">Joining Date:</span>
                  <span>{formatDate(membership.joiningDate)}</span>
                </p>
              )}

              {membership.accountType && (
                <p className="flex justify-between">
                  <span className="font-medium">Account Type:</span>
                  <span>{membership.accountType}</span>
                </p>
              )}

              {membership.expiryDate && (
                <p className="flex justify-between">
                  <span className="font-medium">Expiry Date:</span>
                  <span>{formatDate(membership.expiryDate)}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No membership data available.</p>
        )}
      </div>
    </div>
  );
};

export default Membership;
