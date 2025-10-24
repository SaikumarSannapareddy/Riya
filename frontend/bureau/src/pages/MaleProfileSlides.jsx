import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft,FaOpenBracket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis1';
import Loader from '../components/Loader';

const MaleProfileSlides = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');

  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.fetchbureau}/${bureauId}/male`);

        const data = response.data;        

        if (Array.isArray(response.data.users)) {
          const processed = response.data.users.map(p => ({
            ...p,
            visibleToAll: convertStringToBoolean(p.visibleToAll)
          })).slice(0, 10); // limit to 10 profiles
          setProfiles(processed);
          setTotalCount(data.total);   // set total count

        } else {
          setError('Invalid response format.');
        }
      } catch (err) {
        setError('No Profiles Fund');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [bureauId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const cardWidth = 264; // card width + gap (w-48 + gap-6 approx)
  const maxIndex = profiles.length - 4; // show 4 cards at a time

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const handleProfileClick = (id) => navigate(`/profile/${id}`);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    
    <div className="bg-gray-100 p-4 rounded-lg relative">
      
      <div className='flex items-center justify-between'>

        <h1 className="text-2xl font-semibold text-green-600 mb-4">Your Own Profiles  Male</h1>
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Count : {totalCount}</h1>
      </div>

      <div className="relative overflow-hidden">

        <div className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * cardWidth}px)` }}
        >
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="flex-shrink-0 w-48 mr-6 cursor-pointer"
              onClick={() => handleProfileClick(profile._id)}
            >
              <div className="relative inline-block">
                <img
                  src={
                    profile.image
                      ? `${Uploads}${profile.image}`
                      : 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png'
                  }
                  alt={profile.fullName}
                  className="w-48 h-48 object-cover rounded-lg shadow-md mb-3"
                />
                <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded-full shadow-lg">
                  {profile.profileCompletion}%
                </span>
                <div className="w-full text-left">
                  <h2 className="text-lg font-bold text-gray-800 truncate sm:truncate">{profile.fullName}</h2>
                  <p className="text-sm text-gray-600">{calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next buttons */}
        {profiles.length > 4 && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/3 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-0 top-1/3 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </>
        )}

      </div>

      <div className="flex justify-center mt-6">
        <NavLink
          to={`/male-profiles/${bureauId}/male`}
          className="flex items-center justify-center px-6 sm:px-10 py-2 border-2 border-green-600 rounded-full 
                    text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all duration-300 group"
        >
          <span>View all</span>
          <FaChevronRight className="ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
        </NavLink>
      </div>
    </div>
  );
};

export default MaleProfileSlides;

