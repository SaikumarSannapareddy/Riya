import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const todaysProfiles = [
  {
    id: 1,
    name: "Sarah Williams",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911234567890", whatsapp: "+911234567890" },
    userContact: { phone: "+919876543210", whatsapp: "+919876543210" },
    website: "https://example.com",
    registrationTime: "09:45 AM",
    status: "Pending Review",
  },
  {
    id: 2,
    name: "David Thompson",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911112223334", whatsapp: "+911112223334" },
    userContact: { phone: "+919998887776", whatsapp: "+919998887776" },
    website: "https://example.com",
    registrationTime: "11:30 AM",
    status: "Approved",
  },
  {
    id: 3,
    name: "Jennifer Lee",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911546789012", whatsapp: "+911546789012" },
    userContact: { phone: "+917778889990", whatsapp: "+917778889990" },
    website: "https://example.com",
    registrationTime: "02:15 PM",
    status: "Pending Review",
  },
  {
    id: 4,
    name: "Robert Garcia",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+919876123450", whatsapp: "+919876123450" },
    userContact: { phone: "+912345098765", whatsapp: "+912345098765" },
    website: "https://example.com",
    registrationTime: "04:50 PM",
    status: "Under Verification",
  },
];

const TodaysProfiles = () => {
  const [cardView, setCardView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "delete" or "suspend"
  const [reason, setReason] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const openCardView = (profile) => {
    setSelectedProfile(profile);
    setCardView(true);
  };

  const closeCardView = () => {
    setCardView(false);
    setSelectedProfile(null);
    setWarningMessage("");
  };

  const openReasonModal = (type) => {
    setActionType(type);
    setShowReasonModal(true);
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReason("");
  };

  const submitReason = () => {
    if (reason.trim() === "") {
      alert("Please enter a reason");
      return;
    }

    const action = actionType === "delete" ? "deleted" : "suspended";
    setWarningMessage(`Profile ${action}: ${reason}`);
    closeReasonModal();
    
    // Here you would typically make an API call to update the backend
    console.log(`Profile ${selectedProfile.id} ${action} with reason: ${reason}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      case "Under Verification":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <TopNavbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="p-4 w-full">
          <h2 className="text-2xl font-bold mb-4">Today's Profiles</h2>

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysProfiles.map((profile) => (
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
                      Registered at: {profile.registrationTime}
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
                
                {/* Warning Message */}
                {warningMessage && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md">
                    <p className="font-semibold">Warning</p>
                    <p>{warningMessage}</p>
                  </div>
                )}
                
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />

                {/* Registration Time */}
                <div className="mb-4 text-center">
                  <span className="text-gray-600">
                    Registered today at {selectedProfile.registrationTime}
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
                  {selectedProfile.status === "Pending Review" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Approve
                    </button>
                  )}
                  {selectedProfile.status === "Pending Review" && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md">
                      Reject
                    </button>
                  )}
                  {selectedProfile.status === "Under Verification" && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                      Complete Verification
                    </button>
                  )}
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                    onClick={() => openReasonModal("delete")}
                  >
                    Delete
                  </button>
                  <button 
                    className="px-4 py-2 bg-orange-600 text-white rounded-md"
                    onClick={() => openReasonModal("suspend")}
                  >
                    Suspend
                  </button>
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

          {/* Reason Modal */}
          {showReasonModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Enter Reason for {actionType === "delete" ? "Deletion" : "Suspension"}
                </h3>
                
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 min-h-24"
                  placeholder="Enter reason here..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                    onClick={closeReasonModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={submitReason}
                  >
                    Submit
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

export default TodaysProfiles;