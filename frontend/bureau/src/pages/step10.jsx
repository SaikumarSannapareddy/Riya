import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FaPlus, FaTrash } from "react-icons/fa";
import apiClient, { apiEndpoints } from "../components/Apis1";

const Step10 = () => {
  const navigate = useNavigate();
  const [textBoxes, setTextBoxes] = useState([{ id: 1, text: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  // Maximum number of text boxes allowed
  const MAX_TEXT_BOXES = 10;

  // Add a new text box
  const addTextBox = () => {
    if (textBoxes.length < MAX_TEXT_BOXES) {
      const newId = Math.max(...textBoxes.map(box => box.id), 0) + 1;
      setTextBoxes([...textBoxes, { id: newId, text: "" }]);
    }
  };

  // Remove a text box
  const removeTextBox = (id) => {
    if (textBoxes.length > 1) {
      setTextBoxes(textBoxes.filter(box => box.id !== id));
    }
  };

  // Update text in a specific text box
  const updateTextBox = (id, text) => {
    setTextBoxes(textBoxes.map(box => 
      box.id === id ? { ...box, text } : box
    ));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      // Filter out empty text boxes and prepare data
      const customWords = textBoxes
        .filter(box => box.text.trim() !== "")
        .map(box => box.text.trim());

      const formDataToSend = {
        customWords: customWords,
        step1: 1,
        step2: 1,
        step3: 1,
        step4: 1,
        step5: 1,
        step6: 1,
        step7: 1,
        step8: 1,
        step9: 1,
        step10: 1,
      };

      const endpoint = `${apiEndpoints.update}/${userId}`;
      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // Fetch user data to get martial ID and password
        const userResponse = await apiClient.get(`${apiEndpoints.update}/${userId}`);
        if (userResponse.status === 200) {
          setUserData(userResponse.data.user);
        }
        setIsSuccess(true);
      } else {
        alert("Failed to save custom words.");
      }
    } catch (error) {
      console.error("Error saving custom words:", error);
      alert("An error occurred while saving custom words.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      navigate("/step9");
    }
  };

  // Handle share login details
  const handleShareLoginDetails = () => {
    if (userData) {
      const loginDetails = `Martial ID: ${userData.martialId}\nPassword: ${userData.password}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Login Details',
          text: loginDetails,
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(loginDetails).then(() => {
          alert('Login details copied to clipboard!');
        }).catch(() => {
          alert('Login details copied to clipboard!\n\n' + loginDetails);
        });
      }
    }
  };

  // Navigate to dashboard
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Success message component
  if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-50 to-blue-100">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Profile Successfully Completed!
            </h1>
            <p className="text-gray-600 text-lg">
              Your customer profile has been successfully created.
            </p>
          </div>

          {/* Login Details */}
          {userData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Your Login Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="font-medium text-gray-700">Martial ID:</span>
                  <span className="font-mono text-blue-600">{userData.martialId}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded border">
                  <span className="font-medium text-gray-700">Password:</span>
                  <span className="font-mono text-blue-600">{userData.password}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleShareLoginDetails}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Login Details
            </button>
            
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Go to Dashboard
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Please save your login details securely.</p>
            <p>You can use these credentials to access your profile anytime.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-red-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="flex items-center">
              <BiArrowBack className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-center text-white py-3">
              Step 10 -
            </h1>
            <h5 className="font-semibold text-white">Enter Your Own Words</h5>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-20 py-4 px-3">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enter Your Own Words
            </h2>
            <p className="text-gray-600">
              Add up to 10 text boxes. Each box can contain up to 5 lines of text.
            </p>
          </div>

          {/* Text Boxes */}
          <div className="space-y-4">
            {textBoxes.map((box, index) => (
              <div key={box.id} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-red-500 font-medium">
                    Text Box {index + 1}
                  </label>
                  {textBoxes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTextBox(box.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove this text box"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={box.text}
                  onChange={(e) => updateTextBox(box.id, e.target.value)}
                  placeholder={`Enter your text here (up to 5 lines)...`}
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={5}
                  maxLength={500} // Approximate 5 lines limit
                  style={{ 
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    minHeight: '120px' // 5 lines * 24px per line
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {box.text.length}/500 characters
                </div>
              </div>
            ))}
          </div>

          {/* Add Text Box Button */}
          {textBoxes.length < MAX_TEXT_BOXES && (
            <div className="text-center">
              <button
                type="button"
                onClick={addTextBox}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Text Box ({textBoxes.length}/{MAX_TEXT_BOXES})
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-lg font-medium text-lg focus:outline-none transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save & Complete Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step10;
