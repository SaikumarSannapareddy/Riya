import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const suspendedProfiles = [
  {
    id: 1,
    name: "Robert Miller",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911234567890", whatsapp: "+911234567890" },
    userContact: { phone: "+919876543210", whatsapp: "+919876543210" },
    website: "https://example.com",
    suspendedDate: "2025-02-15",
    reason: "Multiple user complaints about services",
  },
  {
    id: 2,
    name: "Linda Johnson",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911112223334", whatsapp: "+911112223334" },
    userContact: { phone: "+919998887776", whatsapp: "+919998887776" },
    website: "https://example.com",
    suspendedDate: "2025-02-20",
    reason: "False information in profile",
  },
  {
    id: 3,
    name: "James Wilson",
    image: "https://via.placeholder.com/100",
    bureauContact: { phone: "+911546789012", whatsapp: "+911546789012" },
    userContact: { phone: "+917778889990", whatsapp: "+917778889990" },
    website: "https://example.com",
    suspendedDate: "2025-02-22",
    reason: "Violation of terms of service",
  },
];

const SuspendedProf = () => {
  const [cardView, setCardView] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const [profiles, setProfiles] = useState(suspendedProfiles);
  const [actionCompleted, setActionCompleted] = useState(false);

  const openCardView = (profile) => {
    setSelectedProfile(profile);
    setCardView(true);
  };

  const closeCardView = () => {
    setCardView(false);
    setSelectedProfile(null);
  };

  const openReasonModal = () => {
    setReasonText("");
    setShowReasonModal(true);
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReasonText("");
  };

  const activateProfile = () => {
    if (!reasonText.trim()) {
      alert("Please enter a reason");
      return;
    }

    const updatedProfiles = profiles.filter(p => p.id !== selectedProfile.id);
    setProfiles(updatedProfiles);
    setActionCompleted(true);
    
    // Reset action completed flag after 3 seconds
    setTimeout(() => {
      setActionCompleted(false);
      closeCardView();
    }, 3000);
    
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
          <h2 className="text-2xl font-bold mb-4">Suspended Profiles</h2>

          {/* Profile List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
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
                  <div className="mt-1 p-1 bg-red-100 text-red-800 text-sm rounded">
                    Suspended: {new Date(profile.suspendedDate).toLocaleDateString()}
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

          {/* No suspended profiles message */}
          {profiles.length === 0 && (
            <div className="mt-8 p-4 text-center bg-gray-100 rounded-lg">
              <p className="text-gray-600">No suspended profiles at this time.</p>
            </div>
          )}

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

                {/* Suspension Info */}
                <div className="mb-4 p-3 bg-red-100 rounded-md">
                  <h3 className="text-md font-semibold text-red-800">Suspension Information</h3>
                  <p className="text-red-700 mt-1">
                    Suspended on: {new Date(selectedProfile.suspendedDate).toLocaleDateString()}
                  </p>
                  <p className="text-red-700 mt-1">
                    Reason: {selectedProfile.reason}
                  </p>
                </div>

                {/* Action completed message */}
                {actionCompleted && (
                  <div className="mb-4 p-2 bg-green-100 text-green-800 rounded border border-green-200">
                    <p>Profile has been activated successfully</p>
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
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={openReasonModal}
                  >
                    Activate Profile
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
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Activate Profile
                </h3>
                <p className="mb-4">
                  Please enter a reason for activating this profile:
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
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={activateProfile}
                  >
                    Activate
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

export default SuspendedProf;