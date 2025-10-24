// api.jsx
import axios from 'axios';

const API_BASE_URL = "http://localhost:3200/api";
// Configure default axios instance with base URL
const apiClient1 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints1 = {
    Distributers: "/distributors",
    Createdistributers: "/distributor/create",
    AdminLogin: "/admin/login",
    BureauManage: "/bureau_profiles",
    DistributerLogin: "/distributor/login",
    MyBureauProfiles: "/bureau_profiles_distributer",
    CreateBureau: "/bureau/create",
    bureaudetails : "/bureau_profiles_bureauId",
    BureauLogin : "/bureaulogin",
    Bureauupdate: "/bureau/update",
    Bureauimageupdate: "/bureau/uploadBanner",
    BureauSliderimages: "/bureau/slider",
    BureauGetsliderimages: "/bureau/getBannerImages",
    DeleteSliderimage: "/deleteBannerImage",
    GalleryUpload: "/gallery/upload",
    Galleryimagesfetch: "/bureau/getGalleryImages",  
    Deletegallery: "/deleteGalleryImage",  // Add more endpoints as needed
    PasswordUpdate: "/bureau/PasswordUpdate"
};
export const Banner = "http://localhost:3300/api";

export const WEB_URL = "#";// Make sure this is correctly exported


// API call helper functions

export default apiClient1;