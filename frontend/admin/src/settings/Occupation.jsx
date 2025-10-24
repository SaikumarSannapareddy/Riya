import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const OccupationManagementTable = () => {
  const [occupations, setOccupations] = useState([]); // Store all occupations
  const [filteredOccupations, setFilteredOccupations] = useState([]); // Filtered occupations
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newOccupation, setNewOccupation] = useState(''); // Input for new occupation
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch occupation data from the API
  useEffect(() => {
    const fetchOccupations = async () => {
      setLoading(true);
      setMessage('Fetching occupation data...');
      try {
        const response = await apiClient.get(apiEndpoints.Occupation);
        setOccupations(response.data);
        setFilteredOccupations(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching occupations: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupations();
  }, []);

  // Filter occupations based on search term
  useEffect(() => {
    const results = occupations.filter(occupation =>
      occupation?.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOccupations(results);
  }, [searchTerm, occupations]);

  // Handle adding a new occupation
  const handleAddOccupation = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiEndpoints.submitOccupation, {
        occupation_name: newOccupation,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewOccupation('');
        setShowModal(false);
        const updatedOccupations = await apiClient.get(apiEndpoints.Occupation);
        setOccupations(updatedOccupations.data); // Refresh data
      } else {
        alert('Error adding occupation: ' + response.data.message);
      }
    } catch (error) {
      alert('Error adding occupation: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'Occupation Name',
      selector: row => row.occupation,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Occupation Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by occupation..."
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
        Add Occupation
      </button>

      <DataTable
        columns={columns}
        data={filteredOccupations}
        pagination
        highlightOnHover
        striped
        title="Occupation List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Occupation</h2>

            <div className="mb-4">
              <label htmlFor="occupationInput" className="block text-gray-700 mb-2">Occupation Name</label>
              <input
                type="text"
                id="occupationInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter occupation"
                value={newOccupation}
                onChange={(e) => setNewOccupation(e.target.value)}
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
                onClick={handleAddOccupation}
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

export default OccupationManagementTable;
