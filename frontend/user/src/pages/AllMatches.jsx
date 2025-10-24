import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Eye, Share2, MoreVertical, Heart, ChevronLeft, ChevronRight, X, Send, Star, MapPin, GraduationCap, Briefcase, Calendar, Users, LayoutGrid, List as ListIcon } from 'lucide-react';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import { FaSpinner, FaStar, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaRulerVertical, FaHeart, FaEye } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import { useNavigate } from 'react-router-dom';

// Utility function moved outside component to prevent recreation
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

// Send Interest Modal Component
const SendInterestModal = React.memo(({ 
  isOpen, 
  onClose, 
  targetUser, 
  onSendInterest, 
  loading 
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSendInterest({
      targetUserId: targetUser._id
    });
  }, [targetUser, onSendInterest]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Send Interest</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Target User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 ring-4 ring-white shadow-lg">
              <img
                src={targetUser.image ? `${Uploads}${targetUser.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                alt={targetUser.fullName}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{targetUser.fullName}</h3>
              <p className="text-sm text-gray-600">ID: {targetUser.martialId}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {calculateAge(targetUser.dateOfBirth)} years
                </span>
                {targetUser.height && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {targetUser.height} ft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="mb-6 text-center">
            <p className="text-gray-700">
              Are you sure you want to send interest to <strong className="text-pink-600">{targetUser.fullName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">They will be notified of your interest</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !targetUser._id}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Send Interest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Shortlist Modal Component
const ShortlistModal = React.memo(({ 
  isOpen, 
  onClose, 
  targetUser, 
  onAddToShortlist, 
  loading 
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onAddToShortlist({
      targetUserId: targetUser._id
    });
  }, [targetUser, onAddToShortlist]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !targetUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add to Shortlist</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Target User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-100 to-amber-100 ring-4 ring-white shadow-lg">
              <img
                src={targetUser.image ? `${Uploads}${targetUser.image}` : "https://cdn-icons-png.freepik.com/512/147/147144.png"}
                alt={targetUser.fullName}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">{targetUser.fullName}</h3>
              <p className="text-sm text-gray-600">ID: {targetUser.martialId}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {calculateAge(targetUser.dateOfBirth)} years
                </span>
                {targetUser.height && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {targetUser.height} ft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="mb-6 text-center">
            <p className="text-gray-700">
              Are you sure you want to add <strong className="text-yellow-600">{targetUser.fullName}</strong> to your shortlist?
            </p>
            <p className="text-sm text-gray-500 mt-2">You can view shortlisted profiles later</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !targetUser._id}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  <span>Add to Shortlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Modern Profile Card Component
const ProfileCard = React.memo(({ match, onMenuToggle, isMenuOpen, onAction, onViewMore, viewMode }) => {
  const age = useMemo(() => calculateAge(match.dateOfBirth), [match.dateOfBirth]);
  const profileImage = match.image 
    ? `${Uploads}${match.image}` 
    : "https://cdn-icons-png.freepik.com/512/147/147144.png";

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    onMenuToggle(match._id);
  }, [match._id, onMenuToggle]);

  const handleActionClick = useCallback((action) => {
    onAction(match._id, action, match);
  }, [match._id, match, onAction]);

  const handleViewMore = useCallback(() => {
    onViewMore(match._id);
  }, [match._id, onViewMore]);

  const shareProfile = useCallback(() => {
    const shareUrl = `${window.location.origin}/profile_view/${match._id}`;
    const shareData = { title: match.fullName || 'Profile', text: 'Check out this profile', url: shareUrl };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      alert('Profile link copied to clipboard');
    }
  }, [match._id, match.fullName]);

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
        {/* Image on top */}
        <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200">
          <img src={profileImage} alt={`${match.fullName || 'User'}'s profile`} className="w-full h-full object-fill" loading="lazy" onError={(e) => { e.target.src = 'https://cdn-icons-png.freepik.com/512/147/147144.png'; }} />
          <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow" />
          {/* Menu top-right */}
          <div className="absolute top-2 right-2" data-menu>
            <button onClick={handleMenuClick} className="p-2 rounded-full bg-white/90 hover:bg-white border border-gray-200 shadow-sm" aria-label="More options">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-10">
                <button onClick={() => handleActionClick('shortlist')} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-yellow-50 transition-colors">
                  <Star className="w-4 h-4 mr-3 text-yellow-500" />
                  Add to Shortlist
                </button>
                <button onClick={shareProfile} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors">
                  <Share2 className="w-4 h-4 mr-3 text-blue-500" />
                  Share
                </button>
                <button onClick={() => handleActionClick('block')} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition-colors">
                  <span className="mr-3">🚫</span> Block
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-800 truncate">{match.fullName || 'User Name'}</h3>
            <div className="flex items-center space-x-2">
              <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold">{age !== 'N/A' ? `${age} yrs` : 'N/A'}</span>
              {match.height && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{match.height} ft</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>ID: {match.martialId}</span>
            <span className={`px-2 py-0.5 rounded-full font-semibold ${match.profileStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{match.profileStatus || 'Active'}</span>
          </div>
          {match.caste && (
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{match.caste}</span>
            </div>
          )}
          {match.education && (
            <div className="flex items-center space-x-2 text-sm">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 truncate">{match.education}</span>
            </div>
          )}
          {match.occupation && (
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 truncate">{match.occupation}</span>
            </div>
          )}
          {match.annualIncome && (
            <div className="text-sm text-green-600 font-semibold">₹{match.annualIncome}</div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
            <button onClick={handleViewMore} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm">
              <Eye className="w-4 h-4" />
              <span>View More</span>
            </button>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <FaEye className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-700">{match.views || 0}</span>
            </div>
            <button onClick={() => handleActionClick('interest')} className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center space-x-2 text-sm">
              <Heart className="w-4 h-4" />
              <span>Send Interest</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-4">
        {/* Row 1: Name left, Age/Height + menu right */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-gray-800 truncate">{match.fullName || 'User Name'}</h3>
          <div className="flex items-center space-x-2">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">{age !== 'N/A' ? `${age} yrs` : 'N/A'}</span>
            {match.height && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">{match.height} ft</span>
            )}
            <div className="relative" data-menu>
              <button onClick={handleMenuClick} className="p-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm" aria-label="More options">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-10">
                  <button onClick={() => handleActionClick('shortlist')} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-yellow-50 transition-colors">
                    <Star className="w-4 h-4 mr-3 text-yellow-500" />
                    Add to Shortlist
                  </button>
                  <button onClick={shareProfile} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors">
                    <Share2 className="w-4 h-4 mr-3 text-blue-500" />
                    Share
                  </button>
                  <button onClick={() => handleActionClick('block')} className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition-colors">
                    <span className="mr-3">🚫</span> Block
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Image left, Details right (horizontal flex) */}
        <div className="mt-3 flex items-stretch gap-4">
          {/* Left: Image */}
          <div className="relative flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img src={profileImage} alt={`${match.fullName || 'User'}'s profile`} className="w-full h-full object-fill" loading="lazy" onError={(e) => { e.target.src = 'https://cdn-icons-png.freepik.com/512/147/147144.png'; }} />
            <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow" />
          </div>

          {/* Right: Details */}
          <div className="flex-1 space-y-2 text-sm min-w-0">
            <div className="flex items-center justify-between text-gray-600">
              <span>ID: {match.martialId}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${match.profileStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{match.profileStatus || 'Active'}</span>
            </div>
            {match.caste && (
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{match.caste}</span>
              </div>
            )}
            {match.education && (
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 truncate">{match.education}</span>
              </div>
            )}
            {match.occupation && (
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 truncate">{match.occupation}</span>
              </div>
            )}
            {match.annualIncome && (
              <div className="flex items-center space-x-3">
                <span className="text-green-600 font-semibold">₹{match.annualIncome}</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Footer buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <button onClick={handleViewMore} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold">
            <Eye className="w-4 h-4" />
            <span>View More</span>
          </button>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <FaEye className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-700">{match.views || 0}</span>
          </div>
          <button onClick={() => handleActionClick('interest')} className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Send Interest</span>
          </button>
        </div>
      </div>
    </div>
  );
});

// Modern Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange, loading }) => (
  <div className="flex justify-center items-center space-x-3 py-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
      className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:hover:bg-white disabled:cursor-not-allowed"
      aria-label="Previous page"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
    
    <div className="flex items-center space-x-2">
      <span className="px-4 py-2 text-lg font-bold text-gray-800">
        {currentPage}
      </span>
      <span className="text-gray-400">of</span>
      <span className="px-4 py-2 text-lg font-bold text-gray-600">
        {totalPages}
      </span>
    </div>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || loading}
      className="p-3 rounded-xl border-2 border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:hover:bg-white disabled:cursor-not-allowed"
      aria-label="Next page"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
));

// Modern Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4 mx-auto" />
      <p className="text-lg text-gray-700 text-center">Loading matches...</p>
    </div>
  </div>
);

// Modern Progress Header Component
const ProgressHeader = React.memo(({ totalMatches, currentPage, totalPages, title, subtitle }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 mb-6 border border-blue-100">
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
    
    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
      <span className="font-semibold">Total: {totalMatches.toLocaleString()} matches</span>
      <span className="font-semibold">Page {currentPage} of {totalPages}</span>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden" 
        style={{ width: `${(currentPage / totalPages) * 100}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  </div>
));

// Success Toast Component
const SuccessToast = React.memo(({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-yellow-500';
  const Icon = type === 'success' ? Heart : Star;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 animate-in slide-in-from-right-2`}>
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75 transition-opacity">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

const AllMatches = () => {
  const [menuOpen, setMenuOpen] = useState({});
  const [viewMode, setViewMode] = useState('list');
  const [matches, setMatches] = useState([]);
  const [otherBureauMatches, setOtherBureauMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherBureauLoading, setOtherBureauLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [otherBureauPage, setOtherBureauPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [otherBureauTotalPages, setOtherBureauTotalPages] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [otherBureauTotalMatches, setOtherBureauTotalMatches] = useState(0);
  const [error, setError] = useState(null);
  const [otherBureauError, setOtherBureauError] = useState(null);
  
  // Send Interest Modal states
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendingInterest, setSendingInterest] = useState(false);
  
  // Shortlist Modal states
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [shortlistingUser, setShortlistingUser] = useState(false);
  
  const [successToast, setSuccessToast] = useState({ show: false, message: '', type: 'success' });
  
  const navigate = useNavigate();
  const topRef = useRef(null);
  const ITEMS_PER_PAGE = 50;

  // Memoized callbacks to prevent unnecessary re-renders
  const toggleMenu = useCallback((userId) => {
    setMenuOpen(prev => ({ 
      ...prev, 
      [userId]: !prev[userId] 
    }));
  }, []);

  const handleAction = useCallback((userId, action, userData) => {
    console.log(`Action ${action} for user ${userId}`);
    
    if (action === 'interest') {
      setSelectedUser(userData);
      setShowInterestModal(true);
    } else if (action === 'shortlist') {
      setSelectedUser(userData);
      setShowShortlistModal(true);
    } else if (action === 'block') {
      // Implement block logic
      console.log('Blocking user:', userId);
    }
    
    setMenuOpen({}); // Close menu after action
  }, []);

  // Function to increment views when "View More" is clicked
  const handleViewMore = useCallback(async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await apiClient2.post(
        `${apiEndpoints2.incrementViews}/${userId}/increment-views`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the views count in the local state
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match._id === userId 
            ? { ...match, views: (match.views || 0) + 1 }
            : match
        )
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, []);

  const handleSendInterest = useCallback(async (interestData) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!token || !userData._id) {
      setError('Authentication required');
      return;
    }

    try {
      setSendingInterest(true);
      
      const payload = {
        senderUserId: userData._id,
        targetUserId: interestData.targetUserId,
        status: 'pending'
      };

      const response = await apiClient2.post(
        apiEndpoints2.sendInterest,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowInterestModal(false);
        setSelectedUser(null);
        setSuccessToast({ 
          show: true, 
          message: 'Interest sent successfully!',
          type: 'success'
        });
      } else {
        throw new Error(response.data.message || 'Failed to send interest');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      setError(error.response?.data?.message || 'Failed to send interest. Please try again.');
    } finally {
      setSendingInterest(false);
    }
  }, []);

  const handleAddToShortlist = useCallback(async (shortlistData) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!token || !userData._id) {
      setError('Authentication required');
      return;
    }

    try {
      setShortlistingUser(true);
      
      const payload = {
        userId: userData._id,
        shortlistedUserId: shortlistData.targetUserId,
        status: 'active'
      };

      // You may need to add the shortlist endpoint to your apiEndpoints2
      // For now, I'm assuming the endpoint exists
      const response = await apiClient2.post(
        apiEndpoints2.addToShortlist || '/api/shortlist/add',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowShortlistModal(false);
        setSelectedUser(null);
        setSuccessToast({ 
          show: true, 
          message: 'Added to shortlist successfully!',
          type: 'shortlist'
        });
      } else {
        throw new Error(response.data.message || 'Failed to add to shortlist');
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      setError(error.response?.data?.message || 'Failed to add to shortlist. Please try again.');
    } finally {
      setShortlistingUser(false);
    }
  }, []);

  const fetchMatches = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const bureauId = localStorage.getItem('bureauId') || userData.bureauId;

    if (!token || !userData.gender || !bureauId) {
      setError('Missing required authentication data');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient2.get(
        `${apiEndpoints2.userDataOnGender}?gender=${userData.gender}&bureauId=${bureauId}&page=${page}&limit=${ITEMS_PER_PAGE}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMatches(response.data.users || []);
        setTotalMatches(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
        setCurrentPage(page);
        
        // Scroll to top after data is loaded
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        setError('Failed to fetch matches');
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches. Please try again.');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchOtherBureauMatches = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const bureauId = localStorage.getItem('bureauId') || userData.bureauId;

    if (!token || !userData.gender || !bureauId) {
      setOtherBureauError('Missing required authentication data');
      setOtherBureauLoading(false);
      return;
    }

    try {
      setOtherBureauLoading(true);
      setOtherBureauError(null);
      
      const response = await apiClient2.get(
        `${apiEndpoints2.userDataonGenderexeptbureau}?gender=${userData.gender}&bureauId=${bureauId}&page=${page}&limit=${ITEMS_PER_PAGE}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOtherBureauMatches(response.data.users || []);
        setOtherBureauTotalMatches(response.data.total || 0);
        setOtherBureauTotalPages(Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
        setOtherBureauPage(page);
      } else {
        setOtherBureauError('Failed to fetch other bureau matches');
      }
    } catch (error) {
      console.error('Error fetching other bureau matches:', error);
      setOtherBureauError('Failed to load other bureau matches. Please try again.');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setOtherBureauLoading(false);
    }
  }, [navigate]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      fetchMatches(newPage);
    }
  }, [currentPage, totalPages, loading, fetchMatches]);

  const handleOtherBureauPageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= otherBureauTotalPages && newPage !== otherBureauPage && !otherBureauLoading) {
      fetchOtherBureauMatches(newPage);
    }
  }, [otherBureauPage, otherBureauTotalPages, otherBureauLoading, fetchOtherBureauMatches]);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-menu]')) {
        setMenuOpen({});
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Initial data fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMatches();
    fetchOtherBureauMatches();
  }, [navigate, fetchMatches, fetchOtherBureauMatches]);

  // Loading state
  if (loading && matches.length === 0) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
        <BottomNavbar />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-sm mx-auto my-12 mt-30">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchMatches(currentPage)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
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
      <div ref={topRef} className="max-w-4xl mx-auto my-12 mt-30 space-y-8 px-2">
        {/* Same Bureau Matches Section */}
        <div className="bg-white rounded-3xl shadow-xl p-1 border border-gray-100">
          {/* View mode toggle */}
          <div className="flex justify-end mb-2">
            <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                className={`px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm transition ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                className={`ml-1 px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm transition ${viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          <ProgressHeader 
            totalMatches={totalMatches}
            currentPage={currentPage}
            totalPages={totalPages}
            title="My Bureau Matches"
            subtitle="Find your perfect match from your bureau"
          />

          <div className='mb-6'>
            {loading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchMatches(currentPage)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg mb-2">No matches found in your bureau</p>
                <p className="text-gray-500">Try adjusting your preferences to see more profiles</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}>
                {matches.map((match) => (
                  <ProfileCard
                    key={match._id}
                    match={match}
                    onMenuToggle={toggleMenu}
                    isMenuOpen={menuOpen[match._id] || false}
                    onAction={handleAction}
                    onViewMore={handleViewMore}
                    viewMode={viewMode}
                  />
                ))}
              </div>
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

        {/* Other Bureau Matches Section */}
        <div className="bg-white rounded-3xl shadow-xl p-1 border border-gray-100">
          {/* View mode toggle (other bureau) */}
          <div className="flex justify-end mb-2">
            <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                className={`px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm transition ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                className={`ml-1 px-4 py-1.5 rounded-full flex items-center space-x-2 text-sm transition ${viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          <ProgressHeader 
            totalMatches={otherBureauTotalMatches}
            currentPage={otherBureauPage}
            totalPages={otherBureauTotalPages}
            title="Other Bureau Matches"
            subtitle="Explore profiles from other bureaus"
          />

          <div className='mb-6'>
            {otherBureauLoading ? (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-3xl text-purple-500" />
              </div>
            ) : otherBureauError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{otherBureauError}</p>
                <button
                  onClick={() => fetchOtherBureauMatches(otherBureauPage)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : otherBureauMatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg mb-2">No matches found from other bureaus</p>
                <p className="text-gray-500">Try adjusting your preferences to see more profiles</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`}>
                {otherBureauMatches.map((match) => (
                  <ProfileCard
                    key={match._id}
                    match={match}
                    onMenuToggle={toggleMenu}
                    isMenuOpen={menuOpen[match._id] || false}
                    onAction={handleAction}
                    onViewMore={handleViewMore}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>

          {otherBureauTotalPages > 1 && (
            <Pagination
              currentPage={otherBureauPage}
              totalPages={otherBureauTotalPages}
              onPageChange={handleOtherBureauPageChange}
              loading={otherBureauLoading}
            />
          )}
        </div>
      </div>

      {/* Send Interest Modal */}
      <SendInterestModal
        isOpen={showInterestModal}
        onClose={() => {
          setShowInterestModal(false);
          setSelectedUser(null);
        }}
        targetUser={selectedUser}
        onSendInterest={handleSendInterest}
        loading={sendingInterest}
      />

      {/* Shortlist Modal */}
      <ShortlistModal
        isOpen={showShortlistModal}
        onClose={() => {
          setShowShortlistModal(false);
          setSelectedUser(null);
        }}
        targetUser={selectedUser}
        onAddToShortlist={handleAddToShortlist}
        loading={shortlistingUser}
      />

      {/* Success Toast */}
      <SuccessToast
        message={successToast.message}
        isVisible={successToast.show}
        type={successToast.type}
        onClose={() => setSuccessToast({ show: false, message: '', type: 'success' })}
      />

      <BottomNavbar />
    </>
  );
};

export default AllMatches;