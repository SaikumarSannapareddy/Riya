import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCog, FaArrowLeft } from 'react-icons/fa';
import TopNavbar from '../components/Gnavbar';
import Bottomnav from '../components/Bottomnav';
import PrivateRoute from '../components/PrivateRoute';

const SearchPage = () => {
  const navigate = useNavigate();

  const handleQuickSearch = () => {
    navigate('/search-by-id');
  };

  const handleAdvancedSearch = () => {
    navigate('/advanced-search');
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col bg-white min-h-screen">
        <TopNavbar />
        
        <div className="flex-1 p-6 mt-20 mb-20">
          {/* Header */}
          <div className="flex items-center mb-8">
            <FaArrowLeft
              className="mr-3 text-gray-600 cursor-pointer text-xl"
              onClick={handleBackClick}
            />
            <h1 className="text-3xl font-bold text-gray-800">Search Profiles</h1>
          </div>

          {/* Search Options */}
      {/* Search Options */}
<div className="max-w-2xl mx-auto space-y-6">
  {/* Quick Search Option */}
  <div 
    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 cursor-pointer hover:scale-105 shadow-md hover:shadow-xl transition-all duration-300"
    onClick={handleQuickSearch}
  >
    <div className="flex items-center space-x-4">
      <div className="bg-white bg-opacity-20 p-3 rounded-full">
        <FaSearch className="text-white text-2xl" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-1">Search By Id</h2>
        <p className="text-sm text-white/90">
          Search profile using the Matri ID.
        </p>
      </div>
      <FaArrowLeft className="text-white text-xl transform rotate-180" />
    </div>
  </div>

  {/* Advanced Search Option */}
  <div 
    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 cursor-pointer hover:scale-105 shadow-md hover:shadow-xl transition-all duration-300"
    onClick={handleAdvancedSearch}
  >
    <div className="flex items-center space-x-4">
      <div className="bg-white bg-opacity-20 p-3 rounded-full">
        <FaCog className="text-white text-2xl" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-1">Advanced Search</h2>
        <p className="text-sm text-white/90">
          Detailed search with filters like age, height, education, occupation, income, and more.
        </p>
      </div>
      <FaArrowLeft className="text-white text-xl transform rotate-180" />
    </div>
  </div>
</div>


          {/* Additional Info */}
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Search Tips:</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Quick Search is perfect for basic filtering</li>
              <li>• Advanced Search offers detailed criteria for precise matches</li>
              <li>• You can save your search preferences for future use</li>
              <li>• Results are sorted by relevance and recent activity</li>
            </ul>
          </div>
        </div>

        <Bottomnav />
      </div>
    </PrivateRoute>
  );
};

export default SearchPage; 