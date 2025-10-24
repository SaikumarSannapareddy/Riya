import axios from 'axios';
const API_BASE_URL = "http://localhost:3300/";


// Configure default axios instance with base URL
const apiClient2 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Common API endpoints
export const apiEndpoints2 = {
    register: "api/register",
    users: "api/users",
    update: "api/user",
    fetchbureau: "api/bureau",
    user: "api/user",
    fetchotherbureau: "api/bureau/except/gender",
    fetchotherbureaumain: "api/bureau/except",
    usergallery: "api/usergallery",
    userssearch: "api/users/search",
    userImageupdate: "api/update-image",
    fetchpending:"api/bureaupendinguser",
      // Omit :id placeholder
      visibletoall: 'api/profiles/visibletoall',
      showotherprofiles:'api/showotherprofiles',
      reportProfile:"api/profiles/report",
      shortlistprofile:"api/profiles/shortlist",
      profilesfind :"api/profiles",
  
      // Additional profile endpoints
      fetchPublicProfiles: 'api/profiles/visibletoall/public/profiles',
      bulkUpdateVisibility: 'api/profiles/visibletoall/bulk',
      userbymartial:'api/userbymartial',
      sendinterest:'api/send-interestbybureau',
      incrementViews: 'api/user', // Will be appended with /:id/increment-views

      getNotifications:"api/get-notifications",
      updateNotificationStatus:"api/update-notification-status",
};
export const Uploads = "http://localhost:3200/api/uploads/";
export const Uploads2 = "https://localhost:3200/api/";
// export const Uploads = "https://mongodb.riyatechpark.com/api/uploads/";
// export const Uploads2 = "https://mongodb.riyatechpark.com/api/";
// API call helper functions

export default apiClient2;
