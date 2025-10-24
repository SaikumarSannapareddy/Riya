import React from "react";
import { FaUsers, FaShieldAlt, FaHeadset, FaBriefcase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FeatureCards = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleCreateClick = () => {
    navigate("/userdistributors/create"); // Redirect to the desired route
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="flex justify-center items-center mb-10 bg-gray-100  px-4">
        {/* Distributor Creation */}
        <div className="bg-white p-10 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl max-w-4xl w-full">
          <div className="flex justify-center items-center mb-6">
            <FaShieldAlt className="text-5xl text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            Create Distributor Accounts
          </h3>
          <p className="text-lg text-center text-gray-600 mb-6">
            Easily manage and create distributor accounts to expand your
            network. This tool allows you to streamline the process and keep
            track of your distributors effectively.
          </p>

          {/* Centered Button */}
          <div className="flex justify-center">
            <button
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg mt-6 transform transition-all duration-300 hover:scale-110 shadow-md hover:shadow-2xl"
              onClick={handleCreateClick}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Personalized Matchmaking Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center mb-4">
            <FaUsers className="text-4xl text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Personalized Matchmaking
          </h3>
          <p className="text-center text-gray-600">
            We provide personalized matchmaking services that cater to your
            specific needs and preferences.
          </p>
        </div>

        {/* Verified Profiles Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center mb-4">
            <FaShieldAlt className="text-4xl text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Verified Profiles
          </h3>
          <p className="text-center text-gray-600">
            All profiles are verified to ensure genuine connections for our
            clients.
          </p>
        </div>
        {/* 24/7 Customer Support Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center mb-4">
            <FaHeadset className="text-4xl text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            24/7 Customer Support
          </h3>
          <p className="text-center text-gray-600">
            Our team is available around the clock to assist you with any
            questions or issues.
          </p>
        </div>

        {/* Business Opportunities Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center mb-4">
            <FaBriefcase className="text-4xl text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Business Opportunities
          </h3>
          <p className="text-center text-gray-600">
            Onboard bureau owners to provide access to all Indian profiles for
            marriages and expand your network.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
