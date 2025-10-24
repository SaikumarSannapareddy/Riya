import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const EducationManagementTable = () => {
  const [educations, setEducations] = useState([]); // Store all educations
  const [filteredEducations, setFilteredEducations] = useState([]); // Filtered educations
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newEducation, setNewEducation] = useState(''); // Input for new education
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch education data from the API
  useEffect(() => {
    const fetchEducations = async () => {
      setLoading(true);
      setMessage('Fetching education data...');
      try {
        const response = await apiClient.get(apiEndpoints.education);
        setEducations(response.data);
        setFilteredEducations(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching educations: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  // Filter educations based on search term
  useEffect(() => {
    const results = educations.filter(education =>
      education?.education?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'education' exists before accessing 'toLowerCase'
    );
    setFilteredEducations(results);
  }, [searchTerm, educations]);

  // Handle adding a new education
  const handleAddEducation = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiEndpoints.submitEducation, {
        education: newEducation,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewEducation('');
        setShowModal(false);
        const updatedEducations = await apiClient.get(apiEndpoints.education);
        setEducations(updatedEducations.data); // Refresh data
      } else {
        alert('Error adding education: ' + response.data.message);
      }
    } catch (error) {
      alert('Error adding education: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'Education',
      selector: row => row.education,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Education Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by education..."
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
        Add Education
      </button>

      <DataTable
        columns={columns}
        data={filteredEducations}
        pagination
        highlightOnHover
        striped
        title="Education List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Education</h2>

            <div className="mb-4">
              <label htmlFor="educationInput" className="block text-gray-700 mb-2">Education</label>
              <input
                type="text"
                id="educationInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter education"
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
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
                onClick={handleAddEducation}
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

export default EducationManagementTable;
