// api.jsx
import axios from 'axios';

// Preferred base URL from env; falls back to localhost; will auto-fallback to remote if local is down
const ENV_BASE = import.meta?.env?.VITE_MONGO_API_BASE;

const LOCAL_BASE_URL = "http://localhost:3300/";
const API_BASE_URL = (ENV_BASE && ENV_BASE.trim()) || LOCAL_BASE_URL; 

// Configure default axios instance with base URL
const apiClient2 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
apiClient2.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging and auto-fallback to remote API when local server is down
apiClient2.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
            message: error.message
        });
        // If local dev API (localhost) is down, retry once against remote and switch base for future calls
        try {
            const isNetworkOrServerError = !error.response || (error.response.status >= 500);
            const usingLocal = (apiClient2.defaults.baseURL || "").includes("localhost");
            const originalConfig = error.config;
            if (isNetworkOrServerError && usingLocal && originalConfig && !originalConfig.__retriedWithRemote) {
                console.warn('Local API appears down. Retrying with remote base URL:', REMOTE_BASE_URL);
                originalConfig.__retriedWithRemote = true;
                // Temporarily try remote for this request
                return axios({
                    ...originalConfig,
                    baseURL: REMOTE_BASE_URL,
                }).then((res) => {
                    // On success, permanently switch client base to remote to avoid future failures
                    apiClient2.defaults.baseURL = REMOTE_BASE_URL;
                    return res;
                });
            }
        } catch (_) { /* ignore fallback errors */ }
        return Promise.reject(error);
    }
);

// Common API endpoints
export const apiEndpoints2 = {
    register: "api/register",
    users: "api/users",
    update: "api/user",
    userData:"api/userdata",
    userLogin : "api/login",
    fetchbureau: "api/bureau",
    user: "api/user",
    userDataOnGender:"api/userdataongender",
    userDataonGenderexeptbureau: "api/userdataongenderexeptthatbureau",
    userDataMypreferencesOtherBureaus : "api/userDataMypreferencesOtherBureaus",
    userDataMypreferencesAllBureaus:"api/userDataMypreferencesAllBureaus",
    userDataMypreferences:"api/userDataMypreferences",
    fetchotherbureau: "api/bureau/except/gender",
    fetchotherbureaumain: "api/bureau/except",
    usergallery: "api/usergallery",
    userssearch: "api/users/search",
    userImageupdate: "api/update-image",
    fetchpending:"api/bureaupendinguser",
    sendInterest: 'api/send-interest',
    getSentInterests: 'api/sent-interests',
    getReceivedInterests: 'api/interests/received-interests',
    respondToInterest: 'api/interests/respond-interest', // append /:interestId
    withdrawInterest: 'api/interests/withdraw-interest', // append /:interestId
    getInterestStats: 'api/interests/interest-stats',
    getInterestDetails: 'api/interests/interest', // append /:interestId
    // Omit :id placeholder
    addToShortlist: 'api/shortlist/add',
    getShortlist: 'api/shortlist/list',
    removeFromShortlist: 'api/shortlist/remove',
    checkShortlist: 'api/shortlist/check',
    incrementViews: 'api/user', // Will be appended with /:id/increment-views
    advancedSearch: 'api/user-advanced-search', // New advanced search endpoint
    profileCompleteness: 'api/profile-completeness',
};
export const Uploads = "http://localhost:3200/api/uploads/";
 
export const Uploads2 = "https://localhost:3200/api/";
// API call helper functions

export default apiClient2;
