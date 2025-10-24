import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const CountryManagementTable = () => {
  const [countries, setCountries] = useState([]); // Store all countries
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered countries
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newCountry, setNewCountry] = useState(''); // Input for new country
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch country data from the API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setMessage('Fetching country data...');
      try {
        const response = await apiClient.get(apiEndpoints.Country);
        setCountries(response.data);
        setFilteredCountries(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching countries: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    const results = countries.filter(country =>
      country?.country?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'country' exists before accessing 'toLowerCase'
    );
    setFilteredCountries(results);
  }, [searchTerm, countries]);

  // Handle adding a new country
  const handleAddCountry = async () => {
    setLoading(true);
    try {
        const response = await apiClient.post(apiEndpoints.SubmitCountry, {
        country_name: newCountry,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewCountry('');
        setShowModal(false);
        const updatedCountries = await apiClient.get(apiEndpoints.Country);
        setCountries(updatedCountries.data); // Refresh data
      } else {
        alert('Error adding country: ' + response.data.message);
        
      }
    } catch (error) {
      alert('Error adding country: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'Country Name',
      selector: row => row.country,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">Country Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by country..."
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
        Add Country
      </button>

      <DataTable
        columns={columns}
        data={filteredCountries}
        pagination
        highlightOnHover
        striped
        title="Country List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Country</h2>

            <div className="mb-4">
              <label htmlFor="countryInput" className="block text-gray-700 mb-2">Country Name</label>
              <input
                type="text"
                id="countryInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter country"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
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
                onClick={handleAddCountry}
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

export default CountryManagementTable;
