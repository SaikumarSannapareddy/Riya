import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from "./Apis";

const TermsModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');

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

  useEffect(() => {
    const fetchTerms = async () => {
      if (!isOpen) return;
      
      const bureauId = localStorage.getItem("bureauId");
      if (!bureauId) {
        setError('No active bureau found');
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const response = await apiClient.get(apiEndpoints.terms, {
          headers: {
            'Accept': 'application/json; charset=utf-8',
          }
        });
        
        // Convert bureau_id to string for consistent comparison
        const bureauTerms = response.data.find(
          term => String(term.bureau_id) === String(bureauId)
        );

        if (bureauTerms && bureauTerms.term) {
          setContent(bureauTerms.term);
          setDetectedLanguage(detectLanguage(bureauTerms.term));
        } else {
          setContent('<p>No terms and conditions have been set for this bureau.</p>');
          setDetectedLanguage('');
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        setError('Failed to load terms and conditions');
        setContent('<p>Unable to load terms and conditions at this time.</p>');
        setDetectedLanguage('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Terms and Conditions</h2>
            {detectedLanguage && (
              <p className="text-sm text-blue-600 mt-1">Language: {detectedLanguage}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">
              {error}
            </div>
          ) : (
            <div 
              className={`prose max-w-none ${detectedLanguage === 'Telugu' ? 'telugu-text' : ''}`}
              style={{ 
                fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal; 