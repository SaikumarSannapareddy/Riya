import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints, Uploads, bureauLogin } from "./Apis";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineLock,
  AiOutlineMore,
  AiOutlineClose,
  AiOutlineEyeInvisible,
  AiOutlineDollar,
  AiOutlineStop,
  AiOutlineCalendar,
  AiOutlineShareAlt,
  AiOutlineLogin
} from "react-icons/ai";
import Loader from "./Loader";

const PaidBureaus = () => {
  const [bureaus, setBureaus] = useState([]);
  const [filteredBureaus, setFilteredBureaus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Payment edit modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ package: "A", months: 1, amount: 99 });
  
  const itemsPerPage = 30;

  const fetchBureaus = async () => {
    setLoading(true);
    try {
      // Use the new endpoint that handles profile images better
      const response = await apiClient.get(apiEndpoints.BureauManageWithImages);
      const data = response.data;
      
      if (!data || !data.bureauProfiles) {
        setBureaus([]);
        setFilteredBureaus([]);
        setTotalPages(0);
        return;
      }

      // Filter only paid bureaus (paymentStatus == 1 and not deleted/suspended)
      const paidBureaus = data.bureauProfiles.filter(bureau => 
        bureau.paymentStatus == 1 && bureau.deleted != 1 && bureau.suspend != 1
      );

      // Store the filtered bureau data
      setBureaus(paidBureaus);
      
      // Apply filtering and pagination
      filterAndPaginateBureaus(paidBureaus, searchQuery, currentPage);
    } catch (error) {
      console.error("Error fetching bureau profiles:", error);
      // Fallback to original endpoint if new one fails
      try {
        const fallbackResponse = await apiClient.get(apiEndpoints.BureauManage);
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData && fallbackData.bureauProfiles) {
          const paidBureaus = fallbackData.bureauProfiles.filter(bureau => 
            bureau.paymentStatus == 1 && bureau.deleted != 1 && bureau.suspend != 1
          );
          setBureaus(paidBureaus);
          filterAndPaginateBureaus(paidBureaus, searchQuery, currentPage);
        } else {
      setBureaus([]);
      setFilteredBureaus([]);
      setTotalPages(0);
        }
      } catch (fallbackError) {
        console.error("Fallback endpoint also failed:", fallbackError);
        setBureaus([]);
        setFilteredBureaus([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateBureaus = (bureauList, query, page) => {
    // Apply filtering
    const filtered = query.trim() === "" ? 
      bureauList : 
      bureauList.filter((bureau) =>
        (bureau.ownerName && bureau.ownerName.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.email && bureau.email.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.bureauName && bureau.bureauName.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.mobileNumber && bureau.mobileNumber.toLowerCase().includes(query.toLowerCase())) ||
        (bureau.bureauId && bureau.bureauId.toLowerCase().includes(query.toLowerCase()))
      );
    
    // Calculate total pages
    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    // Reset to page 1 if current page is out of bounds
    const validPage = page > totalPagesCount ? 1 : page;
  
    // Apply pagination
    const start = (validPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedResults = filtered.slice(start, end);
    
    // Update state
    setFilteredBureaus(paginatedResults);
    if (validPage !== page) {
      setCurrentPage(validPage);
    }
  };

  useEffect(() => {
    fetchBureaus();
  }, []);

  useEffect(() => {
    filterAndPaginateBureaus(bureaus, searchQuery, currentPage);
  }, [searchQuery, currentPage, bureaus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openPaymentModal = (bureau) => {
    setSelectedBureau(bureau);
    setPaymentData({ package: bureau.package || "A", months: 1, amount: 99 });
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBureau(null);
  };

  const handlePaymentDataChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const submitPaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(currentDate.getMonth() + parseInt(paymentData.months));
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];

      await apiClient.put(apiEndpoints.Bureauupdate, {
        bureauId: selectedBureau.bureauId,
        paymentStatus: 1,
        package: paymentData.package,
        months: paymentData.months,
        amount: paymentData.amount,
        expiryDate: formattedExpiryDate
      });

      // Update UI list
      const updated = bureaus.map(b => 
        b.bureauId === selectedBureau.bureauId ? { ...b, expiryDate: formattedExpiryDate, paymentStatus: 1 } : b
      );
      setBureaus(updated);
      filterAndPaginateBureaus(updated, searchQuery, currentPage);
      alert("Package updated successfully!");
      closePaymentModal();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status. Please try again.");
    }
  };

  const openPasswordModal = (bureau) => {
    setSelectedBureau(bureau);
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedBureau(null);
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Main switch to bureau function (fetches password and switches directly)
  const handleSwitchToBureau = async (bureau) => {
    try {
      // Check if we have the mobile number
      if (!bureau.mobileNumber) {
        alert('Bureau mobile number not available. Please contact support.');
        return;
      }

      // Fetch the bureau password from backend using new endpoint
      const bureauDetailsUrl = `${apiEndpoints.BureauDetails}/${bureau.bureauId}`;
      console.log('Calling bureau details endpoint:', bureauDetailsUrl);
      
      const response = await apiClient.get(bureauDetailsUrl);
      
      if (response.data && response.data.success && response.data.bureauProfile) {
        const bureauProfile = response.data.bureauProfile;
        const password = bureauProfile.password;
        
        if (password) {
          // Switch to bureau with fetched password
          const loginUrl = `http://localhost:5174?mobile=${encodeURIComponent(bureau.mobileNumber)}&password=${encodeURIComponent(password)}&source=admin`;
          
          console.log('Opening bureau login with URL:', loginUrl);
          
          // Open in new window with specific features
          const newWindow = window.open(
            loginUrl, 
            'bureauLogin', 
            'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes,location=yes,status=yes'
          );
          
          if (!newWindow) {
            alert('Please allow pop-ups for this site to switch to bureau account.');
          } else {
            // Focus the new window
            newWindow.focus();
            console.log('Bureau login window opened successfully');
          }
        } else {
          alert('Bureau password not found. Please contact support.');
        }
      } else {
        alert('Unable to fetch bureau details. Please contact support.');
      }
    } catch (error) {
      console.error('Error switching to bureau:', error);
      alert('Error switching to bureau account. Please try again.');
    }
  };

  // Direct switch to bureau (fetches password and switches directly)
  const handleDirectSwitchToBureau = async (bureau) => {
    try {
      // Check if we have the mobile number
      if (!bureau.mobileNumber) {
        alert('Bureau mobile number not available. Please contact support.');
        return;
      }

      // Fetch the bureau password from backend using new endpoint
      const bureauDetailsUrl = `${apiEndpoints.BureauDetails}/${bureau.bureauId}`;
      console.log('Calling bureau details endpoint:', bureauDetailsUrl);
      
      const response = await apiClient.get(bureauDetailsUrl);
      
      if (response.data && response.data.success && response.data.bureauProfile) {
        const bureauProfile = response.data.bureauProfile;
        const password = bureauProfile.password;
        
        if (password) {
          // Direct switch with fetched password
          const loginUrl = `http://localhost:5174?mobile=${encodeURIComponent(bureau.mobileNumber)}&password=${encodeURIComponent(password)}&source=admin`;
          
          console.log('Opening bureau login with URL:', loginUrl);
          
          // Open in new window with specific features
          const newWindow = window.open(
            loginUrl, 
            'bureauLogin', 
            'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes,location=yes,status=yes'
          );
          
          if (!newWindow) {
            alert('Please allow pop-ups for this site to switch to bureau account.');
          } else {
            // Focus the new window
            newWindow.focus();
            console.log('Bureau login window opened successfully');
          }
        } else {
          alert('Bureau password not found. Please contact support.');
        }
      } else {
        alert('Unable to fetch bureau details. Please contact support.');
      }
    } catch (error) {
      console.error('Error switching to bureau:', error);
      alert('Error switching to bureau account. Please try again.');
    }
  };

  // Enhanced password change function that enables switching to bureau after password change
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await apiClient.put(apiEndpoints.PasswordUpdate, {
        bureauId: selectedBureau.bureauId,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        alert("Password updated successfully! You can now switch to this bureau account.");
        closePasswordModal();
        fetchBureaus(); // Refresh the list
        
        // Ask if user wants to switch to bureau now
        const switchNow = window.confirm(
          `Password updated successfully for ${selectedBureau.bureauName}!\n\n` +
          `Would you like to switch to this bureau account now?`
        );
        
        if (switchNow) {
          // Switch to bureau with new password
          const loginUrl = `http://localhost:5174?mobile=${encodeURIComponent(selectedBureau.mobileNumber)}&password=${encodeURIComponent(passwordData.newPassword)}`;
          
          // Open in new window with specific features
          const newWindow = window.open(
            loginUrl, 
            '_blank', 
            'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes,location=yes,status=yes'
          );
          
          if (!newWindow) {
            alert('Please allow pop-ups for this site to switch to bureau account.');
          } else {
            // Focus the new window
            newWindow.focus();
          }
        }
      } else {
        alert("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password. Please try again.");
    }
  };

  const handleSuspendBureau = async (bureau) => {
    const action = bureau.suspend == 1 ? "unsuspend" : "suspend";
    const confirmMessage = `Are you sure you want to ${action} this bureau?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await apiClient.put(apiEndpoints.Bureauupdate, {
        bureauId: bureau.bureauId,
        suspend: bureau.suspend == 1 ? 0 : 1
      });

      // Update the local state to reflect the change
      const updatedBureaus = bureaus.map(b => 
        b.bureauId === bureau.bureauId 
          ? { ...b, suspend: bureau.suspend == 1 ? 0 : 1 } 
          : b
      );
      
      setBureaus(updatedBureaus);
      filterAndPaginateBureaus(updatedBureaus, searchQuery, currentPage);
      
      alert(`Bureau ${action}ed successfully!`);
      setActiveDropdown(null);
    } catch (error) {
      console.error(`Error ${action}ing bureau:`, error);
      alert(`Error ${action}ing bureau. Please try again.`);
    }
  };

  const handleDeleteBureau = async (bureau) => {
    if (!window.confirm("Are you sure you want to delete this bureau? This action cannot be undone.")) {
      return;
    }

    try {
      await apiClient.put(apiEndpoints.Bureauupdate, {
        bureauId: bureau.bureauId,
        deleted: 1
      });

      // Update the local state to reflect the change
      const updatedBureaus = bureaus.map(b => 
        b.bureauId === bureau.bureauId 
          ? { ...b, deleted: 1 } 
          : b
      );
      
      setBureaus(updatedBureaus);
      filterAndPaginateBureaus(updatedBureaus, searchQuery, currentPage);
      
      alert("Bureau deleted successfully!");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting bureau:", error);
      alert("Error deleting bureau. Please try again.");
    }
  };

  const handleRestoreBureau = async (bureau) => {
    if (!window.confirm("Are you sure you want to restore this bureau? This action cannot be undone.")) {
      return;
    }

    try {
      await apiClient.put(apiEndpoints.Bureauupdate, {
        bureauId: bureau.bureauId,
        deleted: 0
      });

      // Update the local state to reflect the change
      const updatedBureaus = bureaus.map(b => 
        b.bureauId === bureau.bureauId 
          ? { ...b, deleted: 0 } 
          : b
      );
      
      setBureaus(updatedBureaus);
      filterAndPaginateBureaus(updatedBureaus, searchQuery, currentPage);
      
      alert("Bureau restored successfully!");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error restoring bureau:", error);
      alert("Error restoring bureau. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getBureauStatusInfo = (bureau) => {
    if (bureau.deleted == 1) {
      return {
        class: "bg-red-500",
        text: "Deleted"
      };
    } else if (bureau.suspend == 1) {
      return {
        class: "bg-orange-500",
        text: "Suspended"
      };
    } else {
      return {
        class: "bg-green-500",
        text: "Paid Member"
      };
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Paid Bureaus</h1>
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Bureau ID, Name, Email, Company, or Mobile"
            className="border px-4 py-2 w-full rounded-lg shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBureaus.length > 0 ? (
              filteredBureaus.map((bureau) => {
                const statusInfo = getBureauStatusInfo(bureau);
                
                return (
                <div
                  key={bureau.bureauId}
                  className={`border rounded-lg shadow-md p-4 bg-white flex flex-col relative hover:shadow-lg transition-shadow duration-300 ${bureau.deleted == 1 ? 'border-red-300 bg-red-50' : bureau.suspend == 1 ? 'border-orange-300 bg-orange-50' : ''}`}
                >
                  {/* Status badge */}
                  <div className={`absolute top-3 right-16 ${statusInfo.class} text-white text-xs px-2 py-1 rounded-full`}>
                    {statusInfo.text}
                  </div>
                  
                  {/* Expiry date for paid members */}
                  {bureau.paymentStatus == 1 && (
                    <div className="absolute top-8 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Expires: {formatDate(bureau.expiryDate)}
                    </div>
                  )}
                  
                  {/* Three-dot menu */}
                  <div className="absolute top-3 right-3 dropdown-container">
                    <button 
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => toggleDropdown(bureau.bureauId)}
                    >
                      <AiOutlineMore className="text-gray-600 text-xl" />
                    </button>
                    
                    {activeDropdown === bureau.bureauId && (
                      <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg z-10 border">
                        <ul className="py-1">
                          <li>
                            <button
                              onClick={() => openPasswordModal(bureau)}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            >
                              <AiOutlineLock className="mr-2" /> Change Password
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDirectSwitchToBureau(bureau)}
                              className="px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left flex items-center"
                            >
                              <AiOutlineLogin className="mr-2" /> Switch to Bureau (Direct)
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                const url = `https://matrimonystudio.in/${bureau.bureauId}/${bureau.bureauName}`;
                                const shareData = {
                                  title: 'Check out this Bureau Profile',
                                  text: `Visit this profile on Matrimony Studio`,
                                  url: url,
                                };

                                if (navigator.share) {
                                  navigator.share(shareData).catch((err) =>
                                    console.error('Share failed:', err)
                                  );
                                } else {
                                  navigator.clipboard.writeText(url).then(() => {
                                    alert('Share not supported on this device. Link copied to clipboard!');
                                  });
                                }
                              }}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            >
                              <AiOutlineShareAlt className="mr-2" /> Share Website
                            </button>
                          </li>
                          
                          <li>
                            <button
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                            >
                              <AiOutlineCalendar className="mr-2" /> Paid Member (Expires: {formatDate(bureau.expiryDate)})
                            </button>
                          </li>
                          
                                  <li>
                            <button
                              onClick={() => openPaymentModal(bureau)}
                              className="px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left flex items-center"
                              disabled={bureau.deleted == 1 || bureau.suspend == 1}
                            >
                              <AiOutlineDollar className="mr-2" /> Edit Package
                            </button>
                          </li>

                          {bureau.suspend == 1 ? (
                            <li>
                              <button
                                onClick={() => handleSuspendBureau(bureau)}
                                className="px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-left flex items-center"
                                disabled={bureau.deleted == 1}
                              >
                                <AiOutlineStop className="mr-2" /> Unsuspend Profile
                              </button>
                            </li>
                          ) : (
                            <li>
                              <button
                                onClick={() => handleSuspendBureau(bureau)}
                                className="px-4 py-2 text-sm text-orange-600 hover:bg-gray-100 w-full text-left flex items-center"
                                disabled={bureau.deleted == 1}
                              >
                                <AiOutlineStop className="mr-2" /> Suspend Profile
                              </button>
                            </li>
                          )}
                          
                          <li>
                            <button
                              onClick={() => handleDeleteBureau(bureau)}
                              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                            >
                              <AiOutlineDelete className="mr-2" /> Delete Bureau
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mt-6">
                    {/* Bureau Logo Section */}
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                      <div className="text-center mb-2">
                        <h4 className="text-xs font-semibold text-gray-700 mb-1">Bureau Logo</h4>
                        <div className="relative group">
                      <img
                        src={
                              bureau.navbarLogo
                                ? `${Uploads}/${bureau.navbarLogo}`
                            : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                        }
                            alt="Bureau Logo"
                            className={`w-20 h-20 object-contain rounded-lg border-2 border-gray-200 ${bureau.deleted == 1 ? 'opacity-50' : ''} cursor-pointer transition-transform hover:scale-105`}
                            onError={(e) => {
                              e.target.src = "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg";
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                            {bureau.navbarLogo ? `Logo: ${bureau.navbarLogo}` : 'No logo uploaded'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {bureau.navbarLogo ? 'Logo Uploaded' : 'No Logo'}
                        </p>
                      </div>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                      <div className="text-center mb-2">
                        <h4 className="text-xs font-semibold text-gray-700 mb-1">Profile Picture</h4>
                        <div className="relative group">
                          <img
                            src={
                              bureau.profile_img
                                ? `data:image/jpeg;base64,${bureau.profile_img}`
                                : "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                            }
                            alt="Profile Picture"
                            className={`w-20 h-20 object-cover rounded-lg border-2 border-gray-200 ${bureau.deleted == 1 ? 'opacity-50' : ''} cursor-pointer transition-transform hover:scale-105`}
                            onError={(e) => {
                              e.target.src = "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg";
                            }}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                            {bureau.profile_img ? 'Profile: Base64 Image' : 'No profile picture uploaded'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {bureau.profile_img ? 'Profile Uploaded' : 'No Profile Pic'}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="mb-2 flex items-start">
                        <AiOutlineUser className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Bureau Id</h3>
                          <p className="text-gray-600 truncate">{bureau.bureauId}</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-start">
                        <AiOutlineShop className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Bureau Name</h3>
                          <p className="text-gray-600 truncate">{bureau.bureauName}</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-start">
                        <AiOutlineUser className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Owner Name</h3>
                          <p className="text-gray-600 truncate">{bureau.ownerName}</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-start">
                        <AiOutlineMail className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Email</h3>
                          <p className="text-gray-600 truncate">{bureau.email}</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-start">
                        <AiOutlinePhone className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Mobile</h3>
                          <p className="text-gray-600 truncate">{bureau.mobileNumber}</p>
                        </div>
                      </div>
                      <div className="mb-2 flex items-start">
                        <AiOutlineCalendar className="text-gray-600 mr-2 mt-1 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800">Created</h3>
                          <p className="text-gray-600 truncate">{formatDate(bureau.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-between">
                    <button 
                      className={`flex-1 ${bureau.deleted == 1 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-2 py-1.5 rounded flex items-center justify-center transition-colors text-sm`}
                      disabled={bureau.deleted == 1}
                    >
                      <AiOutlineEye className="mr-1" /> View
                    </button>
                    <button 
                      className={`flex-1 ${bureau.deleted == 1 ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-2 py-1.5 rounded flex items-center justify-center transition-colors text-sm`}
                      disabled={bureau.deleted == 1}
                    >
                      <AiOutlineEdit className="mr-1" /> Edit
                    </button>
                    <button 
                      className={`flex-1 ${bureau.deleted == 1 ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white px-2 py-1.5 rounded flex items-center justify-center transition-colors text-sm`}
                      disabled={bureau.deleted == 1}
                      onClick={() => handleSwitchToBureau(bureau)}
                      title="Switch to this bureau account (fetches password automatically)"
                    >
                      <AiOutlineLogin className="mr-1" /> Switch to Bureau
                    </button>
                    {bureau.deleted == 1 ? (
                      <button
                        className="flex-1 bg-green-500 text-white px-2 py-1.5 rounded flex items-center justify-center hover:bg-green-600 transition-colors text-sm"
                        onClick={() => handleRestoreBureau(bureau)}
                      >
                        <AiOutlineEye className="mr-1" /> Restore
                      </button>
                    ) : (
                      <button
                        className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                        onClick={() => handleDeleteBureau(bureau)}
                      >
                        <AiOutlineDelete className="mr-1" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No paid bureaus found.</p>
            </div>
          )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Edit Modal */}
      {showPaymentModal && selectedBureau && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Package</h2>
              <button onClick={closePaymentModal} className="text-gray-500 hover:text-gray-700">
                <AiOutlineClose />
              </button>
            </div>
            <form onSubmit={submitPaymentUpdate} className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Bureau</label>
                <p className="text-gray-500 font-medium">{selectedBureau.bureauName}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="package">Select Package</label>
                <select id="package" name="package" value={paymentData.package} onChange={handlePaymentDataChange} className="w-full p-2 border rounded" required>
                  <option value="A">Package A</option>
                  <option value="B">Package B</option>
                  <option value="C">Package C</option>
                  <option value="D">Package D</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="months">Duration (Months)</label>
                <select id="months" name="months" value={paymentData.months} onChange={handlePaymentDataChange} className="w-full p-2 border rounded" required>
                  {[...Array(300)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Month' : 'Months'}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="amount">Amount ($)</label>
                <input type="number" id="amount" name="amount" value={paymentData.amount} onChange={handlePaymentDataChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closePaymentModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Update Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={submitPasswordChange}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2"
                  >
                    {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidBureaus; 