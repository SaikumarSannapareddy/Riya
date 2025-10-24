import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const reportedProfiles = [
  {
    id: 1,
    name: "John Doe",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911234567890", whatsapp: "+911234567890" },
    userContact: { phone: "+919876543210", whatsapp: "+919876543210" },
    website: "https://example.com",
    suspended: false,
    reason: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911112223334", whatsapp: "+911112223334" },
    userContact: { phone: "+919998887776", whatsapp: "+919998887776" },
    website: "https://example.com",
    suspended: true,
    reason: "Multiple policy violations",
  },
];

const ReportedProfiles = () => {
  const [cardView, setCardView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [profiles, setProfiles] = useState(reportedProfiles);
  const [actionCompleted, setActionCompleted] = useState(false);

  const openCardView = (profile) => {
    setSelectedProfile(profile);
    setCardView(true);
  };

  const closeCardView = () => {
    setCardView(false);
    setSelectedProfile(null);
  };

  const openReasonModal = (type) => {
    setActionType(type);
    setReasonText("");
    setShowReasonModal(true);
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReasonText("");
  };

  const submitAction = () => {
    if (!reasonText.trim()) {
      alert("Please enter a reason");
      return;
    }

    const updatedProfiles = [...profiles];
    const profileIndex = updatedProfiles.findIndex(p => p.id === selectedProfile.id);
    
    if (profileIndex !== -1) {
      if (actionType === "delete") {
        // In a real app, you might want to filter this profile out or move it to a "deleted" collection
        updatedProfiles[profileIndex].reason = reasonText;
        updatedProfiles[profileIndex].deleted = true;
      } else if (actionType === "suspend") {
        updatedProfiles[profileIndex].suspended = true;
        updatedProfiles[profileIndex].reason = reasonText;
      } else if (actionType === "activate") {
        updatedProfiles[profileIndex].suspended = false;
        updatedProfiles[profileIndex].reason = reasonText;
      }
      
      setProfiles(updatedProfiles);
      setSelectedProfile({...selectedProfile, 
        suspended: actionType === "suspend" ? true : (actionType === "activate" ? false : selectedProfile.suspended),
        reason: reasonText,
        deleted: actionType === "delete" ? true : false
      });
      setActionCompleted(true);
      
      // Reset action completed flag after 3 seconds
      setTimeout(() => {
        setActionCompleted(false);
      }, 3000);
    }
    
    setShowReasonModal(false);
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
          <h2 className="text-2xl font-bold mb-4">Reported Profiles</h2>

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              !profile.deleted && (
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
                    {profile.reason && (
                      <div className="mt-1 p-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                        Warning: {profile.reason}
                      </div>
                    )}
                    <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                      onClick={() => openCardView(profile)}
                    >
                      Card View
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Card View Modal */}
          {cardView && selectedProfile && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{selectedProfile.name}</h2>
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />

                {/* Warning message if reason exists */}
                {selectedProfile.reason && (
                  <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-200">
                    <p className="font-semibold">Warning:</p>
                    <p>{selectedProfile.reason}</p>
                  </div>
                )}

                {/* Action completed message */}
                {actionCompleted && (
                  <div className="mb-4 p-2 bg-green-100 text-green-800 rounded border border-green-200">
                    <p>Action completed successfully</p>
                  </div>
                )}

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
                    onClick={() => openReasonModal("delete")}
                  >
                    Delete
                  </button>
                  {selectedProfile.suspended ? (
                    <button 
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                      onClick={() => openReasonModal("activate")}
                    >
                      Move to Active
                    </button>
                  ) : (
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                      onClick={() => openReasonModal("suspend")}
                    >
                      Suspend
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

          {/* Reason Modal */}
          {showReasonModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  {actionType === "delete" ? "Delete" : actionType === "suspend" ? "Suspend" : "Activate"} Profile
                </h3>
                <p className="mb-4">
                  Please enter a reason for this action:
                </p>
                <textarea
                  className="w-full p-2 border rounded-md mb-4 h-32"
                  placeholder="Enter reason here..."
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
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
                    onClick={submitAction}
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

export default ReportedProfiles;