import React, { useState, useEffect } from "react";
import { FaUser, FaCreditCard, FaUserAlt, FaBan, FaTrash, FaUsers } from "react-icons/fa";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { Link } from "react-router-dom";
import apiClient, { apiEndpoints } from './Apis';

const DistributorsDashboard = () => {
  // State for distributor profile metrics
  const [distributorMetrics, setDistributorMetrics] = useState({
    totalDistributors: 0,
    activeDistributors: 0,
    inactiveDistributors: 0,
    suspendedDistributors: 0,
    deletedDistributors: 0,
    isLoading: true
  });

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all distributor profiles from the Distributers endpoint
        const response = await apiClient.get(apiEndpoints.Distributers);
        
        // Extract distributors array from response
        const distributorsData = Array.isArray(response?.data?.distributors) 
          ? response.data.distributors 
          : (Array.isArray(response?.data) ? response.data : []);
        
        // Count distributors based on different statuses
        // Assuming status field exists, adjust based on your actual data structure
        const activeDistributorsCount = distributorsData.filter(distributor => 
          distributor.status === "active" || distributor.isActive === true || 
          (!distributor.hasOwnProperty('status') && !distributor.suspend && !distributor.deleted)
        ).length;
        
        const inactiveDistributorsCount = distributorsData.filter(distributor => 
          distributor.status === "inactive" || distributor.isActive === false
        ).length;
        
        const suspendedDistributorsCount = distributorsData.filter(distributor => 
          distributor.suspend === 1 || distributor.status === "suspended"
        ).length;
        
        const deletedDistributorsCount = distributorsData.filter(distributor => 
          distributor.deleted === 1 || distributor.status === "deleted"
        ).length;
        
        setDistributorMetrics({
          totalDistributors: distributorsData.length,
          activeDistributors: activeDistributorsCount,
          inactiveDistributors: inactiveDistributorsCount,
          suspendedDistributors: suspendedDistributorsCount,
          deletedDistributors: deletedDistributorsCount,
          isLoading: false
        });

        // Add console logging to debug
        console.log("Distributors data:", distributorsData);
        console.log("Total distributors:", distributorsData.length);
        console.log("Active distributors:", activeDistributorsCount);
        console.log("Inactive distributors:", inactiveDistributorsCount);
        console.log("Suspended distributors:", suspendedDistributorsCount);
        console.log("Deleted distributors:", deletedDistributorsCount);
      } catch (error) {
        console.error("Error fetching distributors data:", error);
        setDistributorMetrics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  // Metrics card configuration with navigation
  const metricsCards = [
    {
      title: "Total Distributors",
      count: distributorMetrics.totalDistributors,
      icon: FaUsers,
      color: "bg-blue-500",
      link: "/distributors/manage"
    },
    {
      title: "Active Distributors",
      count: distributorMetrics.activeDistributors,
      icon: FaUser,
      color: "bg-green-500",
      link: "/distributors/active"
    },
    {
      title: "Inactive Distributors",
      count: distributorMetrics.inactiveDistributors,
      icon: FaUserAlt,
      color: "bg-gray-500",
      link: "/distributors/inactive"
    },

  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-grow p-4 md:p-6 bg-gray-100">
          <div className="container mx-auto mt-2">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Distributors Dashboard</h1>
              <p className="text-gray-600">Overview of all distributors in the system</p>
            </div>
            
            {/* Metrics grid with clickable cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {metricsCards.map(({ title, count, icon: Icon, color, link }) => (
                <Link 
                  to={link} 
                  key={title} 
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{title}</p>
                      <p className="text-2xl font-bold">
                        {distributorMetrics.isLoading ? 'Loading...' : count.toLocaleString()}
                      </p>
                    </div>
                    {Icon && (
                      <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Additional distributor summary section */}
            {!distributorMetrics.isLoading && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Distributors Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {distributorMetrics.totalDistributors}
                    </div>
                    <div className="text-sm text-gray-500">Total Registered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {distributorMetrics.activeDistributors}
                    </div>
                    <div className="text-sm text-gray-500">Currently Active</div>
                  </div>
                
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorsDashboard;