import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import Multiselect from "multiselect-react-dropdown";

const Step9 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    partnerServicePreference: [], // Array to store selected preferences
    partnerCreatedBy: "", // Changed to partnerCreatedBy
    religionPreferences: [], // Array of selected religions
    castePreferences: [], // Array of selected caste preferences
    subCastePreferences: [], // Array of selected sub-caste preferences
    maritalStatusPreferences: [], // Array of selected marital status preferences
    childrenPreferences: [], // Array of selected children preferences
    motherTonguePreferences: [], // Array of selected mother tongue preferences
    agePreferences: [], // Array of selected age preferences
    heightPreferences: [], // Initialize as an empty array
    partnerEducationPreferences: [], // New field for education preferences
    partnerOccupationPreferences: [], // Add occupation preferences
    partnerJobLocationPreferences: [], // Add job location preferences
    partnerAnnualIncome: "", // Store selected annual income
    familyPreferences: [], // Store selected family preferences
    settledLocationPreferences: [], // Preferences for settled locations
    ownHousePreferences: [], // Selected house types
    squareYardPreferences: [], // Selected square yard preferences
    monthlyRentPreferences: [], // Selected monthly rent preferences
    plotPreference: "", // Store a single selected plot type
    flatPreference: "", // Store a single selected flat type (numeric ID)
    ownLocationPreferences: [], // Make sure this is initialized as an empty array
    agricultureLandPreference: "", // A single value for the selected land size
    totalPropertyValuePreference: "", // A single value for the selected property value
    countryLocationPreferences: [], // Array of selected country names
    stateLocationPreferences: [], // Array of selected state names
    cityLocationPreferences: [], // Array of selected city names
    citizenshipPreferences: [], // Array of selected citizenship types
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (selectedList) => {
    setFormData({
      ...formData,
      languagesKnown: selectedList,
    });

    // Optionally, close the dropdown after selection
    setDropdownOpen(false); // Control visibility based on your specific component
  };

  const handleCloseDropdown = () => {
    // Close the dropdown when the close button is clicked
    setDropdownOpen(false); // Adjust according to your component's API
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    // Handle checkbox changes for partnerServicePreference
    if (name === "partnerServicePreference") {
      setFormData((prevFormData) => {
        const updatedServicePreferences = checked
          ? [...prevFormData.partnerServicePreference, value] // Add to array if checked
          : prevFormData.partnerServicePreference.filter(
              (preference) => preference !== value
            ); // Remove if unchecked

        return {
          ...prevFormData,
          partnerServicePreference: updatedServicePreferences,
        };
      });
    }
    // Handle dropdown change for partnerCreatedBy
    else if (name === "partnerCreatedBy") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        partnerCreatedBy: value, // Update selected value for partnerCreatedBy
      }));
    }
  };

  const handleBack = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      window.location.href = "/step8";
    }
  };

  // Predefined options for religions
  const religionOptions = [
    "Any",
    "Hindu",
    "Muslim",
    "Christian",
    "Sikh",
    "Buddhist",
    "Jain",
    "Parsi",
    "Other",
  ];

  // Handle the selection of religion preferences
  const handleReligionChange = (selectedList) => {
    setFormData({
      ...formData,
      religionPreferences: selectedList,
    });
  };

  // totalcaste fields and functionality

  // State to manage caste options
  const [casteOptions, setCasteOptions] = useState([]);

  // Fetch caste data from API
  useEffect(() => {
    const fetchCastes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/caste"
        );
        console.log("Fetched caste data: ", response.data); // Debugging
        setCasteOptions(response.data.map((caste) => caste.caste)); // Extract only caste names
      } catch (error) {
        console.error("Error fetching caste data:", error);
        alert("Error fetching caste data."); // Feedback for error
      }
    };

    fetchCastes();
  }, []);

  // Handle the selection of caste preferences
  const handleCasteChange = (selectedList) => {
    setFormData({
      ...formData,
      castePreferences: selectedList,
    });
  };

  // State to manage sub-caste options
  const [subCasteOptions, setSubCasteOptions] = useState([]);

  // Fetch sub-caste data from API
  useEffect(() => {
    const fetchSubCastes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/sub_caste"
        );
        console.log("Fetched sub-caste data: ", response.data); // Debugging
        setSubCasteOptions(response.data.map((subCaste) => subCaste.sub_caste)); // Extract only sub_caste names
      } catch (error) {
        console.error("Error fetching sub-caste data:", error);
        alert("Error fetching sub-caste data."); // Feedback for error
      }
    };

    fetchSubCastes();
  }, []);

  // Handle the selection of sub-caste preferences
  const handleSubCasteChange = (selectedList) => {
    setFormData({
      ...formData,
      subCastePreferences: selectedList,
    });
  };

  // Hardcoded marital status options
  const maritalStatusOptions = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];

  // Handle the selection of marital status preferences
  const handleMaritalStatusChange = (selectedList) => {
    setFormData({
      ...formData,
      maritalStatusPreferences: selectedList,
    });
  };

  //   children preference

  // Hardcoded children preference options
  const childrenPreferenceOptions = [
    "No children",
    "Want children",
    "Has children",
    "Not sure yet",
  ];

  // Handle the selection of children preferences
  const handleChildrenPreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      childrenPreferences: selectedList,
    });
  };

  // Hardcoded mother tongue preference options
  const motherTongueOptions = [
    "Hindi",
    "English",
    "Tamil",
    "Telugu",
    "Bengali",
    "Marathi",
    "Gujarati",
  ];

  // Handle the selection of mother tongue preferences
  const handleMotherTongueChange = (selectedList) => {
    setFormData({
      ...formData,
      motherTonguePreferences: selectedList,
    });
  };

  //   Age preference

  // Hardcoded age preference options
  const ageOptions = [
    "Any",
    "18-24",
    "25-30",
    "31-35",
    "36-40",
    "41-50",
    "51 and above",
  ];

  // Handle the selection of age preferences
  const handleAgePreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      agePreferences: selectedList,
    });
  };

  //    education details
  // State to manage education data
  const [educations, setEducations] = useState([]);
  const [filteredEducations, setFilteredEducations] = useState([]);
  const [educationSearchTerm, setEducationSearchTerm] = useState(""); // Search term for filtering

  // Fetch education data from API
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/education"
        );
        setEducations(response.data); // Store the fetched data
        setFilteredEducations(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching education data:", error);
        alert("Error fetching education data.");
      }
    };

    fetchEducationData();
  }, []);

  // Filter education fields based on the search term
  useEffect(() => {
    if (educationSearchTerm) {
      setFilteredEducations(
        educations.filter((edu) =>
          edu.education
            .toLowerCase()
            .includes(educationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEducations(educations); // Reset to the full list if no search term
    }
  }, [educationSearchTerm, educations]);

  // Handle the selection of education fields
  const handleEducationChange = (selectedList) => {
    setFormData({
      ...formData,
      partnerEducationPreferences: selectedList.map((edu) => edu.education),
    });
  };

  //    employeeDetails
  // State to manage employee preferences
  const [employees, setEmployees] = useState([]); // Holds all employee preferences from the API
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered employee list based on search
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState(""); // Search term for filtering

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/occupation"
        );
        setEmployees(response.data); // Store the fetched data
        setFilteredEmployees(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Error fetching employee data."); // Notify the user in case of error
      }
    };

    fetchEmployeeData();
  }, []);

  // Filter employee preferences based on the search term
  useEffect(() => {
    if (employeeSearchTerm) {
      setFilteredEmployees(
        employees.filter((employee) =>
          employee.occupation
            .toLowerCase()
            .includes(employeeSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees(employees); // Reset to the full list if no search term
    }
  }, [employeeSearchTerm, employees]);

  // Handle the selection of employee preferences
  const handleEmployeeChange = (selectedList) => {
    setFormData({
      ...formData,
      partnerOccupationPreferences: selectedList.map(
        (employee) => employee.occupation
      ),
    });
  };

  //   location details
  // State to manage job locations
  const [locations, setLocations] = useState([]); // Holds all job locations from the API
  const [filteredLocations, setFilteredLocations] = useState([]); // Filtered locations based on search
  const [locationSearchTerm, setLocationSearchTerm] = useState(""); // Search term for filtering

  // Fetch job location data from API
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        );
        setLocations(response.data); // Store the fetched data
        setFilteredLocations(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching location data:", error);
        alert("Error fetching location data."); // Notify the user in case of error
      }
    };

    fetchLocationData();
  }, []);

  // Filter job locations based on the search term
  useEffect(() => {
    if (locationSearchTerm) {
      setFilteredLocations(
        locations.filter((location) =>
          location.city.toLowerCase().includes(locationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredLocations(locations); // Reset to the full list if no search term
    }
  }, [locationSearchTerm, locations]);

  // Handle the selection of job location preferences
  const handleLocationChange = (selectedList) => {
    setFormData({
      ...formData,
      partnerJobLocationPreferences: selectedList.map(
        (location) => location.city
      ),
    });
  };

  //   annual income
  const [annualIncomeOptions, setAnnualIncomeOptions] = useState([]); // State for annual income options

  // Fetch annual income data from API
  useEffect(() => {
    const fetchAnnualIncomeData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/annual_income"
        );
        setAnnualIncomeOptions(response.data); // Store the fetched data
      } catch (error) {
        console.error("Error fetching annual income data:", error);
        alert("Error fetching annual income data.");
      }
    };

    fetchAnnualIncomeData();
  }, []);

  //   family preference
  // Handle the selection of annual income (single selection)
  const handleIncomeChange = (selectedList) => {
    // Since it's single selection, selectedList will contain only one item
    if (selectedList.length > 0) {
      setFormData({
        ...formData,
        partnerAnnualIncome: selectedList[0].annual_income,
      });
    }
  };

  // Predefined family preference options
  const familyPreferenceOptions = [
    { id: 1, preference: "Joint Family" },
    { id: 2, preference: "Nuclear Family" },
    { id: 3, preference: "Family-Oriented Partner" },
    { id: 4, preference: "Independent Partner" },
    { id: 5, preference: "Living with Parents" },
  ];

  // Handle the selection of family preferences (multi-selection)
  const handlePreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      familyPreferences: selectedList.map((item) => item.preference),
    });
  };

  // State to manage settled locations
  const [settledLocations, setSettledLocations] = useState([]); // Holds all settled locations from the API
  const [filteredSettledLocations, setFilteredSettledLocations] = useState([]); // Filtered settled locations based on search
  const [settledLocationSearchTerm, setSettledLocationSearchTerm] =
    useState(""); // Search term for filtering

  // Fetch settled location data from API
  useEffect(() => {
    const fetchSettledLocationData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        );
        setSettledLocations(response.data); // Store the fetched data
        setFilteredSettledLocations(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching settled location data:", error);
        alert("Error fetching settled location data."); // Notify the user in case of error
      }
    };

    fetchSettledLocationData();
  }, []);

  // Filter settled locations based on the search term
  useEffect(() => {
    if (settledLocationSearchTerm) {
      setFilteredSettledLocations(
        settledLocations.filter((location) =>
          location.city
            .toLowerCase()
            .includes(settledLocationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSettledLocations(settledLocations); // Reset to the full list if no search term
    }
  }, [settledLocationSearchTerm, settledLocations]);

  // Handle the selection of settled location preferences
  const handleSettledLocationChange = (selectedList) => {
    setFormData({
      ...formData,
      settledLocationPreferences: selectedList.map((location) => location.city),
    });
  };

  // State to manage own house preferences
  const [ownHousePreferences, setOwnHousePreferences] = useState([]); // Holds all options for house types
  const [filteredOwnHousePreferences, setFilteredOwnHousePreferences] =
    useState([]); // Filtered house preferences based on search
  const [ownHouseSearchTerm, setOwnHouseSearchTerm] = useState(""); // Search term for filtering

  // Static data for house types
  const houseOptions = [
    { id: 1, type: "G" },
    { id: 2, type: "G+1" },
    { id: 3, type: "G+2" },
    { id: 4, type: "G+3" },
    { id: 5, type: "G+4" },
    { id: 6, type: "G+5" },
    { id: 7, type: "G+6" },
    { id: 8, type: "G+7" },
    { id: 9, type: "G+8" },
    { id: 10, type: "G+9" },
    { id: 11, type: "G+10" },
  ];

  // Initialize data on mount
  useEffect(() => {
    setOwnHousePreferences(houseOptions); // Set all house types
    setFilteredOwnHousePreferences(houseOptions); // Initialize filtered list
  }, []);

  // Filter own house preferences based on search term
  useEffect(() => {
    if (ownHouseSearchTerm) {
      setFilteredOwnHousePreferences(
        ownHousePreferences.filter((house) =>
          house.type.toLowerCase().includes(ownHouseSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOwnHousePreferences(ownHousePreferences); // Reset to full list if no search term
    }
  }, [ownHouseSearchTerm, ownHousePreferences]);

  // Handle the selection of own house preferences
  const handleOwnHousePreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      ownHousePreferences: selectedList.map((house) => house.type),
    });
  };

  // State to manage square yard preferences
  const [squareYardPreferences, setSquareYardPreferences] = useState([]); // Holds all options for square yards
  const [filteredSquareYardPreferences, setFilteredSquareYardPreferences] =
    useState([]); // Filtered square yard preferences based on search
  const [squareYardSearchTerm, setSquareYardSearchTerm] = useState(""); // Search term for filtering

  // Static data for square yard ranges
  const squareYardOptions = [
    { id: 1, size: "50 sq. yd." },
    { id: 2, size: "100 sq. yd." },
    { id: 3, size: "150 sq. yd." },
    { id: 4, size: "200 sq. yd." },
    { id: 5, size: "250 sq. yd." },
    { id: 6, size: "300 sq. yd." },
    { id: 7, size: "400 sq. yd." },
    { id: 8, size: "500 sq. yd." },
    { id: 9, size: "750 sq. yd." },
    { id: 10, size: "1000 sq. yd." },
  ];

  // Initialize data on mount
  useEffect(() => {
    setSquareYardPreferences(squareYardOptions); // Set all square yard options
    setFilteredSquareYardPreferences(squareYardOptions); // Initialize filtered list
  }, []);

  // Filter square yard preferences based on search term
  useEffect(() => {
    if (squareYardSearchTerm) {
      setFilteredSquareYardPreferences(
        squareYardPreferences.filter((yard) =>
          yard.size.toLowerCase().includes(squareYardSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSquareYardPreferences(squareYardPreferences); // Reset to full list if no search term
    }
  }, [squareYardSearchTerm, squareYardPreferences]);

  // Handle the selection of square yard preferences
  const handleSquareYardPreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      squareYardPreferences: selectedList.map((yard) => yard.size),
    });
  };

  // State to manage monthly rent preferences
  const [monthlyRentPreferences, setMonthlyRentPreferences] = useState([]); // Holds all options for monthly rent
  const [filteredMonthlyRentPreferences, setFilteredMonthlyRentPreferences] =
    useState([]); // Filtered rent preferences based on search
  const [monthlyRentSearchTerm, setMonthlyRentSearchTerm] = useState(""); // Search term for filtering

  // Static data for rent ranges (in INR)
  const monthlyRentOptions = [
    { id: 1, amount: "₹5,000" },
    { id: 2, amount: "₹10,000" },
    { id: 3, amount: "₹15,000" },
    { id: 4, amount: "₹20,000" },
    { id: 5, amount: "₹25,000" },
    { id: 6, amount: "₹30,000" },
    { id: 7, amount: "₹40,000" },
    { id: 8, amount: "₹50,000" },
    { id: 9, amount: "₹75,000" },
    { id: 10, amount: "₹1,00,000" },
  ];

  // Initialize data on mount
  useEffect(() => {
    setMonthlyRentPreferences(monthlyRentOptions); // Set all rent options
    setFilteredMonthlyRentPreferences(monthlyRentOptions); // Initialize filtered list
  }, []);

  // Filter monthly rent preferences based on search term
  useEffect(() => {
    if (monthlyRentSearchTerm) {
      setFilteredMonthlyRentPreferences(
        monthlyRentPreferences.filter((rent) =>
          rent.amount
            .toLowerCase()
            .includes(monthlyRentSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMonthlyRentPreferences(monthlyRentPreferences); // Reset to full list if no search term
    }
  }, [monthlyRentSearchTerm, monthlyRentPreferences]);

  // Handle the selection of monthly rent preferences
  const handleMonthlyRentPreferenceChange = (selectedList) => {
    setFormData({
      ...formData,
      monthlyRentPreferences: selectedList.map((rent) => rent.amount),
    });
  };

  // State for filtering plots
  const [plotPreferences, setPlotPreferences] = useState([]); // Holds all options for plots
  const [filteredPlotPreferences, setFilteredPlotPreferences] = useState([]); // Filtered plot preferences based on search
  const [plotSearchTerm, setPlotSearchTerm] = useState(""); // Search term for filtering

  // Static data for plot types (replace with your actual plot data)
  const plotOptions = [
    { id: 1, type: "1" },
    { id: 2, type: "2" },
    { id: 3, type: "3" },
    { id: 4, type: "4" },
    { id: 5, type: "5" },
    { id: 6, type: "6" },
    { id: 7, type: "7" },
    { id: 8, type: "8" },
    { id: 9, type: "9" },
    { id: 10, type: "10" },
  ];

  // Initialize data on mount
  useEffect(() => {
    setPlotPreferences(plotOptions); // Set all plot types
    setFilteredPlotPreferences(plotOptions); // Initialize filtered list
  }, []);

  // Filter plot preferences based on search term
  useEffect(() => {
    if (plotSearchTerm) {
      setFilteredPlotPreferences(
        plotPreferences.filter((plot) =>
          plot.type.toLowerCase().includes(plotSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPlotPreferences(plotPreferences); // Reset to full list if no search term
    }
  }, [plotSearchTerm, plotPreferences]);

  // Handle the selection of a plot preference (single selection)
  const handlePlotPreferenceChange = (selectedPlot) => {
    setFormData({
      ...formData,
      plotPreference: selectedPlot.type, // Store the selected plot type
    });
  };

  // State for filtering flats
  const [flatPreferences, setFlatPreferences] = useState([]); // Holds all options for flats
  const [filteredFlatPreferences, setFilteredFlatPreferences] = useState([]); // Filtered flat preferences based on search
  const [flatSearchTerm, setFlatSearchTerm] = useState(""); // Search term for filtering

  // Static data for flat types (replace with your actual flat data)
  const flatOptions = [
    { id: 1, type: 1 }, // Flat 1
    { id: 2, type: 2 }, // Flat 2
    { id: 3, type: 3 }, // Flat 3
    { id: 4, type: 4 }, // Flat 4
    { id: 5, type: 5 }, // Flat 5
    { id: 6, type: 6 }, // Flat 6
    { id: 7, type: 7 }, // Flat 7
    { id: 8, type: 8 }, // Flat 8
    { id: 9, type: 9 }, // Flat 9
    { id: 10, type: 10 }, // Flat 10
  ];

  // Initialize data on mount
  useEffect(() => {
    setFlatPreferences(flatOptions); // Set all flat types
    setFilteredFlatPreferences(flatOptions); // Initialize filtered list
  }, []);

  // Filter flat preferences based on search term
  useEffect(() => {
    if (flatSearchTerm) {
      setFilteredFlatPreferences(
        flatPreferences.filter(
          (flat) => flat.type.toString().includes(flatSearchTerm) // Convert to string for search comparison
        )
      );
    } else {
      setFilteredFlatPreferences(flatPreferences); // Reset to full list if no search term
    }
  }, [flatSearchTerm, flatPreferences]);

  // Handle the selection of a flat preference (single selection)
  const handleFlatPreferenceChange = (selectedFlat) => {
    setFormData({
      ...formData,
      flatPreference: selectedFlat.type, // Store the selected flat type as a number
    });
  };

  // State to manage own locations
  const [ownLocations, setOwnLocations] = useState([]); // Holds all own locations from the API
  const [filteredOwnLocations, setFilteredOwnLocations] = useState([]); // Filtered own locations based on search
  const [ownLocationSearchTerm, setOwnLocationSearchTerm] = useState(""); // Search term for filtering

  // Fetch own location data from API
  useEffect(() => {
    const fetchOwnLocationData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        ); // API endpoint for own locations
        setOwnLocations(response.data); // Store the fetched data
        setFilteredOwnLocations(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching own location data:", error);
        alert("Error fetching own location data.");
      }
    };

    fetchOwnLocationData();
  }, []);

  // Filter own locations based on the search term
  useEffect(() => {
    if (ownLocationSearchTerm) {
      setFilteredOwnLocations(
        ownLocations.filter((location) =>
          location.city
            .toLowerCase()
            .includes(ownLocationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOwnLocations(ownLocations); // Reset to the full list if no search term
    }
  }, [ownLocationSearchTerm, ownLocations]);

  // Handle the selection of own location preferences
  const handleOwnLocationChange = (selectedList) => {
    setFormData({
      ...formData,
      ownLocationPreferences: selectedList.map((location) => location.city),
    });
  };

  // State to manage agriculture land sizes
  const [landSizes, setLandSizes] = useState([]); // Holds all available land sizes (up to 1000 acres)
  const [filteredLandSizes, setFilteredLandSizes] = useState([]); // Filtered land sizes based on search
  const [landSizeSearchTerm, setLandSizeSearchTerm] = useState(""); // Search term for filtering

  // Fetch available agriculture land sizes (e.g., 1 acre, 5 acres, 10 acres, ... up to 1000 acres)
  useEffect(() => {
    // Generating land sizes up to 1000 acres
    const sizes = [];
    for (let i = 1; i <= 1000; i++) {
      sizes.push({ size: `${i} acres` }); // Add each size as "1 acre", "2 acres", ..., "1000 acres"
    }

    setLandSizes(sizes); // Store the available land sizes
    setFilteredLandSizes(sizes); // Initialize the filtered list
  }, []);

  // Filter land sizes based on the search term
  useEffect(() => {
    if (landSizeSearchTerm) {
      setFilteredLandSizes(
        landSizes.filter((landSize) =>
          landSize.size.toLowerCase().includes(landSizeSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredLandSizes(landSizes); // Reset to the full list if no search term
    }
  }, [landSizeSearchTerm, landSizes]);

  // Handle the selection of a single agriculture land preference
  const handleLandSizeChange = (e) => {
    setFormData({
      ...formData,
      agricultureLandPreference: e.target.value, // Store the selected land size
    });
  };

  // State to manage available property values
  const [propertyValues, setPropertyValues] = useState([]); // Holds all available property values (up to ₹1000 Crores)
  const [filteredPropertyValues, setFilteredPropertyValues] = useState([]); // Filtered property values based on search
  const [propertyValueSearchTerm, setPropertyValueSearchTerm] = useState(""); // Search term for filtering

  // Generate available property values (from ₹1 Lakh to ₹1000 Crores)
  useEffect(() => {
    const valuesArray = [];

    // Adding values in Lakh and Crore format
    for (let i = 1; i <= 1000; i++) {
      if (i < 100) {
        valuesArray.push({ value: `${i} Lakh` }); // ₹1 Lakh to ₹99 Lakh
      } else {
        valuesArray.push({ value: `${i} Crore` }); // ₹1 Crore to ₹1000 Crore
      }
    }

    setPropertyValues(valuesArray); // Store the available property values
    setFilteredPropertyValues(valuesArray); // Initialize the filtered list
  }, []);

  // Filter property values based on the search term
  useEffect(() => {
    if (propertyValueSearchTerm) {
      setFilteredPropertyValues(
        propertyValues.filter((value) =>
          value.value
            .toLowerCase()
            .includes(propertyValueSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPropertyValues(propertyValues); // Reset to the full list if no search term
    }
  }, [propertyValueSearchTerm, propertyValues]);

  // Handle the selection of a single property value
  const handlePropertyValueChange = (e) => {
    setFormData({
      ...formData,
      totalPropertyValuePreference: e.target.value, // Store the selected property value
    });
  };

  // State to manage country locations
  const [countries, setCountries] = useState([]); // Holds all countries from the API
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered countries based on search
  const [countrySearchTerm, setCountrySearchTerm] = useState(""); // Search term for filtering

  // Fetch country data from API
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/country"
        ); // API endpoint for countries
        setCountries(response.data); // Store the fetched data
        setFilteredCountries(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Error fetching country data.");
      }
    };

    fetchCountryData();
  }, []);

  // Filter countries based on the search term
  useEffect(() => {
    if (countrySearchTerm) {
      setFilteredCountries(
        countries.filter((country) =>
          country.country
            .toLowerCase()
            .includes(countrySearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCountries(countries); // Reset to the full list if no search term
    }
  }, [countrySearchTerm, countries]);

  // Handle the selection of country preferences
  const handleCountryChange = (selectedList) => {
    setFormData({
      ...formData,
      countryLocationPreferences: selectedList.map(
        (country) => country.country
      ),
    });
  };

  // State to manage states
  const [states, setStates] = useState([]); // Holds all states from the API
  const [filteredStates, setFilteredStates] = useState([]); // Filtered states based on search
  const [stateSearchTerm, setStateSearchTerm] = useState(""); // Search term for filtering

  // Fetch state data from API
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/state"
        ); // API endpoint for states
        setStates(response.data); // Store the fetched data
        setFilteredStates(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching state data:", error);
        alert("Error fetching state data.");
      }
    };

    fetchStateData();
  }, []);

  // Filter states based on the search term
  useEffect(() => {
    if (stateSearchTerm) {
      setFilteredStates(
        states.filter((state) =>
          state.state.toLowerCase().includes(stateSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStates(states); // Reset to the full list if no search term
    }
  }, [stateSearchTerm, states]);

  // Handle the selection of state preferences
  const handleStateChange = (selectedList) => {
    setFormData({
      ...formData,
      stateLocationPreferences: selectedList.map((state) => state.state),
    });
  };

  // State to manage cities
  const [cities, setCities] = useState([]); // Holds all cities from the API
  const [filteredCities, setFilteredCities] = useState([]); // Filtered cities based on search
  const [citySearchTerm, setCitySearchTerm] = useState(""); // Search term for filtering

  // Fetch city data from API
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:3300/api/city"
        ); // API endpoint for cities
        setCities(response.data); // Store the fetched data
        setFilteredCities(response.data); // Initialize the filtered list
      } catch (error) {
        console.error("Error fetching city data:", error);
        alert("Error fetching city data.");
      }
    };

    fetchCityData();
  }, []);

  // Filter cities based on the search term
  useEffect(() => {
    if (citySearchTerm) {
      setFilteredCities(
        cities.filter((city) =>
          city.city.toLowerCase().includes(citySearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities); // Reset to the full list if no search term
    }
  }, [citySearchTerm, cities]);

  // Handle the selection of city preferences
  const handleCityChange = (selectedList) => {
    setFormData({
      ...formData,
      cityLocationPreferences: selectedList.map((city) => city.city),
    });
  };

  // Citizenship options (static list)
  const citizenshipOptions = [
    { id: 1, label: "Indian" },
    { id: 2, label: "NRI" },
    { id: 3, label: "OCI" },
    { id: 4, label: "Foreign National" },
  ];

  // Handle the selection of citizenship preferences
  const handleCitizenshipChange = (selectedList) => {
    setFormData({
      ...formData,
      citizenshipPreferences: selectedList.map((option) => option.label),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the form data to send
    const formDataToSend = {
      partnerServicePreference: formData.partnerServicePreference.join(","), // Join if you want to send multiple preferences as a comma-separated string
      partnerCreatedBy: formData.partnerCreatedBy, // Send partnerCreatedBy value
      religionPreferences: formData.religionPreferences.join(","), // Join selected religions if needed
      castePreferences: formData.castePreferences.join(","), // Join selected castes if needed
      subCastePreferences: formData.subCastePreferences.join(","), // Join selected sub-castes if needed
      maritalStatusPreferences: formData.maritalStatusPreferences, // Add partner marital status to form data
      childrenPreferences: formData.childrenPreferences.join(","),
      motherTonguePreferences: formData.motherTonguePreferences, // Add partner mother tongue preferences to form data
      agePreferences: formData.agePreferences.join(","),
      heightPreferences: formData.heightPreferences.join(","),
      partnerEducationPreferences:
        formData.partnerEducationPreferences.join(","),
      partnerOccupationPreferences:
        formData.partnerOccupationPreferences.join(","),
      partnerJobLocationPreferences:
        formData.partnerJobLocationPreferences.join(","),
      partnerAnnualIncome: formData.partnerAnnualIncome, // Send the selected annual income
      familyPreferences: formData.familyPreferences, // Send selected preferences
      settledLocationPreferences: formData.settledLocationPreferences.join(","),
      ownHousePreferences: formData.ownHousePreferences.join(","),
      squareYardPreferences: formData.squareYardPreferences.join(","),
      monthlyRentPreferences: formData.monthlyRentPreferences.join(","),
      plotPreference: formData.plotPreference, // Single selection - just send as a string
      flatPreference: formData.flatPreference,
      ownLocationPreferences: formData.ownLocationPreferences.join(","),
      agricultureLandPreference: formData.agricultureLandPreference,
      totalPropertyValuePreference: formData.totalPropertyValuePreference,
      countryLocationPreferences: formData.countryLocationPreferences.join(","),
      stateLocationPreferences: formData.stateLocationPreferences.join(","),
      cityLocationPreferences: formData.cityLocationPreferences.join(","),
      citizenshipPreferences: formData.citizenshipPreferences.join(","),
    };

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const endpoint = `${apiEndpoints.update}/${userId}`;

      const response = await apiClient.put(endpoint, formDataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Details updated successfully!");

        // Store the userId in localStorage for the next step
        localStorage.setItem("userId", userId);

        // Navigate to Step 7 (or next step)
        navigate(`/step10`, { state: { userId } });
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("An error occurred while updating details.");
    }
  };

  const partnerOptions = [
    "Any",
    "Self",
    "Father",
    "Mother",
    "Friend",
    "Relatives",
    "Sister",
    "Brother",
  ];

  const serviceOptions = [
    "Any",
    "Only Online Service",
    "Only Offline Service",
    "Online/Offline Service",
  ];

  const customStyles = {
    chips: {
      background: "#5a67d8", // Customize selected value (chips) style
      color: "white",
    },
    option: {
      color: "#5a67d8", // Style dropdown options
      borderBottom: "1px solid #e2e8f0", // Line under each option
      padding: "10px",
    },
    searchBox: {
      border: "1px solid #cbd5e0", // Customize search box border
      borderRadius: "0.375rem",
      padding: "16px",
    },
    closeIcon: {
      color: "red", // Style close icon
    },
  };

  const labelStyle = {
    color: "#6366f1", // indigo-500
    marginTop: "1.25rem", // mt-5
    fontWeight: "500", // font-medium
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "5px 5px",
    color: "white",
    backgroundColor: "#6366f1", // indigo-500
    borderRadius: "0.5rem", // rounded-lg
    textAlign: "center",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
    <div className="flex items-center justify-between mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full z-[50]">
<button onClick={handleBack} className="p-2">
  <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
</button>
<div className="text-center flex-1">
  <h2 className="text-xl font-semibold text-white">
    Step 9
  </h2>
  <h3 className="text-lg font-medium text-white">
    Partner Preferences Details
  </h3>
</div>
</div>
        <form onSubmit={handleSubmit} className="space-y-6 px-3 mt-24 z-[49]">
        <div className="z-[48] relative">
  {/* Service Preference Section */}
  <div style={{ zIndex: 1 }}>
    <div className="flex justify-between mt-3 ">
      <label className="block" style={labelStyle}>
        Service Preference
      </label>

      {/* Button to close the dropdown */}
      <button
        type="button"
        onClick={handleCloseDropdown}
        style={buttonStyle}
      >
        Save Service preferences
      </button>
    </div>
    <Multiselect
      options={serviceOptions} // List of service options
      selectedValues={
        formData.partnerServicePreference.length === serviceOptions.length
          ? ["Any"]
          : formData.partnerServicePreference
      } // If all options are selected, show only 'Any'
      onSelect={(selectedList) => {
        setFormData({
          ...formData,
          partnerServicePreference: selectedList.includes("Any")
            ? serviceOptions
            : selectedList,
        });
      }} // Update formData with selected options
      onRemove={(selectedList) => {
        setFormData({
          ...formData,
          partnerServicePreference: selectedList.includes("Any")
            ? serviceOptions
            : selectedList,
        });
      }} // Update formData on removal
      isObject={false} // Simple string array
      displayValue="partnerServicePreference" // Works for array of strings
      placeholder="Select Service Preference"
      showCheckbox={true} // Show checkboxes for each option
      closeIcon="cancel" // Close icon for the dropdown
      className="w-full mt-2"
      style={customStyles}
    />
  </div>
  
  {/* Partner Created By Section */}
  <div style={{ zIndex: 2 }}>
    <div className="flex justify-between mt-3 ">
      <label className="block" style={labelStyle}>
        Created By
      </label>

      {/* Button to close the dropdown */}
      <button
        type="button"
        onClick={handleCloseDropdown}
        style={buttonStyle}
      >
        Save Created By
      </button>
    </div>
    <Multiselect
      options={partnerOptions} // List of partner creation options
      selectedValues={
        formData.partnerCreatedBy.length === partnerOptions.length
          ? ["Any"]
          : formData.partnerCreatedBy
      } // If all options are selected, show only 'Any'
      onSelect={(selectedList) => {
        setFormData({
          ...formData,
          partnerCreatedBy: selectedList.includes("Any")
            ? partnerOptions
            : selectedList,
        });
      }} // Update formData with selected options
      onRemove={(selectedList) => {
        setFormData({
          ...formData,
          partnerCreatedBy: selectedList.includes("Any")
            ? partnerOptions
            : selectedList,
        });
      }} // Update formData on removal
      isObject={false} // Simple string array
      displayValue="partnerCreatedBy" // Works for array of strings
      placeholder="Select creator"
      showCheckbox={true} // Show checkboxes for each option
      closeIcon="cancel" // Close icon for the dropdown
      className="w-full mt-2 "
      style={customStyles}
    />
  </div>
</div>

          <h1 className="bg-gray-200 text-center py-3 rounded-lg">
            Select Your Cast Preference <br /> ** All fields are optional **
          </h1>

          <div className="bg-white shadow-xl px-3 py-5 rounded-lg">
            <div>
              {/* Religion Preference - Multi-select Dropdown */}
              <div className="relative w-full z-[47]">
                <div className="flex justify-between mt-3 ">
                  <label className="block" style={labelStyle}>
                    Religion Preference
                  </label>

                  {/* Button to close the dropdown */}
                  <button
                    type="button"
                    onClick={handleCloseDropdown}
                    style={buttonStyle}
                  >
                    Save Religion 
                  </button>
                </div>

                {/* Multi-select dropdown */}
                <Multiselect
                  closeOnSelect={true}
                  options={religionOptions} // List of religion options
                  selectedValues={
                    formData.religionPreferences.length ===
                    religionOptions.length
                      ? ["Any"] // If all options are selected, show only 'Any'
                      : formData.religionPreferences
                  } // If all options are selected, show only 'Any'
                  onSelect={(selectedList) => {
                    // If "Any" is selected, mark all options as selected, else just pass the selected values
                    setFormData({
                      ...formData,
                      religionPreferences: selectedList.includes("Any")
                        ? religionOptions
                        : selectedList,
                    });
                  }} // Update formData with selected options
                  onRemove={(selectedList) => {
                    setFormData({
                      ...formData,
                      religionPreferences: selectedList.includes("Any")
                        ? religionOptions
                        : selectedList,
                    });
                  }} // Update formData on removal
                  isObject={false} // Simple string array
                  displayValue="religion" // Works for array of strings
                  placeholder="Select Religions"
                  showCheckbox={true} // Show checkboxes for each option
                  closeIcon="cancel" // Close icon for the dropdown
                  className="w-full mt-2"
                  style={customStyles}
                />
              </div>
            </div>

            {/* Partner Caste Preference - Multi-select Dropdown */}
            <div className="relative w-full z-[46]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Caste Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Caste
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...casteOptions]} // Place "Any" at the top of the list
                selectedValues={
                  formData.castePreferences.length === casteOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.castePreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    castePreferences: selectedList.includes("Any")
                      ? casteOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    castePreferences: selectedList.includes("Any")
                      ? casteOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="caste" // Works for array of strings
                placeholder="Select Castes"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Partner Sub-Caste Dropdown */}
            <div className="relative w-full z-[45]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Sub-Caste Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Sub Caste
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...subCasteOptions]} // Place "Any" at the top of the list
                selectedValues={
                  formData.subCastePreferences.length === subCasteOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.subCastePreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    subCastePreferences: selectedList.includes("Any")
                      ? subCasteOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    subCastePreferences: selectedList.includes("Any")
                      ? subCasteOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="sub_caste" // Works for array of strings
                placeholder="Select Sub-Castes"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Partner Marital Status Preference - Multi-select Dropdown */}
            <div className="relative w-full z-[44]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Marital Status Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
   Save Marital
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...maritalStatusOptions]} // Place "Any" at the top of the list
                selectedValues={
                  formData.maritalStatusPreferences.length ===
                  maritalStatusOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.maritalStatusPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    maritalStatusPreferences: selectedList.includes("Any")
                      ? maritalStatusOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    maritalStatusPreferences: selectedList.includes("Any")
                      ? maritalStatusOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="marital_status" // Works for array of strings
                placeholder="Select Marital Status"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Partner Children Preference - Multi-select Dropdown */}
            <div className="relative w-full z-[43]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Children Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Child preferences
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...childrenPreferenceOptions]} // Place "Any" at the top of the list
                selectedValues={
                  formData.childrenPreferences.length ===
                  childrenPreferenceOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.childrenPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    childrenPreferences: selectedList.includes("Any")
                      ? childrenPreferenceOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    childrenPreferences: selectedList.includes("Any")
                      ? childrenPreferenceOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="children_preference" // Works for array of strings
                placeholder="Select Children Preferences"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Partner Mother Tongue Preference - Multi-select Dropdown */}
            <div className="relative w-full z-[42]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Mother Tounge Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Mother Toungue 
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...motherTongueOptions]} // Place "Any" at the top of the list
                selectedValues={
                  formData.motherTonguePreferences.length ===
                  motherTongueOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.motherTonguePreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    motherTonguePreferences: selectedList.includes("Any")
                      ? motherTongueOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    motherTonguePreferences: selectedList.includes("Any")
                      ? motherTongueOptions // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="mother_tongue" // Works for array of strings
                placeholder="Select Mother Tongues"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Partner Age Preference - Multi-select Dropdown */}
            <div className="relative w-full z-[41]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Age Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Age Preferences
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={ageOptions} // List of age options
                selectedValues={
                  formData.agePreferences.length === ageOptions.length - 1 // Exclude "Any"
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.agePreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    agePreferences: selectedList.includes("Any")
                      ? ageOptions.slice(1) // Select all ranges if "Any" is selected (excluding "Any")
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    agePreferences: selectedList.includes("Any")
                      ? ageOptions.slice(1) // Select all ranges if "Any" is selected (excluding "Any")
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="agePreference" // Works for array of strings
                placeholder="Select Age Preferences"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            <div className="relative w-full z-[40]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Height Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Height 
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...Array.from({ length: 26 }, (_, i) =>
                    (4 + i * 0.1).toFixed(1)
                  ),
                ]} // "Any" option and height range from 4 to 6.5
                selectedValues={
                  formData.heightPreferences.length === 26 // If all height ranges are selected, show only 'Any'
                    ? ["Any"]
                    : formData.heightPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  // If "Any" is selected, mark all options as selected, else just pass the selected values
                  setFormData({
                    ...formData,
                    heightPreferences: selectedList.includes("Any")
                      ? Array.from({ length: 26 }, (_, i) =>
                          (4 + i * 0.1).toFixed(1)
                        ) // Select all heights
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    heightPreferences: selectedList.includes("Any")
                      ? Array.from({ length: 26 }, (_, i) =>
                          (4 + i * 0.1).toFixed(1)
                        ) // Select all heights
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="heightPreference" // Works for array of strings
                placeholder="Select Height Preferences (4 to 6.5 feet)"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles} // Apply custom styles if any
              />
            </div>
          </div>

          <h1 className="bg-gray-200 text-center py-3 rounded-lg">
            Education/Professional Preference <br /> ** All fields are optional
            **
          </h1>

          <div className="bg-white shadow-xl px-3 py-5 rounded-lg">
            {/* Education Multiselect */}
            <div className="relative w-full z-[39]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Education Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Education
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredEducations.map((edu) => edu.education),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.partnerEducationPreferences.length ===
                  filteredEducations.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.partnerEducationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerEducationPreferences: selectedList.includes("Any")
                      ? filteredEducations.map((edu) => edu.education) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerEducationPreferences: selectedList.includes("Any")
                      ? filteredEducations.map((edu) => edu.education) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="education" // Works for array of strings
                placeholder="Select education fields"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Occupation Preferences - Dropdown */}
            <div className="relative w-full z-[38]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Employee Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Employee
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredEmployees.map((emp) => emp.occupation),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.partnerOccupationPreferences.length ===
                  filteredEmployees.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.partnerOccupationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerOccupationPreferences: selectedList.includes("Any")
                      ? filteredEmployees.map((emp) => emp.occupation) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerOccupationPreferences: selectedList.includes("Any")
                      ? filteredEmployees.map((emp) => emp.occupation) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="occupation" // Works for array of strings
                placeholder="Select Occupation Preferences"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Job Location Preferences - Dropdown */}
            <div className="relative w-full z-[37]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Job Location Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Job Location
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...filteredLocations.map((loc) => loc.city)]} // Add "Any" at the top
                selectedValues={
                  formData.partnerJobLocationPreferences.length ===
                  filteredLocations.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.partnerJobLocationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerJobLocationPreferences: selectedList.includes("Any")
                      ? filteredLocations.map((loc) => loc.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerJobLocationPreferences: selectedList.includes("Any")
                      ? filteredLocations.map((loc) => loc.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="city" // Works for array of strings
                placeholder="Select Job Locations"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Annual Income Single Select */}
            <div className="relative w-full z-[36] mt-4">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Annual-Income Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Annual Income
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...annualIncomeOptions.map((income) => income.annual_income),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.partnerAnnualIncome === "Any"
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : [formData.partnerAnnualIncome] // Otherwise, show the selected income value
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerAnnualIncome: selectedList.includes("Any")
                      ? "Any" // If "Any" is selected, set the value to "Any"
                      : selectedList[0], // Select the first income option if any other is selected
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    partnerAnnualIncome: selectedList.includes("Any")
                      ? "Any" // If "Any" is removed, set the value to "Any"
                      : selectedList[0], // Select the first income option if "Any" is removed
                  });
                }} // Update formData on removal
                isObject={false} // We're now using an array of strings
                displayValue="annual_income" // Display the income value string
                placeholder="Select annual income range"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Family Preferences Multi-Select */}
            <div className="relative w-full z-[35] mt-4">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Family Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Family Preferences
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...familyPreferenceOptions.map((option) => option.preference),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.familyPreferences.length ===
                  familyPreferenceOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.familyPreferences.includes("Any")
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : familyPreferenceOptions
                        .filter((option) =>
                          formData.familyPreferences.includes(option.preference)
                        )
                        .map((option) => option.preference) // Map the selected preferences
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    familyPreferences: selectedList.includes("Any")
                      ? familyPreferenceOptions.map(
                          (option) => option.preference
                        ) // Select all if "Any" is selected
                      : selectedList, // Otherwise, update with selected preferences
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    familyPreferences: selectedList.includes("Any")
                      ? familyPreferenceOptions.map(
                          (option) => option.preference
                        ) // Select all if "Any" is removed
                      : selectedList, // Otherwise, update with selected preferences
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (preferences)
                displayValue="preference" // Display the preference name
                placeholder="Select family preferences"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Settled Location Preferences - Dropdown */}
            <div className="relative w-full z-[34]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Settled Location Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Setteled Location
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredSettledLocations.map((loc) => loc.city),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.settledLocationPreferences.length ===
                  filteredSettledLocations.length
                    ? ["Any"] // If all locations are selected, show only 'Any'
                    : formData.settledLocationPreferences.includes("Any")
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : filteredSettledLocations
                        .filter((loc) =>
                          formData.settledLocationPreferences.includes(loc.city)
                        )
                        .map((loc) => loc.city) // Map the selected city locations
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    settledLocationPreferences: selectedList.includes("Any")
                      ? filteredSettledLocations.map((loc) => loc.city) // Select all locations if "Any" is selected
                      : selectedList, // Otherwise, update with selected locations
                  });
                }} // Update formData with selected locations
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    settledLocationPreferences: selectedList.includes("Any")
                      ? filteredSettledLocations.map((loc) => loc.city) // Select all locations if "Any" is removed
                      : selectedList, // Otherwise, update with selected locations
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (cities)
                displayValue="city" // Display the city name
                placeholder="Select Settled Locations"
                showCheckbox={true} // Show checkboxes for each location
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>
          </div>

          <h1 className="bg-gray-200 text-center py-3 rounded-lg">
            Propert Preference <br /> ** All fields are optional **
          </h1>

          <div className="bg-white shadow-xl px-3 py-5 rounded-lg">
            <div className="relative w-full z-[33]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Own House Preference Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Ow Preferences
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredOwnHousePreferences.map((house) => house.type),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.ownHousePreferences.length ===
                  filteredOwnHousePreferences.length
                    ? ["Any"] // If all house types are selected, show only 'Any'
                    : formData.ownHousePreferences.includes("Any")
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : filteredOwnHousePreferences
                        .filter((house) =>
                          formData.ownHousePreferences.includes(house.type)
                        )
                        .map((house) => house.type) // Map the selected house types
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    ownHousePreferences: selectedList.includes("Any")
                      ? filteredOwnHousePreferences.map((house) => house.type) // Select all house types if "Any" is selected
                      : selectedList, // Otherwise, update with selected house types
                  });
                }} // Update formData with selected house types
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    ownHousePreferences: selectedList.includes("Any")
                      ? filteredOwnHousePreferences.map((house) => house.type) // Select all house types if "Any" is removed
                      : selectedList, // Otherwise, update with selected house types
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (house types)
                displayValue="type" // Display the house type name
                placeholder="Select House Types"
                showCheckbox={true} // Show checkboxes for each house type
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Square Yards Preferences - Dropdown */}
            <div className="relative w-full z-[32]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  SqYard Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Sqyard 
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredSquareYardPreferences.map((yard) => yard.size),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.squareYardPreferences.length ===
                  filteredSquareYardPreferences.length
                    ? ["Any"] // If all yard sizes are selected, show only 'Any'
                    : formData.squareYardPreferences.includes("Any")
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : filteredSquareYardPreferences
                        .filter((yard) =>
                          formData.squareYardPreferences.includes(yard.size)
                        )
                        .map((yard) => yard.size) // Map the selected square yard sizes
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    squareYardPreferences: selectedList.includes("Any")
                      ? filteredSquareYardPreferences.map((yard) => yard.size) // Select all yard sizes if "Any" is selected
                      : selectedList, // Otherwise, update with selected yard sizes
                  });
                }} // Update formData with selected yard sizes
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    squareYardPreferences: selectedList.includes("Any")
                      ? filteredSquareYardPreferences.map((yard) => yard.size) // Select all yard sizes if "Any" is removed
                      : selectedList, // Otherwise, update with selected yard sizes
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (yard sizes)
                displayValue="size" // Display the square yard size name
                placeholder="Select Square Yards"
                showCheckbox={true} // Show checkboxes for each square yard size
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Monthly Rent Preferences - Dropdown */}
            <div className="relative w-full z-[31]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Rent Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Rent Preferences
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredMonthlyRentPreferences.map((rent) => rent.amount),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.monthlyRentPreferences.length ===
                  filteredMonthlyRentPreferences.length
                    ? ["Any"] // If all rent amounts are selected, show only 'Any'
                    : formData.monthlyRentPreferences.includes("Any")
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : filteredMonthlyRentPreferences
                        .filter((rent) =>
                          formData.monthlyRentPreferences.includes(rent.amount)
                        )
                        .map((rent) => rent.amount) // Map the selected rent amounts
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    monthlyRentPreferences: selectedList.includes("Any")
                      ? filteredMonthlyRentPreferences.map(
                          (rent) => rent.amount
                        ) // Select all rent amounts if "Any" is selected
                      : selectedList, // Otherwise, update with selected rent amounts
                  });
                }} // Update formData with selected rent amounts
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    monthlyRentPreferences: selectedList.includes("Any")
                      ? filteredMonthlyRentPreferences.map(
                          (rent) => rent.amount
                        ) // Select all rent amounts if "Any" is removed
                      : selectedList, // Otherwise, update with selected rent amounts
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (rent amounts)
                displayValue="amount" // Display the rent amount
                placeholder="Select Rent Amount"
                showCheckbox={true} // Show checkboxes for each rent amount
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            <div className="relative w-full z-[30]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Plot Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Plot
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredPlotPreferences.map((plot) => plot.type),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.plotPreference === "Any"
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : [formData.plotPreference] // Otherwise, show the selected plot preference
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    plotPreference: selectedList.includes("Any")
                      ? "Any" // If "Any" is selected, select all options
                      : selectedList[0], // Otherwise, update with selected plot preference
                  });
                }} // Update formData with selected plot preference
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    plotPreference: selectedList.includes("Any")
                      ? "Any" // If "Any" is removed, select all options
                      : selectedList[0], // Otherwise, update with selected plot preference
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (plot types)
                displayValue="type" // Display the plot type name
                placeholder="Select Plot Preference"
                showCheckbox={true} // Show checkboxes for each plot type
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            <div className="relative w-full z-[29]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Flat Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Flat
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredFlatPreferences.map((flat) => flat.type),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.flatPreference === "Any"
                    ? ["Any"] // If "Any" is selected, show only 'Any'
                    : [formData.flatPreference] // Otherwise, show the selected flat preference
                }
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    flatPreference: selectedList.includes("Any")
                      ? "Any" // If "Any" is selected, select all options
                      : selectedList[0], // Otherwise, update with selected flat preference
                  });
                }} // Update formData with selected flat preference
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    flatPreference: selectedList.includes("Any")
                      ? "Any" // If "Any" is removed, select all options
                      : selectedList[0], // Otherwise, update with selected flat preference
                  });
                }} // Update formData on removal
                isObject={false} // We're using an array of strings (flat types)
                displayValue="type" // Display the flat type name
                placeholder="Select Flat Type"
                showCheckbox={true} // Show checkboxes for each flat type
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2"
                style={customStyles}
              />
            </div>

            {/* Own Location Preferences - Dropdown */}
            <div className="relative w-full z-[28]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Own-Location Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Own Location
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredOwnLocations.map((loc) => loc.city),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.ownLocationPreferences.length ===
                  filteredOwnLocations.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.ownLocationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    ownLocationPreferences: selectedList.includes("Any")
                      ? filteredOwnLocations.map((loc) => loc.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    ownLocationPreferences: selectedList.includes("Any")
                      ? filteredOwnLocations.map((loc) => loc.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="city" // Works for array of strings
                placeholder="Select Own Locations"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full"
                style={customStyles}
              />
            </div>

            {/* Agriculture Land Preference - Single Selection Dropdown */}
            <div className="relative w-full z-[27]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Agriculture-Land Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Agriculture Land
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredLandSizes.map((landSize) => landSize.size),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.agricultureLandPreference.length ===
                  filteredLandSizes.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.agricultureLandPreference
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    agricultureLandPreference: selectedList.includes("Any")
                      ? filteredLandSizes.map((landSize) => landSize.size) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    agricultureLandPreference: selectedList.includes("Any")
                      ? filteredLandSizes.map((landSize) => landSize.size) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="size" // Works for array of strings
                placeholder="Select Agriculture Land Size"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to the select dropdown
                style={customStyles} // If you have custom styles defined
              />
            </div>

            {/* Total Property Value Preference - Single Selection Dropdown */}
            <div className="relative w-full z-[26]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Total Property Value Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Total Property
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredPropertyValues.map((value) => value.value),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.totalPropertyValuePreference.length ===
                  filteredPropertyValues.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.totalPropertyValuePreference
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    totalPropertyValuePreference: selectedList.includes("Any")
                      ? filteredPropertyValues.map((value) => value.value) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    totalPropertyValuePreference: selectedList.includes("Any")
                      ? filteredPropertyValues.map((value) => value.value) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="value" // Works for array of strings
                placeholder="Select Total Property Value"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to the select dropdown
                style={customStyles} // If you have custom styles defined
              />
            </div>
          </div>

          <h1 className="bg-gray-200 text-center py-3 rounded-lg">
            Location Preference <br /> ** All fields are optional **
          </h1>

          <div className="bg-white shadow-xl px-3 py-5 rounded-lg">
            {/* Country Location Preferences - Dropdown */}
            <div className="relative w-full z-[25]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Contry Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Country
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...filteredCountries.map((country) => country.country),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.countryLocationPreferences.length ===
                  filteredCountries.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.countryLocationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    countryLocationPreferences: selectedList.includes("Any")
                      ? filteredCountries.map((country) => country.country) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    countryLocationPreferences: selectedList.includes("Any")
                      ? filteredCountries.map((country) => country.country) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="country" // Display name of the country
                placeholder="Select Countries"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to the input and select dropdown
                style={customStyles} // If you have custom styles defined
              />
            </div>

            {/* State Location Preferences - Dropdown */}
            <div className="relative w-full z-[24]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  State Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save State
                </button>
              </div>
              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...filteredStates.map((state) => state.state)]} // Add "Any" at the top
                selectedValues={
                  formData.stateLocationPreferences.length ===
                  filteredStates.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.stateLocationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    stateLocationPreferences: selectedList.includes("Any")
                      ? filteredStates.map((state) => state.state) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    stateLocationPreferences: selectedList.includes("Any")
                      ? filteredStates.map((state) => state.state) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="state" // Display name of the state
                placeholder="Select States"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to the input and select dropdown
                style={customStyles} // If you have custom styles defined
              />
            </div>

            {/* City Location Preferences - Dropdown */}
            <div className="relative w-full z-[23]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  City Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save City
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={["Any", ...filteredCities.map((city) => city.city)]} // Add "Any" at the top
                selectedValues={
                  formData.cityLocationPreferences.length ===
                  filteredCities.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.cityLocationPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    cityLocationPreferences: selectedList.includes("Any")
                      ? filteredCities.map((city) => city.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    cityLocationPreferences: selectedList.includes("Any")
                      ? filteredCities.map((city) => city.city) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="city" // Display name of the city
                placeholder="Select Cities"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to the input and select dropdown
                style={customStyles} // If you have custom styles defined
              />
            </div>

            {/* Citizenship Preferences - Dropdown */}
            <div className="relative w-full z-[22]">
              <div className="flex justify-between mt-3 ">
                <label className="block" style={labelStyle}>
                  Citizenship Preference
                </label>

                {/* Button to close the dropdown */}
                <button
                  type="button"
                  onClick={handleCloseDropdown}
                  style={buttonStyle}
                >
                  Save Citizenship
                </button>
              </div>

              {/* Multi-select dropdown */}
              <Multiselect
                options={[
                  "Any",
                  ...citizenshipOptions.map((option) => option.label),
                ]} // Add "Any" at the top
                selectedValues={
                  formData.citizenshipPreferences.length ===
                  citizenshipOptions.length
                    ? ["Any"] // If all options are selected, show only 'Any'
                    : formData.citizenshipPreferences
                } // If all options are selected, show only 'Any'
                onSelect={(selectedList) => {
                  setFormData({
                    ...formData,
                    citizenshipPreferences: selectedList.includes("Any")
                      ? citizenshipOptions.map((option) => option.label) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData with selected options
                onRemove={(selectedList) => {
                  setFormData({
                    ...formData,
                    citizenshipPreferences: selectedList.includes("Any")
                      ? citizenshipOptions.map((option) => option.label) // Select all options if "Any" is selected
                      : selectedList,
                  });
                }} // Update formData on removal
                isObject={false} // Simple string array
                displayValue="label" // Display name of the citizenship option
                placeholder="Select Citizenship Types"
                showCheckbox={true} // Show checkboxes for each option
                closeIcon="cancel" // Close icon for the dropdown
                className="w-full mt-2" // Custom styles similar to other inputs
                style={customStyles} // If you have custom styles defined
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pb-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step9;
