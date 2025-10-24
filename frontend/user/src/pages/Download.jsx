import React, { useState, useEffect } from "react";
import { Download, X, User, Loader2, ArrowLeft, Eye } from 'lucide-react';
import apiClient2, { apiEndpoints2, Uploads } from '../components/Apismongo';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';

const ProfileDownloadPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);

  // PDF Design Templates
  const pdfTemplates = [
    {
      id: 1,
      name: "Classic Elegance",
      description: "Traditional layout with elegant borders",
      preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
      color: "border-blue-500",
      primaryColor: "#1e40af",
      secondaryColor: "#3b82f6"
    },
    {
      id: 2,
      name: "Modern Minimal",
      description: "Clean, modern design with minimal elements",
      preview: "bg-gradient-to-br from-gray-50 to-slate-100",
      color: "border-gray-500",
      primaryColor: "#374151",
      secondaryColor: "#6b7280"
    },
    {
      id: 3,
      name: "Royal Gold",
      description: "Luxurious golden theme with ornate details",
      preview: "bg-gradient-to-br from-yellow-50 to-amber-100",
      color: "border-yellow-500",
      primaryColor: "#d97706",
      secondaryColor: "#f59e0b"
    },
    {
      id: 4,
      name: "Nature Green",
      description: "Fresh green theme with natural elements",
      preview: "bg-gradient-to-br from-green-50 to-emerald-100",
      color: "border-green-500",
      primaryColor: "#059669",
      secondaryColor: "#10b981"
    },
    {
      id: 5,
      name: "Rose Romance",
      description: "Romantic pink theme with floral accents",
      preview: "bg-gradient-to-br from-pink-50 to-rose-100",
      color: "border-pink-500",
      primaryColor: "#be185d",
      secondaryColor: "#ec4899"
    }
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (!token || !userData._id) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await apiClient2.get(`${apiEndpoints2.user}/${userData._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // The API returns user data directly, not nested under 'user' property
        if (response.data && response.data._id) {
          setUser(response.data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  const generatePDF = async (template) => {
    setDownloadLoading(true);
    setSelectedFrame(template.id);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add header with template styling
      pdf.setFillColor(template.primaryColor);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setFontSize(28);
      pdf.setTextColor(255, 255, 255);
      pdf.text('BIODATA', pageWidth / 2, 25, { align: 'center' });

      yPosition = 50;

      // Add profile image if available
      if (user?.image) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = `${Uploads}${user.image}`;
          
          await new Promise((resolve) => {
            img.onload = () => {
              const imgWidth = 45;
              const imgHeight = (img.height * imgWidth) / img.width;
              const imgX = pageWidth / 2 - imgWidth / 2;
              
              pdf.setDrawColor(template.primaryColor);
              pdf.setLineWidth(2);
              pdf.circle(imgX + imgWidth/2, yPosition + imgHeight/2, imgWidth/2 + 2);
              
              pdf.addImage(img, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
              yPosition += imgHeight + 15;
              resolve();
            };
            img.onerror = resolve;
          });
        } catch (error) {
          console.log('Could not load profile image:', error);
        }
      }

      // Add basic information
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Basic Information', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const basicInfo = [
        { label: 'Full Name', value: user?.fullName || 'Not provided' },
        { label: 'Martial ID', value: user?.martialId || 'Not provided' },
        { label: 'Date of Birth', value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided' },
        { label: 'Age', value: user?.dateOfBirth ? calculateAge(user.dateOfBirth) + ' years' : 'Not provided' },
        { label: 'Gender', value: user?.gender || 'Not provided' },
        { label: 'Marital Status', value: user?.maritalStatus || 'Not provided' },
        { label: 'Height', value: user?.height ? `${user.height} ft` : 'Not provided' },
        { label: 'Weight', value: user?.weight ? `${user.weight} kg` : 'Not provided' },
      ];

      basicInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add religious information
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Religious & Cultural Information', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const religiousInfo = [
        { label: 'Religion', value: user?.religion || 'Not provided' },
        { label: 'Caste', value: user?.caste || 'Not provided' },
        { label: 'Sub Caste', value: user?.subcaste || 'Not provided' },
        { label: 'Mother Tongue', value: user?.motherTongue || 'Not provided' },
        { label: 'Languages Known', value: user?.languagesKnown?.join(', ') || 'Not provided' },
        { label: 'Gotram', value: user?.gotram || 'Not provided' },
        { label: 'Raasi', value: user?.raasi || 'Not provided' },
        { label: 'Star', value: user?.star || 'Not provided' },
      ];

      religiousInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add education & career
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Education & Career', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const careerInfo = [
        { label: 'Education', value: user?.education || 'Not provided' },
        { label: 'Employment Status', value: user?.employmentStatus || 'Not provided' },
        { label: 'Occupation', value: user?.occupation || 'Not provided' },
        { label: 'Annual Income', value: user?.annualIncome ? `₹${user.annualIncome}` : 'Not provided' },
        { label: 'Job Location', value: user?.jobLocation || 'Not provided' },
        { label: 'Other Business', value: user?.otherBusiness || 'Not provided' },
        { label: 'Business Location', value: user?.businessLocation?.join(', ') || 'Not provided' },
        { label: 'Other Business Income', value: user?.otherBusinessIncome ? `₹${user.otherBusinessIncome}` : 'Not provided' },
      ];

      careerInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add family information
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Family Information', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const familyInfo = [
        { label: 'Father Name', value: user?.fatherName || 'Not provided' },
        { label: 'Father Occupation', value: user?.fatherEmployee || 'Not provided' },
        { label: 'Mother Name', value: user?.motherName || 'Not provided' },
        { label: 'Mother Occupation', value: user?.motherEmployee || 'Not provided' },
        { label: 'Family Type', value: user?.familyType || 'Not provided' },
        { label: 'Total Brothers', value: user?.totalBrothers || 'Not provided' },
        { label: 'Married Brothers', value: user?.marriedBrothers || 'Not provided' },
        { label: 'Total Sisters', value: user?.totalSisters || 'Not provided' },
        { label: 'Married Sisters', value: user?.marriedSisters || 'Not provided' },
        { label: 'Family Income', value: user?.familyIncome ? `₹${user.familyIncome}` : 'Not provided' },
      ];

      familyInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add property information
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Property Information', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const propertyInfo = [
        { label: 'House Type', value: user?.houseType || 'Not provided' },
        { label: 'House Location', value: user?.houseLocation?.join(', ') || 'Not provided' },
        { label: 'House Value', value: user?.houseValue ? `₹${user.houseValue}` : 'Not provided' },
        { label: 'House Square Feet', value: user?.houseSqFeet ? `${user.houseSqFeet} sq ft` : 'Not provided' },
        { label: 'Monthly Rent', value: user?.monthlyRent ? `₹${user.monthlyRent}` : 'Not provided' },
        { label: 'Open Plots', value: user?.openPlots || 'Not provided' },
        { label: 'Open Plots Square Feet', value: user?.openPlotsSqFeet ? `${user.openPlotsSqFeet} sq ft` : 'Not provided' },
        { label: 'Open Plots Location', value: user?.openPlotsLocation?.join(', ') || 'Not provided' },
        { label: 'Open Plots Value', value: user?.openPlotsValue ? `₹${user.openPlotsValue}` : 'Not provided' },
        { label: 'Shops Square Yards', value: user?.shopssqyards || 'Not provided' },
        { label: 'Agriculture Land', value: user?.agricultureLand ? `${user.agricultureLand} acres` : 'Not provided' },
        { label: 'Agriculture Land Location', value: user?.agricultureLandLocation?.join(', ') || 'Not provided' },
        { label: 'Agriculture Land Value', value: user?.agricultureLandValue ? `₹${user.agricultureLandValue}` : 'Not provided' },
        { label: 'Number of Flats', value: user?.numberOfFlats || 'Not provided' },
        { label: 'Flat Type', value: user?.flatType || 'Not provided' },
        { label: 'Flat Location', value: user?.flatLocation?.join(', ') || 'Not provided' },
        { label: 'Flat Value', value: user?.flatValue ? `₹${user.flatValue}` : 'Not provided' },
        { label: 'Total Properties Value', value: user?.totalPropertiesValue ? `₹${user.totalPropertiesValue}` : 'Not provided' },
        { label: 'Any More Properties', value: user?.anyMoreProperties || 'Not provided' },
      ];

      propertyInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add location information
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Location Details', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const locationInfo = [
        { label: 'Country', value: user?.country || 'Not provided' },
        { label: 'State', value: user?.state || 'Not provided' },
        { label: 'District', value: user?.district || 'Not provided' },
        { label: 'Citizenship', value: user?.citizenship || 'Not provided' },
      ];

      locationInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add habits
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Habits', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const habitsInfo = [
        { label: 'Eating Habits', value: user?.eatingHabits || 'Not provided' },
        { label: 'Smoking Habits', value: user?.smokingHabits || 'Not provided' },
        { label: 'Drinking Habits', value: user?.drinkingHabits || 'Not provided' },
      ];

      habitsInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add partner preferences
      yPosition += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(template.primaryColor);
      pdf.text('Partner Preferences', margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(template.secondaryColor);
      
      const preferencesInfo = [
        { label: 'Age Preferences', value: user?.agePreferences?.join(', ') || 'Not provided' },
        { label: 'Religion Preferences', value: user?.religionPreferences?.join(', ') || 'Not provided' },
        { label: 'Caste Preferences', value: user?.castePreferences?.join(', ') || 'Not provided' },
        { label: 'Sub Caste Preferences', value: user?.subCastePreferences?.join(', ') || 'Not provided' },
        { label: 'Marital Status Preferences', value: user?.maritalStatusPreferences?.join(', ') || 'Not provided' },
        { label: 'Children Preferences', value: user?.childrenPreferences?.join(', ') || 'Not provided' },
        { label: 'Mother Tongue Preferences', value: user?.motherTonguePreferences?.join(', ') || 'Not provided' },
        { label: 'Education Preferences', value: user?.partnerEducationPreferences?.join(', ') || 'Not provided' },
        { label: 'Occupation Preferences', value: user?.partnerOccupationPreferences?.join(', ') || 'Not provided' },
        { label: 'Job Location Preferences', value: user?.partnerJobLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'Annual Income Preferences', value: user?.partnerAnnualIncome?.join(', ') || 'Not provided' },
        { label: 'Family Preferences', value: user?.familyPreferences?.join(', ') || 'Not provided' },
        { label: 'Settled Location Preferences', value: user?.settledLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'Own House Preferences', value: user?.ownHousePreferences?.join(', ') || 'Not provided' },
        { label: 'Square Yard Preferences', value: user?.squareYardPreferences?.join(', ') || 'Not provided' },
        { label: 'Monthly Rent Preferences', value: user?.monthlyRentPreferences?.join(', ') || 'Not provided' },
        { label: 'Plot Preferences', value: user?.plotPreference?.join(', ') || 'Not provided' },
        { label: 'Flat Preferences', value: user?.flatPreference?.join(', ') || 'Not provided' },
        { label: 'Own Location Preferences', value: user?.ownLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'Agriculture Land Preferences', value: user?.agricultureLandPreference?.join(', ') || 'Not provided' },
        { label: 'Total Property Value Preferences', value: user?.totalPropertyValuePreference?.join(', ') || 'Not provided' },
        { label: 'Country Location Preferences', value: user?.countryLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'State Location Preferences', value: user?.stateLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'City Location Preferences', value: user?.cityLocationPreferences?.join(', ') || 'Not provided' },
        { label: 'Citizenship Preferences', value: user?.citizenshipPreferences?.join(', ') || 'Not provided' },
      ];

      preferencesInfo.forEach(info => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${info.label}: ${info.value}`, margin, yPosition);
        yPosition += 6;
      });

      // Add footer
      const currentPage = pdf.getCurrentPageInfo().pageNumber;
      const totalPages = pdf.getNumberOfPages();
      
      pdf.setFontSize(10);
      pdf.setTextColor(template.secondaryColor);
      pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.setDrawColor(template.primaryColor);
      pdf.setLineWidth(1);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

      // Save the PDF
      const fileName = `${user?.fullName || 'Profile'}_Biodata_${template.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      setShowModal(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Error generating PDF. Please try again.');
    } finally {
      setDownloadLoading(false);
      setSelectedFrame(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin text-4xl text-blue-500" />
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <BottomNavbar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="text-xl" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">Download Bio Data</h1>
              </div>
              <Download className="text-2xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Preview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={user?.image ? `${Uploads}${user.image}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face";
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || 'User Name'}</h2>
                <p className="text-gray-600">ID: {user?.martialId || 'N/A'}</p>
                <p className="text-gray-600">{calculateAge(user?.dateOfBirth)} years • {user?.height || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Religion:</span>
                <span className="ml-2 text-gray-600">{user?.religion || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Caste:</span>
                <span className="ml-2 text-gray-600">{user?.caste || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Education:</span>
                <span className="ml-2 text-gray-600">{user?.education || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Employment:</span>
                <span className="ml-2 text-gray-600">{user?.employmentStatus || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Income:</span>
                <span className="ml-2 text-gray-600">{user?.annualIncome || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Location:</span>
                <span className="ml-2 text-gray-600">{user?.district || 'N/A'}, {user?.state || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* PDF Template Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Choose PDF Template</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye className="text-sm" />
                <span>Preview All</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {pdfTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`${template.preview} rounded-lg border-2 ${template.color} p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="aspect-[3/4] bg-white rounded-md mb-3 flex items-center justify-center border border-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10"></div>
                    <User className="text-2xl text-gray-400 relative z-10" />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  <button
                    onClick={() => generatePDF(template)}
                    disabled={downloadLoading}
                    className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-md py-2 px-3 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadLoading && selectedFrame === template.id ? (
                      <>
                        <Loader2 className="animate-spin text-xs" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="text-xs" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Preview Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Preview PDF Templates</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="text-xl" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                {pdfTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`${template.preview} rounded-lg border-2 ${template.color} p-4 cursor-pointer hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="aspect-[3/4] bg-white rounded-md mb-3 flex items-center justify-center border border-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10"></div>
                      <User className="text-2xl text-gray-400 relative z-10" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">{template.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                    <button
                      onClick={() => generatePDF(template)}
                      disabled={downloadLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md py-2 px-3 text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      {downloadLoading && selectedFrame === template.id ? (
                        <>
                          <Loader2 className="animate-spin text-xs" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="text-xs" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavbar />
    </>
  );
};

export default ProfileDownloadPage; 