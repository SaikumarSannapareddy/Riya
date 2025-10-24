import React, { useState, useEffect } from "react";
import { 
  FaImage,
  FaSpinner,
  FaWhatsapp
} from "react-icons/fa";
import apiClient, { apiEndpoints, Uploads } from './Apis';

const PackageDisplay = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessLoading, setBusinessLoading] = useState(true);

  // Fetch business details for WhatsApp integration
  const fetchBusinessDetails = async () => {
    try {
      setBusinessLoading(true);
      const response = await apiClient.get(apiEndpoints.getBusinessDetails);
      setBusinessPhone(response.data.bnumber || "");
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setBusinessLoading(false);
    }
  };

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(apiEndpoints.packageBanners);
      console.log('All banners:', response.data);
      // Filter to show only active banners
      const activeBanners = (response.data || []).filter(banner => banner.status === 'active');
      console.log('Active banners:', activeBanners);
      setBanners(activeBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchBusinessDetails();
  }, []);

  // Handle Pay Now button click
  const handlePayNow = () => {
    if (businessPhone) {
      const phoneNumber = businessPhone.replace(/[^0-9]/g, '');
      const message = "Hi! I'm interested in your matrimony packages. Can you please provide more details about pricing and payment options?";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Contact information not available. Please try again later.');
    }
  };

  const LoadingCard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Packages</h2>
          <p className="text-lg text-gray-600">Discover our matrimony business solutions</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {/* Banners Grid */}
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            // Loading cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Package Banners Available</h3>
              <p className="text-gray-500">Check back later for our latest package offerings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {banners.map((banner, index) => (
                <div 
                  key={banner.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={`${Uploads}/${banner.image_path}`}
                      alt="Banner"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Package {index + 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-center">
                      <button 
                        onClick={handlePayNow}
                        disabled={businessLoading || !businessPhone}
                        className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg group"
                      >
                        <FaWhatsapp className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                        <span>Pay Now</span>
                        {businessLoading && <FaSpinner className="w-4 h-4 ml-2 animate-spin" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {banners.length > 0 && (
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8">Choose the perfect package for your matrimony business needs</p>
            <button 
              onClick={handlePayNow}
              disabled={businessLoading || !businessPhone}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
            >
              <FaWhatsapp className="w-5 h-5 mr-3" />
              Contact Us Today
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDisplay;