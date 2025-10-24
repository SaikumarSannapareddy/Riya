import React, { useState, useEffect } from "react";
import { FaUser, FaMale, FaFemale, FaExclamationTriangle, FaCalendarDay, FaBan, FaFlag, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { Link } from "react-router-dom";
import apiClientfecth, { apiEndpointsfetch } from './Apis3';

const ProfilesDashboard = () => {
  // State for profile metrics
  const [profileMetrics, setProfileMetrics] = useState({
    totalProfiles: 0,
    maleProfiles: 0,
    femaleProfiles: 0,
    incompleteProfiles: 0,
    todayProfiles: 0,
    suspendedProfiles: 0,
    reportedProfiles: 0,
    deletedProfiles: 0,
    isLoading: true
  });

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiClientfecth.get(apiEndpointsfetch.counts);

        setProfileMetrics({
          totalProfiles: data?.total ?? 0,
          maleProfiles: data?.male ?? 0,
          femaleProfiles: data?.female ?? 0,
          incompleteProfiles: data?.incomplete ?? 0,
          todayProfiles: data?.today ?? 0,
          suspendedProfiles: data?.suspended ?? 0,
          reportedProfiles: data?.reported ?? 0,
          deletedProfiles: data?.deleted ?? 0,
          isLoading: false
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfileMetrics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  // Metrics card configuration with navigation
  const metricsCards = [
    {
      title: "Total Profiles",
      count: profileMetrics.totalProfiles,
      icon: FaUser,
      color: "bg-blue-500",
      link: ""
    },
    {
      title: "Male Profiles",
      count: profileMetrics.maleProfiles,
      icon: FaMale,
      color: "bg-indigo-500",
      link: "/user/male-profiles"
    },
    {
      title: "Female Profiles",
      count: profileMetrics.femaleProfiles,
      icon: FaFemale,
      color: "bg-pink-500",
      link: "/user/female-profiles"
    },
    {
      title: "Incomplete",
      count: profileMetrics.incompleteProfiles,
      icon: FaExclamationTriangle,
      color: "bg-yellow-500",
      link: "/incomplete-profiles"
    },
    {
      title: "Today's Profiles",
      count: profileMetrics.todayProfiles,
      icon: FaCalendarDay,
      color: "bg-green-500",
      link: "/todays-profiles"
    },
    {
      title: "Suspended",
      count: profileMetrics.suspendedProfiles,
      icon: FaBan,
      color: "bg-orange-500",
      link: "/suspended-profiles"
    },
    {
      title: "Reported",
      count: profileMetrics.reportedProfiles,
      icon: FaFlag,
      color: "bg-red-500",
      link: "/reported-profiles"
    },
    {
      title: "Deleted",
      count: profileMetrics.deletedProfiles,
      icon: FaTrash,
      color: "bg-gray-500",
      link: "/deleted-profiles"
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
              <h1 className="text-2xl font-bold text-gray-800">Profiles Dashboard</h1>
              <p className="text-gray-600">Overview of all user profiles in the system</p>
            </div>
            
            {/* Metrics grid with clickable cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {metricsCards.map(({ title, count, icon: Icon, color, link }) => (
                <Link 
                  to={link} 
                  key={title} 
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{title}</p>
                      <p className="text-xl font-bold">
                        {profileMetrics.isLoading ? 'Loading...' : count.toLocaleString()}
                      </p>
                    </div>
                    {Icon && (
                      <div className={`p-2 rounded-full ${color}`}>
                        <Icon className="text-white text-lg" />
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