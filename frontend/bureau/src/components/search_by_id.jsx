import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads, Uploads2 } from './Apis1';
import Loader from './Loader';

function SearchMartialID() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const form = event.target;
    const martialId = form.martialId.value.trim();

    if (!martialId) {
      setAlert({ type: 'error', message: 'Please enter a Martial ID.' });
      return;
    }

    try {
      setLoading(true);
      // Call the backend route /profile/:martialId
      const response = await apiClient.get(`${apiEndpoints.userbymartial}/${martialId}`);

      console.log("Search By id",response)

      const profile = response.data;

      if (profile && profile._id) {
      if (profile.createdBy === "Other Mediater Profile") {
              navigate(`/other_bureau_profile/${profile._id}`);
            } else {
              navigate(`/profile/${profile._id}`);
            }
          } else {
        setAlert({ type: 'error', message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error fetching user by martialId:', error);
      setAlert({ type: 'error', message: 'User not found or server error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <button
          className="text-blue-500 hover:text-blue-700 flex items-center mb-4"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Search By Martial ID
        </h1>

        {alert.message && (
          <div
            className={`mb-4 p-4 rounded ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {alert.message}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label
                htmlFor="martialId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Martial ID
              </label>
              <input
                type="text"
                name="martialId"
                id="martialId"
                className="w-full border-blue-900 border rounded-lg shadow-sm py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter Martial ID (e.g. M12345)"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Search
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SearchMartialID;
