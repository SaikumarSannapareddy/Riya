import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPaperPlane, 
  FaHeart, 
  FaCheck, 
  FaExclamationTriangle, 
  FaPhone, 
  FaLock, 
  FaWhatsapp, 
  FaCog, 
  FaGlobe, 
  FaEyeSlash, 
  FaUsers, 
  FaUserSlash, 
  FaEye, 
  FaEdit,
  FaTimes,
  FaUser,
  FaTrash,
  FaDownload,
  FaCrown,
  FaFilePdf,
  FaImage,
  FaInfoCircle
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient, { apiEndpoints, Uploads } from './Apis1';
import Loader from './Loader';
import { PasswordModal, EmailModal, useModal } from './MyprofileModals';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ServicePreferenceModal from './ServicePreferenceModal';
import { toast } from 'react-hot-toast';

const BiodataPreview = ({ profile }) => {
  if (!profile) return null;
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
  return (
    <div style={{ width: 700, padding: 32, background: '#fff', color: '#222', fontFamily: 'sans-serif', borderRadius: 16, boxShadow: '0 2px 12px #0002' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={profile.image ? `${Uploads}${profile.image}` : 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png'}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginRight: 24 }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: 28 }}>{profile.fullName || 'No Name'}</div>
          <div style={{ fontSize: 16, margin: '4px 0' }}>Martial ID: <b>{profile.martialId || 'N/A'}</b></div>
          <div style={{ fontSize: 16, margin: '4px 0' }}>Age: <b>{profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : 'N/A'}</b></div>
          <div style={{ fontSize: 16, margin: '4px 0' }}>Gender: <b>{profile.gender || 'N/A'}</b></div>
        </div>
      </div>
      <hr style={{ margin: '16px 0' }} />
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Personal Details</div>
          <div><b>Date of Birth:</b> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
          <div><b>Birth Time:</b> {profile.time || 'N/A'}</div>
          <div><b>Marital Status:</b> {profile.maritalStatus || 'N/A'}</div>
          <div><b>Physical State:</b> {profile.physicalState || 'N/A'}</div>
          <div><b>Education:</b> {profile.education || 'N/A'}</div>
          <div><b>Employment Status:</b> {profile.employmentStatus || 'N/A'}</div>
          <div><b>Occupation:</b> {profile.occupation || 'N/A'}</div>
          <div><b>Annual Income:</b> {profile.annualIncome ? `₹${profile.annualIncome}` : 'N/A'}</div>
          <div><b>Location:</b> {[profile.country, profile.state, profile.district].filter(Boolean).join(', ') || 'N/A'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Family Details</div>
          <div><b>Family Type:</b> {profile.familyType || 'N/A'}</div>
          <div><b>Family Value:</b> {profile.familyValue || 'N/A'}</div>
          <div><b>Father Employee:</b> {profile.fatherEmployee || 'N/A'}</div>
          <div><b>Father Occupation:</b> {profile.fatherOccupied || 'N/A'}</div>
          <div><b>Mother Employee:</b> {profile.motherEmployee || 'N/A'}</div>
          <div><b>Mother Occupation:</b> {profile.motherOccupied || 'N/A'}</div>
          <div><b>Total Brothers:</b> {profile.totalBrothers ?? 'N/A'}</div>
          <div><b>Married Brothers:</b> {profile.marriedBrothers ?? 'N/A'}</div>
          <div><b>Total Sisters:</b> {profile.totalSisters ?? 'N/A'}</div>
          <div><b>Married Sisters:</b> {profile.marriedSisters ?? 'N/A'}</div>
        </div>
      </div>
      <hr style={{ margin: '16px 0' }} />
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Religion and Caste</div>
      <div><b>Religion:</b> {profile.religion || 'N/A'}</div>
      <div><b>Caste:</b> {profile.caste || 'N/A'}</div>
      <div><b>Sub Caste:</b> {profile.subcaste || 'N/A'}</div>
      <div style={{ fontWeight: 600, fontSize: 20, margin: '16px 0 8px' }}>Contact</div>
      <div><b>Mobile Number:</b> {profile.mobileNumber || 'N/A'}</div>
      <div><b>Email:</b> {profile.email || 'N/A'}</div>
    </div>
  );
};

const ProfileOptionsPage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const bureauId = localStorage.getItem('bureauId');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [showOtherProfilesLoading, setShowOtherProfilesLoading] = useState(false);
  const [shortlistedProfiles, setShortlistedProfiles] = useState(new Set());
  
  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSendInterestModalOpen, setIsSendInterestModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  // Report modal states
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  
  // Shortlist modal states
  const [shortlistNote, setShortlistNote] = useState('');
  const [shortlistLoading, setShortlistLoading] = useState(false);
  
  // Send Interest modal states
  const [interestDescription, setInterestDescription] = useState('');
  const [sendInterestLoading, setSendInterestLoading] = useState(false);
  const [targetmartialId, setTargetmartialId] = useState('');
  const [targetmartialIdError, setTargetmartialIdError] = useState('');
  
  // Download biodata states
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [completeProfileData, setCompleteProfileData] = useState(null);
  
  // Service preference modal states
  const [isServicePreferenceModalOpen, setIsServicePreferenceModalOpen] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [packageLoading, setPackageLoading] = useState(false);
  
  // Use the custom modal hook
  const {
    isPasswordModalOpen,
    currentPassword,
    openPasswordModal,
    closePasswordModal,
    isEmailModalOpen,
    currentEmail,
    openEmailModal,
    closeEmailModal,
  } = useModal();

  // Add a ref for the profile card
  const profileCardRef = useRef(null);
  // Add a ref for the biodata preview
  const biodataImageRef = useRef(null);

  const reportReasons = [
    'Inappropriate Content',
    'Fake Profile',
    'Spam or Scam',
    'Harassment',
    'Impersonation',
    'Misleading Information',
    'Match Fixed',
    'Other'
  ];

  // Helper function to convert string to boolean
  const convertStringToBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  };

  // Calculate age
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

  // Download biodata as PDF
  const downloadBiodata = async () => {
    setDownloadLoading(true);
    try {
      // Fetch complete profile data including gallery
      const response = await apiClient.get(`${apiEndpoints.user}/${profileId}`);
      const profileData = response.data;
      
      if (!profileData) {
        throw new Error('Profile data not found');
      }

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;

    // Helper function to add a section with background
    const addSection = (title, color = [240, 240, 240]) => {
      // Add background rectangle
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.rect(margin, yPosition - 5, contentWidth, 12, 'F');
      
      // Add title
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin + 5, yPosition + 3);
      yPosition += 15;
    };

    // Helper function to add field with icon-like styling
    const addField = (label, value, iconColor = [52, 152, 219]) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Add colored rectangle as "icon"
      pdf.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
      pdf.rect(margin + 5, yPosition - 3, 4, 4, 'F');
      
      // Add label
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(label + ':', margin + 15, yPosition);
      
      // Add value
      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, margin + 15, yPosition + 5);
      
      yPosition += 12;
    };

    // Header section with profile image
    pdf.setFillColor(44, 62, 80);
    pdf.rect(0, 0, pageWidth, 60, 'F');

      // Add profile image if available
      if (profileData.image) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = `${Uploads}${profileData.image}`;
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
            const imgSize = 35;
            const imgX = 25;
            const imgY = 12;
            
            // Create circular mask effect
            pdf.addImage(img, 'JPEG', imgX, imgY, imgSize, imgSize);
              resolve();
            };
            img.onerror = reject;
          });
        } catch (error) {
          console.log('Could not load profile image:', error);
        }
      }

    // Header info
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(profileData.fullName || 'Name Not Available', 70, 25);
    
    // ID and status badges
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`ID: ${profileData.martialId || 'Not provided'}`, 70, 35);
    pdf.text(`Payment: Free Profile`, 70, 42);
    pdf.text(`Citizenship: ${profileData.citizenship || 'Not provided'}`, 70, 49);

    yPosition = 70;

    // Service and Caste Preference (if available)
    if (profileData.servicePreference || profileData.castePreference) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin, yPosition, contentWidth, 25, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Service Preference:', margin + 5, yPosition + 8);
      pdf.text('Caste Preference:', margin + 5, yPosition + 18);
      
      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.text(profileData.servicePreference || 'Undefined', margin + 45, yPosition + 8);
      pdf.text(profileData.castePreference || 'No Data', margin + 45, yPosition + 18);
      
      yPosition += 35;
    }

    // Personal Details Section
    addSection('👤 Personal Details', [255, 235, 59]);
    
    const personalFields = [
      { label: 'Name', value: profileData.fullName || 'Not provided', color: [244, 67, 54] },
      { label: 'Date Of Birth', value: profileData.dateOfBirth ? `${new Date(profileData.dateOfBirth).toLocaleDateString()} (${calculateAge(profileData.dateOfBirth)} years)` : 'Not provided', color: [233, 30, 99] },
      { label: 'Birth Time', value: profileData.birthTime || 'NO DATA', color: [255, 87, 34] },
      { label: 'Marital Status', value: profileData.maritalStatus || 'NO DATA', color: [255, 193, 7] },
      { label: 'Physical State', value: profileData.physicalState || 'NO DATA', color: [255, 152, 0] },
      { label: 'Education', value: profileData.education || 'Not provided', color: [33, 150, 243] },
      { label: 'Employment Status', value: profileData.employmentStatus || 'Not provided', color: [33, 150, 243] },
      { label: 'Occupation', value: profileData.occupation || 'Not provided', color: [33, 150, 243] },
      { label: 'Annual Income', value: profileData.annualIncome ? `₹${profileData.annualIncome}` : 'Not provided', color: [76, 175, 80] },
      { label: 'Location', value: `${profileData.country || ''}, ${profileData.state || ''}, ${profileData.district || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Not provided', color: [63, 81, 181] }
    ];

    personalFields.forEach(field => {
      addField(field.label, field.value, field.color);
    });

      yPosition += 10;

    // Religion and Caste Section
    addSection('🕉️ Religion And Caste', [255, 183, 77]);
    
    const religionFields = [
      { label: 'Religion', value: profileData.religion || 'Not provided', color: [244, 67, 54] },
      { label: 'Caste', value: profileData.caste || 'Not provided', color: [244, 67, 54] },
      { label: 'Sub Caste', value: profileData.subcaste || 'Not provided', color: [244, 67, 54] },
      { label: 'Mother Tongue', value: profileData.motherTongue || 'Not provided', color: [156, 39, 176] },
      { label: 'Languages Known', value: profileData.languagesKnown?.join(', ') || 'Not provided', color: [156, 39, 176] }
    ];

    religionFields.forEach(field => {
      addField(field.label, field.value, field.color);
    });

      yPosition += 10;

    // Family Details Section
    addSection('👨‍👩‍👧‍👦 Family Details', [129, 199, 132]);
    
    const familyFields = [
      { label: 'Family Type', value: profileData.familyType || 'NO DATA', color: [76, 175, 80] },
      { label: 'Family Value', value: profileData.familyIncome ? `₹${profileData.familyIncome}` : 'NO DATA', color: [255, 235, 59] },
      { label: 'Father Employee', value: profileData.fatherOccupation || 'NO DATA', color: [33, 150, 243] },
      { label: 'Father Occupation', value: profileData.fatherOccupation || 'NO DATA', color: [156, 39, 176] },
      { label: 'Mother Employee', value: profileData.motherOccupation || 'NO DATA', color: [233, 30, 99] },
      { label: 'Mother Occupation', value: profileData.motherOccupation || 'NO DATA', color: [255, 87, 34] },
      { label: 'Total Brothers', value: profileData.numberOfSiblings || 'NO DATA', color: [76, 175, 80] },
      { label: 'Married Brothers', value: profileData.marriedBrothers || 'NO DATA', color: [244, 67, 54] },
      { label: 'Total Sisters', value: profileData.numberOfSisters || 'NO DATA', color: [156, 39, 176] },
      { label: 'Married Sisters', value: profileData.marriedSisters || 'NO DATA', color: [33, 150, 243] }
    ];

    familyFields.forEach(field => {
      addField(field.label, field.value, field.color);
    });

    // Add new page for property and other details if needed
    if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

      yPosition += 10;

    // Property Information Section
    addSection('🏠 Property Information', [255, 224, 178]);
    
    const propertyFields = [
      { label: 'House Location', value: profileData.houseLocation?.join(', ') || 'Not provided', color: [255, 152, 0] },
      { label: 'House Value', value: profileData.houseValue ? `₹${profileData.houseValue}` : 'Not provided', color: [76, 175, 80] },
      { label: 'House Type', value: profileData.houseType || 'Not provided', color: [33, 150, 243] },
      { label: 'Total Plots Value', value: profileData.openPlotsValue ? `₹${profileData.openPlotsValue}` : 'Not provided', color: [76, 175, 80] },
      { label: 'Agriculture Land Value', value: profileData.agricultureLandValue ? `₹${profileData.agricultureLandValue}` : 'Not provided', color: [76, 175, 80] },
      { label: 'Number of Flats', value: profileData.numberOfFlats || 'Not provided', color: [63, 81, 181] },
      { label: 'Total Properties Value', value: profileData.totalPropertiesValue || 'Not provided', color: [76, 175, 80] }
    ];

    propertyFields.forEach(field => {
      addField(field.label, field.value, field.color);
    });

      yPosition += 10;

    // Habits Section
    addSection('🏃‍♂️ Habits', [200, 230, 201]);
    
    const habitsFields = [
      { label: 'Eating Habits', value: profileData.eatingHabits || 'Not provided', color: [255, 87, 34] },
      { label: 'Smoking Habits', value: profileData.smokingHabits || 'Not provided', color: [244, 67, 54] },
      { label: 'Drinking Habits', value: profileData.drinkingHabits || 'Not provided', color: [156, 39, 176] }
    ];

    habitsFields.forEach(field => {
      addField(field.label, field.value, field.color);
      });

      // Add gallery images if available
      if (profileData.gallery && profileData.gallery.length > 0) {
        yPosition += 10;
      addSection('📸 Gallery Images', [187, 222, 251]);

        // Add gallery images (limit to 3 per page)
        let imageCount = 0;
      const imagesPerRow = 3;
      const imageWidth = 45;
      const imageSpacing = 10;
      
        for (let i = 0; i < profileData.gallery.length; i++) {
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = margin;
          }

          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = `${Uploads}${profileData.gallery[i]}`;
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
              const imgHeight = (img.height * imageWidth) / img.width;
              const imgX = margin + (imageCount % imagesPerRow) * (imageWidth + imageSpacing);
                
              pdf.addImage(img, 'JPEG', imgX, yPosition, imageWidth, imgHeight);
                resolve();
              };
            img.onerror = resolve;
            });
            
            imageCount++;
          if (imageCount % imagesPerRow === 0) {
            yPosition += 55;
            }
          } catch (error) {
            console.log('Could not load gallery image:', error);
          }
        }
      }

      // Save the PDF
      const fileName = `${profileData.fullName || 'Profile'}_Biodata_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      alert('Biodata downloaded successfully!');
    } catch (error) {
      console.error('Error downloading biodata:', error);
      alert('Error downloading biodata. Please try again.');
    } finally {
      setDownloadLoading(false);
  }
};

  // Update downloadBiodataImage to use the hidden preview
  const downloadBiodataImage = async () => {
    if (!biodataImageRef.current) return;
    try {
      const canvas = await html2canvas(biodataImageRef.current, { useCORS: true, backgroundColor: '#fff' });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${profile.fullName || 'Profile'}_Biodata.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error downloading image. Please try again.');
    }
  };

  // Service preference functions
  const openServicePreferenceModal = () => {
    setIsServicePreferenceModalOpen(true);
  };

  const closeServicePreferenceModal = () => {
    setIsServicePreferenceModalOpen(false);
  };

  const handleServicePreferenceSuccess = () => {
    // Refresh profile data to get updated service preference
    if (profileId) {
      fetchProfile();
      fetchPackageDetails();
    }
  };

  const fetchPackageDetails = async () => {
    if (!profileId) return;
    
    try {
      setPackageLoading(true);
      const response = await apiClient.get(`${apiEndpoints.getPackageDetails}/${profileId}`);
      
      if (response.data.success) {
        setPackageDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
    } finally {
      setPackageLoading(false);
    }
  };

  const checkExpiredPackages = async () => {
    try {
      await apiClient.post(apiEndpoints.checkExpiredPackages);
    } catch (error) {
      console.error('Error checking expired packages:', error);
    }
  };

  // Update getServicePreferenceDisplay to only show the current service preference
  const getServicePreferenceDisplay = () => {
    if (!packageDetails) return '';
    const serviceMap = {
      'only_online': 'Only Online Service',
      'only_offline': 'Only Offline Service',
      'online_offline': 'Online & Offline Service'
    };
    return serviceMap[packageDetails.servicePreference] || '';
  };

  // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`${apiEndpoints.update}/${profileId}`);
        if (response.data) {
          const processedProfile = {
            ...response.data,
            visibleToAll: convertStringToBoolean(response.data.visibleToAll),
            showOtherProfiles: convertStringToBoolean(response.data.showOtherProfiles)
          };
          setProfile(processedProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (profileId) {
      fetchProfile();
      fetchShortlistedProfiles();
      fetchPackageDetails();
      checkExpiredPackages();
    }
  }, [profileId]);

  // Fetch shortlisted profiles
  const fetchShortlistedProfiles = async () => {
    try {
      const response = await apiClient.get(`${apiEndpoints.profilesfind}/shortlist/${bureauId}?limit=1000`);
      if (response.data.success) {
        const shortlistedIds = new Set(
          response.data.data.map(item => item.profileId._id || item.profileId)
        );
        setShortlistedProfiles(shortlistedIds);
      }
    } catch (error) {
      console.error('Error fetching shortlisted profiles:', error);
    }
  };

  const isProfileShortlisted = (profileId) => {
    return shortlistedProfiles.has(profileId);
  };

  // Toggle visibility
  const toggleVisibility = async (profileId, currentVisibility) => {
    setVisibilityLoading(true);
    
    try {
      const currentBooleanVisibility = convertStringToBoolean(currentVisibility);
      const newVisibility = !currentBooleanVisibility;
      
      const response = await apiClient.post(`${apiEndpoints.visibletoall}/${profileId}`, {
        visibleToAll: newVisibility
      });

      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          visibleToAll: newVisibility
        }));

        const status = newVisibility ? 'visible' : 'not visible';
        const description = newVisibility 
          ? 'Profile is now visible to all users' 
          : 'Profile is now hidden from public search';
        
        alert(`Profile is now ${status}! ${description}`);
      } else {
        throw new Error(response.data.message || 'Failed to update visibility');
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error updating profile visibility. Please try again.';
      alert(errorMessage);
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Toggle show other profiles
  const toggleShowOtherProfiles = async (profileId, currentShowOtherProfiles) => {
    setShowOtherProfilesLoading(true);
    
    try {
      const currentBooleanShowOtherProfiles = convertStringToBoolean(currentShowOtherProfiles);
      const newShowOtherProfiles = !currentBooleanShowOtherProfiles;
      
      const response = await apiClient.post(`${apiEndpoints.showotherprofiles}/${profileId}`, {
        showOtherProfiles: newShowOtherProfiles
      });

      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          showOtherProfiles: newShowOtherProfiles
        }));

        const status = newShowOtherProfiles ? 'show' : "don't show";
        const description = newShowOtherProfiles 
          ? 'This profile can now see other profiles' 
          : 'This profile cannot see other profiles';
        
        alert(`Profile will ${status} other profiles! ${description}`);
      } else {
        throw new Error(response.data.message || 'Failed to update show other profiles setting');
      }
    } catch (error) {
      console.error('Error updating show other profiles:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error updating show other profiles setting. Please try again.';
      alert(errorMessage);
    } finally {
      setShowOtherProfilesLoading(false);
    }
  };

  // Send credentials via WhatsApp
  const sendCredentials = (password, maritalId, fullName) => {
    const message = `Hello! ${fullName} \n\nHere are your login credentials:\n\nMarital ID: ${maritalId}\nPassword: ${password}\n\nLogin at https://matrimonystudio.in/userlogin`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };
  
  const sendwhatsapp = (fullName, phoneNumber) => {
    if (!phoneNumber) {
      alert("Phone number is missing for this profile.");
      return;
    }
    const message = `Hello! ${fullName}\n\n Here are your login credentials:\n\n`;
    const whatsappLink = `https://wa.me/+91${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  // Modal handlers
  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const openReportModal = () => {
    setIsReportModalOpen(true);
    setReportReason('');
    setReportDescription('');
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  const openShortlistModal = () => {
    setIsShortlistModalOpen(true);
    setShortlistNote('');
  };

  const closeShortlistModal = () => {
    setIsShortlistModalOpen(false);
    setShortlistNote('');
  };

  const openSendInterestModal = () => {
    setIsSendInterestModalOpen(true);
    setInterestDescription('');
    setTargetmartialId('');
    setTargetmartialIdError('');
  };

  const closeSendInterestModal = () => {
    setIsSendInterestModalOpen(false);
    setInterestDescription('');
    setTargetmartialId('');
    setTargetmartialIdError('');
  };

  // Submit report
  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert('Please select a reason for reporting');
      return;
    }

    setReportLoading(true);
    try {
      const reportData = {
        reportedProfileId: profile._id,
        reportedMartialId: profile.martialId,
        reporterBureauId: bureauId,
        reason: reportReason,
        description: reportDescription,
        reportedProfileName: profile.fullName,
        reportedAt: new Date().toISOString()
      };

      const response = await apiClient.post(`${apiEndpoints.reportProfile}`, reportData);
      
      if (response.status === 200 || response.status === 201) {
        alert('Profile reported successfully');
        closeReportModal();
      } else {
        alert('Failed to report profile. Please try again.');
      }
    } catch (error) {
      console.error('Error reporting profile:', error);
      alert('Error reporting profile. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  // Submit shortlist
  const handleShortlistSubmit = async () => {
    setShortlistLoading(true);
    try {
      const shortlistData = {
        profileId: profile._id,
        martialId: profile.martialId,
        bureauId: bureauId,
        profileName: profile.fullName,
        note: shortlistNote,
        shortlistedAt: new Date().toISOString()
      };

      const response = await apiClient.post(`${apiEndpoints.shortlistprofile}`, shortlistData);
      
      if (response.status === 200 || response.status === 201) {
        alert('Profile shortlisted successfully');
        setShortlistedProfiles(prev => new Set([...prev, profile._id]));
        closeShortlistModal();
      } else {
        alert('Failed to shortlist profile. Please try again.');
      }
    } catch (error) {
      console.error('Error shortlisting profile:', error);
      alert('Error shortlisting profile. Please try again.');
    } finally {
      setShortlistLoading(false);
    }
  };

  // Submit send interest
  const handleSendInterestSubmit = async () => {
    if (!interestDescription.trim()) {
      alert('Please enter a description for your interest');
      return;
    }

    if (!targetmartialId.trim()) {
      setTargetmartialIdError('Please enter a valid martial ID');
      return;
    }

    setTargetmartialIdError(''); // Clear any previous errors
    setSendInterestLoading(true);
    try {
      const interestData = {
        bureauId: bureauId, // Same bureau for both sender and receiver
        senderMartialId: profile.martialId,
        targetMartialId: targetmartialId.trim(),
        description: interestDescription
      };

      const response = await apiClient.post(`${apiEndpoints.sendMyInterest}`, interestData);
      
      if (response.status === 200 || response.status === 201) {
        const message = response.data.message || 'Interest sent successfully';
        alert(message);
        closeSendInterestModal();
      } else {
        alert('Failed to send interest. Please try again.');
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      const errorMessage = error.response?.data?.message || 'Error sending interest. Please try again.';
      alert(errorMessage);
    } finally {
      setSendInterestLoading(false);
    }
  };

  // Add handler to toggle payment status
  const handleTogglePaymentStatus = async () => {
    if (!profile) return;
    const newStatus = profile.paymentStatus === 'paid' ? 'free' : 'paid';
    try {
      await apiClient.put(`${apiEndpoints.update}/${profile._id}`, { paymentStatus: newStatus });
      setProfile(prev => ({ ...prev, paymentStatus: newStatus }));
      toast.success(`Profile is now ${newStatus === 'paid' ? 'Paid' : 'Free'} Profile!`);
    } catch (error) {
      toast.error('Failed to update payment status.');
    }
  };

  // Handler to toggle activeStatus
  const handleToggleActiveStatus = async () => {
    if (!profile) return;
    // Ensure newStatus is a boolean
    const newStatus = !(profile.activeStatus === true || profile.activeStatus === 'true');
    try {
      await apiClient.put(`${apiEndpoints.update}/${profile._id}`, { activeStatus: newStatus });
      setProfile(prev => ({ ...prev, activeStatus: newStatus }));
      toast.success(`Profile is now ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      toast.error('Failed to update active status.');
    }
  };

  // Add state for image privacy modal
  const [isImagePrivacyModalOpen, setIsImagePrivacyModalOpen] = useState(false);
  const [imagePrivacyLoading, setImagePrivacyLoading] = useState(false);

  const imagePrivacyOptions = [
    { value: 'all', label: 'Publish to All Members' },
    { value: 'accepted', label: 'Only Accepted Members' },
    { value: 'none', label: 'Do Not Publish' }
  ];

  const getImagePrivacyLabel = (value) => {
    const found = imagePrivacyOptions.find(opt => opt.value === value);
    return found ? found.label : 'Not Set';
  };

  const handleImagePrivacyChange = async (newValue) => {
    if (!profile) return;
    setImagePrivacyLoading(true);
    try {
      await apiClient.put(`${apiEndpoints.update}/${profile._id}`, { imagePrivacy: newValue });
      setProfile(prev => ({ ...prev, imagePrivacy: newValue }));
      toast.success('Image privacy updated!');
      setIsImagePrivacyModalOpen(false);
    } catch (error) {
      toast.error('Failed to update image privacy.');
    } finally {
      setImagePrivacyLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Add state for profile history modal
  const [isProfileHistoryModalOpen, setIsProfileHistoryModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="flex items-center mb-4">
          <FaArrowLeft
            className="mr-2 text-gray-600 cursor-pointer"
            onClick={handleBackClick}
          />
          <h1 className="text-2xl font-semibold">Profile Options</h1>
        </div>
        <p className="text-red-500">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaArrowLeft
          className="mr-2 text-gray-600 cursor-pointer"
          onClick={handleBackClick}
        />
        <h1 className="text-2xl font-semibold">Profile Options</h1>
      </div>

      {/* Profile Card */}
      <div ref={profileCardRef} className={`bg-${profile.activeStatus ? 'white' : 'red-400'} shadow-lg rounded-lg p-6 mb-6`}>
        <div className="flex items-center mb-4">
          <img
            src={
              profile.image
                ? `${Uploads}${profile.image}`
                : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
            }
            alt="Profile"
            className="w-20 h-20 object-cover rounded-full mr-4"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.fullName}</h2>
            <p className="text-gray-600">Marital ID: {profile.martialId}</p>
            <p className="text-gray-600">
              {calculateAge(profile.dateOfBirth)} yrs | {profile.height} ft
            </p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${
              profile.visibleToAll
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.visibleToAll ? (
                <>
                  <FaGlobe className="mr-1" size={12} />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <FaEyeSlash className="mr-1" size={12} />
                  <span>Private</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className='text-center font-bold text-red-700'>Profile Contact Details</h2>
        <div className="flex space-x-2 mb-4">
          <a
            href={`tel:${profile.mobileNumber}`}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm"
          >
            <FaPhone className="mr-2" size={16} />
            Call
          </a>
          <button
            onClick={() => sendwhatsapp(profile.fullName, profile.mobileNumber)}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm"
          >
            <FaWhatsapp className="mr-2" size={16} />
            WhatsApp
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Active Status Toggle (now first) */}
        <button
          onClick={handleToggleActiveStatus}
          className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center ${profile.activeStatus ? 'border-green-500' : 'border-red-500'}`}
        >
          <FaUser className={profile.activeStatus ? 'text-green-600 mr-3' : 'text-red-600 mr-3'} size={20} />
          <div className="text-left">
            <p className="font-semibold">
              {profile.activeStatus ? 'Deactivate Profile' : 'Activate Profile'}
            </p>
            <p className={`text-xs ${profile.activeStatus ? 'text-green-600' : 'text-red-600'}`}
            >
              {profile.activeStatus ? 'Active' : 'Inactive'}
            </p>
          </div>
        </button>

        {/* View Email */}
        <button
          onClick={() => openEmailModal(profile.email)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaEnvelope className="text-blue-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">View Email</p>
            <p className="text-sm text-gray-600">Show email address</p>
          </div>
        </button>

        {/* Profile Privacy */}
        <button
          onClick={openPrivacyModal}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaLock className="text-purple-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Profile Privacy</p>
            <p className="text-sm text-gray-600">Manage visibility settings</p>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={openSettingsModal}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaCog className="text-gray-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Settings</p>
            <p className="text-sm text-gray-600">Profile preferences</p>
          </div>
        </button>

        {/* Report Profile */}
        <button
          onClick={openReportModal}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
        <FaTrash className="text-red-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Delete Profile</p>
            <p className="text-sm text-gray-600">Delete issues</p>
          </div>
        </button>

        {/* Shortlist */}
        {isProfileShortlisted(profile._id) ? (
          <div className="bg-white p-4 rounded-lg shadow flex items-center opacity-50">
            <FaCheck className="text-pink-600 mr-3" size={20} />
            <div className="text-left">
              <p className="font-semibold">Already Shortlisted</p>
              <p className="text-sm text-gray-600">Profile is shortlisted</p>
            </div>
          </div>
        ) : (
          <button
            onClick={openShortlistModal}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
          >
            <FaHeart className="text-pink-600 mr-3" size={20} />
            <div className="text-left">
              <p className="font-semibold">Shortlist</p>
              <p className="text-sm text-gray-600">Add to favorites</p>
            </div>
          </button>
        )}

        {/* Send Interest */}
        <button
          onClick={openSendInterestModal}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaHeart className="text-red-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Send Interest</p>
            <p className="text-sm text-gray-600">Express interest in profile</p>
          </div>
        </button>

        {/* Send Credentials */}
        <button
          onClick={() => sendCredentials(profile.password, profile.martialId, profile.fullName)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaPaperPlane className="text-green-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Share login details</p>
            
          </div>
        </button>

        {/* View Password */}
        <button
          onClick={() => openPasswordModal(profile.password)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaEye className="text-orange-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">View Password</p>
            <p className="text-sm text-gray-600">Show login password</p>
          </div>
        </button>

        {/* Edit Profile */}
        <a
          href={`/edit-profile/${profile._id}`}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaEdit className="text-blue-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Edit Profile</p>
            <p className="text-sm text-gray-600">Modify profile details</p>
          </div>
        </a>

        {/* Download Biodata */}
        <button
          onClick={() => setIsDownloadModalOpen(true)}
          disabled={downloadLoading}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center disabled:opacity-50"
        >
          <FaDownload className="text-purple-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">
              Download Biodata
            </p>
            <p className="text-sm text-gray-600">
              Download as PDF or Image
            </p>
          </div>
        </button>

        {/* Payment Status Toggle */}
        <button
          onClick={handleTogglePaymentStatus}
          className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center ${profile.paymentStatus === 'paid' ? 'border-green-500' : 'border-gray-300'}`}
        >
          <FaCrown className={profile.paymentStatus === 'paid' ? 'text-yellow-600 mr-3' : 'text-gray-400 mr-3'} size={20} />
          <div className="text-left">
            <p className="font-semibold">
              {profile.paymentStatus === 'paid' ? 'Downgrade to Free Profile' : 'Upgrade to Paid Profile'}
            </p>
            <p className={`text-xs ${profile.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-600'}`}
            >
              {profile.paymentStatus === 'paid' ? 'Paid Profile' : 'Free Profile'}
            </p>
          </div>
        </button>

        {/* Service Preference Management (only if paid) */}
        {profile.paymentStatus === 'paid' && (
        <button
          onClick={openServicePreferenceModal}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaCrown className="text-yellow-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Service Preference</p>
            <p className="text-sm text-gray-600">
              {packageLoading ? 'Loading...' : getServicePreferenceDisplay()}
            </p>
            </div>
          </button>
        )}

        {/* Image Privacy */}
        <button
          onClick={() => setIsImagePrivacyModalOpen(true)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center"
        >
          <FaLock className="text-purple-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold">Image Privacy</p>
            <p className="text-sm text-gray-600">{getImagePrivacyLabel(profile.imagePrivacy)}</p>
          </div>
        </button>

        {/* Membership Details */}
        <button
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center mb-2"
          onClick={() => setIsProfileHistoryModalOpen(true)}
        >
          <FaInfoCircle className="text-blue-600 mr-3" size={20} />
          <div className="text-left">
            <p className="font-semibold mb-1">Profile History</p>
            <p className="text-sm text-gray-600">View creation date, service, membership, and views</p>
          </div>
        </button>
      </div>

      {/* View Full Profile Button */}
      <div className="mt-6">
        <a
          href={`/profile/${profile._id}`}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <FaUser className="mr-2" size={20} />
          View Full Profile
        </a>
      </div>

      {/* All Modals */}
      {/* Profile Privacy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaLock className="mr-2 text-blue-600" />
                Profile Privacy
              </h2>
              <button
                onClick={closePrivacyModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <img
                  src={
                    profile.image
                      ? `${Uploads}${profile.image}`
                      : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                  }
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{profile.fullName}</h3>
                  <p className="text-sm text-gray-600">ID: {profile.martialId}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="font-semibold mb-3 text-center">Profile Visibility</h4>
              
              <div className="space-y-3">
                {/* Visible Option */}
                <div 
                  onClick={() => toggleVisibility(profile._id, profile.visibleToAll)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    profile.visibleToAll 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      profile.visibleToAll ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {profile.visibleToAll && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <FaGlobe className={`mr-3 ${
                      profile.visibleToAll ? 'text-green-600' : 'text-gray-400'
                    }`} size={18} />
                    <div>
                      <p className="font-medium">Visible</p>
                      <p className="text-sm text-gray-600">Profile is visible to all users</p>
                    </div>
                  </div>
                </div>

                {/* Not Visible Option */}
                <div 
                  onClick={() => toggleVisibility(profile._id, profile.visibleToAll)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    !profile.visibleToAll 
                      ? 'border-red-500 bg-red-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      !profile.visibleToAll ? 'border-red-500 bg-red-500' : 'border-gray-300'
                    }`}>
                      {!profile.visibleToAll && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <FaEyeSlash className={`mr-3 ${
                      !profile.visibleToAll ? 'text-red-600' : 'text-gray-400'
                    }`} size={18} />
                    <div>
                      <p className="font-medium">Not Visible</p>
                      <p className="text-sm text-gray-600">Profile is hidden from public search</p>
                    </div>
                  </div>
                </div>
              </div>

              {visibilityLoading && (
                <div className="text-center mt-4">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Updating...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closePrivacyModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaCog className="mr-2 text-blue-600" />
                Settings
              </h2>
              <button
                onClick={closeSettingsModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <img
                  src={
                    profile.image
                      ? `${Uploads}${profile.image}`
                      : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"
                  }
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{profile.fullName}</h3>
                  <p className="text-sm text-gray-600">ID: {profile.martialId}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="font-semibold mb-3 text-center">Show Other Profiles</h4>
              
              <div className="space-y-3">
                {/* Show Option */}
                <div 
                  onClick={() => toggleShowOtherProfiles(profile._id, profile.showOtherProfiles)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    profile.showOtherProfiles 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      profile.showOtherProfiles ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {profile.showOtherProfiles && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <FaUsers className={`mr-3 ${
                      profile.showOtherProfiles ? 'text-blue-600' : 'text-gray-400'
                    }`} size={18} />
                    <div>
                      <p className="font-medium">Show</p>
                      <p className="text-sm text-gray-600">This profile can see other profiles</p>
                    </div>
                  </div>
                </div>

                {/* Don't Show Option */}
                <div 
                  onClick={() => toggleShowOtherProfiles(profile._id, profile.showOtherProfiles)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    !profile.showOtherProfiles 
                      ? 'border-red-500 bg-red-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      !profile.showOtherProfiles ? 'border-red-500 bg-red-500' : 'border-gray-300'
                    }`}>
                      {!profile.showOtherProfiles && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <FaUserSlash className={`mr-3 ${
                      !profile.showOtherProfiles ? 'text-red-600' : 'text-gray-400'
                    }`} size={18} />
                    <div>
                      <p className="font-medium">Don't Show</p>
                      <p className="text-sm text-gray-600">This profile cannot see other profiles</p>
                    </div>
                  </div>
                </div>
              </div>

              {showOtherProfilesLoading && (
                <div className="text-center mt-4">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Updating...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeSettingsModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Delete Profile</h2>
              <button
                onClick={closeReportModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Deleting Profile:</p>
              <p className="font-semibold">{profile.fullName}</p>
              <p className="text-sm text-gray-600">Marital ID: {profile.martialId}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Deleting *
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a reason...</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Please provide more details about your Delete..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="4"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeReportModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportLoading || !reportReason.trim()}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {reportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortlist Modal - Only show if profile is not already shortlisted */}
      {isShortlistModalOpen && !isProfileShortlisted(profile._id) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pink-600">Shortlist Profile</h2>
              <button
                onClick={closeShortlistModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-pink-50 rounded">
              <p className="text-sm text-gray-600">Shortlisting Profile:</p>
              <p className="font-semibold">{profile.fullName}</p>
              <p className="text-sm text-gray-600">Marital ID: {profile.martialId}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a Note (Optional)
              </label>
              <textarea
                value={shortlistNote}
                onChange={(e) => setShortlistNote(e.target.value)}
                placeholder="Add a personal note about this profile..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                rows="3"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeShortlistModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={shortlistLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleShortlistSubmit}
                disabled={shortlistLoading}
                className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {shortlistLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add to Shortlist'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Interest Modal */}
      {isSendInterestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">Send Interest</h2>
              <button
                onClick={closeSendInterestModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {profile && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Sending Interest to:</p>
                <p className="font-semibold">{profile.fullName}</p>
                <p className="text-sm text-gray-600">Profile Martial ID: {profile.martialId}</p>
                <p className="text-sm text-gray-600">Bureau ID: {profile.bureauId}</p>
                <p className="text-sm text-blue-600 mt-2">
                  <strong>Note:</strong> You will enter the Your Customer  martial ID below
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Customer Martri ID *
              </label>
              <input
                type="text"
                value={targetmartialId}
                onChange={(e) => {
                  setTargetmartialId(e.target.value);
                  setTargetmartialIdError(''); // Clear error when user types
                }}
                placeholder={`Enter target martial ID:`}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  targetmartialIdError ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {targetmartialIdError && <p className="text-red-500 text-sm mt-1">{targetmartialIdError}</p>}
             
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeSendInterestModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={sendInterestLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInterestSubmit}
                disabled={sendInterestLoading || !interestDescription.trim()}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {sendInterestLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Interest'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biodata Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">Download Biodata</h2>
              <button onClick={() => setIsDownloadModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => { setIsDownloadModalOpen(false); downloadBiodata(); }}
                className="flex items-center p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
              >
                <FaFilePdf className="text-red-600 mr-4" size={32} />
                <div>
                  <p className="font-semibold text-lg">Download as PDF</p>
                  <p className="text-sm text-gray-600">Get a printable PDF version of the biodata.</p>
                </div>
              </button>
              <button
                onClick={() => { setIsDownloadModalOpen(false); downloadBiodataImage(); }}
                className="flex items-center p-4 rounded-lg border border-green-200 hover:bg-green-50 transition"
              >
                <FaImage className="text-green-600 mr-4" size={32} />
                <div>
                  <p className="font-semibold text-lg">Download as Image</p>
                  <p className="text-sm text-gray-600">Save the biodata as a high-quality image.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Privacy Modal */}
      {isImagePrivacyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaLock className="mr-2 text-purple-600" />
                Image Privacy
              </h2>
              <button
                onClick={() => setIsImagePrivacyModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {imagePrivacyOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleImagePrivacyChange(opt.value)}
                  disabled={imagePrivacyLoading}
                  className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${profile.imagePrivacy === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:border-purple-300'}`}
                >
                  <span>{opt.label}</span>
                  {profile.imagePrivacy === opt.value && <FaCheck className="text-purple-600" />}
                </button>
              ))}
            </div>
            {imagePrivacyLoading && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Updating...</span>
                </div>
              </div>
            )}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsImagePrivacyModalOpen(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Components */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        password={currentPassword}
        onClose={closePasswordModal}
      />
      
      <EmailModal
        isOpen={isEmailModalOpen}
        email={currentEmail}
        onClose={closeEmailModal}
      />

      {/* Service Preference Modal */}
      <ServicePreferenceModal
        isOpen={isServicePreferenceModalOpen}
        onClose={closeServicePreferenceModal}
        profile={profile}
        onSuccess={handleServicePreferenceSuccess}
      />

      {/* At the end of the main render, add the hidden preview for image export */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={biodataImageRef}>
          <BiodataPreview profile={profile} />
        </div>
      </div>

      {/* Profile History Modal */}
      {isProfileHistoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Profile History
              </h2>
              <button
                onClick={() => setIsProfileHistoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-semibold w-32">Created:</span>
                <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32">Service:</span>
                <span>{getServicePreferenceDisplay() || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32">Membership:</span>
                <span>{profile.paymentStatus === 'paid' ? 'Paid' : 'Free'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-32">Views:</span>
                <span>{profile.views ?? 0}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsProfileHistoryModalOpen(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOptionsPage;