import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translations
const resources = {
  en: {
    translation: {
      home: "Home",
      myProfile: "My Profile",
      editBureauPrivacy : "Edit Bureau Privacy",
      settings:"Settings",
      mynotifications: "My Notifications",
      membership: "Membership Details",
      languages: "Languages",
      english: "English",
      telugu: "Telugu",
      // termsandconditions:"Terms And Conditions",
      communityguidenlines:"Follow Community Guidelines & Terms",
      editpassword:"Edit Password",
      editbureauprivacy:"Edit Bureau Privacy",
      // editwebsite:"Edit Website",
      howtouse:"How to Use",
      updateprofilepic:"Update Profile Picture",
      editbusinesswebsite:"Edit Your Customer Website",
      sharecustomerwebsite:"Share Your Customer Website",
      sharedigitalvisitingcard:"Share Digital Visiting Card",
      sharebusinesswebsiteqr:"Share Business Website QR",
      logout:"Logout",
      brandvaluescore:"Your Brand Value Score",
      completeprofiles:"Complete Profiles",
      profiles:"profiles",
      crossed:"crossed",
      data:"data",
      completeness:"completeness",
      profileStatus:"Profile Status",
      active:"Active",
      inactive:"Inactive",
      businessprofileincomplete:"Your business profile is incomplete!",
      businessprofileincompletemessage:"Please complete your profile to get better response for your business.",
      ownmaleprofiles:"Your Own Profiles( Male )",
      profile:"Profiles",
      ownfemaleprofiles:"Your Own Profiles( Female )",
      malepending:"Male Pending Profiles",
      femalepending:"Female Pending Profiles",
      otherbureaumale:"Other Bureau Male Profiles",
      otherbureaufemale:"Other Bureau Female Profiles",
      shortlist:"Shortlisted Profiles",
      viewall:"View All",
      notifications:"Notifications",
      businessaccountpending:"Your Account is Pending",
      accountpending:"Your Account is Pending",
      search:"Search",
      addprofile:"Add Profile",
      searchid:"Search By ID",
      shareurl:"Share URL",
      sharewebsite:"Share Website",
      sharewhatsapp:"Share via Whatsapp",
      sharefacebook:"Share on Facebook",
      copylink:"Copy Link",
      close:"Close"

    },
  },
 te: {
  translation: {
    home: "హోమ్",
    myProfile: "నా ప్రొఫైల్",
    editBureauPrivacy: "బ్యూరో ప్రైవసీ సవరించండి",
    settings: "సెట్టింగ్స్",
    mynotifications: "నా నోటిఫికేషన్స్",
    membership: "మెంబర్‌షిప్ ప్లాన్",
    languages: "భాషలు",
    english: "ఇంగ్లీష్",
    telugu: "తెలుగు",
    termsandconditions: "నియమాలు మరియు షరతులు",
    communityguidenlines: "కమ్యూనిటీ మార్గదర్శకాలు & నియమాలు పాటించండి",
    editpassword: "పాస్వర్డ్ సవరించండి",
    editbureauprivacy: "బ్యూరో ప్రైవసీ సవరించండి",
    editwebsite: "వెబ్‌సైట్ సవరించండి",
    howtouse: "వినియోగించే విధానం",
    updateprofilepic: "ప్రొఫైల్ ఫోటోని అప్డేట్ చేయండి",
    editbusinesswebsite: "మీ వ్యాపార వెబ్‌సైట్ సవరించండి",
    sharecustomerwebsite: "మీ కస్టమర్ వెబ్‌సైట్‌ను షేర్ చేయండి",
    sharedigitalvisitingcard: "డిజిటల్ విజిటింగ్ కార్డ్‌ను షేర్ చేయండి",
    sharebusinesswebsiteqr: "బిజినెస్ వెబ్‌సైట్ QR షేర్ చేయండి",
    logout: "లాగ్ అవుట్",
    brandvaluescore: "మీ బ్రాండ్ విలువ స్కోరు",
    completeprofiles: "పూర్తి ప్రొఫైల్‌లు",
    profiles: "ప్రొఫైల్‌లు",
    crossed: "మీకొంచెం అధిగమించబడింది",
    data: "డేటా",
    completeness: "పూర్తి స్థాయి",
    profileStatus: "ప్రొఫైల్ స్థితి",
    active: "యాక్టివ్",
    inactive: "నిష్క్రియ",
    businessprofileincomplete: "మీ వ్యాపార ప్రొఫైల్ పూర్తి కాలేదు!",
    businessprofileincompletemessage: "దయచేసి మీ ప్రొఫైల్ పూర్తి చేయండి.",
    ownmaleprofiles: "మీ స్వంత ప్రొఫైల్‌లు (పురుషులు)",
    profile: "ప్రొఫైల్‌లు",
    ownfemaleprofiles: "మీ స్వంత ప్రొఫైల్‌లు (మహిళలు)",
    malepending: "పెండింగ్ పురుషుల ప్రొఫైల్‌లు",
    femalepending: "పెండింగ్ మహిళల ప్రొఫైల్‌లు",
    otherbureaumale: "ఇతర బ్యూరో పురుషుల ప్రొఫైల్‌లు",
    otherbureaufemale: "ఇతర బ్యూరో మహిళల ప్రొఫైల్‌లు",
    shortlist: "షార్ట్‌లిస్ట్ చేయబడిన ప్రొఫైల్‌లు",
    viewall: "అన్నీ వీక్షించండి",
    notifications: "నోటిఫికేషన్స్",
    businessaccountpending: "మీ వ్యాపార ఖాతా పెండింగ్‌లో ఉంది. దయచేసి మీ ఖాతాను పూర్తి చేయండి",
    accountpending: "మీ ఖాతా పెండింగ్‌లో ఉంది",
    search: "శోధించండి",
    addprofile: "ప్రొఫైల్ జోడించండి",
    searchid: "ID ద్వారా శోధించండి",
    shareurl: "URL పంచుకోండి",
    sharewebsite: "వెబ్‌సైట్ పంచుకోండి",
    sharewhatsapp: "వాట్సాప్ ద్వారా పంచుకోండి",
    sharefacebook: "ఫేస్‌బుక్‌లో పంచుకోండి",
    copylink: "లింక్ కాపీ చేయండి",
    close: "మూసివేయండి",
    businessaccountpending: "మీ వ్యాపార ఖాతా పెండింగ్‌లో ఉంది. దయచేసి మీ ఖాతాను పూర్తి చేయండి",
    accountpending: "మీ ఖాతా పెండింగ్‌లో ఉంది"




  
  },
},

};
const savedLanguage = localStorage.getItem("language") || "en";


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // 👈 Use saved language here
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  window.addEventListener("storage", () => {
  const lang = localStorage.getItem("language") || "en";
  i18n.changeLanguage(lang);
});

export default i18n;
