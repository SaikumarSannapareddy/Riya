import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaMapPin, FaHome, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from "./Apis";

const Footer = () => {
  // State variables for business details
  const [bname, setBname] = useState("");
  const [about, setAbout] = useState("");
  const [logo, setLogo] = useState(null);
  const [bemail, setBemail] = useState("");
  const [bnumber, setBnumber] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [houseno, setHouseno] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState(""); // Add if you have this field
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchBusinessDetails();
    // Fetch bureau profile image (as in edit-profile-image)
    const bureauId = localStorage.getItem('bureauId');
    const fetchProfileImage = async () => {
      try {
        const response = await apiClient.get(apiEndpoints.profiles, {
          headers: { bureauId },
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
    fetchProfileImage();
  }, []);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      
      setBname(response.data.bname || "");
      setAbout(response.data.about || "");
      setAddress(response.data.address || "");
      setPincode(response.data.pincode || "");
      setHouseno(response.data.houseno || "");
      setBemail(response.data.bemail || "");
      setBnumber(response.data.bnumber || "");
      setTwitter(response.data.twitter || "");
      setYoutube(response.data.youtube || "");
      setInstagram(response.data.instagram || "");
      setFacebook(response.data.facebook || "");
      setLinkedin(response.data.linkedin || ""); // Add if available in API
      
      // Set logo if available
      if (response.data.logo) {
        setLogo(response.data.logo);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching business details for footer:", err);
      setError("Failed to fetch business details.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to strip HTML tags from about text for footer
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Get truncated about text for footer (first 150 characters)
  const getTruncatedAbout = () => {
    const plainText = stripHtmlTags(about);
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
  };

  if (loading) {
    return (
      <>
        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center justify-around px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="text-sm text-gray-500">Loading...</div>
            </div>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Footer with bottom padding for fixed nav */}
        <footer className="bg-gray-800 text-white py-8 pb-24">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <p className="text-sm">Loading footer information...</p>
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <>
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={profileImage || (logo ? `${Uploads}/${logo}` : "https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png")} 
                alt={`${bname} Profile`}
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-800">{bname || "Matrimony Bureau"}</div>
              <div className="text-xs text-gray-500">Professional Matchmaking</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* WhatsApp Button */}
            {bnumber && (
              <a
                href={`https://wa.me/${bnumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            )}

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: bname || 'Check this out!',
                    text: about ? about.substring(0, 100) : '',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
              title="Share this page"
            >
              <FaShareAlt className="w-5 h-5" />
            </button>

            {/* Call Button */}
            {bnumber && (
              <a
                href={`tel:${bnumber}`}
                className="flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
                title="Call us"
              >
                <FaPhone className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer with bottom padding for fixed nav */}
      <footer className="bg-gray-800 text-white py-8 pb-24">
        <div className="container mx-auto px-6">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Us Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">About Us</h3>
              <div className="bg-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-300 leading-relaxed">{getTruncatedAbout()}</p>
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="flex items-center text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-300 group">
                    <FaHome className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about-us" className="flex items-center text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-300 group">
                    <FaHome className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="flex items-center text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-300 group">
                    <FaHome className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    Services
                  </a>
                </li>
                <li>
                  <a href="#success-stories" className="flex items-center text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-300 group">
                    <FaHome className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#contact-us" className="flex items-center text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-300 group">
                    <FaHome className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Contact Us</h3>
              <div className="space-y-4">
                {bemail && (
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    <FaEnvelope className="w-5 h-5 mr-3 text-yellow-400" />
                    <a href={`mailto:${bemail}`} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                      {bemail}
                    </a>
                  </div>
                )}
                
                {bnumber && (
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    <FaPhone className="w-5 h-5 mr-3 text-yellow-400" />
                    <a href={`tel:${bnumber}`} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                      {bnumber}
                    </a>
                  </div>
                )}
                
                {(address || pincode || houseno) && (
                  <div className="flex items-start p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    <FaMapMarkerAlt className="w-5 h-5 mr-3 mt-1 text-yellow-400" />
                    <div className="text-sm text-gray-300">
                      {houseno && <span>{houseno}, </span>}
                      {address && <span>{address}</span>}
                      {pincode && (
                        <div className="flex items-center mt-1">
                          <FaMapPin className="w-3 h-3 mr-1" />
                          <span>{pincode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400 text-center">Follow Us</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 group">
                  <FaFacebook size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="ml-3 text-sm text-gray-300">Facebook</span>
                </a>
              )}
              
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 group">
                  <FaTwitter size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="ml-3 text-sm text-gray-300">Twitter</span>
                </a>
              )}
              
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 group">
                  <FaInstagram size={24} className="text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="ml-3 text-sm text-gray-300">Instagram</span>
                </a>
              )}
              
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 group">
                  <FaLinkedin size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="ml-3 text-sm text-gray-300">LinkedIn</span>
                </a>
              )}
              
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300 group">
                  <FaYoutube size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="ml-3 text-sm text-gray-300">YouTube</span>
                </a>
              )}
            </div>
            
            {/* Show fallback message if no social links */}
            {!facebook && !twitter && !instagram && !linkedin && !youtube && (
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Connect with us on social media</p>
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-300">
                &copy; {new Date().getFullYear()} {bname || "Matrimony"}. All Rights Reserved.
              </p>
              
              {/* Additional links */}
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="/privacy-policy" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 text-center">
                <p className="text-xs text-red-400">Some information may not be available</p>
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;