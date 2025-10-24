import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaCogs,FaEdit } from "react-icons/fa";

const UploadServices = () => {
  const [hasServices, setHasServices] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.services}/${bureauId}`);

        if (
          response.data &&
          ((Array.isArray(response.data) && response.data.length > 0) ||
            (Array.isArray(response.data.data) && response.data.data.length > 0))
        ) {
          setHasServices(true); // Services exist
        } else {
          setHasServices(false); // No services yet
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setHasServices(false);
      }
    };

    if (bureauId) fetchServices();
  }, [bureauId]);

  // Hide button if services exist
  if (hasServices) return null;

  return (
    <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaCogs className="mr-2"/>   Manage Services  
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadServices;
