import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound'; 
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard' 
import CreateDistributer from './pages/CreateDistributer'// Optional: Add a NotFound component for 404 pages
import ManageDistributer from './pages/Managedis'
import Editwebsite from './pages/Edit_website';
import Welcomebanner from './pages/Welcomebanner';
import EditSocialMediaPages from './components/EditSocialMediaPages';
import Sliderimages from './pages/Sliderimages';
import Success from './pages/Success';
import ProfilePage from './components/ProfilePage';
import User_Register from './pages/User_Register';
import User_Register_OtherMediator from './pages/User_Register_OtherMediator';
import Step2 from './pages/Step2'
import Step2Edit from './pages/Step2Edit'
import Step3 from './pages/Step3'
import Step3Edit from './pages/Step3Edit'
import Step4 from './pages/Step4'
import Step4Edit from './pages/Step4Edit'
import Step5 from './pages/Step5';
import Step5Edit from './pages/Step5Edit'
import Step6 from './pages/Step6'
import Step6Edit from './pages/Step6Edit'
import Step7 from './pages/Step7'
import Step7Edit from './pages/Step7Edit'
import Step8 from './pages/Step8'
import Step8Edit from './pages/Step8Edit'
import Step9 from './pages/Step9'
import Step9Edit from './pages/Step9Edit'
import Step10 from './pages/Step10'
import Step10Edit from './pages/Step10Edit'
import Maleprofile from './pages/Maleprofiles'
import Femaleprofile from './pages/Femaleprofiles'
import Profile from './pages/profile'
import Webmale from './pages/webmale'
import Webfemale from './pages/webfemale'
import Profile_view from './pages/profile_view'
import Profile_webview from './pages/profile_webview'
import We_all from './pages/weballprofiles'
import EditPassword from './pages/Edit_password'
import Otherallprofiles from './pages/otherallprofiles'
import OtherFemaleprofile from './pages/otherfemaleprofiles'
import Othermaleprofile from './pages/othermaleprofiles'
import SearchMartialID from './pages/Searchbyid';
import ThankYou from './pages/Thankyou';
import Edit from './pages/Edit'
import Webotherall from './pages/webotherallprofiles'
import Webothermale from './pages/webothermale'
import Webotherfemale from './pages/webotherfemale'
import Quicksearch from './pages/quick_search'
import Quicksearch2 from './pages/quick_search2'
import SearchResult from './pages/search-resultpage'
import SearchResult2 from './pages/search-resultpage2'
import Step1 from './pages/step1web'
import UserImage from './pages/user_image'
import Step1Edit from './pages/Step1Edit'
import Pendingmale from './pages/PendingMale'
import Pendingfemale from './pages/PendingFemale'
import EditButtons from './components/EditButtons'
import EditYourServices from './components/EditYourServices';
import EditYourLocations from './components/EditYourLocations';
import EditYourImage from './components/EditYourImage';
import TermsAndConditions from './components/TermsAndConditions';
import TestimonialsManagement from './components/TestimonialsManagement';
import CustomizedLinksManagement from './components/CustomizedLinksManagement';
import PackagesManagement from './components/PackagesManagement';
import BureauPrivacy from './pages/Bureauprivacy';
import Shortlist from './pages/Shortlist';
import ProfileHistory from './pages/profileHistory';
import SendIntest from './pages/Sendinterest';
import Mynotifications from './pages/Mynotifications'
import ProfileOptionsPage from './components/Options';
import InterestsManagement from './pages/InterestsManagement';
import MyInterestsManagement from './pages/MyInterestsManagement';
import SearchPage from './pages/SearchPage';
import AdvancedSearch from './pages/AdvancedSearch';
import AdvancedSearchResults from './pages/AdvancedSearchResults';
import EncodingTest from './components/EncodingTest';
import UserRegisterEdit from './pages/User_RegisterEdit';
import NavbarLogo from './pages/NavbarLogo';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HowToUse from './pages/HowToUse';
import CommunityGuidelines from './pages/CommunityGuidelines';
import MaleProfileSlides from './components/MaleProfileSlides';
import Membership from './pages/Membership';
import FemaleProfileSlides from './pages/FemaleProfileSlides';
import MyProfiles from './pages/MyProfiles';
import EditProfile from './pages/EditBureau';
import BrandScore from './pages/BrandScore';
import SuperAndminProfiles from './pages/SuperAdminProfiles';
import SuperAdminFemaleProfiles from './pages/SuperAdminFemaleProfiles';
import OtherBureauProfileView from './components/OtherBureauProfileView';
import SessionHandler from './components/SessionHandler';

const App = () => {
  return (
    <BrowserRouter>
            <SessionHandler>

      <Routes>
        {/* Define your routes */}
        <Route path="/:id/:pageName" element={<Home />} />
        <Route path="/:id/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/quick-search" element={<Quicksearch />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/quick-search2" element={<Quicksearch2 />} />
        <Route path="/search-results" element={<SearchResult />} />
        <Route path="/search-results2" element={<SearchResult2 />} />
        <Route path="/advanced-search-results" element={<AdvancedSearchResults />} />
        <Route path="/thankyou/:id" element={<ThankYou />} />
        <Route path="/edit-buttons" element={<EditButtons />} />
        <Route path="/edit-service" element={<EditYourServices />} />
        <Route path="/edit-location" element={<EditYourLocations />} />
        <Route path="/edit-profile" element={<EditYourImage/>} />
        <Route path="/edit-profile-image" element={<EditYourImage />} />
        <Route path="/terms-conditions" element={<TermsAndConditions/>} />
        <Route path="/testimonials-management" element={<TestimonialsManagement/>} />
        <Route path="/customized-links-management" element={<CustomizedLinksManagement/>} />
        <Route path="/packages-management" element={<PackagesManagement/>} />
        <Route path="/encoding-test" element={<EncodingTest/>} />

        <Route path="/search-by-id" element={<SearchMartialID />} />

        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-website" element={<Editwebsite />} />
        <Route path="/" element={<Welcomebanner />} />
        <Route path='/edit-social-media-links' element={<EditSocialMediaPages/>}/>
        <Route path="/distributors/create" element={<CreateDistributer />} />
        <Route path="/distributors/manage" element={<ManageDistributer />} />
        <Route path='/sliderimages' element={<Sliderimages />} />
        <Route path='/success-stories' element={<Success />} />
        <Route path='/my-profiles/:id/:name' element={<ProfilePage />} />
        <Route path='/web-all-profiles/:id/:name' element={<We_all />} />
        <Route path='/male-profiles/:id/:gender' element={<Maleprofile />} /> 
        <Route path='/web-male-profiles/:id/:gender' element={<Webmale />} />
        <Route path='/female-profiles/:id/:name' element={<Femaleprofile />} />
        <Route path='/other-male-profiles/:id/:name' element={<Othermaleprofile />} />

        <Route path='/pending-male-profiles/:id/:gender' element={<Pendingmale />} />
        <Route path='/pending-female-profiles/:id/:gender' element={<Pendingfemale />} />

        <Route path='/other-female-profiles/:id/:name' element={<OtherFemaleprofile />} />
        <Route path='/web-female-profiles/:id/:gender' element={<Webfemale />} />
        <Route path='/other-profiles/:id/:name' element={<Otherallprofiles />} />
      
        <Route path="/edit-password" element={<EditPassword />} />
        <Route path="/edit-profile/:id" element={<Edit />} />
        
        <Route path='/web-other-all-profiles/:id/:name' element={<Webotherall />} />
        <Route path='/web-other-female-profiles/:id/:gender' element={<Webotherfemale />} />
        <Route path='/web-other-male-profiles/:id/:gender' element={<Webothermale />} />

      
        <Route path="/user-image" element={<UserImage />} />
        <Route path="/step_1_edit/:id" element={<Step1Edit />} />

        <Route path="/add-profile" element={<User_Register />} />
        <Route path="/add-othermediator-profile" element={<User_Register_OtherMediator />} />
        <Route path="/user-register/:id" element={<Step1 />} />
        <Route path="/user-register-other-mediator/:id" element={<User_Register_OtherMediator />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step_2_edit/:id" element={<Step2Edit />} />
        <Route path="/step3" element={<Step3 />} />
        <Route path="/step_3_edit/:id" element={<Step3Edit />} />
        <Route path="/step4" element={<Step4 />} />
        <Route path="/step_4_edit/:id" element={<Step4Edit />} />
        <Route path="/step5" element={<Step5 />} />
        <Route path="/step_5_edit/:id" element={<Step5Edit />} />
        <Route path="/step6" element={<Step6  />} />
        <Route path="/step_6_edit/:id" element={<Step6Edit />} />
        <Route path="/step7" element={<Step7  />} />
        <Route path="/step_7_edit/:id" element={<Step7Edit />} />
        <Route path="/step8" element={<Step8  />} />
        <Route path="/step_8_edit/:id" element={<Step8Edit />} />
        <Route path="/step9" element={<Step9  />} />
        <Route path="/step_9_edit/:id" element={<Step9Edit />} />
        <Route path="/step10" element={<Step10  />} />
        <Route path="/step_10_edit/:id" element={<Step10Edit />} />
        <Route path="/send-interest" element={<SendIntest  />} />
        <Route path="/my-notifications" element={<Mynotifications  />} />
        <Route path="/interests-management" element={<InterestsManagement />} />
        <Route path="/my-interests-management" element={<MyInterestsManagement />} />
        <Route path="/options/:profileId" element={<ProfileOptionsPage />} />
        {/* Optional: 404 Route */}
        <Route path="*" element={<NotFound />} />

        <Route path="/profile/:id" element={<Profile />} />
        <Route path="OtherBureauProfileView" element={<Profile_view />} />
        <Route path="/profile_webview/:id" element={<Profile_webview />} />

          <Route path="/bureau-privacy" element={<BureauPrivacy />} />
          <Route path="/shortlist-profiles" element={<Shortlist />} />
          <Route path="/profile-history/:id" element={<ProfileHistory />} />

        <Route path="/user-register-edit/:userId" element={<UserRegisterEdit />} />
        <Route path="/navbar-logo" element={<NavbarLogo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/profileslides" element={<MaleProfileSlides/>}/>
        <Route path='/membership' element={<Membership/>}/>
        <Route path='/femaleprofileslides' element={<FemaleProfileSlides/>}/>
        <Route path='/myprofiles' element={<MyProfiles/>}/>
        <Route path='/editprofile' element={<EditProfile/>}/> 
        <Route path='/brandscore' element={<BrandScore/>}/>
        <Route path='/superadmin/profiles/:gender' element={<SuperAndminProfiles/>}/>
        <Route path='/superadmin/profiles/:gender' element={<SuperAdminFemaleProfiles/>}/>
        <Route path='/other_bureau_profile/:id' element={<OtherBureauProfileView/>}/>



      </Routes>
              </SessionHandler>
    </BrowserRouter>

  );
};

export default App;
