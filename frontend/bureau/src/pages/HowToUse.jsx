import React, { useState, useEffect } from 'react';
import { FaPlay, FaLock, FaArrowLeft, FaHome, FaUser, FaUsers, FaHeart, FaShareAlt, FaEdit, FaEye } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis';
import { darkThemeClasses } from '../components/darkTheme';

const HowToUse = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFreeAccount, setIsFreeAccount] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const bureauId = localStorage.getItem('bureauId');

  useEffect(() => {
    checkAccountStatus();
    fetchVideos();
  }, []);

  const checkAccountStatus = async () => {
    try {
      const response = await apiClient.get(
        `${apiEndpoints.bureaudetails}?bureauId=${bureauId}`
      );
      const data = response.data;

      if (data.bureauProfiles && data.bureauProfiles.length > 0) {
        const bureauInfo = data.bureauProfiles[0];
        const expiry = bureauInfo.expiryDate ? new Date(bureauInfo.expiryDate) : null;
        const now = new Date();
        
        // Set free account if no expiry or expired
        if (!expiry || expiry < now) {
          setIsFreeAccount(true);
        }
      }
    } catch (error) {
      console.error('Error checking account status:', error);
      setIsFreeAccount(true); // Default to free account on error
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.bureauVideos);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    
    return null;
  };

  const getEmbedUrl = (videoUrl) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0` : '';
  };

  const getThumbnailUrl = (videoUrl) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const handleVideoClick = (video) => {
    if (isFreeAccount) {
      alert('This feature is available for paid members only. Please upgrade your plan to access video tutorials.');
      return;
    }
    setSelectedVideo(video);
  };

  const handleWatchVideo = (video) => {
    if (isFreeAccount) {
      alert('This feature is available for paid members only. Please upgrade your plan to access video tutorials.');
      return;
    }
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NavLink
                to="/"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <FaArrowLeft /> Back
              </NavLink>
              <h1 className="text-2xl font-bold text-gray-800">How to Use - Video Tutorials</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Free Account Warning */}
        {isFreeAccount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaLock className="text-yellow-600 mr-2" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Premium Feature</h3>
                <p className="text-yellow-700 text-sm">
                  Video tutorials are available for paid members only. Upgrade your plan to access all video guides.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Video Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Tutorials</h2>
          
          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  isFreeAccount ? 'opacity-60' : 'cursor-pointer'
                }`}
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={video.thumbnail ? `${Uploads}/thumbnails/${video.thumbnail}` : getThumbnailUrl(video.videoLink) || '/default-thumbnail.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getThumbnailUrl(video.videoLink) || '/default-thumbnail.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    {isFreeAccount ? (
                      <FaLock className="text-white text-3xl opacity-80" />
                    ) : (
                      <FaEye className="text-white text-3xl opacity-80" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {video.description}
                  </p>
                  
                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    {isFreeAccount && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <FaLock className="mr-1" /> Premium
                      </span>
                    )}
                  </div>

                  {/* Watch Button - Only show for paid members */}
                  {!isFreeAccount && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWatchVideo(video);
                      }}
                      className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlay className="text-sm" />
                      Watch Video
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📹</div>
              <p className="text-gray-500 text-lg mb-4">No video tutorials available</p>
              <p className="text-gray-400">Check back later for helpful video guides!</p>
            </div>
          )}
        </div>

        {/* Video Modal */}
        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={closeVideoModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-4">
                {/* Video Player */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoLink)}
                    title={selectedVideo.title}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                
                {/* Video Description */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-gray-600">
                    {selectedVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            <NavLink
              to="/"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                window.location.pathname === '/' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHome className="text-lg mb-1" />
              <span className="text-xs">Home</span>
            </NavLink>

            <NavLink
              to="/add-profile"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                window.location.pathname === '/add-profile' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUser className="text-lg mb-1" />
              <span className="text-xs">Add Profile</span>
            </NavLink>

            <NavLink
              to={`/male-profiles/${bureauId}/male`}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                window.location.pathname.includes('/male-profiles') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUsers className="text-lg mb-1" />
              <span className="text-xs">Profiles</span>
            </NavLink>

            <NavLink
              to="/shortlist-profiles"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                window.location.pathname === '/shortlist-profiles' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHeart className="text-lg mb-1" />
              <span className="text-xs">Shortlist</span>
            </NavLink>

            <NavLink
              to="/edit-buttons"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                window.location.pathname === '/edit-buttons' 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaEdit className="text-lg mb-1" />
              <span className="text-xs">Settings</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom spacing for navbar */}
      <div className="h-20"></div>
    </div>
  );
};

export default HowToUse; 