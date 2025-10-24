// api.jsx
import axios from 'axios';

const API_BASE_URL = "http://localhost:3200/api";
// Configure default axios instance with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
    },
    // Ensure proper encoding for multi-language support
    transformResponse: [function (data) {
        // Ensure UTF-8 encoding is preserved
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) { 
                return data;
            }
        }
        return data;
    }],
});

// Common API endpoints
export const apiEndpoints = {
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
    PasswordUpdate: "/bureau/PasswordUpdate",
    services:"/services/services",
    location:"/location",
    terms:"/terms",
    profiles:"/profiles",
    bureaubutton:"/bureaubutton/update",
    bureaubuttonfetch:"/bureaubutton/profile-settings",
    testimonials: '/bureau-testimonials2',
    testimonialsFetch: '/bureau-testimonials2/fetch',
    testimonialsFetchPublic: '/bureau-testimonials2/fetch-public',
    customizedLinks: '/customized-links',
    customizedLinksFetch: '/customized-links/fetch',
    customizedLinksFetchPublic: '/customized-links/fetch-public',
    packages: '/packages',
    packagesFetch: '/packages/get',
    packagesFetchPublic: '/pak/package/active',
    NavbarLogoUpdate: "/bureau/uploadLogo",
    bureauall:"/bureau_users",
    filterbureauusers:"/all_bureau_users_filtered",
    profilesgender:"/all_bureau_users_gender",

    
      // Package Management APIs
      getPackageDetails: '/pak/package', // Will be appended with /:userId
      getBureauPackages: '/pak/bureau', // Will be appended with /:bureauId
      createUpdatePackage: '/pak/package',
      activatePackage: '/pak/package', // Will be appended with /:userId/activate
      deactivatePackage: '/pak/package', // Will be appended with /:userId/deactivate
      getAvailableProfiles: '/pak/available-profiles', // Will be appended with /:bureauId
      updateContactVisibility: '/pak/package', // Will be appended with /:userId/contact-visibility
      incrementPackageViews: '/pak/package', // Will be appended with /:userId/increment-views
      checkExpiredPackages: '/pak/package/check-expired',

      // Testimonials2 Management APIs
      testimonials: '/bureau-testimonials2',
      testimonialsFetch: '/bureau-testimonials2/fetch',
      testimonialsPublic: '/bureau-testimonials2/public',
      testimonialsFetchPublic: '/bureau-testimonials2/fetch-public',
      testimonialsSingle: '/bureau-testimonials2/single',
      
      // Manage Videos endpoints
      manageVideos:"videos",
      bureauVideos: "bureau-videos", // Add new endpoint for bureau videos only
      
      // Profile Score endpoint
      profileScore: "/profile-score/get-checkpoints",
      
      // MongoDB Profile Score endpoint
      mongoProfileScore: "http://localhost:3300/api/profile-score/calculate-score",
};

export const Banner = "http://localhost:3200/api";

export const Uploads = "http://localhost:3200/api";
// 

export const WEB_URL = "https://matrimonystudio.in";

// Packages API functions
export const getPackages = async (bureauId) => {
    try {
        const response = await apiClient.post(apiEndpoints.packagesFetch, { bureau_id: bureauId });
        return response;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};

export const createPackage = async (packageData) => {
    try {
        const response = await apiClient.post(apiEndpoints.packages, packageData);
        return response;
    } catch (error) {
        console.error('Error creating package:', error);
        throw error;
    }
};

export const updatePackage = async (id, packageData) => {
    try {
        const response = await apiClient.put(`${apiEndpoints.packages}/${id}`, packageData);
        return response;
    } catch (error) {
        console.error('Error updating package:', error);
        throw error;
    }
};

export const deletePackage = async (id) => {
    try {
        const response = await apiClient.delete(`${apiEndpoints.packages}/${id}`);
        return response;
    } catch (error) {
        console.error('Error deleting package:', error);
        throw error;
    }
};

export const getPackagesPublic = async (bureauId) => {
    try {
        const response = await apiClient.get(`${apiEndpoints.packagesFetchPublic}/${bureauId}`);
        return response;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};

// API call helper functions

export default apiClient;