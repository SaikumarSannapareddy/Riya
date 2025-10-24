import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints } from "../components/Apis";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import PrivateRoute from "../components/PrivateRoute";

const VideoLinksManagement = ({ isSidebarOpen, toggleSidebar }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideo, setCurrentVideo] = useState({
    id: null,
    title: "",
    description: "",
    videoLink: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.videolinks);
      setVideos(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch videos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVideo({ ...currentVideo, [name]: value });
  };

  const resetForm = () => {
    setCurrentVideo({
      id: null,
      title: "",
      description: "",
      videoLink: ""
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoData = {
        title: currentVideo.title,
        description: currentVideo.description,
        videoLink: currentVideo.videoLink
      };

      if (isEditing) {
        videoData.id = currentVideo.id;
        await apiClient.put(`${apiEndpoints.videolinksupdate}`, videoData);
      } else {
        await apiClient.post(apiEndpoints.videolinksAdding, videoData);
      }

      fetchVideos();
      resetForm();
    } catch (err) {
      setError(`Failed to ${isEditing ? "update" : "add"} video: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setCurrentVideo({
      id: video.id,
      title: video.title || video.name, // Handle possible field name differences
      description: video.description || video.content, // Handle possible field name differences
      videoLink: video.videoLink
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.delete(`${apiEndpoints.videolinksdelete}/${id}`);
      fetchVideos();
    } catch (err) {
      setError("Failed to delete video: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    
      <PrivateRoute>
      <div className="flex flex-col h-screen">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-grow p-6 bg-gray-100 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Links Management</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Video" : "Add New Video"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={currentVideo.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              required
              value={currentVideo.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-1">
              Video Link
            </label>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              required
              value={currentVideo.videoLink}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            {(isEditing || currentVideo.title || currentVideo.description || currentVideo.videoLink) && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? "Processing..." : isEditing ? "Update Video" : "Add Video"}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">All Videos</h2>
        
        {loading && !videos.length ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No videos found. Add your first one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-50 rounded-lg p-6 relative">
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{video.title || video.name}</h3>
                </div>
                <p className="text-gray-700 mb-4">{video.description || video.content}</p>
                {video.videoLink && (
                  <div className="mb-4">
                    <a 
                      href={video.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      View Video
                    </a>
                  </div>
                )}
                <div className="flex justify-end space-x-2 absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    aria-label="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    aria-label="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default VideoLinksManagement;