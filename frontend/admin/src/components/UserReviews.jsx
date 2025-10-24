import React, { useState, useEffect } from "react";
import apiClient, { apiEndpoints, Uploads } from "./Apis";

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    id: null,
    name: "",
    position: "",
    content: "",
    photo: null,
    photoPreview: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(apiEndpoints.Testimonials2);
      setTestimonials(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch testimonials: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTestimonial({ ...currentTestimonial, [name]: value });
  };

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      setCompressingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate aspect ratio
          const aspectRatio = width / height;
          
          // Determine new dimensions while maintaining aspect ratio
          // Start with a reasonable size and adjust quality later if needed
          if (width > 1200) {
            width = 1200;
            height = width / aspectRatio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Start with a high quality and reduce if necessary
          let quality = 0.9;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          let compressedBlob;
          
          // Function to convert base64 to blob
          const dataURLtoBlob = (dataURL) => {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
          };
          
          // Check file size and reduce quality if needed
          const checkSize = () => {
            compressedBlob = dataURLtoBlob(compressedDataUrl);
            const sizeInKB = compressedBlob.size / 1024;
            
            if (sizeInKB > 500 && quality > 0.1) {
              // Reduce quality and try again
              quality -= 0.1;
              compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
              checkSize();
            } else {
              // If it's still too large after reaching minimum quality, reduce dimensions
              if (sizeInKB > 500 && width > 800) {
                width = width * 0.8;
                height = height * 0.8;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                checkSize();
              } else {
                // Create a new File object
                const compressedFile = new File([compressedBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                setCompressingImage(false);
                resolve(compressedFile);
              }
            }
          };
          
          checkSize();
        };
        img.onerror = (error) => {
          setCompressingImage(false);
          reject(error);
        };
      };
      reader.onerror = (error) => {
        setCompressingImage(false);
        reject(error);
      };
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show a preview immediately for better UX
        const tempPreview = URL.createObjectURL(file);
        setCurrentTestimonial({
          ...currentTestimonial,
          photoPreview: tempPreview,
        });
        
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Update with compressed file and create a new preview
        URL.revokeObjectURL(tempPreview);
        setCurrentTestimonial({
          ...currentTestimonial,
          photo: compressedFile,
          photoPreview: URL.createObjectURL(compressedFile),
        });
      } catch (err) {
        setError("Failed to process image: " + err.message);
        // Revert to no image on error
        setCurrentTestimonial({
          ...currentTestimonial,
          photo: null,
          photoPreview: null,
        });
      }
    }
  };

  const resetForm = () => {
    setCurrentTestimonial({
      id: null,
      name: "",
      position: "",
      content: "",
      photo: null,
      photoPreview: null,
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a FormData object to properly handle file uploads
      const formData = new FormData();
      formData.append("name", currentTestimonial.name);
      formData.append("position", currentTestimonial.position);
      formData.append("content", currentTestimonial.content);
      
      // Important: Make sure to append the file with the correct field name
      // This must match what the server expects (i.e., 'photo')
      if (currentTestimonial.photo) {
        formData.append("photo", currentTestimonial.photo);
      }

      // Add the ID if we're editing
      if (isEditing) {
        formData.append("id", currentTestimonial.id);
        
        // Make sure your API endpoint accepts multipart/form-data
        await apiClient.put(apiEndpoints.Testimonialsupdate2, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Same for create endpoint
        await apiClient.post(apiEndpoints.TestimonialAdding2, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      fetchTestimonials();
      resetForm();
    } catch (err) {
      setError(`Failed to ${isEditing ? "update" : "add"} testimonial: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setCurrentTestimonial({
      id: testimonial.id,
      name: testimonial.name,
      position: testimonial.position,
      content: testimonial.content,
      photo: null,
      photoPreview: testimonial.photoUrl ? `${Uploads}/${testimonial.photoUrl}` : null,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.delete(`${apiEndpoints.Testimonialsdelete2}/${id}`);
      fetchTestimonials();
    } catch (err) {
      setError("Failed to delete testimonial: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Reviews Management</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit User Review" : "Add New User Review"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={currentTestimonial.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={currentTestimonial.position}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Testimonial Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="4"
              required
              value={currentTestimonial.content}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-sm"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <div className="flex items-center space-x-4">
              {currentTestimonial.photoPreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={currentTestimonial.photoPreview}
                    alt="Preview"
                    className="object-cover w-full h-full rounded-full ring-2 ring-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={compressingImage}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 focus:outline-none cursor-pointer border border-dashed border-gray-300 rounded-lg py-3 px-4"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG or GIF (will be compressed to max 500KB)
                  {compressingImage && (
                    <span className="ml-2 text-indigo-600">Compressing image...</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            {(isEditing || currentTestimonial.name || currentTestimonial.content) && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || compressingImage}
              className="px-5 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? "Processing..." : compressingImage ? "Compressing Image..." : isEditing ? "Update Testimonial" : "Add Testimonial"}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">All User Reviews</h2>
        
        {loading && !testimonials.length ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No User Reviews found. Add your first one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 relative">
                <div className="flex items-center space-x-4 mb-4">
                  {testimonial.photoUrl ? (
                    <img
                      src={`${Uploads}/${testimonial.photoUrl}`}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex justify-end space-x-2 absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    aria-label="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    aria-label="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;