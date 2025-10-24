import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const SubCasteManagementTable = () => {
  const [subCastes, setSubCastes] = useState([]); // Store all sub-castes
  const [filteredSubCastes, setFilteredSubCastes] = useState([]); // Filtered sub-castes
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newSubCaste, setNewSubCaste] = useState(''); // Input for new sub-caste
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch sub-caste data from the new API
  useEffect(() => {
    const fetchSubCastes = async () => {
      setLoading(true);
      setMessage('Fetching sub-caste data...');
      try {
        const response = await apiClient.get(apiEndpoints.SubCaste);
        setSubCastes(response.data);
        setFilteredSubCastes(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching sub-castes: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCastes();
  }, []);

  // Filter sub-castes based on search term
  useEffect(() => {
    const results = subCastes.filter(subCaste =>
      subCaste?.sub_caste?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'sub_caste' exists before accessing 'toLowerCase'
    );
    setFilteredSubCastes(results);
  }, [searchTerm, subCastes]);

  // Handle adding a new sub-caste
  const handleAddSubCaste = async () => {
    setLoading(true);
    try {
        const response = await apiClient.post(apiEndpoints.SubmitSubcaste, {
        sub_caste_name: newSubCaste,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewSubCaste('');
        setShowModal(false);
        const updatedSubCastes = await apiClient.get(apiEndpoints.SubCaste);
        setSubCastes(updatedSubCastes.data); // Refresh data
      } else {
        alert('Error adding sub-caste: ' + response.data.message);
        
      }
    } catch (error) {
      alert('Error adding sub-caste: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'Sub-Caste Name',
      selector: row => row.sub_caste,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Sub-Caste Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by sub-caste..."
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
        Add Sub-Caste
      </button>

      <DataTable
        columns={columns}
        data={filteredSubCastes}
        pagination
        highlightOnHover
        striped
        title="Sub-Caste List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Sub-Caste</h2>

            <div className="mb-4">
              <label htmlFor="subCasteInput" className="block text-gray-700 mb-2">Sub-Caste Name</label>
              <input
                type="text"
                id="subCasteInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter sub-caste"
                value={newSubCaste}
                onChange={(e) => setNewSubCaste(e.target.value)}
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
                onClick={handleAddSubCaste}
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

export default SubCasteManagementTable;
