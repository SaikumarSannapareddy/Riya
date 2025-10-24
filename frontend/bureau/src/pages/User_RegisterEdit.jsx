import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from '../components/Loader2';

const UserRegisterEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`${apiEndpoints.user}/${userId}`);
        if (response.status === 200 && response.data) {
          setFormData({
            mobileNumber: response.data.mobileNumber || '',
            email: response.data.email || '',
            password: '', // Do not prefill password for security
          });
        } else {
          setError('Failed to fetch user details.');
        }
      } catch (err) {
        setError('Error fetching user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        mobileNumber: formData.mobileNumber,
        email: formData.email,
      };
      if (formData.password) payload.password = formData.password;
      const response = await apiClient.put(`${apiEndpoints.update}/${userId}`, payload);
      if (response.status === 200) {
        setSuccess('Details updated successfully!');
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        setError('Failed to update details.');
      }
    } catch (err) {
      setError('Error updating details.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Basic Details</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Leave blank to keep unchanged"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Details'}
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserRegisterEdit; 