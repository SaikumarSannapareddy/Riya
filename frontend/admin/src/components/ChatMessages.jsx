import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai';
import { FaComments } from 'react-icons/fa';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    messageId: '',
    message: ''
  });

  const API_BASE_URL = 'http://localhost:3300/api';

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat-messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for creating new message
  const handleCreate = () => {
    setEditingMessage(null);
    setFormData({
      messageId: '',
      message: ''
    });
    setShowModal(true);
  };

  // Open modal for editing message
  const handleEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      messageId: message.messageId,
      message: message.message
    });
    setShowModal(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingMessage 
        ? `${API_BASE_URL}/chat-messages/${editingMessage._id}`
        : `${API_BASE_URL}/chat-messages`;
      
      const method = editingMessage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        fetchMessages();
        setFormData({ messageId: '', message: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Error saving message');
    }
  };

  // Handle message deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat-messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMessages();
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter(message =>
    message.messageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopNavbar />
        
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaComments className="text-3xl text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Chat Messages</h1>
                  <p className="text-gray-600">Manage system chat messages</p>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <AiOutlinePlus />
                <span>Add Message</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading messages...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMessages.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          {searchTerm ? 'No messages found matching your search.' : 'No messages available.'}
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map((message) => (
                        <tr key={message._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {message.messageId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {message.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(message)}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              >
                                <AiOutlineEdit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(message._id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                <AiOutlineDelete className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingMessage ? 'Edit Message' : 'Add New Message'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message ID
                </label>
                <input
                  type="text"
                  name="messageId"
                  value={formData.messageId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter message ID"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter message content"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingMessage ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages; 