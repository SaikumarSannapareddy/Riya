import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import apiClient, { apiEndpoints } from "../components/Apis";

const CityManagementTable = () => {
  const [cities, setCities] = useState([]); // Store all cities
  const [filteredCities, setFilteredCities] = useState([]); // Filtered cities
  const [searchTerm, setSearchTerm] = useState(''); // Search input
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newCity, setNewCity] = useState(''); // Input for new city
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/error messages

  // Fetch city data from the new API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setMessage('Fetching city data...');
      try {
        const response = await apiClient.get(apiEndpoints.City);
        setCities(response.data);
        setFilteredCities(response.data); // Initialize filtered with all data
        setMessage('');
      } catch (error) {
        setMessage('Error fetching cities: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    const results = cities.filter(city =>
      city?.city?.toLowerCase().includes(searchTerm.toLowerCase()) // Check if 'city' exists before accessing 'toLowerCase'
    );
    setFilteredCities(results);
  }, [searchTerm, cities]);

  // Handle adding a new city
  const handleAddCity = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiEndpoints.SubmitCity, {
        city_name: newCity,
      });

      if (response.data.success) {
        alert(response.data.message);
        setNewCity('');
        setShowModal(false);
        const updatedCities = await apiClient.get(apiEndpoints.City);
        setCities(updatedCities.data); // Refresh data
      } else {
        alert('Error adding city: ' + response.data.message);
      }
    } catch (error) {
      alert('Error adding city: ' + error.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after successful add
    }
  };

  // Define table columns
  const columns = [
    {
      name: 'City Name',
      selector: row => row.city,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center text-2xl font-semibold">City Management</h1>

      {message && <div className="alert alert-primary">{message}</div>}

      <div className="mb-3 flex items-center">
        <input
          type="text"
          className="form-input mr-2 p-2 border border-gray-300 rounded-md"
          placeholder="Search by city..."
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
        Add City
      </button>

      <DataTable
        columns={columns}
        data={filteredCities}
        pagination
        highlightOnHover
        striped
        title="City List"
      />

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New City</h2>

            <div className="mb-4">
              <label htmlFor="cityInput" className="block text-gray-700 mb-2">City Name</label>
              <input
                type="text"
                id="cityInput"
                className="p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter city"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
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
                onClick={handleAddCity}
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

export default CityManagementTable;
