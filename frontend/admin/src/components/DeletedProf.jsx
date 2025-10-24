import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const deletedProfiles = [
  {
    id: 1,
    name: "Ryan Cooper",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911234567890", whatsapp: "+911234567890" },
    userContact: { phone: "+919876543210", whatsapp: "+919876543210" },
    website: "https://example.com",
    deletedDate: "12 Feb 2025",
    deleteReason: "Profile information was misleading",
  },
  {
    id: 2,
    name: "Lisa Morgan",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911112223334", whatsapp: "+911112223334" },
    userContact: { phone: "+919998887776", whatsapp: "+919998887776" },
    website: "https://example.com",
    deletedDate: "15 Feb 2025",
    deleteReason: "User requested account deletion",
  },
  {
    id: 3,
    name: "Kevin Martinez",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911546789012", whatsapp: "+911546789012" },
    userContact: { phone: "+917778889990", whatsapp: "+917778889990" },
    website: "https://example.com",
    deletedDate: "20 Feb 2025",
    deleteReason: "Violated terms of service",
  },
];

const DeletedProfiles = () => {
  const [cardView, setCardView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reasonType, setReasonType] = useState("");
  const [reason, setReason] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

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
    } else if (reasonType === "restore") {
      setWarningMessage(`Profile will be restored. Reason: ${reason}`);
    }

    // Close the dialog
    setShowReasonDialog(false);
    
    // For demo purposes only - in a real app, you'd perform the actual action here
    // setTimeout to clear the warning message after 5 seconds
    setTimeout(() => {
      setWarningMessage("");
    }, 5000);
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
          <h2 className="text-2xl font-bold mb-4">Deleted Profiles</h2>

          {/* Warning Message */}
          {warningMessage && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p>{warningMessage}</p>
            </div>
          )}

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deletedProfiles.map((profile) => (
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
                  <p className="text-sm text-gray-600">
                    Deleted on: {profile.deletedDate}
                  </p>
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
                <h2 className="text-xl font-bold mb-4">{selectedProfile.name}</h2>
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />

                {/* Deletion Information */}
                <div className="mb-4 p-3 bg-red-100 rounded-md">
                  <h3 className="text-md font-semibold text-red-700">Deletion Information</h3>
                  <p className="text-red-600">
                    <strong>Date:</strong> {selectedProfile.deletedDate}
                  </p>
                  <p className="text-red-600">
                    <strong>Reason:</strong> {selectedProfile.deleteReason}
                  </p>
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
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => openReasonDialog("restore")}
                  >
                    Restore Profile
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                    onClick={() => openReasonDialog("delete")}
                  >
                    Permanent Delete
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

          {/* Reason Dialog */}
          {showReasonDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {reasonType === "delete" 
                    ? "Confirm Deletion" 
                    : reasonType === "suspend"
                      ? "Confirm Suspension"
                      : "Confirm Restoration"}
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

export default DeletedProfiles;