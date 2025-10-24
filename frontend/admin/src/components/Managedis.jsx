import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints, Uploads } from "./Apis";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineShop,
} from "react-icons/ai";
import Loader from "./Loader"; // Importing the loader component

const ManageDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const itemsPerPage = 10;

  // Fetch distributors from the API
  const fetchDistributors = async () => {
    setLoading(true); // Show loader while fetching data
    try {
      const response = await apiClient.get(apiEndpoints.Distributers);
      const data = response.data;
  
      // Search logic to include mobile number
      const filteredDistributors = data.distributors.filter((distributor) =>
        distributor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distributor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distributor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distributor.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      const totalItems = filteredDistributors.length;
      setDistributors(
        filteredDistributors.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error("Error fetching distributors:", error);
    } finally {
      setLoading(false); // Hide loader after fetching is complete
    }
  };
  

  // Delete distributor
  const deleteDistributor = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this distributor?");
    if (!confirmDelete) return;

    setLoading(true); // Show loader while deleting
    try {
      await apiClient.delete(`${apiEndpoints.DistributorDelete}/${id}`);
      alert("Distributor deleted successfully!");
      fetchDistributors(); // Refresh the distributors list after deletion
    } catch (error) {
      console.error("Error deleting distributor:", error);
      alert("Failed to delete the distributor. Please try again.");
    } finally {
      setLoading(false); // Hide loader after operation
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Fetch data when page loads, currentPage changes, or search query changes
  useEffect(() => {
    fetchDistributors();
  }, [currentPage, searchQuery]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Distributors</h1>

      {/* Search Bar */}
      <div className="mb-4 flex items-center w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Email, or Company, Or Mobile Number"
          className="border px-4 py-2  rounded-lg w-full"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader /> {/* Show loader while data is being fetched */}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distributors.length > 0 ? (
              distributors.map((distributor) => (
                <div
                  key={distributor.id}
                  className="border rounded-lg shadow p-4 bg-white flex flex-col md:flex-row"
                >
                  {/* Image */}
                  <img
                    src={
                      distributor.owner_profile
                        ? `${Uploads}/${distributor.owner_profile}`
                        : "/default-avatar.png"
                    }
                    alt={distributor.fullName}
                    className="w-40 h-40 object-cover rounded-lg border mb-4 md:mb-0 md:mr-4"
                  />

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="mb-2 flex items-center">
                      <AiOutlineUser className="text-gray-600 mr-2" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-gray-800">Name</h3>
                        <p className="text-gray-600 truncate">
                          {distributor.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlineMail className="text-gray-600 mr-2" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-gray-800">Email</h3>
                        <p className="text-gray-600 truncate">
                          {distributor.email}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlinePhone className="text-gray-600 mr-2" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-gray-800">Phone</h3>
                        <p className="text-gray-600 truncate">
                          {distributor.mobileNumber}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlineShop className="text-gray-600 mr-2" />
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-gray-800">Company</h3>
                        <p className="text-gray-600 truncate">
                          {distributor.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center mt-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 flex items-center">
                        <AiOutlineEye className="mr-1" />
                        View
                      </button>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 flex items-center">
                        <AiOutlineEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                        onClick={() => deleteDistributor(distributor.id)}
                      >
                        <AiOutlineDelete className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full py-4">
                No distributors found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-lg mx-1`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ml-2"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageDistributors;
