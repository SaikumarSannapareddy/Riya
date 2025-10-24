import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import apiClient, { apiEndpoints } from "../components/Apis1"; // Import apiClient and apiEndpoints

const PhotoUploadForm = () => {
  const [images, setImages] = useState(Array(5).fill(null)); // Limit to 5 mini-boxes
  const [selectedImage, setSelectedImage] = useState(null); // Image to be cropped
  const [currentIndex, setCurrentIndex] = useState(null); // Current mini-box index
  const [isCropping, setIsCropping] = useState(false); // State to control whether cropping is active
  const cropperRef = useRef(null);

  // Handle saving the cropped image
  const handleSaveCrop = () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas();

    if (canvas) {
      const croppedImageUrl = canvas.toDataURL("image/jpeg");

      setImages((prev) => {
        const updatedImages = [...prev];
        updatedImages[currentIndex] = croppedImageUrl;
        return updatedImages;
      });
      setSelectedImage(null); // Close the cropper modal after saving
      setIsCropping(false); // Reset cropping state
    }
  };

  // Handle Image Selection
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentIndex(index);

    // Update images array with the uploaded file object
    setImages(prev => {
      const updatedImages = [...prev];
      updatedImages[index] = file;
      return updatedImages;
    });

    // Automatically prompt user to crop the image immediately after uploading
    setIsCropping(true); // Enable cropping after image selection
    setSelectedImage(URL.createObjectURL(file)); // Set selected image for cropping
  };

  // Prevent uploading more than 5 images
  const handleFileInputChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the image limit has been reached
    if (images.filter(img => img !== null).length >= 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    // Update images array with the uploaded file object
    setImages(prev => {
      const updatedImages = [...prev];
      updatedImages[index] = file;
      return updatedImages;
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID is missing!");
        return;
      }
      formData.append("userId", userId);
  
      // Append all images to formData
      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        if (image) {
          // If it's a Data URL (cropped image), convert it to a Blob
          if (typeof image === "string" && image.startsWith("data:image")) {
            const blob = await fetch(image).then((res) => res.blob());
            formData.append("images[]", blob, `image_${index}.jpeg`);
          } else {
            formData.append("images[]", image, `image_${index}.jpeg`);
          }
        }
      }
  
      // Log FormData to check
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const endpoint = `${apiEndpoints.usergallery}/${userId}/gallery`;
      const response = await apiClient.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        alert("Gallery updated successfully!");
        setImages(Array(5).fill(null)); // Reset images after successful upload
      } else {
        alert("Failed to update gallery.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Photos</h2>
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative border rounded w-20 h-20 flex items-center justify-center bg-gray-100"
          >
            {image ? (
              <img
                src={typeof image === "string" ? image : URL.createObjectURL(image)}
                alt={`Box ${index}`}
                className="w-full h-full object-cover cursor-pointer"
                // No longer need to handle image click for cropping here
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleImageUpload(e, index)} // Handle file input change
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
          <Cropper
            src={selectedImage}
            style={{ height: 400, width: "100%" }}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                setSelectedImage(null); // Cancel cropping
                setIsCropping(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSaveCrop} // Save cropped image
            >
              Save Crop
            </button>
          </div>
        </div>
      )}

      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default PhotoUploadForm;
