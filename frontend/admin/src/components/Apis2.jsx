// api.jsx
import axios from 'axios';


const API_BASE_URL = "http://localhost:3200/api";

// Configure default axios instance with base URL
const apiClient2 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints2 = {
    Distributers: "/distributors",
    Createdistributers: "/distributor/create",
    AdminLogin: "/admin/login",
    BureauManage: "/bureau_profiles",
    DistributorDelete: "/distributor/delete",
    bureaudelete: "/bureau/delete",
    passwordUpdate:"/bureau/PasswordUpdateadmin",
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
   
    // MongoDB User Profile endpoints for bureau gender profiles
    fetchBureauMaleProfiles: "/bureau", // GET /bureau/:bureauId/male
    fetchBureauFemaleProfiles: "/bureau", // GET /bureau/:bureauId/female
    fetchBureauPendingMaleProfiles: "/bureaupendinguser", // GET /bureaupendinguser/:bureauId/male
    fetchBureauPendingFemaleProfiles: "/bureaupendinguser", // GET /bureaupendinguser/:bureauId/female
   
    // Add more endpoints as needed
};
// 
export const Uploads = "http://localhost:3200/api";

// API call helper functions

export default apiClient2;
