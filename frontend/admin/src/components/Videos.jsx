import React, { useState, useEffect } from "react";
import { 
  FaPlay,
  FaSpinner,
  FaVideo
} from "react-icons/fa";
import apiClient, { apiEndpoints } from './Apis';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.videolinks);
      console.log('Fetched videos:', response.data);
      setVideos(response.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const LoadingCard = () => (
    <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">For More Info </h2>
          <p className="text-lg text-gray-600">Watch our latest matrimony videos and success stories</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* Videos Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            // Loading cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Videos Available</h3>
              <p className="text-gray-500">Check back later for our latest video content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {video.title || video.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {video.description || video.content}
                      </p>
                    </div>
                    
                    {video.videoLink && (
                      <div className="mt-4">
                        <a 
                          href={video.videoLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg group"
                        >
                          <FaPlay className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                          <span>Watch Video</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {videos.length > 0 && (
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Want to See More?</h3>
            <p className="text-gray-600 mb-8">Subscribe to our channel for the latest matrimony videos and tips</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos; 