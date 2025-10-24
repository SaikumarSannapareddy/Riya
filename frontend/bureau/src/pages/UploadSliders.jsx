import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaSlidersH,FaEdit } from 'react-icons/fa';

const UploadSliders = () => { 
  const [hasImages, setHasImages] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.BureauGetsliderimages}/${bureauId}`);
        if (response.data && response.data.data && response.data.data.length > 0) {
          setHasImages(true); // Images exist
        } else {
          setHasImages(false); // No images yet
        } 
      } catch (err) {
        console.error("Error fetching banner images:", err);
        setHasImages(false);
      }
    };

    fetchImages();
  }, [bureauId]);

  // Hide button if images exist
  if (hasImages) return null;

  return (
    <div className="flex justify-center mt-4">
        <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
           <p className="text-center">Pending</p>
        <NavLink
        to="/sliderimages" className="flex items-center" >
        <FaSlidersH className="mr-2"/>    Slider Images  
                <FaEdit size={20} className=" ml-2" /> 
            </NavLink> 
        </div>
    </div>
  );
};

export default UploadSliders;
