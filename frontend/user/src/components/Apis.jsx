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
    Createdistributers: "/distributor/create",
    AdminLogin: "/admin/login",
    BureauManage: "/bureau_profiles",
    Bureauupdate: "/bureau/update-status",
    Testimonials:"testimonials",
    Testimonialsupdate:"testimonials-update",
    TestimonialAdding:"testimonials-adding",
    Testimonialsdelete:"testimonials-delete",
    paymentTransaction:"bureau/add-transaction",
    DistributorDelete: "/distributor/delete",
    bureaudelete: "/bureau/delete",
    passwordUpdate:"/bureau/PasswordUpdateadmin",
    bureaudetails : "/bureau_profiles_bureauId",
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

    locationlinks:"locationlinks",
    locationlinksupdate:"locationlinks-update",
    locationlinksAdding:"locationlinks-adding",
    locationlinksdelete:"locationlinks-delete",
   
    // Add more endpoints as needed
};

export const Uploads = "http://localhost:3200/api";


// API call helper functions

export default apiClient;
