import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaImage,FaEdit } from "react-icons/fa";

const UploadNavbarLogoButton = () => {
  const [hasLogo, setHasLogo] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data.bureauProfiles?.[0];
        if (bureauData && bureauData.navbarLogo) {
          setHasLogo(true); // Logo exists → hide button
        } else {
          setHasLogo(false); // No logo → show button
        }
      } catch (err) {
        console.error("Error fetching navbar logo:", err);
        setHasLogo(false);
      }
    };

    if (bureauId) fetchLogo();
  }, [bureauId]);

  // Hide button if logo exists
  if (hasLogo) return null;

  return (
    <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaImage className="mr-2"/>  Navbar Logo  
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadNavbarLogoButton;
