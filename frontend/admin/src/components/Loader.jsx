import React from 'react';
import './loader.css'
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loader;
