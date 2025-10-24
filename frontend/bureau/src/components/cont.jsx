
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
        { 
          label: "Education", 
          value: profile?.education || "N/A", 
          icon: <FaGraduationCap style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Employment Status", 
          value: profile?.employmentStatus || "N/A", 
          icon: <FaBriefcase style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Occupation", 
          value: profile?.occupation || "N/A", 
          icon: <FaUserTie style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Annual Income", 
          value: `₹ ${profile?.annualIncome || "N/A"}`, 
          icon: <FaMoneyBillWave style={{ color: "#007bff" }} /> 
        },
      ],
    },
    {
      title: "Business Information",
      icon: <FaBuilding style={{ color: "#007bff" }} />,
      fields: [
        { 
          label: "Any other Business", 
          value: profile?.otherBusiness || "N/A", 
          icon: <FaChartLine style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Business Location", 
          value: profile?.businessLocation?.join(", ") || "N/A", 
          icon: <FaMapMarkerAlt style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Other Business Income", 
          value: profile?.otherBusinessIncome || "N/A", 
          icon: <FaMoneyCheckAlt style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Extra Talented Skills", 
          value: profile?.extraTalentedSkills?.join(", ") || "N/A", 
          icon: <FaLightbulb style={{ color: "#007bff" }} /> 
        },
      ],
    },
    {
      title: "Location Information",
      icon: <FaLocationArrow style={{ color: "#007bff" }} />,
      fields: [
        { 
          label: "Country", 
          value: profile?.country || "N/A", 
          icon: <FaGlobe style={{ color: "#007bff" }} /> 
        },
        { 
          label: "State", 
          value: profile?.state || "N/A", 
          icon: <FaMap style={{ color: "#007bff" }} /> 
        },
        { 
          label: "City", 
          value: profile?.district || "N/A", 
          icon: <FaCity style={{ color: "#007bff" }} /> 
        },
        { 
          label: "Citizenship", 
          value: profile?.citizenship || "N/A", 
          icon: <FaPassport style={{ color: "#007bff" }} /> 
        },
      ],
    },
    
    {
      title: "Partner Preferences",
      icon: <FaEnvelope style={{ color: "#007bff" }} />,
      fields: [
        {
          label: "Education Preferences",value: Array.isArray(profile?.partnerEducationPreferences)? profile.partnerEducationPreferences[0]?.split(",").length > 10? "Any": profile.partnerEducationPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaGraduationCap style={{ color: "#28a745" }} />,
        },
        {
          label: "Service Preferences",value: Array.isArray(profile?.partnerServicePreference)? profile.partnerServicePreference[0]?.split(",").length > 10? "Any": profile.partnerServicePreference[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaCog style={{ color: "#007545f" }} />,
        },
        {
          label: "Created By",value: Array.isArray(profile?.partnerCreatedBy)? profile.partnerCreatedBy[0]?.split(",").length > 10? "Any": profile.partnerCreatedBy[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaUser style={{ color: "#007bff" }} />,
        },
        {
          label: "Education Preferences",value: Array.isArray(profile?.partnerEducationPreferences)? profile.partnerEducationPreferences[0]?.split(",").length > 10? "Any": profile.partnerEducationPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaGraduationCap style={{ color: "#28a745" }} />,
        },
        {
          label: "Occupation Preferences",value: Array.isArray(profile?.partnerOccupationPreferences)? profile.partnerOccupationPreferences[0]?.split(",").length > 10? "Any": profile.partnerOccupationPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaBriefcase style={{ color: "#007bff" }} />,
        },
        {
          label: "Job Location Preferences",value: Array.isArray(profile?.partnerJobLocationPreferences)? profile.partnerJobLocationPreferences[0]?.split(",").length > 10? "Any": profile.partnerJobLocationPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaMapMarkerAlt style={{ color: "#17a2b8" }} />,
        },
       
        {
          label: "Annual Income",value: Array.isArray(profile?.partnerAnnualIncome)? profile.partnerAnnualIncome[0]?.split(",").length > 10? "Any": profile.partnerAnnualIncome[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaRupeeSign style={{ color: "#ffc107" }} />,
        },
        {
          label: "Religion Preferences",value: Array.isArray(profile?.religionPreferences)? profile.religionPreferences[0]?.split(",").length > 10? "Any": profile.religionPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaChurch style={{ color: "#007bff" }} />,
        },
        {
          label: "Caste Preferences",value: Array.isArray(profile?.castePreferences)? profile.castePreferences[0]?.split(",").length > 10? "Any": profile.castePreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaUsers style={{ color: "#28a745" }} />,
        },
       
        {
          label: "Sub Caste Preferences",value: Array.isArray(profile?.subcastePreferences)? profile.subcastePreferences[0]?.split(",").length > 10? "Any": profile.subcastePreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaUsers style={{ color: "#007bff" }} />,
        },
        {
          label: "Marital Status Preferences",value: Array.isArray(profile?.maritalStatusPreferences)? profile.maritalStatusPreferences[0]?.split(",").length > 10? "Any": profile.maritalStatusPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaHeart style={{ color: "#17a2b8" }} />,
        },
        {
          label: "Children Preferences",value: Array.isArray(profile?.childrenPreferences)? profile.childrenPreferences[0]?.split(",").length > 10? "Any": profile.childrenPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaChild style={{ color: "#28a745" }} />,
        },
        {
          label: "Mother Tongue Preferences",value: Array.isArray(profile?.motherTonguePreferences)? profile.motherTonguePreferences[0]?.split(",").length > 10? "Any": profile.motherTonguePreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaLanguage style={{ color: "#007bff" }} />,
        },
        {
          label: "Age Preferences",value: Array.isArray(profile?.agePreferences)? profile.agePreferences[0]?.split(",").length > 10? "Any": profile.agePreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaBirthdayCake style={{ color: "#ffc107" }} />,
        },
        {
          label: "Family Preferences",value: Array.isArray(profile?.familyPreferences)? profile.familyPreferences[0]?.split(",").length > 10? "Any": profile.familyPreferences[0] ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaUsers style={{ color: "#007bff" }} />,
        },
        {
          label: "Own House Preferences",
          value: Array.isArray(profile?.ownHousePreferences)
            ? profile.ownHousePreferences[0]?.split(",").length > 10
              ? "Any"
              : profile.ownHousePreferences[0]
                  ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
          icon: <FaHome style={{ color: "#007bff" }} />,
        },
        {
          label: "Square Yards Preferences",
          value: Array.isArray(profile?.squareYardsPreferences)
            ? profile.squareYardsPreferences[0]?.split(",").length > 10
              ? "Any"
              : profile.squareYardsPreferences[0]
                  ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
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
            : "N/A",
          icon: <FaMoneyBillAlt style={{ color: "#007bff" }} />,
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
            : "N/A",
          icon: <FaMapMarkerAlt style={{ color: "#007bff" }} />,
        },
        {
          label: "Country Location Preferences",
          value: Array.isArray(profile?.countryLocationPreferences)
            ? profile.countryLocationPreferences[0]?.split(",").length > 10
              ? "Any"
              : profile.countryLocationPreferences[0]
                  ?.split(",")
                  .slice(0, 10)
                  .join(", ") + "..."
            : "N/A",
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
            : "N/A",
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
            : "N/A",
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
            : "N/A",
          icon: <FaPassport style={{ color: "#007bff" }} />,
        },
        
        
       
       
      ],
    }
    