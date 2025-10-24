import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const StarManagementTable = () => {
  const [stars, setStars] = useState([]); // Store all stars
  const [filteredStars, setFilteredStars] = useState([]); // Filtered stars
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newStar, setNewStar] = useState(''); // Input for new star
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch star data from the new API
  useEffect(() => {
    const fetchStars = async () => {
      setLoading(true);
      setMessage('Fetching star data...');
      try {
        const response = await apiClient.get(apiEndpoints.Star);
        setStars(response.data);
        setFilteredStars(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching stars: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, []);

  // Filter stars based on search term
  useEffect(() => {
    const results = stars.filter(star =>
      star?.star?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'star' exists before accessing 'toLowerCase'
    );
    setFilteredStars(results);
  }, [searchTerm, stars]);

  // Handle adding a new star
  const handleAddStar = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiEndpoints.SubmitStar, {
        star_name: newStar,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewStar('');
        setShowModal(false);
        const updatedStars = await apiClient.get(apiEndpoints.Star);
        setStars(updatedStars.data); // Refresh data
      } else {
        alert('Error adding star: ' + response.data.message);
      }
    } catch (error) {
      alert('Error adding star: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'Star Name',
      selector: row => row.star,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Star Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by star..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setSearchTerm(searchTerm)}
        >
          Search
        </button>
      </div>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded-md mb-4 hover:bg-green-600"
        onClick={() => setShowModal(true)}
      >
        Add Star
      </button>

      <DataTable
        columns={columns}
        data={filteredStars}
        pagination
        highlightOnHover
        striped
        title="Star List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Star</h2>

            <div className="mb-4">
              <label htmlFor="starInput" className="block text-gray-700 mb-2">Star Name</label>
              <input
                type="text"
                id="starInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter star name"
                value={newStar}
                onChange={(e) => setNewStar(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddStar}
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

export default StarManagementTable;
