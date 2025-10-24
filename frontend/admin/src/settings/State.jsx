import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const StateManagementTable = () => {
  const [states, setStates] = useState([]); // Store all states
  const [filteredStates, setFilteredStates] = useState([]); // Filtered states
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newState, setNewState] = useState(''); // Input for new state
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch state data from the API
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setMessage('Fetching state data...');
      try {
        const response = await apiClient.get(apiEndpoints.State);
        setStates(response.data);
        setFilteredStates(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching states: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  // Filter states based on search term
  useEffect(() => {
    const results = states.filter(state =>
      state?.state?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'state' exists before accessing 'toLowerCase'
    );
    setFilteredStates(results);
  }, [searchTerm, states]);

  // Handle adding a new state
  const handleAddState = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiEndpoints.SubmitState, {
        state_name: newState,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewState('');
        setShowModal(false);
        const updatedStates = await apiClient.get(apiEndpoints.State);
        setStates(updatedStates.data); // Refresh data
      } else {
        alert('Error adding state: ' + response.data.message);
      }
    } catch (error) {
      alert('Error adding state: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'State Name',
      selector: row => row.state,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">State Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by state..."
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
        Add State
      </button>

      <DataTable
        columns={columns}
        data={filteredStates}
        pagination
        highlightOnHover
        striped
        title="State List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New State</h2>

            <div className="mb-4">
              <label htmlFor="stateInput" className="block text-gray-700 mb-2">State Name</label>
              <input
                type="text"
                id="stateInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter state"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
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
                onClick={handleAddState}
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

export default StateManagementTable;
