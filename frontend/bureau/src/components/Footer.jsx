import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import apiClient, { apiEndpoints } from './Apis'; 
import { MdLocationOn } from 'react-icons/md';

const Footer = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [userId, setUserId] = useState(id);
  const [bureauName, setBureauName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobile] = useState("");
  const [about, setAbout] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const fetchBureauDetails = async () => {
    try {
      if (userId) {
        const response = await apiClient.get(`${apiEndpoints.bureaudetails}?bureauId=${userId}`);
        const data = response.data.bureauProfiles;

        if (data && data.length > 0) {
          const bureauData = data[0];
          setBureauName(bureauData.bureauName); 
          setEmail(bureauData.email);
          setMobile(bureauData.mobileNumber);
          setAbout(bureauData.about);
          setLocation(bureauData.location);
          setFacebookUrl(bureauData.facebook || "");
          setTwitterUrl(bureauData.twitter || "");
          setInstagramUrl(bureauData.instagram || "");
          setLinkedinUrl(bureauData.linkedin || "");
          setYoutubeUrl(bureauData.youtube || "");
        }
      } else {
        console.error('No Bureau ID found');
      }
    } catch (error) {
      console.error('Error fetching bureau details:', error);
    }
  };

  useEffect(() => {
    fetchBureauDetails();
    // Fetch profile image (same as Gnavbar)
    const fetchProfileImage = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.profiles, {
          headers: { bureauId: userId },
        });
        if (response.data.profile_img) {
          setProfileImage(`data:image/jpeg;base64,${response.data.profile_img}`);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        setProfileImage(null);
      }
    };
    if (userId) fetchProfileImage();
  }, [userId]);

  return (
    <>
<div className="px-10 py-5 w-full md:w-full text-center md:text-left">
        {/* Profile Image Section */}
      
        <h2 className="text-2xl font-bold mb-4 text-center">About Us</h2>
        <p className="text-gray-900 text-center">
          {about}
        </p>
      </div>
      <section className="bg-gray-100 py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h2>
    <p className="text-center text-lg text-gray-600 mb-8">
      We're here to assist you. Feel free to reach out to us!
    </p>
    <div className="flex flex-col items-center gap-4">
      {/* Email */}
      <div className="flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 12l-4-4m0 0l-4 4m4-4v8m-2-2h6a2 2 0 01-2 2m-8-2a2 2 0 100 4h8a2 2 0 100-4H6z"
          />
        </svg>
        <a href="#" className="text-lg font-medium hover:text-blue-600">
          {email}
        </a>
      </div>

      {/* Mobile Number */}
      <div className="flex items-center gap-2 text-gray-700">
  <button
    onClick={() => window.location.href = `tel:${mobileNumber}`}
    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM15 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM15 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
    Call {mobileNumber}
  </button>
</div>


       {/* Location */}
       <div className="flex items-center gap-2 text-gray-700">
       <MdLocationOn className="text-red-600" size={24} />
        <a href="#" className="text-lg font-medium hover:text-green-600">
          {location}
        </a>
      </div>
    </div>
  </div>
</section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Links Section */}
           

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-sm">Email: {email}</p>
              <p className="text-sm">Phone: {mobileNumber}</p>
              <p className="text-sm">Address: {location}</p>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={24} className="hover:text-yellow-500 transition-colors" />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={24} className="hover:text-yellow-500 transition-colors" />
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={24} className="hover:text-yellow-500 transition-colors" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={24} className="hover:text-yellow-500 transition-colors" />
                  </a>
                )}
                {youtubeUrl && (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={24} className="hover:text-yellow-500 transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {bureauName}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Bottom Fixed Bar for Profile, WhatsApp, and Share */}
      {profileImage && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 flex items-center justify-center py-3 px-4 gap-4">
          {/* Share Button - remains unchanged */}
          <button
            onClick={async () => {
              const shareData = {
                title: document.title,
                text: 'Join Millions of Happy Families, Simple.Secure Genuine Matches',
                url: window.location.href,
              };
              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  // User cancelled or error
                }
              } else {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  alert('URL copied to clipboard!');
                } catch (err) {
                  alert('Could not copy URL');
                }
              }
            }}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            title="Share this page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 6l-4-4-4 4m4-4v16" /></svg>
            Share Website
          </button>
          
          {/* Enhanced Chat Button with Profile Picture on Right */}
          <a
            href={`https://wa.me/${mobileNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 overflow-hidden"
            title="Chat on WhatsApp"
          >
            {/* Chat text and icon on the left */}
            <div className="flex items-center px-6 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.72 13.06a6.5 6.5 0 10-2.72 2.72l2.13.62a1 1 0 001.26-1.26l-.62-2.13z" /><path d="M8.29 11.71a1 1 0 001.42 0l.29-.29a1 1 0 011.42 0l.29.29a1 1 0 001.42 0" /></svg>
              Chat
            </div>
            
            {/* Profile Image on the right - circular with border */}
            <div className="flex items-center justify-center w-12 h-12 mr-2">
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
          </a>
        </div>
      )}
    </>
  );
};

export default Footer;
