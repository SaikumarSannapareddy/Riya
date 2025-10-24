import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaFileContract,FaEdit } from "react-icons/fa";

const UploadTerms = () => {
  const [hasTerms, setHasTerms] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.terms, {
          headers: {
            "Accept": "application/json; charset=utf-8",
          },
        });

        // find terms for current bureauId
        const bureauTerms = response.data.find(
          (term) => String(term.bureau_id) === String(bureauId)
        );

        if (bureauTerms && bureauTerms.term && bureauTerms.term.trim() !== "") {
          setHasTerms(true); // Terms exist
        } else {
          setHasTerms(false); // No terms saved
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        setHasTerms(false);
      }
    };

    if (bureauId) fetchTerms();
  }, [bureauId]);

  // Hide button if terms exist
  if (hasTerms) return null;

  return (
    <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaFileContract className="mr-2"/>  Add Terms & Conditions   
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadTerms;
