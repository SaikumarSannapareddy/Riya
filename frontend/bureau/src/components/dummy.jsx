import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaWhatsapp, FaEnvelope, FaPhone, FaUser, FaBriefcase, FaDollarSign, FaFlag, FaMapMarkerAlt, FaTractor, FaBook, FaUtensils, FaSmoking, FaGlassMartini, FaEye, FaHome, FaRupeeSign, FaBuilding, FaChartPie, FaMapMarkedAlt, FaSeedling, FaCity, FaLocationArrow } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader'; // Import Loader component

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iconStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    marginRight: "12px",
  };
  const sections = [


    {
      title: "Personal Information",
      icon: <FaUser style={{ color: "#6c757d" }} />,
      fields: [
        { label: "Gender", value: profile?.gender || "N/A", icon: <FaUser style={{ color: "#ffc107" }} /> },
        { label: "Created By", value: profile?.createdBy || "N/A", icon: <FaUser style={{ color: "#ffc107" }} /> },
        { label: "Payment Status", value: ` ${profile?.paymentStatus || "N/A"}`, icon: <FaRupeeSign style={{ color: "#e83e8c" }} /> },
        { label: "Profile Status", value: profile?.profileStatus || "N/A", icon: <FaUser style={{ color: "#ffc107" }} /> },
        { label: "Service Preference", value: profile?.servicePreference || "N/A", icon: <FaUser style={{ color: "#ffc107" }} /> },
        { label: "Image Privacy", value: profile?.imagePrivacy || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },


        { label: "Family Type", value: profile?.familyType || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Family Value", value: profile?.familyValue || "N/A", icon: <FaFlag style={{ color: "#20c997" }} /> },
        { label: "Father Occupation", value: profile?.fatherOccupied || "N/A", icon: <FaBriefcase style={{ color: "#6610f2" }} /> },
        { label: "Father Employment", value: profile?.fatherEmployee || "N/A", icon: <FaBriefcase style={{ color: "#e83e8c" }} /> },
        { label: "Mother Employment", value: profile?.motherEmployee || "N/A", icon: <FaBriefcase style={{ color: "#17a2b8" }} /> },
      ],
    },
    {
      title: "Personal Details",
      icon: <FaUser style={{ color: "#6c757d" }} />,
      fields: [

        { label: "Date Of Birth", value: profile?.dateOfBirth || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Birth Time", value: profile?.time || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Marital Status", value: profile?.maritalStatus || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Physical State", value: profile?.physicalState || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },


      ],
    },
    {
      title: "Religion And Caste",
      icon: <FaUser style={{ color: "#6c757d" }} />,
      fields: [

        { label: "Religion", value: profile?.religion || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "caste", value: profile?.caste || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Sub Caste", value: profile?.subcaste || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Raasi", value: profile?.raasi || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Star", value: profile?.star || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Gothram", value: profile?.gotram || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Mother Tongue", value: profile?.motherTongue || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Languages Known", value: profile?.languagesKnown?.join(", ") || "N/A", icon: <FaFlag style={{ color: "#dc3545" }} /> },


      ],
    },
    {
      title: "Property Information",
      icon: <FaBriefcase style={{ color: "#28a745" }} />,
      fields: [
        {
          label: "House Location",
          value: profile?.houseLocation?.join(", ") || "N/A",
          icon: <FaHome style={{ color: "#007bff" }} />,
        },
        {
          label: "House Value",
          value: `₹ ${profile?.houseValue || "N/A"}`,
          icon: <FaRupeeSign style={{ color: "#ffc107" }} />,
        },
        {
          label: "House Type",
          value: profile?.houseType || "N/A",
          icon: <FaBuilding style={{ color: "#6c757d" }} />,
        },
        {
          label: "Total Plots Value",
          value: `₹ ${profile?.openPlotsValue || "N/A"}`,
          icon: <FaChartPie style={{ color: "#dc3545" }} />,
        },
        {
          label: "Open Plots Location",
          value: profile?.openPlotsLocation?.join(", ") || "N/A",
          icon: <FaMapMarkedAlt style={{ color: "#20c997" }} />,
        },
        {
          label: "Agriculture Land Location",
          value: profile?.agricultureLandLocation?.join(", ") || "N/A",
          icon: <FaTractor style={{ color: "#6610f2" }} />,
        },
        {
          label: "Agriculture Land Value",
          value: `₹ ${profile?.agricultureLandValue || "N/A"}`,
          icon: <FaSeedling style={{ color: "#e83e8c" }} />,
        },
        {
          label: "Number of Flats",
          value: profile?.numberOfFlats || "N/A",
          icon: <FaCity style={{ color: "#17a2b8" }} />,
        },
        {
          label: "Flat Type",
          value: profile?.flatType || "N/A",
          icon: <FaCity style={{ color: "#17a2b8" }} />,
        },
        {
          label: "Flat Location",
          value: profile?.flatLocation?.join(", ") || "N/A",
          icon: <FaHome style={{ color: "#007bff" }} />,
        },
        {
          label: "Any More Properties",
          value: profile?.anyMoreProperties || "N/A",
          icon: <FaCity style={{ color: "#17a2b8" }} />,
        },
        {
          label: "Total Properties Value",
          value: profile?.totalPropertiesValue || "N/A",
          icon: <FaCity style={{ color: "#17a2b8" }} />,
        },
        {
          label: "Property Names",
          value: profile?.propertyNames || "N/A",
          icon: <FaCity style={{ color: "#17a2b8" }} />,
        },



      ],
    },

    {
      title: "Habits",
      icon: <FaUtensils style={{ color: "#ffc107" }} />,
      fields: [
        { label: "Eating Habits", value: profile?.eatingHabits || "N/A", icon: <FaUtensils style={{ color: "#28a745" }} /> },
        { label: "Smoking Habits", value: profile?.smokingHabits || "N/A", icon: <FaSmoking style={{ color: "#dc3545" }} /> },
        { label: "Drinking Habits", value: profile?.drinkingHabits || "N/A", icon: <FaGlassMartini style={{ color: "#6610f2" }} /> },
      ],
    },
    {
      title: "Education & Employment",
      icon: <FaBook style={{ color: "#007bff" }} />,
      fields: [
        { label: "Education", value: profile?.education || "N/A" },
        { label: "Employment Status", value: profile?.employmentStatus || "N/A" },
        { label: "Occupation", value: profile?.occupation || "N/A" },
        { label: "Annual Income", value: `₹ ${profile?.annualIncome || "N/A"}` },
      ],
    },

    {
      title: "Bussiness Information",
      icon: <FaBook style={{ color: "#007bff" }} />,
      fields: [
        { label: "Any other Business", value: profile?.otherBusiness || "N/A" },
        { label: "Business Location", value: profile?.businessLocation?.join(", ") || "N/A" },
        { label: "Other Business Income", value: profile?.otherBusinessIncome || "N/A" },

        { label: "Extra Talented Skills", value: profile?.extraTalentedSkills?.join(", ") || "N/A" },
      ],
    },

    {
      title: "Location Information",
      icon: <FaLocationArrow style={{ color: "#007bff" }} />,
      fields: [
        { label: "Country", value: profile?.country || "N/A" },
        { label: "State", value: profile?.state || "N/A" },
        { label: "City", value: profile?.district || "N/A" },

        { label: "CitizenShip", value: profile?.citizenship || "N/A" },
      ],
    },

  ];


  const navigate = useNavigate();

  const userId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.user}/${userId}`);
        const contentType = response.headers['content-type'];

        if (contentType && contentType.includes('application/json')) {
          setProfile(response.data);
        } else {
          setError('Expected JSON response, but got HTML or other content type.');
        }
      } catch (error) {
        setError('Error fetching profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };


  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleShareClick = () => {
    const message = `Check out the profile of ${profile.fullName} https://matrimonystudio.in/profile_view/${profile._id}!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <div className="flex justify-center"><Loader /></div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!profile) {
    return <p>No profile data found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <Helmet>
        <title>{`Profile of ${profile.fullName}`}</title>
        <meta name="description" content={`Check out the profile of ${profile.fullName} on our platform.`} />
        <meta property="og:title" content={`Profile of ${profile.fullName}`} />
        <meta property="og:description" content="Explore the details and connect now!" />
        <meta property="og:image" content={`${Uploads}${profile.image}`} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Profile of ${profile.fullName}`} />
        <meta name="twitter:description" content="Explore the details and connect now!" />
        <meta name="twitter:image" content={`${Uploads}${profile.image}`} />
      </Helmet>

      {/* Profile Image Section */}
      {/* Profile Image Section */}
      <div className=" w-full h-[350px] shadow-lg z-20 fixed top-0 left-0 right-0">
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-30 flex justify-between items-center p-4 z-30">
          <FaArrowLeft
            className="text-white cursor-pointer"
            onClick={handleBackClick}
            size={24}
          />
          <h1 className="text-2xl font-semibold text-white text-center flex-1">Profile Details</h1>
        </div>
        {/* Profile Image */}
        <img
          src={`${Uploads}${profile.image || 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-business-user-profile-vector-png-image_1541960.jpg'}`}
          alt="Profile"
          className="w-full h-full object-fill"
        />

        {/* Overlay with Title and Back Button */}

      </div>





      {/* Profile Details Section */}
      <div className="p-6 mb-3 mt-80 ">
        <h2 className="text-2xl font-bold mb-4 text-center">{profile.fullName}</h2>
        <h4 className="text-xl font-bold mb-4 text-center">Martial ID : {profile.martialId}</h4>
        <p className="text-sm text-gray-600 text-center">
          {calculateAge(profile.dateOfBirth)} yrs
        </p>


      </div>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold flex items-center">
              <div style={iconStyle}>{section.icon}</div> {section.title}
            </h3>
            <div className="mt-4">
              {section.fields.map((field, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <div style={iconStyle}>{field.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{field.label}:</p>
                    <p className="text-sm">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* WhatsApp Share Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleShareClick}
          className="flex items-center bg-green-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-green-600 focus:outline-none"
        >
          <FaWhatsapp className="mr-2" size={20} />
          Share Profile on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
