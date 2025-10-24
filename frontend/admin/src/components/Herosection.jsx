import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from "./Apis";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaMapPin, FaHome, FaWhatsapp } from 'react-icons/fa';

const HeroSection = () => {
    const [bname, setBname] = useState("");
    const [about, setAbout] = useState("");
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bemail, setBemail] = useState("");
    const [bnumber, setBnumber] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [houseno, setHouseno] = useState("");
    const [sliderImages, setSliderImages] = useState([]);
    const [successImages, setSuccessImages] = useState([]);
    const [twitter, setTwitter] = useState("");
    const [youtube, setYoutube] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    
    // Slider states
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Separate intervals for each slider
    const slideInterval = useRef(null);
    
    // Touch references
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        fetchBusinessDetails();
    }, []);

    // Auto-slide effect for main slider
    useEffect(() => {
        if (sliderImages.length > 1) {
            startSlideTimer();
        }
        
        return () => {
            if (slideInterval.current) {
                clearInterval(slideInterval.current);
            }
        };
    }, [sliderImages, currentSlide]);

    // Timer functions for main slider
    const startSlideTimer = () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
        }
        
        slideInterval.current = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === sliderImages.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000); // Change slide every 5 seconds
    };

    const restartTimer = () => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
            startSlideTimer();
        }
    };

    // Navigation for main slider
    const goToSlide = (index) => {
        setCurrentSlide(index);
        restartTimer();
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === 0 ? sliderImages.length - 1 : prevSlide - 1
        );
        restartTimer();
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === sliderImages.length - 1 ? 0 : prevSlide + 1
        );
        restartTimer();
    };

    // Touch events for main slider
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const difference = touchStartX.current - touchEndX.current;
        
        // If swipe distance is significant (more than 50px)
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                // Swipe left to go next
                goToNextSlide();
            } else {
                // Swipe right to go previous
                goToPrevSlide();
            }
        }
    };

    const fetchBusinessDetails = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(apiEndpoints.getBusinessDetails);
            setBname(response.data.bname);
            setAbout(response.data.about);
            setAddress(response.data.address);
            setPincode(response.data.pincode);
            setHouseno(response.data.houseno);
            setBemail(response.data.bemail);
            setBnumber(response.data.bnumber);
            setTwitter(response.data.twitter);
            setYoutube(response.data.youtube);
            setInstagram(response.data.instagram);
            setFacebook(response.data.facebook);
            
            // Set logo if available
            if (response.data.logo) {
                setLogo(response.data.logo);
            }
            
            if (response.data.sliderImages) {
                setSliderImages(response.data.sliderImages);
            }
            
            if (response.data.successImages) {
                setSuccessImages(response.data.successImages);
            }
            
            setError(null);
        } catch (err) {
            console.error("Error fetching business details:", err);
            setError("Failed to fetch business details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
               <section className="bg-white">
                <div className="container mx-auto">
                    {/* Main Slider Gallery */}
                    {sliderImages.length > 0 && (
                        <div className="w-full mt-1">
                            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Slider Gallery</h3>
                            
                            <div 
                                className="relative w-full overflow-hidden rounded-lg shadow-xl"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Single Image Display */}
                                <div className="relative w-full h-64 md:h-96">
                                    {sliderImages.map((image, index) => (
                                        <div 
                                            key={image.id || index} 
                                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                                                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                            }`}
                                        >
                                            <img 
                                                src={`${Uploads}/${image.path}`}
                                                alt={`Slider Image ${index + 1}`}
                                                className="w-full h-full object-fill"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                <button 
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-r focus:outline-none transition-all z-20"
                                    onClick={goToPrevSlide}
                                    aria-label="Previous slide"
                                >
                                    <FaChevronLeft size={24} />
                                </button>
                                
                                <button 
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-l focus:outline-none transition-all z-20"
                                    onClick={goToNextSlide}
                                    aria-label="Next slide"
                                >
                                    <FaChevronRight size={24} />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                                    {sliderImages.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`w-3 h-3 rounded-full focus:outline-none transition-all ${
                                                currentSlide === index ? "bg-white" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                                            }`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-green-400 to-yellow-500 text-white mt-16">
                <div className="container mx-auto p-8 md:flex items-center justify-between">
                    {/* Left Side (Heading, Paragraph, Login Button) */}
                    <div className="w-full md:w-1/2 space-y-4 animate__animated animate__fadeIn animate__delay-0.5s">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to {bname}
                        </h1>
                        <p className="text-lg">
                            Join the best matrimonial platform to find your perfect match. We
                            are here to help you connect with people who share similar values.
                        </p>

                        {/* Login Button */}
                        <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg mt-4 transform transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                            Login
                        </button>
                    </div>

                    {/* Right Side (Image) */}
                    <div className="w-1/2 hidden md:block animate__animated animate__fadeIn animate__delay-1s">
                        <img
                            src={`${Uploads}/${logo}`}
                            alt="Hero Image"
                            className="w-full h-auto object-cover rounded-xl shadow-lg"
                        />
                    </div>
                </div>

              
            </section>

            {/* Floating App Download Section - Only One Floating */}
            <div className="fixed top-1/2 right-4 z-50 animate-bounce transform -translate-y-1/2">
                <a 
                    href="https://play.google.com/store/apps/details?id=com.matrimonystudio.heeltech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg shadow-2xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">GET IT ON</p>
                            <p className="text-sm font-semibold text-gray-800">Google Play</p>
                        </div>
                    </div>
                </a>
            </div>

            {/* Create Bureau Section */}
            <section className="bg-gray-50 py-16" id="create-bureau">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Do you want to start a new matrimony business?</h2>
                        <p className="text-lg text-gray-600 mb-8">Create your own matrimony bureau and start helping people find their perfect match.</p>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
                        <a 
                            href="/create-bureau"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block"
                        >
                            Create Matrimony Bureau
                        </a>
                    </div>
                </div>
            </section>

            {/* App Download Section 1 - Between Create Bureau and About Us */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Download Our Marriage Bureau App</h3>
                        <p className="text-gray-600 mb-8">Get the best matrimony experience on your mobile device</p>
                        <a 
                            href="https://play.google.com/store/apps/details?id=com.matrimonystudio.heeltech" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-xs opacity-90">Download Our</p>
                                <p className="text-lg font-bold">Marriage Bureau App</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Cards Section - Above About Us */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
                        <p className="text-lg text-gray-600">Get in touch with us for the best matrimony services</p>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* WhatsApp Card */}
                            {bnumber && (
                                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaWhatsapp className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Chat on WhatsApp</h3>
                                        <p className="text-gray-600 mb-6">Get instant support and answers to your queries</p>
                                        <a
                                            href={`https://wa.me/${bnumber.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 group"
                                        >
                                            <FaWhatsapp className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                                            <span className="font-semibold text-lg">Chat on WhatsApp</span>
                                            <div className="ml-auto">
                                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Call Card */}
                            {bnumber && (
                                <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FaPhone className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Call Support</h3>
                                        <p className="text-gray-600 mb-6">Speak directly with our matrimony experts</p>
                                        <a
                                            href={`tel:${bnumber}`}
                                            className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 group"
                                        >
                                            <FaPhone className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                                            <span className="font-semibold text-lg">Call Now</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Contact Info */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Email Card */}
                            {bemail && (
                                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaEnvelope className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Email Us</h4>
                                    <a 
                                        href={`mailto:${bemail}`}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        {bemail}
                                    </a>
                                </div>
                            )}

                            {/* Address Card */}
                            {address && (
                                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaMapMarkerAlt className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Visit Us</h4>
                                    <p className="text-gray-600 text-sm">
                                        {address}
                                        {pincode && `, ${pincode}`}
                                    </p>
                                </div>
                            )}

                            {/* Business Hours Card */}
                            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaHome className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">Business Hours</h4>
                                <p className="text-gray-600 text-sm">
                                    Mon - Sat: 9:00 AM - 8:00 PM<br />
                                    Sunday: 10:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="bg-white py-4" id="about-us">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto mb-16">
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Loading about information...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : (
                            <div className="text-gray-700 leading-relaxed text-lg animate__animated animate__fadeIn">
                                {about ? (
                                    <div dangerouslySetInnerHTML={{ __html: about }} />
                                ) : (
                                    <p>No information available at the moment. Please check back later.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Slider Gallery Section */}
     

            {/* Contact Section */}
            <section className="bg-gray-100 py-16" id="contact-us">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
                        {bnumber && (
    <div className="flex justify-center">
        <div className="bg-purple-600 text-white rounded-lg px-2 py-3 shadow-lg max-w-sm w-full">
            <div className="flex items-center justify-center text-center">
                <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    <FaPhone className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm opacity-80 mb-1">Call Now</p>
                    <a 
                        href={`tel:${bnumber}`} 
                        className="text-lg font-medium hover:underline block"
                    >
                        {bnumber}
                    </a>
                </div>
            </div>
        </div>
    </div>
)}
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
                        
                    </div>

                   
                </div>
            </section>

            {/* App Download Section 2 - Between Contact Us and Success Stories */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Get Our Mobile App</h3>
                        <p className="text-gray-600 mb-8">Experience the best matrimony services on the go</p>
                        <a 
                            href="https://play.google.com/store/apps/details?id=com.matrimonystudio.heeltech" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-3 bg-white text-gray-800 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-500"
                        >
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05,20.28C16.07,21.23 15,21.08 13.97,20.63C12.88,20.17 11.88,20.15 10.73,20.63C9.29,21.25 8.53,21.07 7.66,20.28C2.86,15.25 3.27,7.6 9.28,7.31C10.46,7.39 11.34,8.05 12.13,8.11C13.31,7.95 14.35,7.12 15.72,7.19C17.1,7.27 18.29,7.88 19.08,9C20.18,10.72 19.96,14.28 22.23,16.32C21.54,17.27 20.68,18.2 19.83,19.11C19.39,18.87 18.81,18.67 18.47,19.11C18.12,19.55 18.6,20.28 17.05,20.28Z"/>
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-500">Download</p>
                                <p className="text-lg font-semibold">Marriage Bureau App</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="bg-white py-12" id="success-stories">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Success Stories Gallery */}
                    {successImages.length > 0 && (
                        <div className="w-full">
                            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Success Stories</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                {successImages.map((image, index) => (
                                    <div 
                                        key={image.id || index} 
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                                    >
                                        <img 
                                            src={`${Uploads}/${image.path}`}
                                            alt={`Success Story ${index + 1}`}
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                console.error('Image failed to load:', e.target.src);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default HeroSection;