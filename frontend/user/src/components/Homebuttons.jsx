import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Download, 
  Hand, 
  ThumbsUp, 
  MessageCircle, 
  ThumbsDown,
  MapPin,
  Shield,
  Search
} from 'lucide-react';

const ProfileButtons = ({ user }) => {
  const navigate = useNavigate();
  
  // Navigation handler function
  const handleNavigation = (path, action) => {
    if (action) {
      // For actions like accept/reject, you might want to handle them differently
      console.log(`Performing action: ${action}`);
      // Add your action logic here
      return;
    }
    
    // Use React Router navigation
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const buttons = [
    // Row 1
    [
      {
        text: "My Bureau Preference Matches",
        icon: Users,
        gradient: "from-green-500 to-teal-500",
        hoverGradient: "hover:from-green-600 hover:to-teal-600",
        path: "/my-preferences"
      },
      {
        text: "My Bureau All Matches",
        icon: Users,
        gradient: "from-indigo-500 to-purple-500",
        hoverGradient: "hover:from-indigo-600 hover:to-purple-600",
        path: "/all-matches"
      }
    ],
    [
        {
          text: "Other Bureau Preference Matches",
          icon: Users,
          gradient: "from-green-500 to-teal-500",
          hoverGradient: "hover:from-yellow-600 hover:to-teal-600",
          path: "/my-preferences-others"
        },
        {
          text: "Other Bureau All Matches",
          icon: Users,
          gradient: "from-indigo-500 to-purple-500",
          hoverGradient: "hover:from-indigo-600 hover:to-red-600",
          path: "/all-other-matches"
        }
      ],
    // Row 2 - Advanced Search
    [
      {
        text: "Advanced Search",
        icon: Search,
        gradient: "from-purple-500 to-pink-500",
        hoverGradient: "hover:from-purple-600 hover:to-pink-600",
        path: "/advanced-search"
      },
      {
        text: "Shortlisted Preference",
        icon: Hand,
        gradient: "from-green-400 to-lime-400",
        hoverGradient: "hover:from-green-500 hover:to-lime-500",
        path: "/shortlist"
      }
    ],
    // Row 3
    [
      {
        text: `Profile Privacy (${user?.imagePrivacy || 'all'})`,
        icon: Shield,
        gradient: "from-yellow-400 to-yellow-600",
        hoverGradient: "hover:from-yellow-500 hover:to-yellow-700",
        path: "/settings/privacy"
      },
      {
        text: "Download Your Data",
        icon: Download,
        gradient: "from-blue-400 to-blue-600",
        hoverGradient: "hover:from-blue-500 hover:to-blue-700",
        path: "/download"
      }
    ],
    // Row 4
    [
      {
        text: "Nearby Matches",
        icon: MapPin,
        gradient: "from-purple-400 to-pink-500",
        hoverGradient: "hover:from-purple-500 hover:to-pink-600",
        path: "/matches/nearby"
      },
      {
        text: "Chat Now",
        icon: MessageCircle,
        gradient: "from-pink-400 to-red-500",
        hoverGradient: "hover:from-pink-500 hover:to-red-600",
        path: "/chat"
      }
    ],
    // Row 5
    [
      {
        text: "Sent Interest List",
        icon: ThumbsUp,
        gradient: "from-teal-400 to-green-500",
        hoverGradient: "hover:from-teal-500 hover:to-green-600",
        path: "/interests/sent"
      },
      {
        text: "Accepted Profile",
        icon: ThumbsUp,
        gradient: "from-amber-400 to-orange-500",
        hoverGradient: "hover:from-amber-500 hover:to-orange-600",
        action: "accept_profile"
      }
    ],
    // Row 6
    [
      {
        text: "Rejected Profile",
        icon: ThumbsDown,
        gradient: "from-red-400 to-red-600",
        hoverGradient: "hover:from-red-500 hover:to-red-700",
        action: "reject_profile"
      }
    ]
  ];

  return (
    <div className="flex flex-col items-center">
      {buttons.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-4 mb-4">
          {row.map((button, buttonIndex) => {
            const IconComponent = button.icon;
            return (
              <button
                key={buttonIndex}
                onClick={() => handleNavigation(button.path, button.action)}
                className={`bg-gradient-to-r ${button.gradient} text-white px-6 py-3 rounded-lg shadow-md ${button.hoverGradient} transition duration-300 flex items-center transform hover:scale-105 active:scale-95`}
              >
                <IconComponent className="mr-2 text-2xl" />
                {button.text}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Example usage with mock user data
const App = () => {
  const mockUser = {
    imagePrivacy: 'friends',
    // Add other user properties as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-1 pt-8">
      <div className=" mx-auto">
       
        <ProfileButtons user={mockUser} />
      </div>
    </div>
  );
};

export default App;