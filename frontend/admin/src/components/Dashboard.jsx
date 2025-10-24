import React, { useState, useEffect } from "react";
import { FaUsers, FaWarehouse, FaTruck, FaMale, FaFemale, FaComments, FaVideo, FaBuilding } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import apiClient, { apiEndpoints } from './Apis'; // Assuming this is the API client you're using
import apiClientfecth, {apiEndpointsfetch} from './Apis3'
import { Link } from 'react-router-dom'
import { AiOutlineDashboard, AiOutlineEdit, AiOutlineFileText, AiOutlineFileProtect, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai'

// Registering chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    users: 0, // Initialize to 0 instead of static 150
    bureaus: 0,
    distributors: 0,
    males: 0,
    females: 0,
  });
  

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
  
      const [bureauResponse, distributorResponse, countsResponse] = await Promise.all([
        apiClient.get(apiEndpoints.BureauManage),
        apiClient.get(apiEndpoints.Distributers),
        apiClientfecth.get(apiEndpointsfetch.counts),
      ]);
  
      const bureauCount = Array.isArray(bureauResponse?.data?.bureauProfiles) ? bureauResponse.data.bureauProfiles.length : 0;
      const distributorCount = Array.isArray(distributorResponse?.data?.distributors) ? distributorResponse.data.distributors.length : 0;
      const userCount = countsResponse?.data?.total ?? 0;
      const femaleCount = countsResponse?.data?.female ?? 0;
      const maleCount = countsResponse?.data?.male ?? 0;
  
      setUserStats({
        users: userCount,
        bureaus: bureauCount,
        distributors: distributorCount,
        males: maleCount,
        females: femaleCount,
      });
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  

  useEffect(() => {
    fetchData();
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
      <h1 className="text-3xl font-bold mb-4">Welcome to Riya Tech Park Super Admin Dashboard</h1>
      <p className="mb-6">This is the admin dashboard where you can manage users, distributors, bureaus, and more.</p>



      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Manage Users */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Users</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.users}</p>
          </div>
          <FaUsers size={40} className="text-gray-600" />
        </div>

        {/* Manage Bureaus */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Bureaus</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.bureaus}</p>
          </div>
          <FaWarehouse size={40} className="text-gray-600" />
        </div>

        {/* Manage Distributors */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Manage Distributors</h2>
            <p className="text-2xl font-bold text-gray-900">{userStats.distributors}</p>
          </div>
          <FaTruck size={40} className="text-gray-600" />
        </div>
      </div>

      {/* Quick Links (Sidebar buttons replicated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/admin-dashboard" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Dashboard</span>
            <AiOutlineDashboard />
          </div>
        </Link>
        <Link to="/profiles-dashboard" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Profiles Dashboard</span>
            <AiOutlineDashboard />
          </div>
        </Link>
        <Link to="/bureau-dashboard" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Bureau Dashboard</span>
            <AiOutlineDashboard />
          </div>
        </Link>
        <Link to="/distributer-dashboard" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Distributor Dashboard</span>
            <AiOutlineDashboard />
          </div>
        </Link>
        <Link to="/packages" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Packages</span>
            <AiOutlineDashboard />
          </div>
        </Link>
        <Link to="/edit-branding-website" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Edit Branding Website</span>
            <AiOutlineEdit />
          </div>
        </Link>
        <Link to="/manage-videos" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Manage How to Use Videos</span>
            <FaVideo />
          </div>
        </Link>
        <Link to="/edit-bureau-terms" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Edit Bureau Terms & Conditions</span>
            <AiOutlineFileText />
          </div>
        </Link>
        <Link to="/edit-distributors-terms" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Edit Distributors Terms & Conditions</span>
            <AiOutlineFileProtect />
          </div>
        </Link>
        <Link to="/admin/chat-messages" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Chat Messages</span>
            <FaComments />
          </div>
        </Link>
        <Link to="/user/male-profiles" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Male Profiles</span>
            <AiOutlineUser />
          </div>
        </Link>
        <Link to="/user/female-profiles" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Female Profiles</span>
            <AiOutlineUser />
          </div>
        </Link>
        <Link to="/bureau/manage" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Manage Bureau</span>
            <FaBuilding />
          </div>
        </Link>
        <Link to="/distributors/create" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Create Distributor</span>
            <FaUsers />
          </div>
        </Link>
        <Link to="/distributors/manage" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Manage Distributors</span>
            <FaUsers />
          </div>
        </Link>
        <Link to="/settings/cast" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Cast</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/sub-caste" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Sub Caste</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/education" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Education</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/occupation" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Occupation</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/country" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Country</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/state" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">State</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/city" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">City</span>
            <AiOutlineSetting />
          </div>
        </Link>
        <Link to="/settings/star" className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="font-medium">Star</span>
            <AiOutlineSetting />
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gender Distribution Pie Chart */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gender Distribution</h2>
          <Pie data={pieData} />
        </div>

        {/* User, Bureau, Distributor Bar Chart */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User, Bureau, Distributor Statistics</h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
