import React from 'react';

// Password Modal Component
export const PasswordModal = ({ isOpen, password, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md mx-4">
        <h2 className="text-lg font-bold mb-4">Profile Password</h2>
        <div className="bg-gray-100 p-3 rounded border">
          <p className="text-sm font-mono break-all">{password}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Email Modal Component
export const EmailModal = ({ isOpen, email, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md mx-4">
        <h2 className="text-lg font-bold mb-4">Profile Email</h2>
        <div className="bg-gray-100 p-3 rounded border">
          <p className="text-sm break-all">{email}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Generic Modal Component (for future use)
export const GenericModal = ({ 
  isOpen, 
  title, 
  children, 
  onClose, 
  closeButtonText = "Close",
  closeButtonClass = "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md mx-4">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="mb-4">
          {children}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={closeButtonClass}
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Hook for Modal Management
export const useModal = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [currentEmail, setCurrentEmail] = React.useState("");

  const openPasswordModal = (password) => {
    setCurrentPassword(password);
    setIsPasswordModalOpen(true);
  };

  const openEmailModal = (email) => {
    setCurrentEmail(email);
    setIsEmailModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setCurrentEmail("");
  };

  return {
    // Password Modal
    isPasswordModalOpen,
    currentPassword,
    openPasswordModal,
    closePasswordModal,
    
    // Email Modal
    isEmailModalOpen,
    currentEmail,
    openEmailModal,
    closeEmailModal,
  };
};