import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { BiSearch} from "react-icons/bi";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const QuickSearch = () => {
  const [modalData, setModalData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [castes, setCastes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const dropdownOptions = {
    gender: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    maritalStatus: [
      { value: "", label: "Any" },
      { value: "neverMarried", label: "Never Married" },
      { value: "awaitingDivorce", label: "Awaiting Divorce" },
      { value: "divorced", label: "Divorced" },
      { value: "widow", label: "Widow" },
    ],
    religion: [
      { value: "", label: "Any" },
      { value: "buddhist", label: "Buddhist" },
      { value: "christian", label: "Christian" },
      { value: "hindu", label: "Hindu" },
      { value: "muslim", label: "Muslim" },
      { value: "sikh", label: "Sikh" },
    ],
    caste: [
      { value: "", label: "Any" },
      ...castes.map((caste) => ({ value: caste.caste, label: caste.caste })),
    ],
    country: [
      { value: "", label: "Any" },
      ...countries.map((country) => ({
        value: country.country,
        label: country.country,
      })),
    ],
    state: [
      { value: "", label: "Any" },
      ...states.map((state) => ({ value: state.state, label: state.state })),
    ],
    city: [
      { value: "", label: "Any" },
      ...cities.map((city) => ({ value: city.city, label: city.city })),
    ],
  };

  const [selectedOptions, setSelectedOptions] = useState({
    gender: null,
    maritalStatus: null,
    caste: null,
    country: null,
    state: null,
    city: null,
  });

  const openModal = (key) => {
    setModalData({ key, options: dropdownOptions[key] });
  };

  const closeModal = () => {
    setModalData(null);
    setSearchTerm(""); // Clear the search term when the modal is closed
  };
  

  const handleSelect = (selectedOption) => {
    setSelectedOptions({ ...selectedOptions, [modalData.key]: selectedOption });
    closeModal();
  };

  useEffect(() => {
    const fetchData = async (url, setState, label) => {
      try {
        const response = await axios.get(url);
        setState(response.data);
      } catch (error) {
        console.error(`Error fetching ${label} data:`, error);
        alert(`Error fetching ${label} data.`);
      }
    };

    fetchData("http://localhost:3300/api/country", setCountries, "country");
    fetchData("https://localhost:3300/api/state", setStates, "state");
    fetchData("https://localhost:3300/api/city", setCities, "city");
    fetchData("https://localhost:3300/api/caste", setCastes, "caste");
  }, []);

  const handleSearch = () => {
    const payload = Object.keys(selectedOptions).reduce((acc, key) => {
      acc[key] = selectedOptions[key]?.value || "";
      return acc;
    }, {});

    navigate(`/search-results`, { state: { searchData: payload } });
  };

  return (
    <div className="p-6 w-full mx-auto mt-20 min-h-screen mb-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Quick Search</h1>

      <div className="grid grid-cols-1 gap-6 mb-6">
  {Object.keys(dropdownOptions).map((key) => (
    <div
      key={key}
      className="flex items-center justify-between w-full border-b border-gray-300 py-3"
    >
      {/* Label Section */}
      <label className="text-lg font-semibold capitalize text-gray-800">
        {key}
      </label>
      {/* Button Section */}
      <button
        className="px-4 py-2 bg-white text-gray-500  text-md font-medium rounded flex  hover:text-red-600 transition-all"
        onClick={() => openModal(key)}
      >
        {selectedOptions[key]?.label || `Select ${key}`} <RiArrowRightSLine className="text-3xl text-gray-500 ml-3" />
      </button>
    </div>
  ))}
</div>


<div className="flex justify-center items-center w-full">
  <button
    className="flex items-center justify-center px-6 py-2 w-full max-w-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 hover:shadow-md transition"
    onClick={handleSearch}
  >
    <BiSearch className="h-5 w-5 mr-2" />
    Search
  </button>
</div>


      {modalData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
      <h2 className="text-lg font-bold mb-4 capitalize text-center">
        Select {modalData.key}
      </h2>
      
      {/* Search Bar */}
      <input
        type="text"
        className="w-full px-4 py-2 mb-4 border  border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        placeholder={`Search ${modalData.key}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Options List */}
      <div className="h-64 overflow-y-auto border-t border-b border-gray-200">
        {modalData.options
          .filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((option, index) => (
            <div key={index}>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => handleSelect(option)}
              >
                {option.label} 
              </button>
              <hr className="border-gray-300 mt-2 mb-2" />
            </div>
          ))}
      </div>
      
      {/* Close Button */}
      <button
        className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={closeModal}
      >
        Continue
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default QuickSearch;
