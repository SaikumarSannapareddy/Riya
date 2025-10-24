// components/Shortlist.js - Fixed version with 404 error handling
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Trash2, Eye, Share2, ChevronLeft, ChevronRight, X, Heart } from 'lucide-react';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import { FaSpinner } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigate } from 'react-router-dom';

// Utility function for age calculation
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

// Remove Confirmation Modal
const RemoveConfirmationModal = React.memo(({ 
  isOpen, 
  onClose, 
  targetUser, 
  onRemove, 
  loading 
}) => {
  const handleConfirm = useCallback(() => {
    onRemove(targetUser._id);
  }, [targetUser, onRemove]);

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Remove from Shortlist</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-6 p-3 bg-red-50 rounded-lg">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img
                src={targetUser.shortlistedUserId?.image ? `${Uploads}${targetUser.shortlistedUserId.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                alt={targetUser.shortlistedUserId?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{targetUser.shortlistedUserId?.fullName}</h3>
              <p className="text-sm text-gray-600">ID: {targetUser.shortlistedUserId?.martialId}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 text-center">
              Are you sure you want to remove <strong>{targetUser.shortlistedUserId?.fullName}</strong> from your shortlist?
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Shortlist Card Component
const ShortlistCard = React.memo(({ shortlistItem, onRemove, onSendInterest }) => {
  const user = shortlistItem.shortlistedUserId;
  const age = useMemo(() => calculateAge(user?.dateOfBirth), [user?.dateOfBirth]);
  
  const profileImage = user?.image 
    ? `${Uploads}${user.image}` 
    : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png";

  const handleRemove = useCallback(() => {
    onRemove(shortlistItem);
  }, [shortlistItem, onRemove]);

  const handleSendInterest = useCallback(() => {
    onSendInterest(user);
  }, [user, onSendInterest]);

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-4 relative mb-4">
      {/* Header with star indicator */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {user.fullName || 'User Name'}
          </h2>
        </div>
        <button
          onClick={handleRemove}
          className="p-2 rounded-full hover:bg-red-50 transition-colors text-red-500"
          aria-label="Remove from shortlist"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="flex items-start space-x-4">
        <div className="flex-1 text-sm text-gray-700 space-y-2">
          <ProfileDetail label="ID" value={user.martialId} />
          <ProfileDetail label="Profile Status" value={user.profileStatus} />
          <ProfileDetail label="Caste" value={user.caste} />
          <ProfileDetail label="Education" value={user.education} />
          <ProfileDetail label="Income" value={user.annualIncome ? `₹${user.annualIncome}` : null} />
          <ProfileDetail label="Work" value={user.occupation} />
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-xs font-semibold mb-1 text-center">
            {age !== 'N/A' ? `${age} yrs` : 'N/A'} / {user.height || 'Height'}
          </div>
          <div className="w-28 h-36 rounded-md overflow-hidden bg-gray-100">
            <img 
              src={profileImage}
              alt={`${user.fullName || 'User'}'s profile`}
              className="object-cover w-full h-full" 
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png";
              }}
            />
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="flex justify-around text-xs text-gray-600 pt-2">
        <ActionButton icon={Eye} label="View More" color="text-blue-500" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-green-500">{user.views || 0}</span>
          <span>Views</span>
        </div>
        <button
          onClick={handleSendInterest}
          className="flex flex-col items-center hover:opacity-75 transition-opacity"
        >
          <Heart className="w-5 h-5 mb-1 text-pink-500" />
          <span>Send Interest</span>
        </button>
        <ActionButton icon={Share2} label="Share" color="text-purple-500" />
      </div>

      {/* Added to shortlist date */}
      <div className="text-xs text-gray-500 text-center">
        Added on {new Date(shortlistItem.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
});

// Helper Components
const ProfileDetail = React.memo(({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span> {value || '-'}
  </div>
));

const ActionButton = React.memo(({ icon: Icon, label, color }) => (
  <button className="flex flex-col items-center hover:opacity-75 transition-opacity">
    <Icon className={`w-5 h-5 mb-1 ${color}`} />
    <span>{label}</span>
  </button>
));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <FaSpinner className="animate-spin text-2xl text-yellow-500" />
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-2xl shadow-md p-8 text-center">
    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Shortlisted Profiles</h3>
    <p className="text-gray-500">You haven't shortlisted any profiles yet.</p>
  </div>
);

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, loading }) => (
  <div className="flex justify-center items-center space-x-2 py-4 bg-white rounded-lg shadow-sm">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    
    <span className="px-4 py-2 text-sm font-medium">
      {currentPage} / {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || loading}
      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
));

const SuccessToast = React.memo(({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
      <Heart className="w-4 h-4" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

// Main Shortlist Component
const Shortlist = () => {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [successToast, setSuccessToast] = useState({ show: false, message: '' });
  
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  const fetchShortlist = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!token || !userData._id) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // FIX 1: Ensure proper endpoint construction
      let endpoint;
      if (apiEndpoints2.getShortlist) {
        // If full URL is provided
        endpoint = apiEndpoints2.getShortlist.includes('http') 
          ? `${apiEndpoints2.getShortlist}/${userData._id}?page=${page}&limit=${ITEMS_PER_PAGE}`
          : `${apiEndpoints2.getShortlist}/${userData._id}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      } else {
        // Fallback endpoint
        endpoint = `/api/shortlist/list/${userData._id}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      }

      console.log('Fetching shortlist from:', endpoint); // Debug log
      
      const response = await apiClient2.get(endpoint, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (response.data.success) {
        setShortlist(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(response.data.message || 'Failed to fetch shortlist');
      }
    } catch (error) {
      console.error('Error fetching shortlist:', error);
      
      // FIX 2: Better error handling for 404s
      if (error.response?.status === 404) {
        setError('Shortlist endpoint not found. Please check your API configuration.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.clear();
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this resource.');
      } else {
        setError(error.response?.data?.message || 'Failed to load shortlist. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleRemove = useCallback((shortlistItem) => {
    setSelectedItem(shortlistItem);
    setShowRemoveModal(true);
  }, []);

  const confirmRemove = useCallback(async (shortlistedUserId) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!apiEndpoints2.removeFromShortlist) {
      setError('Remove shortlist endpoint not configured');
      return;
    }

    try {
      setRemoving(true);
      
      // FIX 3: Ensure proper endpoint for remove
      console.log('Removing from shortlist via:', apiEndpoints2.removeFromShortlist); // Debug log
      
      const response = await apiClient2.delete(
        apiEndpoints2.removeFromShortlist,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            userId: userData._id,
            shortListedId: shortlistedUserId
          }
        }
      );

      if (response.data.success) {
        setShortlist(prev => prev.filter(item => 
          item.shortlistedUserId._id !== shortlistedUserId
        ));
        setShowRemoveModal(false);
        setSelectedItem(null);
        setSuccessToast({ 
          show: true, 
          message: 'Removed from shortlist successfully!' 
        });
      } else {
        throw new Error(response.data.message || 'Failed to remove from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      
      // FIX 4: Better error handling for remove operation
      if (error.response?.status === 404) {
        setError('Remove shortlist endpoint not found. Please check your API configuration.');
      } else {
        setError(error.response?.data?.message || 'Failed to remove from shortlist. Please try again.');
      }
    } finally {
      setRemoving(false);
    }
  }, []);

  const handleSendInterest = useCallback(async (targetUser) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!apiEndpoints2.sendInterest) {
      setError('Send interest endpoint not configured');
      return;
    }

    try {
      const payload = {
        senderUserId: userData._id,
        targetUserId: targetUser._id,
        status: 'pending'
      };

      console.log('Sending interest via:', apiEndpoints2.sendInterest); // Debug log

      const response = await apiClient2.post(
        apiEndpoints2.sendInterest,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccessToast({ 
          show: true, 
          message: 'Interest sent successfully!' 
        });
      } else {
        throw new Error(response.data.message || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      
      // FIX 5: Better error handling for send interest
      if (error.response?.status === 404) {
        setError('Send interest endpoint not found. Please check your API configuration.');
      } else {
        setError(error.response?.data?.message || 'Failed to send interest. Please try again.');
      }
    }
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      fetchShortlist(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, loading, fetchShortlist]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchShortlist();
  }, [navigate, fetchShortlist]);

  if (loading && shortlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-sm mx-auto my-12 mt-30">
          <LoadingSpinner />
        </div>
        <BottomNavbar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-sm mx-auto my-12 mt-30">
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <div className="text-red-500 mb-4">
              <X className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Error</p>
            </div>
            <p className="text-red-600 mb-4 text-sm">{error}</p>
            <button
              onClick={() => fetchShortlist(currentPage)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-sm mx-auto my-12 mt-30 space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h1 className="text-xl font-semibold text-gray-800">My Shortlist</h1>
          </div>
          <p className="text-sm text-gray-600">
            {shortlist.length} {shortlist.length === 1 ? 'profile' : 'profiles'} shortlisted
          </p>
        </div>

        <div className="mb-32">
          {shortlist.length === 0 ? (
            <EmptyState />
          ) : (
            shortlist.map((item) => (
              <ShortlistCard
                key={item._id}
                shortlistItem={item}
                onRemove={handleRemove}
                onSendInterest={handleSendInterest}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>

      {/* Remove Confirmation Modal */}
      <RemoveConfirmationModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedItem(null);
        }}
        targetUser={selectedItem}
        onRemove={confirmRemove}
        loading={removing}
      />

      {/* Success Toast */}
      <SuccessToast
        message={successToast.message}
        isVisible={successToast.show}
        onClose={() => setSuccessToast({ show: false, message: '' })}
      />

      <BottomNavbar />
    </>
  );
};

export default Shortlist;