import React from "react";
import { useLocation } from "react-router-dom";

const ThankYou = () => {
  // Extract the `id` from the current URL
  const location = useLocation();
  const id = location.pathname.split("/").pop(); // Gets the last part of the URL

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Your User Created Successfully
        </h1>
        <p className="text-gray-700 mb-6">
          You can now proceed to the dashboard or view your created profile.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Go to Dashboard
          </a>
          {/* <a
            href={`/profile/${id}`} // Use the extracted ID here
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            View Created Profile
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
