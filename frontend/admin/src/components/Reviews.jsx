import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaQuoteRight, FaTimes, FaStar } from 'react-icons/fa';
import apiClient, { apiEndpoints, Uploads } from "./Apis";

const ReviewSection = ({ title, endpoint, bgColor = "bg-gray-50" }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(endpoint);
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch reviews: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [endpoint]);

  // Get the first review to display initially
  const firstReview = reviews.length > 0 ? reviews[0] : null;

  // Modal component for all reviews
  const ReviewsModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
              <p className="text-gray-600 mt-1">{reviews.length} reviews available</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body - Scrollable Reviews */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No reviews found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                  <div 
                    key={review.id || index} 
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-300">
                        <img 
                          src={`${Uploads}/${review.photoUrl}`}
                          alt={`${review.name}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-bold text-gray-800">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.position}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`w-4 h-4 ${i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <FaQuoteLeft className="text-blue-200 mb-2" />
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.content}
                      </p>
                      <FaQuoteRight className="text-blue-200 ml-auto mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={`${bgColor} py-16`}>
      <div className="container mx-auto p-2">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews found.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Show first review */}
            {firstReview && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-2">
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-300">
                    <img 
                      src={`${Uploads}/${firstReview.photoUrl}`}
                      alt={`${firstReview.name}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{firstReview.name}</h3>
                    <p className="text-sm text-gray-600">{firstReview.position}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`w-5 h-5 ${i < (firstReview.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <FaQuoteLeft className="text-blue-200 mb-3 text-2xl" />
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    {firstReview.content}
                  </p>
                  <FaQuoteRight className="text-blue-200 ml-auto text-2xl" />
                </div>
              </div>
            )}

            {/* See More Reviews Button */}
            {reviews.length > 1 && (
              <div className="text-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span>See More Reviews</span>
                  <span className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {reviews.length - 1} more
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ReviewsModal />
    </section>
  );
};

const ReviewsPage = () => {
  return (
    <>
      {/* User Reviews Section */}
      <ReviewSection 
        title="User Reviews" 
        endpoint={apiEndpoints.Testimonials2}
        bgColor="bg-gray-50"
      />
      
      {/* Bureau Reviews Section */}
      <ReviewSection 
        title="Bureau Reviews" 
        endpoint={apiEndpoints.Testimonials}
        bgColor="bg-white"
      />
      
      {/* Distributer Reviews Section */}
      <ReviewSection 
        title="Distributer Reviews" 
        endpoint={apiEndpoints.Testimonials1}
        bgColor="bg-gray-50"
      />
    </>
  );
};

export default ReviewsPage;