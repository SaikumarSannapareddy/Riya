import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient2, { apiEndpoints2 } from '../components/Apismongo';

const EditGallery = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [files, setFiles] = useState([null, null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null, null]);
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    apiClient2.get(apiEndpoints2.userData, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (res.data?.success && res.data.user) setUserId(res.data.user._id); });
  }, []);

  const onPick = (idx) => inputRefs[idx].current?.click();
  const onFile = (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const nextFiles = [...files];
    const nextPrev = [...previews];
    nextFiles[idx] = file;
    nextPrev[idx] = URL.createObjectURL(file);
    setFiles(nextFiles);
    setPreviews(nextPrev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const form = new FormData();
    files.filter(Boolean).forEach(f => form.append('images[]', f));
    try {
      setSubmitting(true);
      await apiClient2.put(`upload/${userId}/gallery`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Gallery updated successfully');
      navigate(-1);
    } catch (err) {
      alert('Failed to update gallery');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full z-50 bg-gradient-to-r from-green-400 to-blue-500 fixed top-0 mb-12 p-2 px-3 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <button className="flex items-center" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-center text-white py-3">Edit Gallery - Update Images</h1>
        </div>
      </div>

      <div className="flex justify-center items-center pt-20 pb-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-2">Edit Gallery Images</h2>
          <p className="text-center text-gray-500 mb-6">You can upload up to 5 images. Click on a square or the + to add a new one.</p>

          <form onSubmit={onSubmit}>
            {/* Top row: 4 squares */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[0,1,2,3].map((idx) => (
                <div key={idx} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => onPick(idx)}>
                  {previews[idx] ? (
                    <img src={previews[idx]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl sm:text-2xl text-gray-300">+</span>
                  )}
                  <input ref={inputRefs[idx]} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(idx, e)} />
                </div>
              ))}
            </div>

            {/* Bottom row: 1 left-aligned square */}
            <div className="flex justify-start mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => onPick(4)}>
                {previews[4] ? (
                  <img src={previews[4]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl sm:text-2xl text-gray-300">+</span>
                )}
                <input ref={inputRefs[4]} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(4, e)} />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-400 text-white py-2 rounded">Cancel</button>
              <button type="submit" disabled={submitting || !userId} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50">{submitting ? 'Updating...' : 'Update Gallery'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditGallery; 