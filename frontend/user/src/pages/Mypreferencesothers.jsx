import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Eye, Share2, MoreVertical, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import { FaSpinner } from 'react-icons/fa';
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

// Memoized ProfileCard component to prevent unnecessary re-renders
const ProfileCard = React.memo(({ match, onMenuToggle, isMenuOpen, onAction, onViewMore }) => {
  const age = useMemo(() => calculateAge(match.dateOfBirth), [match.dateOfBirth]);
  const profileImage = match.image 
    ? `${Uploads}${match.image}` 
    : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png";

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    onMenuToggle(match._id);
  }, [match._id, onMenuToggle]);

  const handleActionClick = useCallback((action) => {
    onAction(match._id, action);
  }, [match._id, onAction]);

  const handleViewMore = useCallback(() => {
    onViewMore(match._id);
  }, [match._id, onViewMore]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-4 relative mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate pr-2">
          {match.fullName || 'User Name'}
        </h2>
        <div className="flex items-center space-x-2">
          {/* Match Percentage Badge */}
          <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            {match.matchPercentage || 0}% Match
          </div>
          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-10">
                <button 
                  onClick={() => handleActionClick('interest')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  Send Interest
                </button>
                <button 
                  onClick={() => handleActionClick('shortlist')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  ⭐ Shortlist
                </button>
                <button 
                  onClick={() => handleActionClick('block')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  🚫 Block
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-200" />

      <div className="flex items-start space-x-4">
        <div className="flex-1 text-sm text-gray-700 space-y-2">
          <ProfileDetail label="ID" value={match.martialId} />
          <ProfileDetail label="Profile Status" value={match.profileStatus} />
          <ProfileDetail label="Caste" value={match.caste} />
          <ProfileDetail label="Education" value={match.education} />
          <ProfileDetail label="Income" value={match.annualIncome ? `₹${match.annualIncome}` : null} />
          <ProfileDetail label="Work" value={match.occupation} />
          <ProfileDetail label="Location" value={match.district || match.jobLocation} />
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-xs font-semibold mb-1 text-center">
            {age !== 'N/A' ? `${age} yrs` : 'N/A'} / {match.height || 'Height'}
          </div>
          <div className="w-28 h-36 rounded-md overflow-hidden bg-gray-100">
            <img 
              src={profileImage}
              alt={`${match.fullName || 'User'}'s profile`}
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
        <button 
          onClick={handleViewMore}
          className="flex flex-col items-center hover:opacity-75 transition-opacity"
        >
          <Eye className="w-5 h-5 mb-1 text-blue-500" />
          <span>View More</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-green-500">{match.views || 0}</span>
          <span>Views</span>
        </div>
        <button className="flex flex-col items-center hover:opacity-75 transition-opacity">
          <Share2 className="w-5 h-5 mb-1 text-purple-500" />
          <span>Share</span>
        </button>
      </div>

      {/* Match Details - Debug Info (can be removed in production) */}
      {match.matchedCriteria && match.totalCriteria && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
          Matched: {match.matchedCriteria}/{match.totalCriteria} criteria
        </div>
      )}
    </div>
  );
});

// Helper component for profile details
const ProfileDetail = React.memo(({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span> {value || '-'}
  </div>
));

// Helper component for action buttons
const ActionButton = React.memo(({ icon: Icon, label, color }) => (
  <button className="flex flex-col items-center hover:opacity-75 transition-opacity">
    <Icon className={`w-5 h-5 mb-1 ${color}`} />
    <span>{label}</span>
  </button>
));

// Memoized Pagination component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange, loading }) => (
  <div className="flex justify-center items-center space-x-2 py-4 bg-white rounded-lg shadow-sm">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:hover:bg-white"
      aria-label="Previous page"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    
    <span className="px-4 py-2 text-sm font-medium">
      {currentPage} / {totalPages}
    </span>
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || loading}
      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:hover:bg-white"
      aria-label="Next page"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <FaSpinner className="animate-spin text-2xl text-blue-500" />
  </div>
);

// Progress header component
const ProgressHeader = React.memo(({ totalMatches, currentPage, totalPages }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 text-center mb-4">
    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
      <span>Total: {totalMatches.toLocaleString()} matches</span>
      <span>Page {currentPage} of {totalPages}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${(currentPage / totalPages) * 100}%` }}
      />
    </div>
    <div className="text-xs text-gray-500 mt-2">
      Showing profiles with 50%+ compatibility
    </div>
  </div>
));

const AllMatches = () => {
  const [menuOpen, setMenuOpen] = useState({});
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [error, setError] = useState(null);
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

  const handleAction = useCallback((userId, action) => {
    console.log(`Action ${action} for user ${userId}`);
    // Implement your action logic here
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

  const fetchMatches = useCallback(async (page = 1) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const martialId = localStorage.getItem('martialId') || userData.martialId;
    const bureauId = localStorage.getItem('bureauId') || userData.bureauId;
  
    if (!token || !martialId) {
      setError('Missing required authentication data');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient2.get(
        `${apiEndpoints2.userDataMypreferencesOtherBureaus}?martialId=${martialId}&bureauId=${bureauId}&page=${page}&limit=${ITEMS_PER_PAGE}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setMatches(response.data.data || []);
        setTotalMatches(response.data.total || 0);
        setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
        setCurrentPage(page);
        
        // Scroll to top after data is loaded
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        setError(response.data.message || 'Failed to fetch matches');
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

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      fetchMatches(newPage);
    }
  }, [currentPage, totalPages, loading, fetchMatches]);

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
  }, [fetchMatches, navigate]);

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
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchMatches(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
      <div ref={topRef} className="max-w-sm mx-auto my-12 mt-30 space-y-4">
        <ProgressHeader 
          totalMatches={totalMatches}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <div className='mb-32'>
          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <p className="text-gray-600">No matches found with 50%+ compatibility</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your preferences to see more profiles</p>
            </div>
          ) : (
            matches.map((match) => (
              <ProfileCard
                key={match._id}
                match={match}
                onMenuToggle={toggleMenu}
                isMenuOpen={menuOpen[match._id] || false}
                onAction={handleAction}
                onViewMore={handleViewMore}
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
      <BottomNavbar />
    </>
  );
};

export default AllMatches;