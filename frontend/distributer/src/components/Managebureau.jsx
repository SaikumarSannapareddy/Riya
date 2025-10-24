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
import Loader from "./Loader"; // Import the loader component

const ManageBureaus = () => {
  const [bureaus, setBureaus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  
  const distributorId = localStorage.getItem('distributorId');

  // Fetch bureaus from the API
  const fetchBureaus = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${apiEndpoints.MyBureauProfiles}?distributorId=${distributorId}`);
      const data = response.data;
      if (!data || !data.bureauProfiles) {
        setBureaus([]);
        setTotalPages(0);
        return;
      }

      const filteredBureaus = data.bureauProfiles.filter((bureau) =>
        bureau.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bureau.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bureau.bureauName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bureau.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const totalItems = filteredBureaus.length;
      setBureaus(
        filteredBureaus.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      );
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error("Error fetching bureau profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete bureau
  const deleteBureau = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Bureau?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await apiClient.delete(`${apiEndpoints.bureaudelete}/${id}`);
      alert("Bureau deleted successfully!");
      fetchBureaus();
    } catch (error) {
      console.error("Error deleting bureau:", error);
      alert("Failed to delete bureau. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch data on load and on dependency changes
  useEffect(() => {
    fetchBureaus();
  }, [currentPage, searchQuery]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Bureaus</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Email, Company, or Mobile Number"
          className="border px-4 py-2 w-full rounded-lg"
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader />
        </div>
      ) : (
        <>
          {/* Bureau List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bureaus.length > 0 ? (
              bureaus.map((bureau) => (
                <div
                  key={bureau.id}
                  className="border rounded-lg shadow p-4 bg-white flex flex-col"
                >
                  {/* Image */}
                  <img
                    src={
                      bureau.image
                        ? `${Uploads}/${bureau.image}`
                        : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                    }
                    alt={bureau.ownerName}
                    className="w-full h-auto object-cover rounded-lg border mb-4"
                  />

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="mb-2 flex items-center">
                      <AiOutlineUser className="text-gray-600 mr-2" />
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">Name</h3>
                        <p className="text-gray-600">{bureau.ownerName}</p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlineMail className="text-gray-600 mr-2" />
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">Email</h3>
                        <p className="text-gray-600">{bureau.email}</p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlinePhone className="text-gray-600 mr-2" />
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">Phone</h3>
                        <p className="text-gray-600">{bureau.mobileNumber}</p>
                      </div>
                    </div>
                    <div className="mb-2 flex items-center">
                      <AiOutlineShop className="text-gray-600 mr-2" />
                      <div>
                        <h3 className="font-bold text-sm text-gray-800">Company</h3>
                        <p className="text-gray-600">{bureau.bureauName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ">
                      <AiOutlineEye className="mr-1" />
                      View
                    </button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center justify-center ">
                      <AiOutlineEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center "
                      onClick={() => deleteBureau(bureau.id)}
                    >
                      <AiOutlineDelete className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full">No bureaus found.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 mb-2"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 mb-2 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-lg`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ml-2 mb-2"
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

export default ManageBureaus;
