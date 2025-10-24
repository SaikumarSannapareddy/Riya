import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import BottomNavbar from "./components/BottomNavbar";
import Navbar from "./components/Navbar";
// import Search from "./Pages/Search";
// import SearchById from "./pages/SearchById";
// import SearchByBasic from "./pages/SearchByBasic";
// import SearchByFull from "./pages/SearchByFull";
import Home from './pages/Home';
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Allmatches from './pages/AllMatches';
import MyProfile from './pages/MyProfile';
import Mypreferences from './pages/Mypreferences';
import AllOtherbureaumatches from './pages/Allotherbureaumatches';
import Mypreferencesothers from './pages/Mypreferencesothers';
import Download from './pages/Download';
import Shortlist from './pages/Shortlist';
import AdvancedSearch from './pages/AdvancedSearch';
import AdvancedSearchResults from './pages/AdvancedSearchResults';
import ChatScreen from './pages/ChatScreen';
import UpperMiddleClass from './pages/UpperMiddleClass';
import IASIPSProfiles from './pages/IASIPSProfiles';
import OnlineServices from './pages/OnlineServices';
import ShortlistedByOthers from './pages/ShortlistedByOthers';
import InterestMatches from './pages/InterestMatches';
import ChatHistory from './pages/ChatHistory';
import EditProfile from './pages/EditProfile';
import EditProfilePicture from './pages/EditProfilePicture';
import EditPersonalDetails from './pages/EditPersonalDetails';
import EditReligionCaste from './pages/EditReligionCaste';
import EditEducationDetails from './pages/EditEducationDetails';
import EditFamilyDetails from './pages/EditFamilyDetails';
import EditPropertyDetails from './pages/EditPropertyDetails';
import EditAgricultureFlat from './pages/EditAgricultureFlat';
import EditLocationDetails from './pages/EditLocationDetails';
import EditPartnerPreferences from './pages/EditPartnerPreferences';
import EditGallery from './pages/EditGallery';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="relative min-h-screen bg-gray-50">
      {!isLoginPage && <Navbar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/all-matches" element={<Allmatches />} />
          <Route path="/my-preferences" element={<Mypreferences />} />
          <Route path="/download" element={<Download />} />
          <Route path='/shortlist' element={<Shortlist />} />
          <Route path="/my-preferences-others" element={<Mypreferencesothers />} />
          <Route path="/all-other-matches" element={<AllOtherbureaumatches />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/advanced-search-results" element={<AdvancedSearchResults />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/chat-history" element={<ChatHistory />} />
          <Route path="/upper-middle-class" element={<UpperMiddleClass />} />
          <Route path="/ias-ips" element={<IASIPSProfiles />} />
          <Route path="/online-services" element={<OnlineServices />} />
          <Route path="/shortlisted-by-others" element={<ShortlistedByOthers />} />
          <Route path="/interest-matches" element={<InterestMatches />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-profile-picture" element={<EditProfilePicture />} />
          <Route path="/edit-personal-details" element={<EditPersonalDetails />} />
          <Route path="/edit-religion-caste" element={<EditReligionCaste />} />
          <Route path="/edit-education-details" element={<EditEducationDetails />} />
          <Route path="/edit-family-details" element={<EditFamilyDetails />} />
          <Route path="/edit-property-details" element={<EditPropertyDetails />} />
          <Route path="/edit-agriculture-flat" element={<EditAgricultureFlat />} />
          <Route path="/edit-location-details" element={<EditLocationDetails />} />
          <Route path="/edit-partner-preferences" element={<EditPartnerPreferences />} />
          <Route path="/edit-gallery" element={<EditGallery />} />

          {/* Add other routes as needed */}
        </Routes>
       
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
