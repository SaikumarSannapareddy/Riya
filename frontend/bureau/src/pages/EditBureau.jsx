import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import UploadImageButton from "./UploadImageButton";
import UploadSliders from "./UploadSliders";
import AddLocationButton from "./AddLocation";
import UploadLinks from "./UploadLinks";
// import UploadBannerButton from "./UploadBannerButton";
import UploadTerms from "./UploadTerms";
import UploadPackages from "./UploadPackages";
import UploadServices from "./UploadServices";
import UploadNavbarLogoButton from "./UploadNavbar";
import UploadSuccess from "./UploadSuccess";
import UploadTestimonial from "./UploadTestimonial";
import { useTranslation } from "react-i18next";


const EditProfile = () => {
      const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-2 p-4 overflow-x-scroll button-container">
        <UploadImageButton />
    <UploadSliders />
    <AddLocationButton />
    <UploadLinks /> 
    {/* <UploadBannerButton />  */}
    <UploadTerms />
    <UploadPackages />
    <UploadServices /> 
    <UploadNavbarLogoButton />
    <UploadSuccess />
    <UploadTestimonial />
    </div>
    </div>
  );
};

export default EditProfile;
