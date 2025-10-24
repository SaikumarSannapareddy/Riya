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
    fetchotherbureau: "api/bureau/except/gender",
    fetchotherbureaumain: "api/bureau/except",
    usergallery: "api/usergallery",
    userssearch: "api/users/search",
    userImageupdate: "api/update-image",
    fetchpending:"api/bureaupendinguser",
    checkMobile: "api/check-mobile",
    
      // Omit :id placeholder
      visibletoall: 'api/profiles/visibletoall', 
      showotherprofiles:'api/showotherprofiles',
      reportProfile:"api/profiles/report",
      shortlistprofile:"api/profiles/shortlist", 
      profilesfind :"api/profiles",
      completedProfiles:"api/bureau/complete-profiles",
  
      // Additional profile endpoints
      fetchPublicProfiles: 'api/profiles/visibletoall/public/profiles',
      bulkUpdateVisibility: 'api/profiles/visibletoall/bulk',
      userbymartial:'api/userbymartial',
      sendinterest:'api/send-interestbybureau',
      incrementViews: 'api/user', // Will be appended with /:id/increment-views

      getNotifications:"api/get-notifications",
      updateNotificationStatus:"api/update-notification-status",
      getSentInterests:"api/get-sent-interests",
      getNotificationCount:"api/get-notification-count",
      markAllNotificationsSeen:"api/mark-all-notifications-seen",
      dontShowAgain:"api/dontshowagain",
      
      // My Interests Management endpoints (same bureau)
      sendMyInterest: "api/send-my-interest",
      getMyNotifications: "api/get-my-notifications",
      getMySentInterests: "api/get-my-sent-interests",
      updateMyNotificationStatus: "api/update-my-notification-status",
      getMyNotificationCount: "api/get-my-notification-count",
      markAllMyNotificationsSeen: "api/mark-all-my-notifications-seen",
      getAllMyInterests: "api/get-all-my-interests",
      deleteMyInterest: "api/delete-my-interest",
      
      // Advanced Search endpoint
      advancedSearch: "api/user-advanced-search",

      // Service preference/package endpoints
      getPackageDetails: 'api/package', // Usage: `${getPackageDetails}/${userId}`
      createUpdatePackage: 'api/package', // POST
      activatePackage: 'api/package', // Usage: `${activatePackage}/${userId}/activate`
      deactivatePackage: 'api/package', // Usage: `${deactivatePackage}/${userId}/deactivate`
      getAvailableProfiles: 'api/package/bureau', // Usage: `${getAvailableProfiles}/${bureauId}`

};
export const Uploads = `${API_BASE_URL}api/uploads/`;

export const Uploads2 = "https://localhost:3200/api/";
// API call helper functions

export default apiClient;
