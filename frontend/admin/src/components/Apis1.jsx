// api.jsx
import axios from 'axios';

const API_BASE_URL = "http://localhost:3300/"; 

// Configure default axios instance with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints = {
    register: "api/register",
    users: "api/users",
    update: "api/user",
    fetchbureau: "api/bureau",
    user: "api/user",
    fetchotherbureau: "api/bureau/except",
     Males: "api/gender/male",
        Females: "api/gender/female"
      // Omit :id placeholder
};
export const Uploads = "http://localhost:3300/api/uploads/";

// API call helper functions

export default apiClient;
