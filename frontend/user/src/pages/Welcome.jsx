import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from '../components/Apis';


const Bureau = () => {
  const [bureauId, setBureauId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bureauId.trim() === '') {
      setError('Bureau ID is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch bureau details using the provided bureau ID
      const response = await apiClient.get(
        `${apiEndpoints.bureaudetails}?bureauId=${bureauId}`
      );
      
      const { bureauProfiles } = response.data;
      
      // Check if bureau exists
      if (!bureauProfiles || bureauProfiles.length === 0) {
        setError('Bureau ID not found');
        setLoading(false);
        return;
      }
      
      // Get the bureau data (first element in the array)
      const bureauData = bureauProfiles[0];
      
      // Check if the bureau is NOT suspended (suspend must be 0)
      if (bureauData.suspend !== 0) {
        setError('This bureau account is suspended');
        setLoading(false);
        return;
      }
      
      // Check if expiryDate exists or is in the future
      if (!bureauData.expiryDate) {
        // If no expiry date is found, allow redirect
        window.location.href = `https://matrimonystudio.in/${bureauId}/test1`;
        return;
      } else {
        // Get current date for comparison
        const today = new Date();
        const expiryDate = new Date(bureauData.expiryDate);
        
        // Check if expiry date is in the future
        if (expiryDate > today) {
          // Redirect to the specified URL with the bureau ID
          window.location.href = `https://matrimonystudio.in/${bureauId}/test1`;
        } else {
          setError('Bureau subscription has expired');
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching bureau details:', error);
      setError('Failed to validate bureau ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 shadow-lg"
      style={{
        background: 'linear-gradient(to bottom right, #6a0dad, #000000)', // Purple to black
      }}
    >
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md transform transition duration-500 hover:scale-105 hover:shadow-2xl">
        
        {/* Image at the top */}
        <img
          src="https://thoduneeda.com/images/slide1.jpg"
          alt="Top Banner"
          className="w-full h-40 object-cover rounded-md mb-6"
        />
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center tracking-wide">
          Enter Bureau ID
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={bureauId}
            onChange={(e) => setBureauId(e.target.value)}
            placeholder="Bureau ID"
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-500 transition"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md transition font-semibold tracking-wide shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(to right, #6a0dad, #4b0082)', // Deep purple tones
              color: '#ffffff',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bureau;