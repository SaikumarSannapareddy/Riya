import React, { useState, useEffect } from "react";
import { FaUser, FaCreditCard, FaUserAlt, FaBan, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { Link } from "react-router-dom";
import apiClient, { apiEndpoints } from './Apis';

const ProfilesDashboard = () => {
  // State for bureau profile metrics
  const [bureauMetrics, setBureauMetrics] = useState({
    totalBureaus: 0,
    freeBureaus: 0,
    paidBureaus: 0,
    suspendedBureaus: 0,
    deletedBureaus: 0,
    recentBureaus: 0,
    expiredBureaus: 0,
    isLoading: true
  });

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all bureau profiles and counts
        const [response, recentCountResp, expiredCountResp] = await Promise.all([
          apiClient.get(apiEndpoints.BureauManage),
          apiClient.get(apiEndpoints.BureauRecentCount),
          apiClient.get(apiEndpoints.BureauExpiredCount)
        ]);
        
        // Make sure we have an array of data
        const bureauData = Array.isArray(response?.data?.bureauProfiles) 
          ? response.data.bureauProfiles 
          : (Array.isArray(response?.data) ? response.data : []);
        
        // Count bureaus based on payment and suspension status
        const freeBureausCount = bureauData.filter(bureau => 
          bureau.paymentStatus != 1 && bureau.deleted != 1 && bureau.suspend != 1
        ).length;
        const paidBureausCount = bureauData.filter(bureau => 
          bureau.paymentStatus == 1 && bureau.deleted != 1 && bureau.suspend != 1
        ).length;
        const suspendedBureausCount = bureauData.filter(bureau => bureau.suspend == 1).length;
        const deletedBureausCount = bureauData.filter(bureau => bureau.deleted == 1).length;
        
        setBureauMetrics({
          totalBureaus: bureauData.length,
          freeBureaus: freeBureausCount,
          paidBureaus: paidBureausCount,
          suspendedBureaus: suspendedBureausCount,
          deletedBureaus: deletedBureausCount,
          recentBureaus: recentCountResp?.data?.count ?? 0,
          expiredBureaus: expiredCountResp?.data?.count ?? 0,
          isLoading: false
        });

        // Add console logging to debug
        console.log("Bureau data:", bureauData);
        console.log("Total bureaus:", bureauData.length);
        console.log("Free bureaus:", freeBureausCount);
        console.log("Paid bureaus:", paidBureausCount);
        console.log("Suspended bureaus:", suspendedBureausCount);
        console.log("Deleted bureaus:", deletedBureausCount);
        
        // Log sample bureau data to check paymentStatus format
        if (bureauData.length > 0) {
          console.log("Sample bureau paymentStatus:", bureauData[0].paymentStatus, typeof bureauData[0].paymentStatus);
        }
      } catch (error) {
        console.error("Error fetching bureau data:", error);
        setBureauMetrics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  // Metrics card configuration with navigation
  const metricsCards = [
    {
      title: "Total Bureau Profiles",
      count: bureauMetrics.totalBureaus,
      icon: FaUser,
      color: "bg-blue-500",
      link: "/bureau/manage"
    },
    {
      title: "Recent (7 days)",
      count: bureauMetrics.recentBureaus,
      icon: FaUser,
      color: "bg-teal-600",
      link: "/bureaus/recent"
    },
    {
      title: "Free Bureau Profiles",
      count: bureauMetrics.freeBureaus,
      icon: FaUserAlt,
      color: "bg-green-500",
      link: "/bureaus/free"
    },
    {
      title: "Paid Bureau Profiles",
      count: bureauMetrics.paidBureaus,
      icon: FaCreditCard,
      color: "bg-purple-500",
      link: "/bureaus/paid"
    },
    {
      title: "Suspended Bureaus",
      count: bureauMetrics.suspendedBureaus,
      icon: FaBan,
      color: "bg-orange-500",
      link: "/bureaus/suspended"
    },
    {
      title: "Deleted Bureaus",
      count: bureauMetrics.deletedBureaus,
      icon: FaTrash,
      color: "bg-red-500",
      link: "/bureaus/deleted"
    },
    {
      title: "Expired Bureaus",
      count: bureauMetrics.expiredBureaus,
      icon: FaCreditCard,
      color: "bg-gray-700",
      link: "/bureaus/expired"
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Bureau Profiles Dashboard</h1>
              <p className="text-gray-600">Overview of all bureau profiles in the system</p>
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
                        {bureauMetrics.isLoading ? 'Loading...' : count.toLocaleString()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilesDashboard;