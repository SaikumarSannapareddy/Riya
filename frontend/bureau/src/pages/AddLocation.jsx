import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaMapMarkerAlt,FaEdit} from 'react-icons/fa';

const AddLocationButton = () => {
  const [hasLocations, setHasLocations] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.location);
        if (response.data && Array.isArray(response.data)) {
          const numericBureauId = Number(bureauId);
          const filtered = response.data.filter(
            (loc) => Number(loc.bureau_id) === numericBureauId
          );
          setHasLocations(filtered.length > 0);
        } else {
          setHasLocations(false);
        }
      } catch (error) {
        console.error("Error checking locations:", error);
        setHasLocations(false);
      }
    };

    if (bureauId) fetchLocations();
  }, [bureauId]);

  // Hide button if location exists
  if (hasLocations) return null;

  return ( 
     <div className="flex justify-center mt-4">
                <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
                   <p className="text-center">Pending</p>
                <NavLink
                to="/sliderimages" className="flex items-center" >
                <FaMapMarkerAlt className="mr-2"/>    Your Locations  
                        <FaEdit size={20} className=" ml-2" /> 
                    </NavLink> 
                </div>
            </div>
  );
};

export default AddLocationButton;
