import React, { useState, useEffect } from 'react';
import apiClient, { apiEndpoints } from "./Apis";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavBar from './Bottomnav';
import TopNavbar from "../components/Gnavbar";
import Loader from './Loader';

const CommunityGuidelines = () => {
  const [terms, setTerms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch terms from backend
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(apiEndpoints.bureauTerms);
        
        if (response.data.terms) {
          setTerms(response.data.terms);
          setDetectedLanguage(detectLanguage(response.data.terms.content));
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        toast.error('Failed to fetch community guidelines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
      />
      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Community Guidelines & Terms
            </h1>
            <p className="text-gray-600">
              Please read and follow these guidelines to maintain a respectful community
            </p>
          </div>

          {/* Language Indicator */}
          {detectedLanguage && (
            <div className="mb-4 p-3 rounded-lg text-center bg-blue-100 text-blue-800 border border-blue-200">
              <span className="font-medium">Language:</span> {detectedLanguage}
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          )}

          {/* Terms Content */}
          {!isLoading && terms ? (
            <div className="space-y-6">
              {/* Title */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {terms.title}
                </h2>
                <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
              </div>

              {/* Content */}
              <div 
                className={`prose max-w-none ${detectedLanguage === 'Telugu' ? 'telugu-text' : ''}`}
                style={{ 
                  fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: terms.content }}
              />

              {/* Last Updated Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Guidelines Available</h3>
              <p className="text-gray-500">
                Community guidelines and terms are currently being prepared. Please check back later.
              </p>
            </div>
          )}

          {/* Important Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    By using our matrimony services, you agree to follow these community guidelines. 
                    Violation of these guidelines may result in account suspension or termination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default CommunityGuidelines; 