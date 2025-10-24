import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import apiClient, { apiEndpoints } from "./Apis";

const SocialMediaSection = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(apiEndpoints.getBusinessDetails);
        setSocialLinks({
          facebook: response.data.facebook || "",
          twitter: response.data.twitter || "",
          instagram: response.data.instagram || "",
          linkedin: response.data.linkedin || "",
          youtube: response.data.youtube || ""
        });
      } catch (err) {
        console.error("Error fetching social links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      link: socialLinks.facebook,
      brandColor: "text-blue-600"
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
      link: socialLinks.twitter,
      brandColor: "text-blue-400"
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
      link: socialLinks.instagram,
      brandColor: "text-pink-500"
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
      link: socialLinks.linkedin,
      brandColor: "text-blue-700"
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      link: socialLinks.youtube,
      brandColor: "text-red-600"
    }
  ];

  const hasSocialLinks = Object.values(socialLinks).some(link => link);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading social media links...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasSocialLinks) {
    return null; // Don't show section if no social links
  }

  return (
    <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Follow Our Social Media</h2>
          <p className="text-lg text-gray-600">Stay connected with us for the latest updates and success stories</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {socialPlatforms.map((platform) => {
              if (!platform.link) return null;
              
              const IconComponent = platform.icon;
              
              return (
                <a
                  key={platform.name}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    <div className={`w-16 h-16 ${platform.color} ${platform.hoverColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{platform.name}</h3>
                    <p className="text-sm text-gray-600">Follow us on {platform.name}</p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Join our community and stay updated with the latest matrimony news</p>
            <div className="flex justify-center space-x-4">
              {socialPlatforms.map((platform) => {
                if (!platform.link) return null;
                
                const IconComponent = platform.icon;
                
                return (
                  <a
                    key={`cta-${platform.name}`}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 ${platform.color} ${platform.hoverColor} rounded-full flex items-center justify-center text-white transform hover:scale-110 transition-all duration-300 hover:shadow-lg`}
                    aria-label={`Follow us on ${platform.name}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection; 