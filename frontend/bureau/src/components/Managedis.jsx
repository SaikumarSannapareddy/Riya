import React, { useState, useEffect } from 'react';

const ManageDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Number of items per page

  // Fetch distributors from the API
  const fetchDistributors = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/distributors`);
      const data = await response.json();
      
      if (response.ok) {
        const totalItems = data.distributors.length;
        setDistributors(data.distributors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      } else {
        console.error('Error fetching distributors');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch data when page loads or when currentPage changes
  useEffect(() => {
    fetchDistributors();
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Distributors</h1>
      
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Company Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {distributors.length > 0 ? (
              distributors.map((distributor) => (
                <tr key={distributor.id}>
                  <td className="border px-4 py-2">{distributor.id}</td>
                  <td className="border px-4 py-2">{distributor.fullName}</td>
                  <td className="border px-4 py-2">{distributor.email}</td>
                  <td className="border px-4 py-2">{distributor.mobileNumber}</td>
                  <td className="border px-4 py-2">{distributor.companyName}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No distributors found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
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
    </div>
  );
};

export default ManageDistributors;
