import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import apiClient, { apiEndpoints } from "../components/Apis1";
import Loader from "../components/Loader";

const Step10Edit = () => {
  const [images, setImages] = useState(Array(5).fill(null));
  const [existingImages, setExistingImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const cropperRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 800;
          const maxHeight = 800;

          let width = img.width;
          let height = img.height;

          if (width > height && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob.size / 1024 > maxSizeKB) {
                console.warn("Image compression failed to reach target size.");
              }
              resolve(blob);
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  const handleSaveCrop = async () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas();

    if (canvas) {
      const croppedBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      const compressedBlob = await compressImage(croppedBlob);

      setImages((prev) => {
        const updatedImages = [...prev];
        updatedImages[currentIndex] = compressedBlob;
        return updatedImages;
      });
      setSelectedImage(null);
      setIsCropping(false);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentIndex(index);

    const compressedFile = await compressImage(file);

    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = compressedFile;
      return updatedImages;
    });

    setIsCropping(true);
    setSelectedImage(URL.createObjectURL(compressedFile));
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = null;
      return updatedImages;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (!id) {
        alert("User ID is missing!");
        return;
      }
      formData.append("userId", id);

      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        if (image) {
          formData.append("images[]", image, `image_${index}.jpeg`);
        }
      }

      const endpoint = `${apiEndpoints.usergallery}/${id}/gallery`;
      const response = await apiClient.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Gallery updated successfully!");
        navigate(-1); // Go back to previous page
      } else {
        alert("Failed to update gallery.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    const confirmBack = window.confirm("Are you sure you want to go back?");
    if (confirmBack) {
      navigate(-1);
    }
  };

  // Fetch existing gallery data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setIsLoadingData(true);
        const response = await apiClient.get(`${apiEndpoints.user}/${id}`);
        
        if (response.data && response.data.gallery) {
          setExistingImages(response.data.gallery);
          
          // Initialize images array with existing gallery images
          const galleryImages = response.data.gallery || [];
          const initialImages = Array(5).fill(null);
          
          galleryImages.forEach((imageUrl, index) => {
            if (index < 5) {
              initialImages[index] = imageUrl;
            }
          });
          
          setImages(initialImages);
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (id) {
      fetchGalleryData();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoadingData) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full z-50 bg-red-600 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">
            Edit Gallery -
          </h1>
        </div>
        <h5 className="font-semibold text-white">Update Images</h5>
      </div>

      <div className="max-w-4xl mx-auto p-6 mt-20">
        {isLoading && <Loader />}
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Gallery Images</h2>
        <p className="text-gray-600 text-center mb-6">
          You can upload up to 5 images. Click on an image to replace it or click the + to add a new one.
        </p>
        
        <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative border rounded w-20 h-20 flex items-center justify-center bg-gray-100"
            >
              {image ? (
                <>
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                  <span className="text-gray-500 text-sm">+</span>
                </>
              )}
            </div>
          ))}
        </div>

        {isCropping && selectedImage && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Crop Your Photo</h3>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
              onClick={handleSaveCrop}
            >
              Save Crop
            </button>
            <Cropper
              src={selectedImage}
              style={{ height: 400, width: "100%" }}
              aspectRatio={1}
              guides={true}
              ref={cropperRef}
            />
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex-1"
            onClick={handleBackClick}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Gallery"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Step10Edit; 