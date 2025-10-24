// api.jsx
import axios from 'axios';


const API_BASE_URL = "http://localhost:3200/api";

// Configure default axios instance with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints = {
    Distributers: "/distributors",
    Createdistributors: "/distributor/create",
    AdminLogin: "/admin/login",
    BureauManage: "/bureau_profiles",
    BureauCounts: "/bureau_counts",
    Bureauupdate: "/bureau/update-status",
    Testimonials:"testimonials",
    Testimonialsupdate:"testimonials-update",
    TestimonialAdding:"testimonials-adding",
    Testimonialsdelete:"testimonials-delete",
    paymentTransaction:"bureau/add-transaction",
    DistributorDelete: "/distributor/delete",
    bureaudelete: "/bureau/delete",
    passwordUpdate:"/bureau/PasswordUpdateadmin",
    PasswordUpdate:"/bureau/PasswordUpdateadmin",
    Caste: "caste", 
    Castesubmit: "castesubmit",
    SubCaste: "/sub_caste",
    SubmitSubcaste:"submit_sub_caste",
    education : "education",
    submitEducation:"submit_education",
    Occupation : "occupation",
    submitOccupation: "submit_occupation",
    Country: "country",
    SubmitCountry: "submit_country",
    State : "state",
    SubmitState : "submit_state",
    City : "city",
    SubmitCity : "submit_city",
    Star: "Star",
    SubmitStar: "submit_star",

    getBusinessDetails: "/buname",
    updateBusinessName: "/admin/business-name",
    updateBusinessabout: "/business-aboutus",
    updateLogo: '/logo',
    Sliderimages : '/slider-images',
    Successstories :'success-stories',
    updateContact : '/business-contact',
    updateSocialmedia : '/social-media-links',
    updateaddress : 'business-address',

    Testimonials1:"testimonials1",
    Testimonialsupdate1:"testimonials1-update",
    TestimonialAdding1:"testimonials1-adding",
    Testimonialsdelete1:"testimonials1-delete",

    Testimonials2:"testimonials2",
    Testimonialsupdate2:"testimonials2-update",
    TestimonialAdding2:"testimonials2-adding",
    Testimonialsdelete2:"testimonials2-delete",

    videolinks:"videolinks",
    videolinksupdate:"videolinks-update",
    videolinksAdding:"videolinks-adding",
    videolinksdelete:"videolinks-delete",
    uploadThumbnail:"upload-thumbnail",
    
    // Manage Videos endpoints
    manageVideos:"videos",
    manageVideosStats:"videos/stats",
    manageVideosUploadThumbnail:"upload-thumbnail",

    locationlinks:"locationlinks",
    locationlinksupdate:"locationlinks-update",
    locationlinksAdding:"locationlinks-adding",
    locationlinksdelete:"locationlinks-delete",

    packages:"packages",
    packageBanners:"/packages",
    packageBannerImages:"/package_banners",
    CreateBureau: "/bureau/create",
   
    // Recent bureaus (last 7 days)
    BureauRecent: "/bureau_recent",
    BureauRecentCount: "/bureau_recent_count",
    BureauExpired: "/bureau_expired",
    BureauExpiredCount: "/bureau_expired_count",
    
    // Alternative endpoint for bureaus with profile images
    BureauManageWithImages: "/bureau_profiles_with_images",
    
    // Add more endpoints as needed
    // MongoDB Profile Score endpoint
    mongoProfileScore: "http://localhost:3300/api/profile-score/calculate-score",
    
    // Bureau Login endpoint
    BureauLogin: "/bureaulogin",
    
    // Bureau Details endpoint
    BureauDetails: "/admin/bureau_details",
    
    // MongoDB Profile Score endpoint
    mongoProfileScore: "http://localhost:3300/api/profile-score/calculate-score",

    // Profile Management
    DeleteIncompleteProfiles: "/admin/delete-incomplete-profiles",
};

export const Uploads = "http://localhost:3200/api";

// API call helper functions

export default apiClient;

// Bureau Login function
export const bureauLogin = async (mobileNumber, password) => {
    try {
        const response = await apiClient.post(apiEndpoints.BureauLogin, {
            email: mobileNumber, // The backend expects 'email' field but we pass mobile number
            password: password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
