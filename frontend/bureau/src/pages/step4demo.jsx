import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient, { apiEndpoints } from '../components/Apis1';
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import Select from "react-select";

const Step4 = () => {
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        education: "",
        employmentStatus: "",
        occupation: "",
        annualIncome: "",
        jobLocation: "",
        otherBusiness: "",
        businessLocation: [],
        otherBusinessIncome: "",
        extraTalentedSkills: [],
        step1: '',
        step2: '',
        step3: '',
    });

    const [education, setEducation] = useState([]);
    const [income, setIncome] = useState([]);
    const [city, setCity] = useState([]);
    const [businessLocation, setbusinessLocation] = useState([]);
    const [skills, setSkills] = useState([]);
    const [occupation, setOccupation] = useState([]);

    const navigate = useNavigate();


    const handleBack = () => {
        const confirmBack = window.confirm("Are you sure you want to go back?");
        if (confirmBack) {
            navigate(-1);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (selectedOption, field) => {
        setFormData({
            ...formData,
            [field]: selectedOption.value, // Use only value here
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

        const formDataToSend = {
            education: formData.education?.value || "",
            employmentStatus: formData.employmentStatus?.value || "",
            occupation: formData.occupation?.value || "",
            annualIncome: formData.annualIncome || "",
            jobLocation: formData.jobLocation?.value || "",
            otherBusiness: formData.otherBusiness || "",
            businessLocation: formData.businessLocation.map(option => option.value),
            otherBusinessIncome: formData.otherBusinessIncome || "",
            extraTalentedSkills: formData.extraTalentedSkills.map(option => option.value),
            step1: 1,
            step2: 1,
            step3: 1,
            step4: 1,
        };

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in local storage');
            }

            const endpoint = `${apiEndpoints.update}/${userId}`;

            const response = await apiClient.put(endpoint, formDataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                alert('Details updated successfully!');
                navigate(`/edit-profile/${id}`, { state: { userId } });
            } else {
                alert('Failed to update details.');
            }
        } catch (error) {
            console.error('Error updating details:', error);
            alert('An error occurred while updating details.');
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [educationData, incomeData, occupationData, cityData, skillsData] = await Promise.all([
                    axios.get("https://localhost:3300/api/education"),
                    axios.get("https://localhost:3300/api/annual_income"),
                    axios.get("https://localhost:3300/api/occupation"),
                    axios.get("https://localhost:3300/api/city"),
                    axios.get("https://localhost:3300/api/extra_skills"),
                ]);

                setEducation(educationData.data);
                setIncome(incomeData.data);
                setOccupation(occupationData.data);
                setCity(cityData.data);
                setSkills(skillsData.data);
                setbusinessLocation(cityData.data)
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error fetching data. Please try again later.");
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg">
                <div className="flex items-center mb-6 fixed top-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 w-full p-4 z-100">
                    <button onClick={handleBack} className="p-2">
                        <BiArrowBack className="h-6 w-6 text-white hover:text-indigo-700 transition-colors" />
                    </button>
                    <h2 className="text-2xl font-semibold text-white ml-4">
                        Step 4: Educational Details
                    </h2>
                </div>
                <form className="space-y-6 mt-20 py-4 px-3 z-99" onSubmit={handleSubmit}>
                    <div className="z-98">
                        <label className="block text-indigo-500 font-medium mb-2">Education</label>
                        <Select
                            name="education"
                            value={{ label: formData.education, value: formData.education }}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "education")}
                            options={education.map((edu) => ({
                                label: edu.education,
                                value: edu.education,
                            }))}
                            className="w-full"
                        />


                    </div>
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">Employment Status</label>
                        <Select
                            name="employmentStatus"
                            value={{
                                label: formData.employmentStatus,
                                value: formData.employmentStatus,
                            }}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "employmentStatus")}
                            options={[
                                { value: "privateEmployee", label: "Private Employee" },
                                { value: "govtEmployee", label: "Government Employee" },
                                { value: "business", label: "Business" },
                            ]}
                            className="w-full"
                        />

                    </div>
                    {/* Occupation Field */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Occupation
                        </label>


                        <Select
                            name="occupation"
                            value={{
                                label: formData.occupation,
                                value: formData.occupation,
                            }}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "occupation")}
                            options={occupation.map((occupation) => ({
                                value: occupation.occupation,
                                label: occupation.occupation,
                            }))}
                            className="w-full"
                        />

                    </div>


                    {/* Annual Income Field */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Annual Income
                        </label>


                        <select
                            name="annualIncome"
                            value={formData.annualIncome}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select  Annual Income</option>
                            {income.map((income) => (
                                <option key={income.id} value={income.annual_income}>
                                    {income.annual_income}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Other Business Field */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Any Other Business (1-4)
                        </label>
                        <select
                            name="otherBusiness"
                            value={formData.otherBusiness}
                            onChange={handleChange}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select</option>
                            <option value="1"> 1</option>
                            <option value="2"> 2</option>
                            <option value="3"> 3</option>
                            <option value="4"> 4</option>
                            <option value="null">None</option>
                        </select>
                    </div>

                    {/* Other Business Income Field */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Other Business Income
                        </label>

                        <select
                            name="otherBusinessIncome"
                            value={formData.otherBusinessIncome ? { label: formData.otherBusinessIncome, value: formData.otherBusinessIncome } : ""}
                            onChange={(e) => handleChange(e, "otherBusinessIncome")}
                            className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                        >
                            <option value="">Select Business Income</option>
                            {income.map((incomeItem) => (
                                <option key={incomeItem.id} value={incomeItem.annual_income}>
                                    {incomeItem.annual_income}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Job Location Field */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Job Location
                        </label>

                        <Select
                            name="jobLocation"
                            value={{
                                label: formData.jobLocation,
                                value: formData.jobLocation,
                            }}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, "jobLocation")}
                            options={city.map((cityu) => ({
                                label: cityu.city,
                                value: cityu.city,
                            }))}
                            className="w-full"
                        />

                    </div>

                    {/* Business Location Multi-Select */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Business Location
                        </label>
                        <Select
                            isMulti
                            name="businessLocation"
                            value={formData.businessLocation}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, "businessLocation")
                            }
                            options={businessLocation.map((businessLocation) => ({
                                value: businessLocation.city,
                                label: businessLocation.city,
                            }))}
                            className="w-full"
                        />
                    </div>

                    {/* Extra Talented Skills Multi-Select */}
                    <div>
                        <label className="block text-indigo-500 font-medium mb-2">
                            Extra Talented Skills
                        </label>
                        <Select
                            isMulti
                            name="extraTalentedSkills"
                            value={formData.extraTalentedSkills.map(skill => ({
                                value: skill,
                                label: skill,
                            }))}
                            onChange={(selectedOptions) => handleSelectChange(selectedOptions, "extraTalentedSkills")}
                            options={skills.map((skill) => ({
                                value: skill.skill,
                                label: skill.skill,
                            }))}
                            className="w-full"
                        />

                    </div>


                    {/* Add other fields similarly */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Step4;
