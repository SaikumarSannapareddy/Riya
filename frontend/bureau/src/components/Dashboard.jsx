import React, { useState, useEffect } from "react";
import { FaUsers, FaWarehouse, FaTruck, FaMale, FaFemale } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

// Registering chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    users: 150,
    bureaus: 20,
    distributors: 30,
    males: 90,
    females: 60,
  });

  useEffect(() => {
    // Simulate fetching data here
    // Replace with your actual data fetching logic
    setUserStats({
      users: 150,
      bureaus: 20,
      distributors: 30,
      males: 90,
      females: 60,
    });
  }, []);

  // Pie chart data for gender distribution
  const pieData = {
    labels: ['Males', 'Females'],
    datasets: [
      {
        data: [userStats.males, userStats.females],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };

  // Bar chart data for user, bureau, distributor statistics
  const barData = {
    labels: ['Users', 'Bureaus', 'Distributors'],
    datasets: [
      {
        label: 'Counts',
        data: [userStats.users, userStats.bureaus, userStats.distributors],
        backgroundColor: ['#3b82f6', '#f97316', '#22c55e'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Riya Matrimony Dashboard</h1>
      <p className="mb-6">This is the admin dashboard where you can manage users, distributors, bureaus, and more.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Manage Users */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Users</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.users}</p>
          </div>
          <FaUsers className="text-blue-500 text-4xl" />
        </div>

        {/* Manage Bureaus */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Bureaus</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.bureaus}</p>
          </div>
          <FaWarehouse className="text-orange-500 text-4xl" />
        </div>

        {/* Manage Distributors */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Distributors</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.distributors}</p>
          </div>
          <FaTruck className="text-green-500 text-4xl" />
        </div>

        {/* Gender Distribution */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Gender Distribution</h2>
            <div className="w-24 h-24">
              <Pie data={pieData} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <FaMale className="text-blue-500 text-3xl mb-2" />
            <FaFemale className="text-pink-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Bar Chart for Users, Bureaus, and Distributors */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">User, Bureau, Distributor Stats</h2>
        <div className="w-full h-64">
          <Bar data={barData} />
        </div>
      </div>

      {/* Created This Month List */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Created This Month</h2>
        {/* List of items created this month */}
        <ul className="space-y-2">
          <li className="text-gray-700">Item 1 - January 1, 2024</li>
          <li className="text-gray-700">Item 2 - January 3, 2024</li>
          <li className="text-gray-700">Item 3 - January 6, 2024</li>
          {/* Add more items dynamically */}
        </ul>
      </div>

      {/* Navigation links to manage sections */}
      <div className="mt-6 flex space-x-4">
        <a href="/manage-users" className="text-blue-500 hover:underline">Manage Users</a>
        <a href="/manage-bureaus" className="text-orange-500 hover:underline">Manage Bureaus</a>
        <a href="/manage-distributors" className="text-green-500 hover:underline">Manage Distributors</a>
      </div>
    </div>
  );
};

export default Dashboard;
