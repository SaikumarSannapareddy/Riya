import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaWhatsapp, FaEnvelope, FaPhone,FaLightbulb, FaMoneyCheckAlt, FaChartLine, FaMoneyBillWave, FaUserTie,
  FaCog, FaGraduationCap, FaChurch, FaUsers, FaHeart, FaChild, FaLanguage, FaBirthdayCake, FaGlobe, FaSquare, FaMap, FaPassport, FaMoneyBillAlt, FaRuler,
  FaUser, FaBriefcase, FaDollarSign, FaFlag, FaMapMarkerAlt, FaTractor, FaBook, FaUtensils, FaSmoking, FaGlassMartini, FaEye, FaHome, FaRupeeSign, FaBuilding, FaChartPie, FaMapMarkedAlt, FaSeedling, FaCity, FaLocationArrow, 
  FaMapMarker,FaDownload,FaPhoneAlt,FaIdBadge,FaCreditCard,FaCogs,FaStar,FaCheck,FaCalendar,FaClock,FaGem,FaMale,FaRing,FaFemale,
  FaTree, FaArrowRight} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import apiClient1, { apiEndpoints1 } from './apisEdit'; // Bureau API
import apiClient, { apiEndpoints, Uploads } from './Apis1'; // User API
import Loader from './Loader'; // Import Loader component

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [bureauProfile, setBureauProfile] = useState(null); // State for bureau profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = profile ? [profile.image, ...(profile.gallery || [])] : [];
  const toggleModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(!isModalOpen);
  };
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  const iconStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    marginRight: "12px",
  };

  const profileViewStyle = {
    width: "50%",
  };

  const sections = [
    
    {
      title: "Personal Details",
      icon: <FaUser style={{ color: "#6c757d" }} />,
      fields: [
        { label: "Name", value: profile?.fullName || "NO DATA", icon: <FaUser style={{ color: "red" }} /> },
        { label: "Date Of Birth",  value: profile?.dateOfBirth ? (
          <>
            {new Date(profile.dateOfBirth).toISOString().split('T')[0]} 
            <span style={{ marginLeft: '10px', color: '#dc3545' }}>
              ({new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years)
            </span>
          </>
        ) : "NO DATA",  icon: <FaCalendar style={{ color: "#dc3545" }} /> },
        { label: "Birth Time", value: profile?.time || "NO DATA", icon: <FaClock style={{ color: "#dc3545" }} /> },
        { label: "Marital Status", value: profile?.maritalStatus || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { label: "Physical State", value: profile?.physicalState || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
        { 
          label: "Education", 
          value: profile?.education || "NO DATA", 
          icon: <FaGraduationCap style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Employment Status", 
          value: profile?.employmentStatus || "NO DATA", 
          icon: <FaBriefcase style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Occupation", 
          value: profile?.occupation || "NO DATA", 
          icon: <FaUserTie style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Annual Income", 
          value: `₹ ${profile?.annualIncome || "NO DATA"}`, 
          icon: <FaMoneyBillWave style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Location", 
          value: (
            <>
              <span>{profile?.country || "NO DATA"}</span>
              <span style={{ marginLeft: '5px' }}>,</span>
              <span style={{ marginLeft: '5px' }}>{profile?.state || "NO DATA"}</span>
              <span style={{ marginLeft: '5px' }}>,</span>
              <span style={{ marginLeft: '5px' }}>{profile?.district || "NO DATA"}</span>
            </>
          ), 
          icon: <FaMapMarkerAlt style={{ color: "#007bff" }} /> 
        }
        
  
      ],
    },
    
{
  title: "Religion And Caste",
  icon: <FaUser style={{ color: "#6c757d" }} />,
  fields: [

    { label: "Religion", value: profile?.religion || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "caste", value: profile?.caste || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "Sub Caste", value: profile?.subcaste || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "Raasi", value: profile?.raasi || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "Star", value: profile?.star || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "Languages Known", value: profile?.languagesKnown?.join(", ") || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    { label: "Mother Tongue", value: profile?.motherTongue || "NO DATA", icon: <FaFlag style={{ color: "#dc3545" }} /> },
    
  ],
},
{
  title: "Property Information",
  icon: <FaBriefcase style={{ color: "#28a745" }} />,
  fields: [
    {
      label: "House Location",
      value: profile?.houseLocation?.join(", ") || "NO DATA",
      icon: <FaHome style={{ color: "#007bff" }} />,
    },
    {
      label: "House Value",
      value: `₹ ${profile?.houseValue || "NO DATA"}`,
      icon: <FaRupeeSign style={{ color: "#ffc107" }} />,
    },
    {
      label: "House Type",
      value: profile?.houseType || "NO DATA",
      icon: <FaBuilding style={{ color: "#6c757d" }} />,
    },
    {
      label: "Total Plots Value",
      value: `₹ ${profile?.openPlotsValue || "NO DATA"}`,
      icon: <FaChartPie style={{ color: "#dc3545" }} />,
    },
    {
      label: "Open Plots Location",
      value: profile?.openPlotsLocation?.join(", ") || "NO DATA",
      icon: <FaMapMarkedAlt style={{ color: "#20c997" }} />,
    },
    {
      label: "Agriculture Land Location",
      value: profile?.agricultureLandLocation?.join(", ") || "NO DATA",
      icon: <FaTractor style={{ color: "#6610f2" }} />,
    },
    {
      label: "Agriculture Land Value",
      value: `₹ ${profile?.agricultureLandValue || "NO DATA"}`,
      icon: <FaSeedling style={{ color: "#e83e8c" }} />,
    },
    {
      label: "Number of Flats",
      value: profile?.numberOfFlats || "NO DATA",
      icon: <FaCity style={{ color: "#17a2b8" }} />,
    },
    {
      label: "Flat Type",
      value: profile?.flatType || "NO DATA",
      icon: <FaCity style={{ color: "#17a2b8" }} />,
    },
    {
      label: "Flat Location",
      value: profile?.flatLocation?.join(", ") || "NO DATA",
      icon: <FaHome style={{ color: "#007bff" }} />,
    },
    {
      label: "Any More Properties",
      value: profile?.anyMoreProperties || "NO DATA",
      icon: <FaCity style={{ color: "#17a2b8" }} />,
    },
    {
      label: "Total Properties Value",
      value: profile?.totalPropertiesValue || "NO DATA",
      icon: <FaCity style={{ color: "#17a2b8" }} />,
    },
    {
      label: "Property Names",
      value: profile?.propertyNames || "NO DATA",
      icon: <FaCity style={{ color: "#17a2b8" }} />,
    },

  ],
},

  {
    title: "Habits",
    icon: <FaUtensils style={{ color: "#ffc107" }} />,
    fields: [
      { label: "Eating Habits", value: profile?.eatingHabits || "NO DATA", icon: <FaUtensils style={{ color: "#28a745" }} /> },
      { label: "Smoking Habits", value: profile?.smokingHabits || "NO DATA", icon: <FaSmoking style={{ color: "#dc3545" }} /> },
      { label: "Drinking Habits", value: profile?.drinkingHabits || "NO DATA", icon: <FaGlassMartini style={{ color: "#6610f2" }} /> },
    ],
  },
 
  {
    title: "Business Information",
    icon: <FaBuilding style={{ color: "#007bff" }} />,
    fields: [
      { 
        label: "Any other Business", 
        value: profile?.otherBusiness || "NO DATA", 
        icon: <FaChartLine style={{ color: "#007bff" }} /> 
      },
      { 
        label: "Business Location", 
        value: profile?.businessLocation?.join(", ") || "NO DATA", 
        icon: <FaMapMarkerAlt style={{ color: "#007bff" }} /> 
      },
      { 
        label: "Other Business Income", 
        value: profile?.otherBusinessIncome || "NO DATA", 
        icon: <FaMoneyCheckAlt style={{ color: "#007bff" }} /> 
      },
      { 
        label: "Extra Talented Skills", 
        value: profile?.extraTalentedSkills?.join(", ") || "NO DATA", 
        icon: <FaLightbulb style={{ color: "#007bff" }} /> 
      },
    ],
  },
  // {
  //   title: "Location Information",
  //   icon: <FaLocationArrow style={{ color: "#007bff" }} />,
  //   fields: [
  //     { 
  //       label: "Country", 
  //       value: profile?.country || "NO DATA", 
  //       icon: <FaGlobe style={{ color: "#007bff" }} /> 
  //     },
  //     { 
  //       label: "State", 
  //       value: profile?.state || "NO DATA", 
  //       icon: <FaMap style={{ color: "#007bff" }} /> 
  //     },
  //     { 
  //       label: "City", 
  //       value: profile?.district || "NO DATA", 
  //       icon: <FaCity style={{ color: "#007bff" }} /> 
  //     },
  //     { 
  //       label: "Citizenship", 
  //       value: profile?.citizenship || "NO DATA", 
  //       icon: <FaPassport style={{ color: "#007bff" }} /> 
  //     },
  //   ],
  // },
  
  {
    title: "General Personal Partner Preferences",
    icon: <FaEnvelope style={{ color: "#007bff" }} />,
    fields: [
    
      {
        label: "Service Preferences",value: Array.isArray(profile?.partnerServicePreference)? profile.partnerServicePreference[0]?.split(",").length > 10? "Any": profile.partnerServicePreference[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaCog style={{ color: "#007545f" }} />,
      },
      {
        label: "Created By",value: Array.isArray(profile?.partnerCreatedBy)? profile.partnerCreatedBy[0]?.split(",").length > 10? "Any": profile.partnerCreatedBy[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaUser style={{ color: "#007bff" }} />,
      },
   
      {
        label: "Marital Status Preferences",value: Array.isArray(profile?.maritalStatusPreferences)? profile.maritalStatusPreferences[0]?.split(",").length > 10? "Any": profile.maritalStatusPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaHeart style={{ color: "#17a2b8" }} />,
      },
      {
        label: "Children Preferences",value: Array.isArray(profile?.childrenPreferences)? profile.childrenPreferences[0]?.split(",").length > 10? "Any": profile.childrenPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaChild style={{ color: "#28a745" }} />,
      },
      {
        label: "Mother Tongue Preferences",value: Array.isArray(profile?.motherTonguePreferences)? profile.motherTonguePreferences[0]?.split(",").length > 10? "Any": profile.motherTonguePreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaLanguage style={{ color: "#007bff" }} />,
      },
      {
        label: "Age Preferences",value: Array.isArray(profile?.agePreferences)? profile.agePreferences[0]?.split(",").length > 10? "Any": profile.agePreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaBirthdayCake style={{ color: "#ffc107" }} />,
      },
      {
        label: "Family Preferences",value: Array.isArray(profile?.familyPreferences)? profile.familyPreferences[0]?.split(",").length > 10? "Any": profile.familyPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaUsers style={{ color: "#007bff" }} />,
      }
     
    ],
  },
  //catse / religion prteferences
  {
    title: "Catse / Religion Preferences",
    icon: <FaEnvelope style={{ color: "#007bff" }} />,
    fields: [
      
      {
        label: "Religion Preferences",value: Array.isArray(profile?.religionPreferences)? profile.religionPreferences[0]?.split(",").length > 10? "Any": profile.religionPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaChurch style={{ color: "#007bff" }} />,
      },
      {
        label: "Caste Preferences",value: Array.isArray(profile?.castePreferences)? profile.castePreferences[0]?.split(",").length > 10? "Any": profile.castePreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaUsers style={{ color: "#28a745" }} />,
      },
     
      {
        label: "Sub Caste Preferences",value: Array.isArray(profile?.subCastePreferences)? profile.subCastePreferences[0]?.split(",").length > 10? "Any": profile.subCastePreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaUsers style={{ color: "#007bff" }} />,
      },
     
     
     
    ],
  },
  //Education or profession preferences
  {
    title: "Education / Professionsal  Preferences",
    icon: <FaEnvelope style={{ color: "#007bff" }} />,
    fields: [
      {
        label: "Education Preferences",value: Array.isArray(profile?.partnerEducationPreferences)? profile.partnerEducationPreferences[0]?.split(",").length > 10? "Any": profile.partnerEducationPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaGraduationCap style={{ color: "#28a745" }} />,
      },
      
   
      {
        label: "Occupation Preferences",value: Array.isArray(profile?.partnerOccupationPreferences)? profile.partnerOccupationPreferences[0]?.split(",").length > 10? "Any": profile.partnerOccupationPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaBriefcase style={{ color: "#007bff" }} />,
      },
      {
        label: "Job Location Preferences",value: Array.isArray(profile?.partnerJobLocationPreferences)? profile.partnerJobLocationPreferences[0]?.split(",").length > 10? "Any": profile.partnerJobLocationPreferences[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaMapMarkerAlt style={{ color: "#17a2b8" }} />,
      },
     
      {
        label: "Annual Income",value: Array.isArray(profile?.partnerAnnualIncome)? profile.partnerAnnualIncome[0]?.split(",").length > 10? "Any": profile.partnerAnnualIncome[0] ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaRupeeSign style={{ color: "#ffc107" }} />,
      },
      
      
     
     
    ],
  },
  
  //Property preferences
  {
    title: "Property Preferences",
    icon: <FaEnvelope style={{ color: "#007bff" }} />,
    fields: [
     
   
      {
        label: "Own House Preferences",
        value: Array.isArray(profile?.ownHousePreferences)
          ? profile.ownHousePreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.ownHousePreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaHome style={{ color: "#007bff" }} />,
      },
      {
        label: "Square Yards Preferences",
        value: Array.isArray(profile?.squareYardPreferences)
          ? profile.squareYardPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.squareYardPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaRuler style={{ color: "#007bff" }} />,
      },
      {
        label: "Monthly Rent Preferences",
        value: Array.isArray(profile?.monthlyRentPreferences)
          ? profile.monthlyRentPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.monthlyRentPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaMoneyBillAlt style={{ color: "#007bff" }} />,
      },
      {
        label: "Plots Preferences",
        value: Array.isArray(profile?.plotPreference)
          ? profile.plotPreference[0]?.split(",").length > 10
            ? "Any"
            : profile.plotPreference[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaMapMarkerAlt style={{ color: "#007bff" }} />,
      },
      {
        label: "Flats Preferences",
        value: Array.isArray(profile?.flatPreference)
          ? profile.flatPreference[0]?.split(",").length > 10
            ? "Any"
            : profile.flatPreference[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaHome style={{ color: "#007bff" }} />,
      },
      {
        label: "Own Location Preferences",
        value: Array.isArray(profile?.ownLocationPreferences)
          ? profile.ownLocationPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.ownLocationPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaMapMarkerAlt style={{ color: "#007bff" }} />,
      },
      {
        label: "Agriculture Land Preferences",
        value: Array.isArray(profile?.agricultureLandPreference)
          ? profile.agricultureLandPreference[0]?.split(",").length > 10
            ? "Any"
            : profile.agricultureLandPreference[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaTree style={{ color: "#007bff" }} />,
      },
      {
        label: "Property Value Preferences",
        value: Array.isArray(profile?.totalPropertyValuePreference)
          ? profile.totalPropertyValuePreference[0]?.split(",").length > 10
            ? "Any"
            : profile.totalPropertyValuePreference[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaTree style={{ color: "#007bff" }} />,
      },
   
      
      
     
     
    ],
  },
// Address Preferences
  {
    title: "Address Preferences",
    icon: <FaEnvelope style={{ color: "#007bff" }} />,
    fields: [
 
      {
        label: "Country Location Preferences",
        value: Array.isArray(profile?.countryLocationPreferences)
          ? profile.countryLocationPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.countryLocationPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaGlobe style={{ color: "#007bff" }} />,
      },
      {
        label: "State Location Preferences",
        value: Array.isArray(profile?.stateLocationPreferences)
          ? profile.stateLocationPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.stateLocationPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaMap style={{ color: "#007bff" }} />,
      },
      {
        label: "City Location Preferences",
        value: Array.isArray(profile?.cityLocationPreferences)
          ? profile.cityLocationPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.cityLocationPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaCity style={{ color: "#007bff" }} />,
      },
      {
        label: "Citizenship Preferences",
        value: Array.isArray(profile?.citizenshipPreferences)
          ? profile.citizenshipPreferences[0]?.split(",").length > 10
            ? "Any"
            : profile.citizenshipPreferences[0]
                ?.split(",")
                .slice(0, 10)
                .join(", ") + "..."
          : "NO DATA",
        icon: <FaPassport style={{ color: "#007bff" }} />,
      },
      
      
     
     
    ],
  },

  ];

  const navigate = useNavigate();

  const userId = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchProfile = async () => {
      try { 
        const response = await apiClient.get(`${apiEndpoints.userbymartial}/${userId}`);
                  console.log(response)

        const response2 = await apiClient1.get(`${apiEndpoints1.BureauManage}`);
        
        const contentType = response.headers['content-type'];

        if (contentType && contentType.includes('application/json')) {
          setProfile(response.data);

          
          // Increment views count when profile is viewed
          try {
            await apiClient.post(`${apiEndpoints.incrementViews}/${userId}/increment-views`);
          } catch (viewError) {
            console.error('Error incrementing views:', viewError);
            // Don't fail the entire request if view increment fails
          }
          
          // Increment package views count if user has a package
          try {
            await apiClient.post(`${apiEndpoints.incrementPackageViews}/${userId}/increment-views`);
          } catch (packageViewError) {
            console.error('Error incrementing package views:', packageViewError);
            // Don't fail the entire request if package view increment fails
          }
        } else {
          setError('Expected JSON response, but got HTML or other content type.');
        }

        // Assuming you want to match the `bureauId` stored in the user profile with the bureau profile data
        const bureauId = response.data?.bureauId;
        const bureau = response2.data.bureauProfiles.find(b => b.bureauId === bureauId);
        setBureauProfile(bureau);

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

  if (!profile || !bureauProfile) {
    return <p>No profile data found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-2">
           <Helmet>
  <title>{`Profile of ${profile.fullName}`}</title>
  <meta name="description" content={`Check out the profile of ${profile.fullName} on our platform.`} />
  <meta property="og:title" content={`Profile of ${profile.fullName}`} />
  <meta property="og:description" content="Explore the details and connect now!" />
  <meta property="og:image" content={`${Uploads}/${profile.image}`} />
  <meta property="og:url" content={window.location.href} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Profile of ${profile.fullName}`} />
  <meta name="twitter:description" content="Explore the details and connect now!" />
  <meta name="twitter:image" content={`${Uploads}/${profile.image}`} />
</Helmet>

<div className="w-full h-full shadow-lg z-20 ">
        <div className="absolute top-0 left-0 right-0  flex justify-between items-center p-4 z-30">
          <FaArrowLeft
            className="text-grey cursor-pointer"
            onClick={handleBackClick}
            size={24}
          />
          <h1 className="text-md font-semibold text-grey text-left flex-1">
             {profile.fullName}
          </h1>
        </div>
       <div className='flex justify-center items-center'>
         <img
          src={`${Uploads}${profile.image || "default_image.png"}`}
          style={profileViewStyle}
          alt="Profile"
          className="h-full object-cover cursor-pointer"
          onClick={() => toggleModal(0)} // Open modal at main image
          onError={(e) => {
            e.target.src = `${Uploads}default_image.png`;
          }}
        />
       </div>
      </div>

      {/* Gallery Images */}
      {profile.gallery && profile.gallery.length > 0 && (
        <div className="flex overflow-x-auto space-x-2 p-2 mt-2">
          {profile.gallery.map((img, index) => (
            <img
              key={index}
              src={`${Uploads}${img}`}
              alt={`Gallery ${index}`}
              className="w-20 h-20 object-cover cursor-pointer rounded-lg shadow"
              onClick={() => toggleModal(index + 1)} // Open modal at gallery image
              onError={(e) => {
                e.target.src = `${Uploads}default_image.png`;
              }}
            />
          ))}
        </div>
      )}
      {/* Modal Slider */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="relative">
            <img
              src={`${Uploads}${images[currentIndex] || "default_image.png"}`}
              alt="Gallery Modal"
              className="max-w-full max-h-[90vh] rounded-lg"
              onError={(e) => {
                e.target.src = `${Uploads}default_image.png`;
              }}
            />
            {/* Close Button */} 
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            {/* Navigation Arrows */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
              onClick={prevImage}
            >
              <FaArrowLeft />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
              onClick={nextImage}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}

   {/* Profile Details */}
   <div className="pt-6 mb-3">
  <div className="w-full">
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <br />

 {/* First Row */}
 <div className="grid grid-cols-3 gap-2 w-full">
  <div className="flex items-center text-blue-400">
    <FaIdBadge className="text-lg mr-1" />
    <div>
      <h5 className="text-xs text-left text-black">ID</h5>
      <p className="text-xs font-semibold flex">
        {profile.martialId || "No Data"} <FaCheck className='text-green-500 ml-2'/>
      </p>
    </div>
  </div>
  <div className="flex items-center text-yellow-600">
    <FaCreditCard className="text-lg mr-1" />
    <div>
      <h5 className="text-xs text-left text-black">Payment</h5>
      <p className="text-xs font-semibold">
        {profile.paymentStatus
          ? profile.paymentStatus.charAt(0).toUpperCase() + profile.paymentStatus.slice(1)
          : "No Data"}
      </p>
    </div>
  </div>
  <div className="flex items-center text-blue-600">
    <FaPassport className="text-lg mr-1" />
    <div>
      <h5 className="text-xs text-left text-black">Citizenship</h5>
      <p className="text-xs font-semibold">
        {profile.profileStatus || "No Data"}
      </p>
    </div>
  </div>
</div>

{/* Views Count Row */}
<div className="grid grid-cols-1 gap-2 w-full mt-2">
  <div className="flex items-center text-green-600">
    <FaEye className="text-lg mr-1" />
    <div>
      <h5 className="text-xs text-left text-black">Profile Views</h5>
      <p className="text-xs font-semibold">
        {profile.views || 0} views
      </p>
    </div>
  </div>
</div>

      <br />

      {/* Subsequent Rows */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex items-center">
          <FaCogs className="text-gray-600 text-2xl mr-2" />
          <div>
            <h5 className="text-sm font-semibold text-gray-800 text-left">Service Preference</h5>
            <p className="text-sm font-bold text-gray-800">
              {profile.servicePreference
                ? profile.servicePreference.charAt(0).toUpperCase() + profile.servicePreference.slice(1)
                : "No Data"}
            </p>
          </div>
        </div>
      

        <div className="flex items-center">
          <FaUser className="text-gray-600 text-2xl mr-2" />
          <div>
            <h5 className="text-sm font-semibold text-gray-800 text-left">Created By</h5>
            <p className="text-sm font-bold text-gray-800">
              {profile.createdBy
                ? profile.createdBy.charAt(0).toUpperCase() + profile.createdBy.slice(1)
                : "No Data"}
            </p>
          </div>
        </div>
    
        <div className="flex items-center">
          <FaUsers className="text-gray-600 text-2xl mr-2" />
          <div>
            <h5 className="text-sm font-semibold text-gray-800 text-left">Caste Preference</h5>
            <p className="text-sm font-bold text-gray-800">
              {profile.castePreference || "No Data"}
            </p>
          </div>
        </div>
     
      </div>
      <h2 className='font-bold text-center text-red-600'>Bureau Contact Details </h2>
      <div className="flex items-center w-full space-x-4">
       
  {/* Call Button */}
  <a
    href={`tel:${bureauProfile.mobileNumber}`} // Dynamic mobile number
    className="flex items-center justify-center bg-blue-500 text-white text-xs py-2 px-4 w-full rounded-full hover:bg-blue-600"
  >
    <FaPhoneAlt className="mr-2" />
    Call Now
  </a>

  {/* Example: Message Button or another element */}
  <a
    href={`https://wa.me/${bureauProfile.mobileNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center bg-green-500 text-white py-2 px-4 w-full rounded-full hover:bg-green-600"
  >
    <FaWhatsapp className="mr-2" />
    WhatsApp
  </a>
</div>
    </div>
  </div>
</div>

    
      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-2">
            <h3 className="text-2xl font-semibold flex items-center text-yellow-500">
              <div style={iconStyle}>{section.icon}</div> {section.title}
            </h3>
            <div className="mt-4">
              {section.fields.map((field, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <div className="text-lg " style={iconStyle}>{field.icon}</div>
                  <div>
                    <p className="text-sm text-gray">{field.label}:</p>
                    <p className="text-lg font-semibold">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      


    </div>
  );
};

export default ProfilePage;
