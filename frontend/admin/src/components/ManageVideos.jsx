import React, { useState, useEffect } from 'react';
import { FaPlay, FaLock, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from './Apis';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoLink: '',
    thumbnail: '',
    status: 'active',
    type: 'bureau' // Add default type
  });
  const [editingVideo, setEditingVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.manageVideos);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setMessage('Error fetching videos');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title || '',
        description: video.description || '',
        videoLink: video.videoLink || '',
        thumbnail: video.thumbnail || '',
        status: video.status || 'active',
        type: video.type || 'bureau'
      });
      setThumbnailPreview(video.thumbnail || '');
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        description: '',
        videoLink: '',
        thumbnail: '',
        status: 'active',
        type: 'bureau'
      });
      setThumbnailPreview('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      videoLink: '',
      thumbnail: '',
      status: 'active',
      type: 'bureau'
    });
    setMessage(''); // Clear any messages
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async (file) => {
    if (!file) return null;

    const formDataToSend = new FormData();
    formDataToSend.append('thumbnail', file);

    try {
      const response = await fetch(`${Uploads}/${apiEndpoints.manageVideosUploadThumbnail}`, {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        return null;
      }
      
      const data = await response.json();
      return data.filename;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailFileName = null;
      if (formData.thumbnail && formData.thumbnail instanceof File) {
        thumbnailFileName = await uploadThumbnail(formData.thumbnail);
      }

      const videoData = {
        title: formData.title,
        description: formData.description,
        videoLink: formData.videoLink,
        thumbnail: thumbnailFileName,
        status: formData.status,
        type: formData.type // Include type in the data
      };

      if (editingVideo) {
        await apiClient.put(`${apiEndpoints.manageVideos}/${editingVideo.id}`, videoData);
        setMessage('Video updated successfully!');
      } else {
        await apiClient.post(apiEndpoints.manageVideos, videoData);
        setMessage('Video added successfully!');
      }

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        videoLink: '',
        thumbnail: '',
        status: 'active',
        type: 'bureau'
      });
      setEditingVideo(null);
      setShowModal(false); // Close the modal
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      setMessage('Error saving video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await apiClient.delete(`${apiEndpoints.manageVideos}/${id}`);
      setMessage('Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      setMessage('Error deleting video. Please try again.');
    }
  };

  const handleEdit = (video) => {
    openModal(video);
  };

  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (videoUrl) => {
    const videoId = getVideoId(videoUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage How to Use Videos</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Video
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <FaPlay className="text-white text-3xl opacity-80" />
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
              
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  video.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {video.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  video.type === 'bureau' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {video.type === 'bureau' ? 'Bureau' : 'User'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => window.open(video.videoLink, '_blank')}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <FaEye /> View
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="text-green-600 hover:text-green-800 p-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No videos found. Add your first video!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bureau">Bureau</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Link (YouTube) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoLink}
                  onChange={(e) => setFormData({...formData, videoLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    key={showModal ? 'modal-open' : 'modal-closed'} // Force re-render to clear file input
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use YouTube thumbnail
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingVideo ? 'Update Video' : 'Add Video')}
                </button>
                
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVideos; 