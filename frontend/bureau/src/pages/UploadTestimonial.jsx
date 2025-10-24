import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis";
import { FaQuoteRight,FaEdit } from "react-icons/fa";

const UploadTestimonial = () => {
  const [hasTestimonials, setHasTestimonials] = useState(false);
  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.post(`${apiEndpoints.testimonials}/fetch`, {
          bureau_id: bureauId,
        });

        if (
          response.data &&
          response.data.success &&
          response.data.testimonials &&
          response.data.testimonials.length > 0
        ) {
          setHasTestimonials(true); // Testimonials exist
        } else {
          setHasTestimonials(false); // No testimonials yet
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setHasTestimonials(false);
      }
    };

    if (bureauId) fetchTestimonials();
  }, [bureauId]);

  // Hide button if testimonials already exist
  if (hasTestimonials) return null;

  return (
    <div className="flex justify-center mt-4">
            <div  className="px-12 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 " >
               <p className="text-center">Pending</p>
            <NavLink
            to="/sliderimages" className="flex items-center" >
            <FaQuoteRight className="mr-2"/>     Add Testimonials  
                    <FaEdit size={20} className=" ml-2" /> 
                </NavLink> 
            </div>
        </div>
  );
};

export default UploadTestimonial;
