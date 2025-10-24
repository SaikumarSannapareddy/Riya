import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiClient, { apiEndpoints } from "./Apis";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./Loader";

const EditBureauTerms = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Terms and Conditions');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTerms, setCurrentTerms] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const quillRef = useRef(null);

  // Function to detect language from content
  const detectLanguage = (text) => {
    if (!text) return '';
    
    // Simple language detection for Telugu
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const englishPattern = /[a-zA-Z]/;
    
    if (teluguPattern.test(text)) {
      return 'Telugu';
    } else if (englishPattern.test(text)) {
      return 'English';
    }
    return 'Unknown';
  };

  // Fetch current terms from backend
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(apiEndpoints.adminTerms);
        
        if (response.data.terms) {
          setCurrentTerms(response.data.terms);
          setTitle(response.data.terms.title || 'Terms and Conditions');
          setContent(response.data.terms.content || '');
          setDetectedLanguage(detectLanguage(response.data.terms.content));
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        toast.error('Failed to fetch terms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Save terms to backend
  const handleSaveTerms = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    // Trim content to remove any empty paragraphs
    const trimmedContent = content.replace(/<p>\s*<\/p>/g, '').trim();

    try {
      setIsLoading(true);
      
      if (currentTerms) {
        // Update existing terms
        await apiClient.put(apiEndpoints.adminTermsUpdate(currentTerms.id), {
          title: title.trim(),
          content: trimmedContent,
          is_active: 1
        });
        toast.success('Terms updated successfully!');
      } else {
        // Create new terms
        const response = await apiClient.post(apiEndpoints.adminTermsCreate, {
          title: title.trim(),
          content: trimmedContent
        });
        setCurrentTerms({ id: response.data.id, title: title.trim(), content: trimmedContent });
        toast.success('Terms created successfully!');
      }
      
      setIsEditing(false);
      setDetectedLanguage(detectLanguage(trimmedContent));
    } catch (error) {
      console.error('Error saving terms:', error);
      toast.error('Failed to save terms');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete terms
  const handleDeleteTerms = async () => {
    if (!currentTerms) {
      toast.error('No terms to delete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete these terms? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await apiClient.delete(apiEndpoints.adminTermsDelete(currentTerms.id));
      
      setCurrentTerms(null);
      setTitle('Terms and Conditions');
      setContent('');
      setDetectedLanguage('');
      setIsEditing(false);
      toast.success('Terms deleted successfully!');
    } catch (error) {
      console.error('Error deleting terms:', error);
      toast.error('Failed to delete terms');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form
  const handleClearForm = () => {
    setTitle('Terms and Conditions');
    setContent('');
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            Bureau Terms and Conditions Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2">
            {!isEditing && currentTerms && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Edit Terms
              </button>
            )}
            {!isEditing && !currentTerms && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Create Terms
              </button>
            )}
          </div>
        </div>

        {/* Language Indicator */}
        {detectedLanguage && (
          <div className="mb-4 p-2 rounded text-center bg-blue-100 text-blue-800">
            Detected Language: {detectedLanguage}
          </div>
        )}

        {/* Status Indicator */}
        {!isEditing && (
          <div className={`mb-4 p-2 rounded text-center ${currentTerms ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {currentTerms 
              ? `Terms are currently active and visible to all bureaus` 
              : 'No terms have been created yet'}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <Loader />
          </div>
        )}

        {/* Editor */}
        <div className={`border-0 md:border rounded ${isEditing ? 'md:border-blue-500' : 'md:border-gray-300'}`}>
          {isEditing ? (
            <div className="p-4">
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter terms title"
                  required
                />
              </div>

              {/* Rich Text Editor */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Content</label>
                <ReactQuill 
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'font': [] }],
                      [{ 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet',
                    'script',
                    'indent',
                    'direction',
                    'color', 'background',
                    'font',
                    'align',
                    'link', 'image', 'video'
                  ]}
                  theme="snow"
                  className={`h-[400px] ${detectedLanguage === 'Telugu' ? 'telugu' : ''}`}
                  style={{ fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif' }}
                />
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Display Title */}
              <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
              
              {/* Display Content */}
              <div 
                className={`prose max-w-none ${detectedLanguage === 'Telugu' ? 'telugu-text' : ''}`}
                style={{ 
                  minHeight: '200px',
                  fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: content || '<p>No terms and conditions available</p>' }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
          {isEditing ? (
            <>
              <button 
                onClick={handleClearForm}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTerms}
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Save Changes
              </button>
            </>
          ) : (
            currentTerms && (
              <button 
                onClick={handleDeleteTerms}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading}
              >
                Delete Terms
              </button>
            )
          )}
        </div>

        {/* Preview Note */}
        {currentTerms && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Preview Information</h3>
            <p className="text-blue-700 text-sm">
              These terms and conditions are currently active and visible to all bureaus. 
              Bureaus can view them in their mobile app under "Follow community guidelines & terms and conditions".
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Last updated: {new Date(currentTerms.updated_at || currentTerms.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
      />
    </div>
  );
};

export default EditBureauTerms; 