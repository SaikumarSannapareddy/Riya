import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const totalProfiles = [
  {
    id: 1,
    name: "John Doe",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911234567890", whatsapp: "+911234567890" },
    userContact: { phone: "+919876543210", whatsapp: "+919876543210" },
    website: "https://example.com",
    registrationDate: "10 Jan 2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911112223334", whatsapp: "+911112223334" },
    userContact: { phone: "+919998887776", whatsapp: "+919998887776" },
    website: "https://example.com",
    registrationDate: "15 Jan 2025",
    status: "Suspended",
  },
  {
    id: 3,
    name: "Michael Johnson",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911546789012", whatsapp: "+911546789012" },
    userContact: { phone: "+917778889990", whatsapp: "+917778889990" },
    website: "https://example.com",
    registrationDate: "22 Jan 2025",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Williams",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+919876123450", whatsapp: "+919876123450" },
    userContact: { phone: "+912345098765", whatsapp: "+912345098765" },
    website: "https://example.com",
    registrationDate: "05 Feb 2025",
    status: "Incomplete",
  },
  {
    id: 5,
    name: "Robert Brown",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+913698521470", whatsapp: "+913698521470" },
    userContact: { phone: "+914567891230", whatsapp: "+914567891230" },
    website: "https://example.com",
    registrationDate: "18 Feb 2025",
    status: "Active",
  },
  {
    id: 6,
    name: "Sarah Davis",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+917410258963", whatsapp: "+917410258963" },
    userContact: { phone: "+918956237410", whatsapp: "+918956237410" },
    website: "https://example.com",
    registrationDate: "24 Feb 2025",
    status: "New",
  },
];

const TotalProfiles = () => {
  const [cardView, setCardView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reasonType, setReasonType] = useState("");
  const [reason, setReason] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const openCardView = (profile) => {
    setSelectedProfile(profile);
    setCardView(true);
  };

  const closeCardView = () => {
    setCardView(false);
    setSelectedProfile(null);
  };

  const openReasonDialog = (type) => {
    setReasonType(type);
    setReason("");
    setShowReasonDialog(true);
  };

  const closeReasonDialog = () => {
    setShowReasonDialog(false);
    setReason("");
  };

  const submitReason = () => {
    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    // Set warning message based on action type
    if (reasonType === "delete") {
      setWarningMessage(`Profile will be deleted. Reason: ${reason}`);
    } else if (reasonType === "suspend") {
      setWarningMessage(`Profile will be suspended. Reason: ${reason}`);
    }

    // Close the dialog
    setShowReasonDialog(false);
    
    // For demo purposes only - in a real app, you'd perform the actual action here
    // setTimeout to clear the warning message after 5 seconds
    setTimeout(() => {
      setWarningMessage("");
    }, 5000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Incomplete":
        return "bg-yellow-100 text-yellow-800";
      case "New":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter profiles based on search term and status filter
  const filteredProfiles = totalProfiles.filter(
    (profile) =>
      (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.registrationDate.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || profile.status === filterStatus)
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="p-4 w-full">
          <h2 className="text-2xl font-bold mb-4">Total Profiles</h2>

          {/* Warning Message */}
          {warningMessage && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p>{warningMessage}</p>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by name or date..."
                className="w-full p-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="p-2 border rounded-md w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Incomplete">Incomplete</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center p-4 border rounded-lg shadow-md bg-white"
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-sm text-gray-600">
                      Registered: {profile.registrationDate}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full inline-block w-fit ${getStatusColor(profile.status)}`}>
                      {profile.status}
                    </span>
                  </div>
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => openCardView(profile)}
                  >
                    Card View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Card View Modal */}
          {cardView && selectedProfile && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedProfile.name}</h2>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedProfile.status)}`}>
                    {selectedProfile.status}
                  </span>
                </div>
                
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />

                {/* Registration Date */}
                <div className="mb-4 text-center">
                  <span className="text-gray-600">
                    Registered on {selectedProfile.registrationDate}
                  </span>
                </div>

                {/* Bureau Contact Details */}
                <div className="mb-2">
                  <h3 className="text-md font-semibold">Bureau Contact</h3>
                  <div className="flex gap-2 mt-1">
                    <a
                      href={`tel:${selectedProfile.bureauContact.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${selectedProfile.bureauContact.whatsapp}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* User Contact Details */}
                <div className="mb-2">
                  <h3 className="text-md font-semibold">User Contact</h3>
                  <div className="flex gap-2 mt-1">
                    <a
                      href={`tel:${selectedProfile.userContact.phone}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${selectedProfile.userContact.whatsapp}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Website Button */}
                <a
                  href={selectedProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  View My Website
                </a>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="px-4 py-2 bg-gray-400 text-white rounded-md">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-md">
                    Edit
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                    onClick={() => openReasonDialog("delete")}
                  >
                    Delete
                  </button>
                  {selectedProfile.status !== "Suspended" ? (
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                      onClick={() => openReasonDialog("suspend")}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Move to Active
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md w-full"
                  onClick={closeCardView}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Reason Dialog */}
          {showReasonDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {reasonType === "delete" 
                    ? "Confirm Deletion" 
                    : "Confirm Suspension"}
                </h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter Reason
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    placeholder="Please enter a reason..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex-1"
                    onClick={submitReason}
                  >
                    Submit
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded-md flex-1"
                    onClick={closeReasonDialog}
                  >
                    Cancel
                  </button>
                </div> 
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalProfiles;