// api.jsx
import axios from 'axios';


const API_BASE_URL = "http://localhost:3300/api";

// Configure default axios instance with base URL
const apiClient2 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints2 = {


   
    // MongoDB User Profile endpoints for bureau gender profiles
    fetchBureauMaleProfiles: "/bureau", // GET /bureau/:bureauId/male
    fetchBureauFemaleProfiles: "/bureau", // GET /bureau/:bureauId/female
    fetchBureauPendingMaleProfiles: "/bureaupendinguser", // GET /bureaupendinguser/:bureauId/male
    fetchBureauPendingFemaleProfiles: "/bureaupendinguser", // GET /bureaupendinguser/:bureauId/female
   
    // Add more endpoints as needed
};

export const Uploads = "http://localhost:3200/api";

// API call helper functions

export default apiClient2;
