import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaImage,FaEdit } from "react-icons/fa";

const UploadBannerButton = () => {
  const [hasBanner, setHasBanner] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${bureauId}`);
        const bureauData = response.data?.bureauProfiles?.[0];

        if (bureauData?.welcomeImageBanner) {
          setHasBanner(true); // Banner image exists
        } else {
          setHasBanner(false); // No banner yet
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
        setHasBanner(false);
      }
    };

    fetchBanner();
  }, [bureauId]);

  // Hide button if banner already uploaded
  if (hasBanner) return null; 

  return (
    <div className="flex justify-center mt-4">
      <NavLink
        to="/welcomebanner"
        className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center"
      >
        <FaImage className="mr-2" />  Edit Main Banner
        <FaEdit size={20} className=" ml-2" /> 
      </NavLink>
    </div>
  );
};

export default UploadBannerButton;
