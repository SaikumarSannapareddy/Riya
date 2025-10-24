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
    DistributerLogin: "/distributor/login",
    MyBureauProfiles: "/bureau_profiles_distributer",
    CreateBureau: "/bureau/create",
    
    DistributorDelete: "/distributor/delete",
    bureaudelete: "/bureau/delete"
    // Add more endpoints as needed
};


export const Uploads = "https://localhost:3300/api";
// API call helper functions

export default apiClient;
