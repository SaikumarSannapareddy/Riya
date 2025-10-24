import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from '../components/Apis1';
import Loader from '../components/Loader';
import '../../src/mediaquries.css';
import { useTranslation } from "react-i18next";


const OtherFemaleProfileSlider = () => {
    const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [cardWidthPx, setCardWidthPx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

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
        const response = await apiClient.get(
          `${apiEndpoints.fetchotherbureau}/${bureauId}/female?page=1&limit=10`
        );
        const data = response.data;
        console.log(data)

        if (Array.isArray(data.users)) {
          const processed = data.users.map((p) => ({
            ...p,
            visibleToAll: convertStringToBoolean(p.visibleToAll),
          }));
          setProfiles(processed);
          setTotalCount(data.total ?? processed.length);
        } else {
          setError('Invalid response format.');
        }
      } catch {
        setError('No Profiles Fund.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [bureauId]);

  // Responsive card width & visible count
  useEffect(() => {
    const updateMeasurements = () => {
      const container = containerRef.current;
      const card = cardRef.current;
      if (!container || !card) return;

      const cardStyle = window.getComputedStyle(card);
      const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
      const cardW = card.offsetWidth + cardMarginRight;

      const visible = Math.max(1, Math.floor(container.clientWidth / cardW));

      setCardWidthPx(cardW);
      setVisibleCount(visible);

      const maxIdx = Math.max(0, profiles.length - visible);
      setCurrentIndex((prev) => Math.min(prev, maxIdx));
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);
    window.addEventListener('load', updateMeasurements);

    return () => {
      window.removeEventListener('resize', updateMeasurements);
      window.removeEventListener('load', updateMeasurements);
    };
  }, [profiles]);

  const maxIndex = Math.max(0, profiles.length - visibleCount);
  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleProfileClick = (id) => navigate(`/profile/${id}`);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!profiles.length) return <p className="text-center mt-10">No profiles found.</p>;

  return (
    <div className="bg-gray-100 p-4 rounded-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg sm:text-3xl font-bold text-gray-800 tracking-tight leading-snug flex items-center mb-2">
          <span className="text-purple-700">{t("otherbureaufemale")}</span>
        </h1>
        <h1>
          <span className="bg-blue-100 text-purple-800 text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full shadow-sm ml-2 sm:ml-4">
             {t("profile")}: {totalCount}
          </span>
        </h1>
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden" ref={containerRef}>
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * cardWidthPx}px)` }}
        >
          {profiles.map((profile, idx) => (
            <div
              key={profile._id}
              ref={idx === 0 ? cardRef : null}
              className="card flex-shrink-0 cursor-pointer"
              onClick={() => handleProfileClick(profile._id)}
            >
              <div className="relative inline-block w-full">
                <img
                  src={profile.image ? `${Uploads}${profile.image}` : 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png'}
                  alt={profile.fullName}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                {/* <span className="absolute top-2 right-2 bg-purple-100 text-purple-600 text-sm font-bold px-2 py-1 rounded-full shadow-lg">
                  {profile.profileCompletion || 0}%
                </span> */}
                <div className="w-full text-left mt-2">
                  <h2 className="text-gray-800 truncate">{profile.fullName}</h2>
                  <p className="text-sm text-gray-600">{calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next buttons */}
        {profiles.length > visibleCount && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/3 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition disabled:opacity-50"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="absolute right-0 top-1/3 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition disabled:opacity-50"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-6">
        <NavLink
          to={`/other-female-profiles/${bureauId}/female`}
          className="flex items-center justify-center w-full sm:px-10 py-1 border-2 border-purple-600 rounded-full 
                    text-purple-600 font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 group"
        >
          <span>{t("viewall")}</span>
          <FaChevronRight className="ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
        </NavLink>
      </div>
    </div>
  );
};

export default OtherFemaleProfileSlider;
