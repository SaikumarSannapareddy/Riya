import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import {  FaImage,FaEdit } from 'react-icons/fa';
const UploadImageButton = () => {
  const [profileImage, setProfileImage] = useState(null);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => { 
    const fetchProfileImage = async () => { 
      try {
        const response = await apiClient.get(apiEndpoints.profiles, {
          headers: { bureauId },
        });

        if (response.data.profile_img) {
          setProfileImage(response.data.profile_img); 
        } else {
          setProfileImage(null); 
        }
      } catch (err) {
        console.error("Error fetching profile image:", err);
        setProfileImage(null);
      }
    };

    fetchProfileImage();
  }, [bureauId]);

  // If profile image exists, don't show button
  if (profileImage) return null;

  return (
     <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaImage className="mr-2"/>     Profile Image  
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadImageButton;
