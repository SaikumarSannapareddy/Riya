import React, { useState, useEffect } from "react";
import { FaWarehouse } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import apiClient, { apiEndpoints } from './Apis';

// Registering chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [bureauCount, setBureauCount] = useState(0);
  const [distributorId, setDistributorId] = useState(null);

  useEffect(() => {
    // Retrieve distributorId from localStorage
    const storedDistributorId = localStorage.getItem("distributorId");
    setDistributorId(storedDistributorId);
    console.log("Distributor ID:", storedDistributorId); // Print to console

    if (storedDistributorId) {
      fetchBureauData(storedDistributorId);
    }
  }, []);

  const fetchBureauData = async (distributorId) => {
    try {
      console.log("Fetching bureau data...");

      // Fetching the Bureau count from the API, filtered by distributorId
      const bureauResponse = await apiClient.get(`${apiEndpoints.MyBureauProfiles}?distributorId=${distributorId}`);

      console.log("Bureau API Response:", bureauResponse);

      // Check if bureauResponse is valid and contains the necessary data
      const count = bureauResponse?.data?.bureauProfiles?.length || 0;

      console.log("Bureau count:", count);

      // Set the state with the fetched data
      setBureauCount(count);
    } catch (error) {
      console.error("Error fetching bureau data: ", error);
    }
  };

  // Bar chart data for bureau statistics
  const barData = {
    labels: ['Bureaus'],
    datasets: [
      {
        label: 'Count',
        data: [bureauCount],
        backgroundColor: ['#f97316'],
        borderColor: ['#fff'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Riya Matrimony Dashboard</h1>
      <p className="mb-6">This is the admin dashboard where you can manage bureaus.</p>

      {/* Display Distributor ID */}
      {/* (optional) */}
  
      {/* Bureau Stat Card */}
      <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300 mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-700">Manage Bureaus</h2>
          <p className="text-2xl font-bold text-gray-900">{bureauCount}</p>
        </div>
        <FaWarehouse size={40} className="text-gray-600" />
      </div>

      {/* Bureau Bar Chart */}
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Bureau Statistics</h2>
        <div className="w-full h-80 sm:h-96">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
