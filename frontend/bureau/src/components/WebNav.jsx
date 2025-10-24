import React, { useEffect, useState } from 'react';
import { FaHome, FaPlusCircle, FaSearch, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints } from './Apis';

const WebNav = () => {
  const navigate = useNavigate();

  // Extract bureauId from the URL
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const bureauId = segments[2] || '';

  const [bureauName, setBureauName] = useState('');

  useEffect(() => {
    const fetchBureauName = async () => {
      if (bureauId) {
        try {
          const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
          const data = response.data.bureauProfiles;
          if (data && data.length > 0) {
            setBureauName(data[0].bureauName);
          }
        } catch (error) {
          setBureauName('');
        }
      }
    };
    fetchBureauName();
  }, [bureauId]);

  const handleShare = async () => {
    let shareUrl = window.location.href;
    if (bureauId && bureauName) {
      const encodedName = encodeURIComponent(bureauName.replace(/\s+/g, ''));
      shareUrl = `https://matrimonystudio.in/${bureauId}/${encodedName}`;
    }
    const shareData = {
      title: document.title,
      text: 'Check this out!',
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('URL copied to clipboard!');
      } catch (err) {
        alert('Could not copy URL');
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow z-50">
      <div className="flex justify-around items-center py-2">
        <button
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 focus:outline-none"
          onClick={() => navigate(`/${bureauId}/ABCD`)}
        >
          <FaHome size={22} />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-700 hover:text-green-600 focus:outline-none"
          onClick={() => navigate(`/user-register/${bureauId}`)}
        >
          <FaPlusCircle size={22} />
          <span className="text-xs">Add Profile</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-700 hover:text-red-600 focus:outline-none"
          onClick={() => navigate('/quick-search2')}
        >
          <FaSearch size={22} />
          <span className="text-xs">Search</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-700 hover:text-blue-500 focus:outline-none"
          onClick={handleShare}
        >
          <FaShareAlt size={22} />
          <span className="text-xs">Share</span>
        </button>
      </div>
    </nav>
  );
};

export default WebNav; 