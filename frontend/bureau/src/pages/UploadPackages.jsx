import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaBoxOpen,FaEdit } from "react-icons/fa";

const UploadPackages = () => {
  const [hasPackages, setHasPackages] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiClient.post(
          `${apiEndpoints.getBureauPackages}/${bureauId}`
        );

        if (
          response.data &&
          ((Array.isArray(response.data) && response.data.length > 0) ||
            (Array.isArray(response.data.packages) &&
              response.data.packages.length > 0) ||
            (Array.isArray(response.data.data) &&
              response.data.data.length > 0))
        ) {
          setHasPackages(true); // Packages exist
        } else {
          setHasPackages(false); // No packages yet
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setHasPackages(false);
      }
    };

    if (bureauId) fetchPackages();
  }, [bureauId]);

  // If packages already exist, hide the button
  if (hasPackages) return null;

  return (
     <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaBoxOpen className="mr-2"/>    Manage Packages  
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadPackages;
