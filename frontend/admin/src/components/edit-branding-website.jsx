import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit,
  Image,
  Users,
  Star,
  Video,
  MapPin,
  Phone,
  Share2,
  Building,
  Award,
  BookOpen,
  Settings
} from 'lucide-react';

export default function AdminRedirectButtons() {
  const navigate = useNavigate();

  const adminButtons = [
    { id: 'route', label: 'Edit Name', icon: <Edit size={20} />, path: '/edit-name', color: 'text-blue-600 bg-blue-50' },
    { id: 'logo', label: 'Edit Logo', icon: <Image size={20} />, path: '/edit-logo', color: 'text-purple-600 bg-purple-50' },
    { id: 'slider', label: 'Edit Slider Images', icon: <Image size={20} />, path: '/edit-slider', color: 'text-green-600 bg-green-50' },
    { id: 'success', label: 'Edit Success Story Images', icon: <Image size={20} />, path: '/edit-success-stories', color: 'text-yellow-600 bg-yellow-50' },
    { id: 'contact', label: 'Edit Contact Details', icon: <Phone size={20} />, path: '/edit-contact', color: 'text-red-600 bg-red-50' },
    { id: 'about', label: 'Edit About Us', icon: <BookOpen size={20} />, path: '/edit-about', color: 'text-indigo-600 bg-indigo-50' },
    { id: 'social', label: 'Edit Social Media Pages', icon: <Share2 size={20} />, path: '/edit-social', color: 'text-pink-600 bg-pink-50' },
    { id: 'user-reviews', label: 'Edit & Add User Reviews', icon: <Star size={20} />, path: '/edit-user-reviews', color: 'text-orange-600 bg-orange-50' },
    { id: 'bureau-reviews', label: 'Edit & Add Bureau Reviews', icon: <Award size={20} />, path: '/add-bureau-reviews', color: 'text-teal-600 bg-teal-50' },
    { id: 'distributer-reviews', label: 'Edit & Add Distributer Reviews', icon: <Users size={20} />, path: '/edit-distributer-reviews', color: 'text-cyan-600 bg-cyan-50' },
    { id: 'videos', label: 'Edit Customized Video Links', icon: <Video size={20} />, path: '/edit-videos', color: 'text-emerald-600 bg-emerald-50' },
    { id: 'address', label: 'Edit Office Address', icon: <Building size={20} />, path: '/edit-address', color: 'text-rose-600 bg-rose-50' },
    { id: 'locations', label: 'Add More Locations', icon: <MapPin size={20} />, path: '/add-locations', color: 'text-amber-600 bg-amber-50' },
    { id: 'services', label: 'Manage Services', icon: <Settings size={20} />, path: '/admin-services', color: 'text-violet-600 bg-violet-50' },
  ];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adminButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.path)}
              className="flex items-center p-4 rounded-lg shadow transition-all bg-white hover:bg-gray-50 text-gray-800 hover:shadow-md"
            >
              <div className={`p-2 rounded-full mr-3 ${button.color}`}>
                {button.icon}
              </div>
              <div className="text-left">
                <span className="font-semibold block">{button.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
