import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEye,
  FaShareAlt,
  FaSearch,
  FaCog,
  FaGlobe,
  FaEyeSlash,
  FaExchangeAlt,
  FaImage,
  FaFilePdf,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient, { apiEndpoints, Uploads } from "./Apis1";
import Loader from "./Loader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Dialog } from "@headlessui/react";

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 100;
  const [totalCount, setTotalCount] = useState(0);

  const [showDesignModal, setShowDesignModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const navigate = useNavigate();
  const bureauId = localStorage.getItem("bureauId");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const [activeFilter, setActiveFilter] = useState("All");

  // simple counters placeholder (keeps your existing UI intact)
  const [counters, setCounters] = useState({
    active: 0,
    inactive: 0,
    paid: 0,
    free: 0,
    otherMediatorDetails: 0,
    servicePreferences: { only_online: 0, only_offline: 0, online_offline: 0 },
  });

  // ref to preview element to capture for image/pdf
  const previewRef = useRef(null);


  const handleDownload = async (type) => {
    if (!selectedProfile) {
      alert("No profile selected.");
      return;
    }
    if (selectedDesign === null) {
      alert("Please choose a design.");
      return;
    }

    try {
      // Build a temporary preview element using the selected design
      // For now we render a simple card variant based on selectedDesign
      const element = previewRef.current;
      if (!element) {
        alert("Preview not available.");
        return;
      }

      // Use html2canvas to capture
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      if (type === "image") {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${selectedProfile.fullName}_Design${selectedDesign + 1}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (type === "pdf") {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${selectedProfile.fullName}_Design${selectedDesign + 1}.pdf`);
      }

      // close modal and clear selection
      setShowDesignModal(false);
      setSelectedDesign(null);
      setSelectedProfile(null);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to generate file. Check console for details.");
    }
  };

  // helper to convert strings like "true"/"false"
  const convertStringToBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  };

  const pathname = window.location.pathname;
  const segments = pathname.split("/");
  const gender = segments[3];

  useEffect(() => {
    // store in local storage as before
    localStorage.setItem("bureauId", bureauId);
    localStorage.setItem("gender", gender);
  }, [bureauId, gender]);

  useEffect(() => {
    // Fetch profiles
    const fetch = async () => {
      if (!bureauId) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get(
          `${apiEndpoints.fetchbureau}/${bureauId}/${gender}`
        );
        const contentType = response.headers["content-type"] || "";
        if (contentType.includes("application/json")) {
          if (Array.isArray(response.data.users)) {
            const processed = response.data.users.map((p) => ({
              ...p,
              visibleToAll: convertStringToBoolean(p.visibleToAll),
              showOtherProfiles: convertStringToBoolean(p.showOtherProfiles),
            }));
            setProfiles(processed);
            setFilteredProfiles(processed);
            setCounters(response.data.counters || counters);
            setTotalCount(response.data.total || processed.length);
          } else {
            setError("Invalid response format from server.");
          }
        } else {
          setError("Server returned non-JSON. Check the API.");
        }
      } catch (err) {
        console.error(err);
        setError("No Profiles Fund");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bureauId]);

  // pagination helpers
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles
    .filter((p) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "otherMediatorDetails")
        return p.createdBy === "Other Mediater Profile";
      return p.filterTags && p.filterTags.includes(activeFilter);
    })
    .slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = profiles.filter(
      (profile) =>
        profile.martialId?.toString().toLowerCase().includes(term) ||
        profile.fullName?.toLowerCase().includes(term)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    if (m < birthDate.getMonth() || (m === birthDate.getMonth() && d < birthDate.getDate()))
      age--;
    return age;
  };

  const handleShareProfile = (profile) => {
    const shareUrl = `${window.location.origin}/profile_webview/${profile._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Matrimony Studio Profile",
          text: `${profile.fullName} (Marital ID: ${profile.martialId})`,
          url: shareUrl,
        })
        .catch((err) => {
          if (err && err.name !== "AbortError") alert("Could not share profile.");
        });
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Profile link copied to clipboard!"))
        .catch(() => alert("Could not copy link."));
    }
  };

 

  // small UI to render different designs — replace with real templates later
  const renderDesignPreview = (profile, designIndex) => {
    // Use designIndex to vary colors/arrangement — simple examples below
    const baseColors = [
      { bg: "bg-white", accent: "text-blue-600" },
      { bg: "bg-gray-50", accent: "text-red-600" },
      { bg: "bg-yellow-50", accent: "text-green-700" },
      { bg: "bg-pink-50", accent: "text-pink-700" },
      { bg: "bg-indigo-50", accent: "text-indigo-700" },
    ];
    const color = baseColors[designIndex % baseColors.length];

    return (
      <div
        ref={previewRef}
        style={{ width: 600, padding: 20 }}
        className={`${color.bg} rounded-2xl border p-4 shadow`}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <img
            src={profile.image ? `${Uploads}${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
            alt="profile"
            style={{ width: 140, height: 180, objectFit: "cover", borderRadius: 12 }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }} className={color.accent}>
              {profile.fullName}
            </h2>
            <p style={{ margin: "6px 0" }}>
              <strong>Marital ID:</strong> {profile.martialId} • <strong>Age:</strong>{" "}
              {calculateAge(profile.dateOfBirth)} yrs
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Education:</strong> {profile.education || "-"}
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Profession:</strong> {profile.occupation || "-"}
            </p>
            <p style={{ margin: "6px 0" }}>
              <strong>Location:</strong> {profile.district}, {profile.state}
            </p>
            <div style={{ marginTop: 8 }}>
              <span style={{ padding: "6px 10px", borderRadius: 999, background: "#fff", fontWeight: 600 }}>
                Design {designIndex + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // UI render
  return (
    <div className="min-h-screen p-4 bg-gray-100 text-gray-800 mb-36">
      <div className="sticky top-0 bg-gray-100 z-10 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <FaArrowLeft className="mr-2 text-gray-600 cursor-pointer" onClick={() => navigate("/dashboard")} />
            Your Own Profiles (Male)
          </h3>
          <h3 className="font-semibold bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded-full shadow-lg">
            {totalCount}
          </h3>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            className="w-full p-4 border border-green-900"
            placeholder="Search by ID or name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute right-3 top-4 w-7 h-9 text-gray-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProfiles.map((profile) => (
            <div
              id={`profile-card-${profile._id}`}
              key={profile._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col transition-transform duration-200 hover:shadow-xl hover:scale-105"
            >
              <div className="flex justify-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  Profile Score: {profile.profileCompletion || 0}%
                </span>
              </div>

              <div className="flex">
                <div className="flex-1">
                  <h1 className="text-lg font-bold mb-4">
                    <div
                      className={`flex items-center w-16 px-2 py-1 rounded-full text-xs ${
                        convertStringToBoolean(profile.visibleToAll) ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {convertStringToBoolean(profile.visibleToAll) ? (
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
                  </h1>
                </div>

                <div className="w-64 ml-4">
                  <div className="flex justify-end mb-4 space-x-2">
                    <button className="bg-gray-200 text-blue-700 px-3 py-2 rounded-md flex items-center text-sm hover:bg-blue-100 transition" title="Switch Profile" onClick={() => alert("Switch action!")}>
                      <FaExchangeAlt className="mr-2" size={16} />
                      <span>Switch</span>
                    </button>
                    <button onClick={() => navigate(`/options/${profile._id}`)} className="bg-purple-500 text-white px-3 py-2 rounded-md flex items-center text-sm">
                      <FaCog size={16} />
                      <span className="ml-2">Manage Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{profile.fullName}</h2>
                <span className="text-sm font-bold">{calculateAge(profile.dateOfBirth)} yrs | {profile.height || "-"}</span>
              </div>

              <div className="flex">
                <div className="flex-1 text-sm">
                  <p className="text-gray-700">Marital ID: {profile.martialId}</p>
                  <p>Caste: {profile.caste} - {profile.subcaste}</p>
                  <p>Degree: {profile.education}</p>
                  <p>Income: ₹ {profile.annualIncome}</p>
                  <p>Profession: {profile.occupation}</p>
                  <p>{profile.district}, {profile.state}, {profile.country}</p>
                </div>
                <img
                  src={profile.image ? `${Uploads}${profile.image}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png"}
                  alt="Profile"
                  className="w-28 h-36 object-fill ml-4 rounded-lg"
                />
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex justify-around items-center mt-4 text-gray-800 space-x-6">
                <a href={`/profile/${profile._id}`} className="text-center">
                  <FaUser className="text-blue-500 mb-1" size={20} />
                  <span className="text-xs">View More</span>
                </a>

                <div className="text-center">
                  <FaEye className="text-green-500 mb-1" size={20} />
                  <span className="text-xs">{profile.views || 0} Views</span>
                </div>

                <button onClick={() => handleShareProfile(profile)} className="text-center cursor-pointer hover:scale-110 transition-transform">
                  <FaShareAlt className="text-purple-500 mb-1" size={20} />
                  <span className="text-xs">Share</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProfile(profile);
                    setSelectedDesign(null); // reset
                    setShowDesignModal(true);
                  }}
                  className="text-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <FaFilePdf className="text-red-500 mb-1" size={20} />
                  <span className="text-xs">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No profiles found.</p>
      )}

      {/* Pagination */}
      {filteredProfiles.length > profilesPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50">
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="py-1 px-3 bg-gray-300 rounded disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {/* ===== Design Selection Modal - ONE instance only ===== */}
      <Dialog open={showDesignModal} onClose={() => setShowDesignModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Choose Your Profile Design</h2>
            <button className="text-gray-600" onClick={() => setShowDesignModal(false)}>✕</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {[...Array(20)].map((_, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-xl p-2 cursor-pointer transition-transform hover:scale-105 ${selectedDesign === idx ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => setSelectedDesign(idx)}
              >
                <img src={`https://via.placeholder.com/200x250?text=Design+${idx + 1}`} alt={`Design ${idx + 1}`} className="w-full h-40 object-cover rounded-md" />
                <p className="text-center mt-2 font-semibold">Design {idx + 1}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="font-semibold mb-2">Preview</h3>
              <div className="border rounded p-3 bg-gray-50">
                {selectedProfile ? (
                  renderDesignPreview(selectedProfile, selectedDesign ?? 0)
                ) : (
                  <p className="text-sm text-gray-600">Select a profile and a design to preview.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Actions</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleDownload("pdf")}
                  disabled={selectedDesign === null || !selectedProfile}
                  className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  <FaFilePdf className="inline mr-2" /> Download PDF
                </button>

                <button
                  onClick={() => handleDownload("image")}
                  disabled={selectedDesign === null || !selectedProfile}
                  className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  <FaImage className="inline mr-2" /> Download Image
                </button>

                <button
                  onClick={() => {
                    setShowDesignModal(false);
                    setSelectedDesign(null);
                    setSelectedProfile(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <p className="text-sm text-gray-500 mt-2">
                  Tip: choose a design thumbnail to enable the Download buttons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
