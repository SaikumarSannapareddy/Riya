import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiClient, { apiEndpoints } from "./Apis";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavBar from './Bottomnav';
import TopNavbar from "../components/Gnavbar";

const TermsAndConditionsEditor = () => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [bureauId, setBureauId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch bureau ID from localStorage
  useEffect(() => {
    const storedBureauId = localStorage.getItem("bureauId");
    if (storedBureauId) {
      // Ensure bureauId is converted to a string for consistent comparison
      setBureauId(String(storedBureauId));
    }
  }, []);

  // Fetch terms from backend when bureauId is available
  useEffect(() => {
    const fetchTerms = async () => {
      if (bureauId) {
        try {
          setIsLoading(true);
          const response = await apiClient.get(apiEndpoints.terms, {
            headers: {
              'Accept': 'application/json; charset=utf-8',
            }
          });
          
          console.log('Raw API Response:', response.data);
          
          // Convert bureau_id to string for consistent comparison
          const bureauTerms = response.data.find(
            term => String(term.bureau_id) === String(bureauId)
          );

          console.log('Found Bureau Terms:', bureauTerms);
          console.log('Raw Terms Content:', bureauTerms?.term);

          if (bureauTerms) {
            const termsContent = bureauTerms.term || '';
            console.log('Processed Terms Content:', termsContent);
            console.log('Content Length:', termsContent.length);
            console.log('Content Bytes:', new TextEncoder().encode(termsContent));
            
            setContent(termsContent);
            setDetectedLanguage(detectLanguage(termsContent));
            setIsSaved(true);
          } else {
            setContent('');
            setDetectedLanguage('');
            setIsSaved(false);
          }
        } catch (error) {
          console.error("Error fetching terms:", error);
          toast.error('Failed to fetch terms');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTerms();
  }, [bureauId]);
  
  // Save terms to backend
  const handleSaveTerms = async () => {
    if (!bureauId) {
      toast.error('No active bureau found');
      return;
    }

    // Trim content to remove any empty paragraphs
    const trimmedContent = content.replace(/<p>\s*<\/p>/g, '').trim();

    console.log('Saving Terms - Original Content:', content);
    console.log('Saving Terms - Trimmed Content:', trimmedContent);
    console.log('Saving Terms - Content Length:', trimmedContent.length);
    console.log('Saving Terms - Content Bytes:', new TextEncoder().encode(trimmedContent));

    try {
      setIsLoading(true);
      const response = await apiClient.put(`${apiEndpoints.terms}/${bureauId}`, 
        { term: trimmedContent },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }
      );
      
      console.log('Save Response:', response.data);
      
      setIsSaved(true);
      setIsEditing(false);
      setDetectedLanguage(detectLanguage(trimmedContent));
      toast.success('Terms updated successfully!');
    } catch (error) {
      console.error('Error saving terms:', error);
      toast.error('Failed to save terms');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear saved terms
  const handleClearTerms = async () => {
    if (bureauId) {
      try {
        setIsLoading(true);
        await apiClient.put(`${apiEndpoints.terms}/${bureauId}`, 
          { term: '' },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            }
          }
        );
        setContent('');
        setDetectedLanguage('');
        setIsSaved(false);
        toast.success('Terms cleared successfully!');
      } catch (error) {
        console.error('Error clearing terms:', error);
        toast.error('Failed to clear terms');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // If no bureau is active, show login/selection prompt
  if (!bureauId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl mb-4">No Active Bureau</h2>
          <p className="mb-4">Please log in or select a bureau to edit terms.</p>
          <button 
            onClick={() => {
              localStorage.setItem('bureauId', 'sample-bureau-id');
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Select Bureau (Demo)
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold mb-4 text-center">
            Terms and Conditions
          </h1>

          {/* Language Indicator */}
          {detectedLanguage && (
            <div className="mb-4 p-2 rounded text-center bg-blue-100 text-blue-800">
              Detected Language: {detectedLanguage}
            </div>
          )}

          {/* Status Indicator */}
          {!isEditing && (
            <div className={`mb-4 p-2 rounded text-center ${isSaved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isSaved 
                ? `Terms are saved for Bureau` 
                : 'No terms have been saved yet'}
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Editor */}
          <div className={`border-0 md:border rounded ${isEditing ? 'md:border-blue-500' : 'md:border-gray-300'}`}>
            {isEditing ? (
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
                className={`h-[300px] md:h-[500px] ${detectedLanguage === 'Telugu' ? 'telugu' : ''}`}
                style={{ fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif' }}
              />
            ) : (
              <div 
                className={`p-4 max-h-[60vh] overflow-y-auto ${detectedLanguage === 'Telugu' ? 'telugu-text' : ''}`}
                style={{ 
                  minHeight: '300px',
                  fontFamily: detectedLanguage === 'Telugu' ? 'Noto Sans Telugu, Arial, sans-serif' : 'Arial, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: content || '<p>No terms and conditions</p>' }}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 mt-6">
            {!isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Edit Terms
                </button>
                {/* {content && (
                  <button 
                    onClick={handleClearTerms}
                    className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Clear Terms
                  </button>
                )} */}
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="w-full md:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTerms}
                  className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default TermsAndConditionsEditor;