import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // Import animate.css for animations

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center animate__animated animate__fadeIn animate__delay-0.5s">
        {/* 404 Text with Animation */}
        <h1 className="text-6xl font-bold text-white mb-4 animate__animated animate__zoomIn">
          404
        </h1>
        <p className="text-xl text-white mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Go Back Button */}
        <Link to="/">
          <button className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-yellow-600 animate__animated animate__fadeIn animate__delay-1.5s">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
