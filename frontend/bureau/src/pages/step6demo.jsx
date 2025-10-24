import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom"; // Assuming you're using react-router for navigation
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints
import axios from "axios";
import Select from "react-select";

const Family_Property_Details = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        houseType: "",
        houseSqFeet: "",
        houseValue: "",
        monthlyRent: "",
        houseLocation: [],
        openPlots: "",
        openPlotsSqFeet: "",
        openPlotsValue: "",
        openPlotsLocation: [],
        numberOfHouses: ''
    });

    const [showNumberField, setShowNumberField] = useState(false);
    const [city, setCity] = useState([]);

    const handleBack = () => {
        const confirmBack = window.confirm("Are you sure you want to go back?");
        if (confirmBack) {
            navigate(-1);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "houseType" && value) {
            setShowNumberField(true);
        }
    };

    const handleSelectChange = (selectedOption, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: selectedOption,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    console.error("ID not found in URL");
                    alert("User ID is missing. Please check the URL and try again.");
                    return;
                }

                const endpoint = `${apiEndpoints.user}/${id}`;
                console.log("Fetching data from endpoint:", endpoint);

                const response = await apiClient.get(endpoint);
                console.log("API Response:", response);

                if (response.status === 200 && response.data) {
                    setFormData((prevData) => ({
                        ...prevData,
                        ...response.data,
                    }));
                } else {
                    console.error("Unexpected response format or status:", response);
                    alert("Unable to fetch user details. Please try again later.");
                }
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
                alert("An error occurred while fetching user details.");
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the form data with updated family property fields
        const formDataToSend = {
            houseType: formData.houseType,
            houseSqFeet: formData.houseSqFeet,
            houseValue: formData.houseValue,
            monthlyRent: formData.monthlyRent,


            houseLocation: formData.houseLocation.map(option => option.value),
            openPlots: formData.openPlots,
            openPlotsSqFeet: formData.openPlotsSqFeet,
            openPlotsValue: formData.openPlotsValue,
            openPlotsLocation: formData.openPlotsLocation.map(option => option.value),

            numberOfHouses: formData.numberOfHouses,

            // Including step flags to indicate progress
            step1: 1,
            step2: 1,
            step3: 1,
            step4: 1,
            step5: 1,
            step6: 1, // You can modify this flag to indicate step 5 completion
        };

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User ID not found in local storage");
            }

            const endpoint = `${apiEndpoints.update}/${userId}`;

            // Send the PUT request to update the data
            const response = await apiClient.put(endpoint, formDataToSend, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert("Details updated successfully!");

                // Store the userId in localStorage for the next step
                localStorage.setItem("userId", userId);

                // Navigate to Step 7 (or next step)
                navigate(`/edit-profile/${id}`, { state: { userId } });
            } else {
                alert("Failed to update details.");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            alert("An error occurred while updating details.");
        }
    };

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const response = await axios.get(
                    "https://localhost:3300/api/city"
                );
                console.log("Fetched city data: ", response.data); // Log the API response
                setCity(response.data);
            } catch (error) {
                console.error("Error fetching city data:", error);
                alert("Error fetching city data."); // Provide feedback to the user
            }
        };
        fetchCity();
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [cityData] = await Promise.all([
                    axios.get("https://riyatechpark.com/api/city"),
                ]);
                setCity(cityData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error fetching data. Please try again later.");
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg  my-5 mx-3">
                {/* Step Indicator with Back Arrow */}
                <div className="flex items-center mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full p-4">
                    <button onClick={handleBack} className="p-2">
                        <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
                    </button>
                    <h2 className="text-2xl font-semibold text-white ml-4">
                        Step 6: Property Details
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 mt-12 py-4 px-3">
                    {/* Own House Type */}
                    <div>
                        <div>
                            <label className="block text-indigo-500 font-medium mb-2">
                                Own House Type
                            </label>
                            <select
                                name="houseType"
                                value={formData.houseType}
                                onChange={handleChange}
                                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                            >
                                <option value="">Select Type</option>
                                <option value="groundFloor">Ground Floor</option>
                                <option value="g+1">G+1</option>
                                <option value="g+2">G+2</option>
                                <option value="g+3">G+3</option>
                                <option value="g+4">G+4</option>
                                <option value="g+5">G+5</option>
                                <option value="g+6">G+6</option>
                                <option value="g+7">G+7</option>
                                <option value="g+8">G+8</option>
                                <option value="g+9">G+9</option>
                                <option value="g+10">G+10</option>
                            </select>
                        </div>

                        {showNumberField && (
                            <div className="mt-4">
                                <label className="block text-indigo-500 font-medium mb-2">
                                    Number of Houses Like This
                                </label>
                                <select
                                    name="numberOfHouses"
                                    value={formData.numberOfHouses}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                >
                                    <option value="">Select Number</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Own House Total Sq Feet */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Own House Total Sq Feet
                        </label>
                        <select
                            name="houseSqFeet"
                            value={formData.houseSqFeet}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select total sq feet</option>
                            {Array.from(
                                { length: 1000 - 70 + 1 },
                                (_, index) => 70 + index
                            ).map((sqFeet) => (
                                <option key={sqFeet} value={sqFeet}>
                                    {sqFeet} Yards
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Own House Total Value */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Own House Total Value (in amount)
                        </label>
                        <select
                            name="houseValue"
                            value={formData.houseValue}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select total value</option>
                            {Array.from(
                                { length: 200 },
                                (_, index) => 50000 + index * 50000
                            ).map((value) => (
                                <option key={value} value={value}>
                                    ₹{value.toLocaleString("en-IN")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="originalLocation"
                            className="text-indigo-500 font-medium mb-2"
                        >
                            House Location
                        </label>

                        <Select
                            isMulti
                            name="houseLocation"
                            value={formData.houseLocation.map((location) => ({
                                label: location,
                                value: location,
                            }))}
                            onChange={(selectedOptions) =>
                                setFormData({
                                    ...formData,
                                    houseLocation: selectedOptions.map((option) => option.value),
                                })
                            }
                            options={city.map((cityu) => ({
                                value: cityu.city,
                                label: cityu.city,
                            }))}
                            className="w-full"
                        />


                    </div>

                    {/* Monthly Rent */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Monthly Rent
                        </label>
                        <select
                            name="monthlyRent"
                            value={formData.monthlyRent}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select monthly rent</option>
                            {Array.from(
                                { length: 100 },
                                (_, index) => 1000 + index * 1000
                            ).map((value) => (
                                <option key={value} value={value}>
                                    ₹{value.toLocaleString("en-IN")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Open Plots
                        </label>
                        <select
                            name="openPlots"
                            value={formData.openPlots}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select Number of Open Plots</option>
                            {Array.from({ length: 20 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Open Plots Sq Feet */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Open Plots Sq Feet
                        </label>
                        <select
                            name="openPlotsSqFeet"
                            value={formData.openPlotsSqFeet}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select total sq feet of open plots</option>
                            {Array.from(
                                { length: 1000 - 70 + 1 },
                                (_, index) => 70 + index
                            ).map((sqFeet) => (
                                <option key={sqFeet} value={sqFeet}>
                                    {sqFeet} Yards
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Open Plots Total Value */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Open Plots Total Value (in amount)
                        </label>
                        <select
                            name="openPlotsValue"
                            value={formData.openPlotsValue}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select total value of open plots</option>
                            {Array.from(
                                { length: 200 },
                                (_, index) => 50000 + index * 50000
                            ).map((value) => (
                                <option key={value} value={value}>
                                    ₹{value.toLocaleString("en-IN")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="originalLocation"
                            className="text-indigo-500 font-medium mb-2"
                        >
                            Plots Location
                        </label>


                        <Select
                            isMulti
                            name="openPlotsLocation"
                            value={formData.openPlotsLocation.map((location) => ({
                                label: location,
                                value: location,
                            }))}
                            onChange={(selectedOptions) =>
                                setFormData({
                                    ...formData,
                                    openPlotsLocation: selectedOptions.map((option) => option.value),
                                })
                            }
                            options={city.map((cityu) => ({
                                value: cityu.city,
                                label: cityu.city,
                            }))}
                            className="w-full"
                        />

                    </div>

                    {/* Next Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Family_Property_Details;
