import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints, Uploads } from "./Apis";
import apiClient2, { apiEndpoints2 } from "./Apismongo";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineCalendar,
  AiOutlineMan,
  AiOutlineWoman,
  AiOutlineEnvironment
} from "react-icons/ai";
import Loader from "./Loader";

const ManageBureaus = () => {
  const [bureaus, setBureaus] = useState([]);
  const [filteredBureaus, setFilteredBureaus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State for storing profiles for each bureau
  const [bureauProfiles, setBureauProfiles] = useState({}); // Store profiles for each bureau
  
  const itemsPerPage = 30;
  const profilesPerBureauPerGender = 20; // limit profiles shown per gender to 20 active

  const fetchBureaus = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiEndpoints.BureauManage);
      if (response.data.bureauProfiles) {
        setBureaus(response.data.bureauProfiles);
        // Apply filtering and pagination (profiles for visible page will be fetched in effect)
        filterAndPaginateBureaus(response.data.bureauProfiles, searchQuery, currentPage);
      }
    } catch (error) {
      console.error("Error fetching bureaus:", error);
    } finally {
      setLoading(false);
    }
  };



  // Function to fetch user profiles by bureau and gender
  const fetchUserProfiles = async (bureauId) => {
    try {
      const params = { page: 1, limit: profilesPerBureauPerGender };

      // Fetch male profiles with pagination
      const maleResponse = await apiClient2.get(`${apiEndpoints2.fetchBureauMaleProfiles}/${bureauId}/male`, { params });
      const maleProfiles = maleResponse.data.users || [];

      // Fetch female profiles with pagination
      const femaleResponse = await apiClient2.get(`${apiEndpoints2.fetchBureauFemaleProfiles}/${bureauId}/female`, { params });
      const femaleProfiles = femaleResponse.data.users || [];

      setBureauProfiles(prev => ({
        ...prev,
        [bureauId]: {
          male: maleProfiles,
          female: femaleProfiles
        }
      }));

    } catch (error) {
      console.error("Error fetching user profiles for bureau:", bureauId, error);
      setBureauProfiles(prev => ({
        ...prev,
        [bureauId]: {
          male: [],
          female: []
        }
      }));
    }
  };

  // Function to fetch profiles for all bureaus
  const fetchAllBureauProfiles = async (bureauList) => {
    const promises = bureauList.map(bureau => fetchUserProfiles(bureau.bureauId));
    await Promise.allSettled(promises);
  };

  // Function to fetch profiles for a list of bureaus (current page only)
  const fetchProfilesForVisibleBureaus = async (visibleBureaus) => {
    const promises = visibleBureaus.map(bureau => fetchUserProfiles(bureau.bureauId));
    await Promise.allSettled(promises);
  };


  const filterAndPaginateBureaus = (bureauList, query, page) => {
    // Apply filtering
    const filtered = query.trim() === "" ? 
      bureauList : 
      bureauList.filter((bureau) =>
        (bureau.ownerName && bureau.ownerName.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.email && bureau.email.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.bureauName && bureau.bureauName.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.mobileNumber && bureau.mobileNumber.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.bureauId && bureau.bureauId.toLowerCase().includes(query.toLowerCase()))
      );
    
    // Calculate total pages
    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    // Reset to page 1 if current page is out of bounds
    const validPage = page > totalPagesCount ? 1 : page;
  
    // Apply pagination
    const start = (validPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedResults = filtered.slice(start, end);
    
    // Update state
    setFilteredBureaus(paginatedResults);
    if (validPage !== page) {
      setCurrentPage(validPage);
    }
  };

  useEffect(() => {
    fetchBureaus();
  }, []);

  useEffect(() => {
    // When search query or page changes, filter and paginate the existing data
    filterAndPaginateBureaus(bureaus, searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    // When filtered list for current page changes, fetch only those bureaus' profiles
    if (filteredBureaus && filteredBureaus.length > 0) {
      fetchProfilesForVisibleBureaus(filteredBureaus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBureaus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when search query changes
    setCurrentPage(1);
  };








  

  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };


  
  // Get bureau status class and text
  const getBureauStatusInfo = (bureau) => {
    if (bureau.deleted == 1) {
      return { class: "bg-red-500", text: "Deleted" };
    }
    if (bureau.suspend == 1) {
      return { class: "bg-orange-500", text: "Suspended" };
    }
    return null; // No Paid/Free badges
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Manage Bureaus</h1>
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Bureau ID, Name, Email, Company, or Mobile"
            className="border px-4 py-2 w-full rounded-lg shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <>
          {/* New Responsive Bureau Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredBureaus.length > 0 ? (
              filteredBureaus.map((bureau) => {
                const statusInfo = getBureauStatusInfo(bureau);
                
                return (
                <div
                  key={bureau.bureauId}
                    className={`border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 ${bureau.deleted == 1 ? 'border-red-300 bg-red-50' : bureau.suspend == 1 ? 'border-orange-300 bg-orange-50' : ''}`}
                >
                                    {/* Status badge (only Deleted/Suspended) */}
                  {statusInfo && (
                    <div className={`absolute top-3 left-3 ${statusInfo.class} text-white text-xs px-2 py-1 rounded-full z-10`}>
                      {statusInfo.text}
                    </div>
                  )}
                  
                  {/* New Two-Column Layout */}
                    <div className="flex">
                      {/* Left Column (35%) */}
                      <div className="w-2/5 p-4 border-r border-gray-200">
                        {/* First Row: Bureau Logo */}
                        <div className="mb-4">
                          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-2">
                      <img
                        src={
                          bureau.image
                            ? `${Uploads}/${bureau.image}`
                            : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                        }
                              alt={bureau.bureauName}
                              className={`w-full h-full object-cover rounded-lg border ${bureau.deleted == 1 ? 'opacity-50' : ''}`}
                      />
                    </div>
                          <h3 className="text-center text-sm font-semibold text-gray-800 truncate">
                            {bureau.bureauName}
                          </h3>
                        </div>

                        {/* Second Row: Bureau Location */}
                        <div className="flex items-start">
                          <AiOutlineEnvironment className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-gray-800 mb-1">Location</h4>
                            <p className="text-xs text-gray-600 line-clamp-3">
                              {bureau.location || "Location not available"}
                            </p>
                      </div>
                        </div>
                      </div>

                                            {/* Right Column (65%) */}
                      <div className="w-3/5 p-4">
                        {/* Males Section */}
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <AiOutlineMan className="text-blue-600 mr-2" />
                            <h4 className="font-bold text-sm text-gray-800">Males</h4>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {bureauProfiles[bureau.bureauId]?.male.length > 0 ? (
                              bureauProfiles[bureau.bureauId]?.male.map((profile) => (
                                <div key={profile._id} className="flex-shrink-0">
                                  <img
                                    src={
                                      profile.image
                                        ? `https://mongo.riyatechpark.com/uploads/${profile.image}`
                                        : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                                    }
                                    alt={profile.fullName}
                                    className="w-20 h-16 object-cover rounded-md"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">No male profiles</div>
                            )}
                          </div>
                        </div>

                        {/* Females Section */}
                        <div>
                          <div className="flex items-center mb-2">
                            <AiOutlineWoman className="text-pink-600 mr-2" />
                            <h4 className="font-bold text-sm text-gray-800">Females</h4>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {bureauProfiles[bureau.bureauId]?.female.length > 0 ? (
                              bureauProfiles[bureau.bureauId]?.female.map((profile) => (
                                <div key={profile._id} className="flex-shrink-0">
                                  <img
                                    src={
                                      profile.image
                                        ? `https://mongo.riyatechpark.com/uploads/${profile.image}`
                                        : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-female-avatar-png-image_1934458.jpg"
                                    }
                                    alt={profile.fullName}
                                    className="w-20 h-16 object-cover rounded-md"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">No female profiles</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                );
              })
            ) : (
              <div className="text-center col-span-full py-8 text-gray-500">
                No bureaus found matching your search criteria.
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 overflow-x-auto">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  // Show limited page numbers on mobile
                  if (totalPages > 5 && 
                      (index < currentPage - 2 || index > currentPage + 0) && 
                      index !== 0 && 
                      index !== totalPages - 1) {
                    if (index === currentPage - 3 || index === currentPage + 1) {
                      return <span key={index} className="mx-1">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      

      

    </div>
  );
};

export default ManageBureaus;