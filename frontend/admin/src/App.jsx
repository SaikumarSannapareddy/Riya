import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound'; 
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard' 
import CreateDistributer from './pages/CreateDistributer'// Optional: Add a NotFound component for 404 pages
import ManageDistributer from './pages/Managedis'
import ManageBureau from './pages/Managebureau'
import FreeBureaus from './pages/FreeBureaus'
import PaidBureaus from './pages/PaidBureaus'
import UserDistributor from './pages/UserDistributor';
import Female from './pages/female';
import Male from './pages/male'
import Profile from './pages/profile'
import Maleprofile from './pages/Maleprofiles'
import Femaleprofile from './pages/Femaleprofiles'
import CasteManagement from './pages/Settingscaste';
import Subcaste from './pages/Settingssubcaste' 
import SettingsEducation from './pages/SettingsEducation'
import Occupation from './pages/SettingsOccupation'
import Country from './pages/SettingsCountry'
import State from './pages/SettingsState'
import City from './pages/SettingsCity'
import Star from './pages/Settingsstar'
import ProfilesDashboard from './components/ProfilesDashboard';
import ReportedProf from './components/ReportedProf';
import SuspendedProfiles from './components/SuspendedProf';
import DeletedProfiles from './components/DeletedProf';
import IncompleteProfiles from './components/IncompleteProfile';
import TodayProfiles from './components/TodaysProfiles';
import TotalProfiles from './components/TotalProfiles';
import BureauDashboard from './components/BureauDashboard';
import BureauReviews from './pages/BureauReviews';
import UserReviews from './pages/Userreview';
import Distributerreviews from './pages/Distributerreviews';
import Editwebsite from './pages/Edit-branding-website';

import Editname from './pages/Editname';
import Editlogo from './pages/Editlogo';
import Editslider from './pages/Editsliderimages';
import Editsucess from './pages/Editsucess';
import Editabout from './pages/Editabout';
import Editcontact from './pages/EditContact';
import Editsocial from './pages/EditSocialmedia';
import Editaddress from './pages/Editaddress';
import Editvideolinks from './pages/Editvideolinks';
import EditLocation from './pages/EditLocations';

import Distributor from './components/DistributerDashboard';
import Package from './components/Packages'
import ChatMessages from './pages/ChatMessages';
import ManageVideosPage from './pages/ManageVideosPage';
import CreateBureauForm from './components/CreateBureauForm';
import AdminServices from './pages/AdminServices';
import RecentBureaus from './pages/RecentBureaus';
import SuspendedBureaus from './pages/SuspendedBureaus';
import DeletedBureaus from './pages/DeletedBureaus';
import ExpiredBureaus from './pages/ExpiredBureaus';
import EditBureauTerms from './pages/EditBureauTerms';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-branding-website" element={<Editwebsite />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/profiles-dashboard" element={<ProfilesDashboard />} />
        <Route path="/bureau-dashboard" element={<BureauDashboard />} />
        <Route path="/distributors/create" element={<CreateDistributer />} />
        <Route path="/distributors/manage" element={<ManageDistributer />} />
        <Route path="/bureau/manage" element={<ManageBureau />} />
        <Route path="/bureaus/free" element={<FreeBureaus />} />
        <Route path="/bureaus/recent" element={<RecentBureaus />} />
        <Route path="/bureaus/suspended" element={<SuspendedBureaus />} />
        <Route path="/bureaus/deleted" element={<DeletedBureaus />} />
        <Route path="/bureaus/expired" element={<ExpiredBureaus />} />
        <Route path="/bureaus/paid" element={<PaidBureaus />} />
        <Route path="/edit-bureau-terms" element={<EditBureauTerms />} />
        <Route path="/user/male-profiles" element={<Male />} /> 
        <Route path="/user/female-profiles" element={<Female />} />
        <Route path="/userdistributors/create" element={<UserDistributor />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path='/male-profiles/:id/:gender' element={<Maleprofile />} />
        <Route path='/female-profiles/:id/:name' element={<Femaleprofile />} />
        <Route path="/profiles/reported" element={<ReportedProf />} />
        <Route path="/profiles/all" element={<TotalProfiles />} />
        <Route path="/profiles/suspended" element={<SuspendedProfiles />} />
        <Route path="/profiles/deleted" element={<DeletedProfiles />} />
        <Route path="/profiles/incomplete" element={<IncompleteProfiles />} />
        <Route path="/profiles/today" element={<TodayProfiles />} />
        <Route path='/settings/cast' element={<CasteManagement />} />
        <Route path='/settings/sub-caste' element={<Subcaste />} />
        <Route path='/settings/education' element={<SettingsEducation />} />
        <Route path='/settings/occupation' element={<Occupation />} />
        <Route path='/settings/country' element={<Country />} />
        <Route path='/settings/state' element={<State />} />
        <Route path='/settings/city' element={<City />} />
        <Route path='/settings/star' element={<Star />} />
        <Route path='/add-bureau-reviews' element={<BureauReviews />} />
        <Route path='/edit-user-reviews' element={<UserReviews />} />
        <Route path='/edit-distributer-reviews' element={<Distributerreviews />} />

        {/* Editing */}
        <Route path="/edit-name" element={<Editname />} />
        <Route path="/edit-logo" element={<Editlogo />} />
        <Route path="/edit-slider" element={<Editslider />} />
        <Route path="/edit-success-stories" element={<Editsucess />} />
        <Route path="/edit-about" element={<Editabout />} />
        <Route path="/edit-contact" element={<Editcontact />} />
        <Route path="/edit-social" element={<Editsocial />} />
        <Route path="/edit-videos" element={<Editvideolinks />} />
        <Route path="/manage-videos" element={<ManageVideosPage />} />
        <Route path="/edit-address" element={<Editaddress />} />
        <Route path="/add-locations" element={<EditLocation />} />

        <Route path="/distributer-dashboard" element={<Distributor />} />
        <Route path="/packages" element={<Package />} />
        <Route path="/admin/chat-messages" element={<ChatMessages />} />
        <Route path="/create-bureau" element={<CreateBureauForm />} />
        <Route path="/admin-services" element={<AdminServices />} />
        {/* Optional: 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
