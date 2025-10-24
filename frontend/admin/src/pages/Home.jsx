import React from 'react'
import Navbar from '../components/Navbar'
import Herosection from '../components/Herosection'
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import ReviewsCarousel from '../components/Reviews'
import PackageDisplay from '../components/Packagesview'
import SocialMediaSection from '../components/SocialMediaSection'
import Services from '../components/Services'
import OfficeLocations from '../components/OfficeLocations'
import Videos from '../components/Videos'

const Home = () => {
  return (
   <>
   <Navbar />
   <Herosection />
  
   {/* Create Matrimony App Section */}
   <div id="create-app" className="bg-gray-50 py-16">
     <div className="container mx-auto px-4 md:px-8">
       <div className="text-center mb-12">
         <h2 className="text-4xl font-bold text-gray-800 mb-4">Create Your Matrimony App</h2>
         <p className="text-lg text-gray-600">Build your own matrimony platform with our advanced technology</p>
         <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
       </div>
       <div className="max-w-4xl mx-auto text-center">
         <p className="text-gray-600 mb-8">
           Start your own matrimony business with our comprehensive app development services. 
           We provide complete solutions including backend, frontend, and mobile applications.
         </p>
         <a 
           href="/create-bureau"
           className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
         >
           Get Started Today
         </a>
       </div>
     </div>
   </div>

   {/* Download Matrimony App Section */}
   <div id="download-app" className="bg-white py-16">
     <div className="container mx-auto px-4 md:px-8">
       <div className="text-center mb-12">
         <h2 className="text-4xl font-bold text-gray-800 mb-4">Download Our Matrimony App</h2>
         <p className="text-lg text-gray-600">Get the best matrimony experience on your mobile device</p>
         <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
       </div>
       <div className="max-w-4xl mx-auto text-center">
         <p className="text-gray-600 mb-8">
           Download our mobile app for the best matrimony experience. 
           Available on both Android and iOS platforms.
         </p>
         <a 
           href="https://play.google.com/store/apps/details?id=com.matrimonystudio.heeltech"
           target="_blank"
           rel="noopener noreferrer"
           className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
         >
           Download Now
         </a>
       </div>
     </div>
   </div>

   <div id="user-reviews">
     <ReviewsCarousel />
   </div>
   <Videos />
   <div id="services">
     <Services />
   </div>
   <div id="social-media">
     <SocialMediaSection />
   </div>
   <div id="packages">
     <PackageDisplay />
   </div>
   <div id="contact-us">
     <OfficeLocations />
   </div>
   <div id="about-us">
     <Cards />
   </div>
   <Footer />
   </>
  )
}

export default Home
