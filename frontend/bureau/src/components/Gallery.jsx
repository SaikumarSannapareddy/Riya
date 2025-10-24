import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import apiClient, { apiEndpoints, Banner } from "./Apis";

const Gallery = () => {
  const { id } = useParams();
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
    const bureauId = localStorage.getItem('bureauId');

  

  useEffect(() => {
    const fetchBannerImages = async () => {  
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${apiEndpoints.Galleryimagesfetch}/${bureauId}`
        );
        if (response.data && response.data.data) {
          setBannerImages(response.data.data);
        } else {
          setBannerImages([]);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setBannerImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBannerImages();
    }
  }, [id]);

  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Success Stories</h2>
      {bannerImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bannerImages.map((image, index) => (
            <div
              key={image.id || index}
              className="overflow-hidden rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
              onClick={() => openModal(image)}
            >
              <img
                src={`${Banner}${image.imageUrl}`}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-auto object-cover max-h-96 sm:max-h-[400px] md:max-h-[500px] rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images found</p>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
            <img
              src={`${Banner}${selectedImage.imageUrl}`}
              alt="Enlarged Gallery"
              className="w-auto max-w-full max-h-screen rounded-lg shadow-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;