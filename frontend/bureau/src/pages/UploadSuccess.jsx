import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaImages,FaEdit } from "react-icons/fa";

const UploadSuccess = () => {
  const [hasGallery, setHasGallery] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.Galleryimagesfetch}/${bureauId}`);

        if (response.data && response.data.data && response.data.data.length > 0) {
          setHasGallery(true); // Gallery images exist
        } else {
          setHasGallery(false); // No gallery images
        }
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setHasGallery(false);
      }
    };

    if (bureauId) fetchGallery();
  }, [bureauId]); 

  // If gallery images exist, don't show the button
  if (hasGallery) return null;

  return (
        <div className="flex justify-center mt-4">
                <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
                   <p className="text-center">Pending</p>
                <NavLink
                to="/sliderimages" className="flex items-center" >
                <FaImages className="mr-2"/>   Success Stories  
                        <FaEdit size={20} className=" ml-2" /> 
                    </NavLink> 
                </div>
            </div>
  );
};

export default UploadSuccess;
