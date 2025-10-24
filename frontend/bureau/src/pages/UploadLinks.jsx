import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaLink, FaEdit} from "react-icons/fa";

const UploadLinks = () => {
  const [hasLinks, setHasLinks] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await apiClient.post(`${apiEndpoints.customizedLinks}/fetch`, {
          bureau_id: bureauId,
        });
        if (response.data?.success && response.data.links?.length > 0) {
          setHasLinks(true); // Links exist
        } else {
          setHasLinks(false); // No links yet
        }
      } catch (err) {
        console.error("Error fetching customized links:", err);
        setHasLinks(false);
      }
    };

    fetchLinks();
  }, [bureauId]);

  // Hide button if links exist
  if (hasLinks) return null;

  return (
    <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaLink className="mr-2"/>    Custom Links 
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadLinks;
