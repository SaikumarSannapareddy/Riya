import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css'; // Import animate.css for animations

const RegistrationSuccess = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      <div className="text-center animate__animated animate__fadeIn animate__delay-1s">
        {/* Success Message with Animation */}
        <h1 className="text-6xl font-bold text-white mb-4 animate__animated animate__zoomIn">
          Thank You!
        </h1>
        <p className="text-xl text-white mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Your distributor registration was successful.
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

export default RegistrationSuccess;
