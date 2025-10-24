import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const CasteManagementTable = () => {
  const [castes, setCastes] = useState([]); // Store all castes
  const [filteredCastes, setFilteredCastes] = useState([]); // Store filtered castes based on search term
  const [searchTerm, setSearchTerm] = useState(''); // For the search input
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [newCaste, setNewCaste] = useState(''); // For new caste input
  const [loading, setLoading] = useState(false); // For loading state during fetching
  const [message, setMessage] = useState(''); // For success or error message

  // Fetch data from API
  useEffect(() => {
    const fetchCastes = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setMessage('Fetching caste data...'); // Show fetching alert
      try {
        const response = await apiClient.get(apiEndpoints.Caste);
        setCastes(response.data); // Set all castes data
        setFilteredCastes(response.data); // Initialize filtered data with all castes
        setMessage(''); // Clear message once data is fetched
      } catch (error) {
        setMessage('Error fetching castes: ' + error.message); // Show error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchCastes();
  }, []);

  // Filter castes based on search term
  useEffect(() => {
    const results = castes.filter(caste =>
      caste.caste.toLowerCase().includes(searchTerm.toLowerCase()) // Case insensitive search
    );
    setFilteredCastes(results); // Set filtered castes
  }, [searchTerm, castes]);

  // Handle adding a new caste
  const handleAddCaste = async () => {
    setLoading(true); // Start loading state
  
    try {
      const response = await apiClient.post(apiEndpoints.Castesubmit, {
        caste: newCaste, // Send the new caste in the request body
      });
  
      console.log("API Response:", response); // Log the response for debugging
  
      if (response.data.success) {
        // Show success alert
        alert(response.data.message); // Display success message in a JavaScript alert
        setNewCaste(''); // Clear input field
        setShowModal(false); // Close modal after successful add
        fetchCastes(); // Refresh the caste list after adding
      } else {
        // Show error message in alert
        alert('Error adding caste: ' + response.data.message);
        setShowModal(false); // Close modal after successful add
      }
    } catch (error) {
      // If there's an error during the API request
      console.error("Error:", error); // Log the error for debugging
      alert('Error adding caste: ' + error.message); // Show error alert
       setShowModal(false); // Close modal after successful add
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };
  
  // Define columns for the table (removed ID column)
  const columns = [
    {
      name: 'Caste',
      selector: row => row.caste,
      sortable: true, // Allow sorting
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Caste Management</h1>

      {/* Show message (fetching or success/error messages) */}
      {message && <div className="alert alert-primary">{message}</div>}

      {/* Search Input and Button */}
      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by caste..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)} // Update search term as user types
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setSearchTerm(searchTerm)} // Trigger search
        >
          Search
        </button>
      </div>

      {/* Add Caste Button */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-md mb-4 hover:bg-green-600"
        onClick={() => setShowModal(true)}
      >
        Add Caste
      </button>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCastes} // Display filtered data
        pagination // Enable pagination
        highlightOnHover // Highlight rows on hover
        striped // Add striped rows for better readability
        title="Caste List"
      />

      {/* Modal for Adding Caste */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Caste</h2>
           

            <div className="mb-4">
              <label htmlFor="casteInput" className="block text-gray-700 mb-2">Caste Name</label>
              <input
                type="text"
                id="casteInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter caste"
                value={newCaste}
                onChange={(e) => setNewCaste(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                onClick={() => setShowModal(false)} // Close modal
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddCaste} // Submit caste
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasteManagementTable;
