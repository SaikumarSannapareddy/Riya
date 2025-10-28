const mongoose = require("mongoose");
const { Schema } = mongoose;


// Define the merged User schema with LocationDetails schema fields added
const userSchema = new Schema(
  {
      
    // General User Information
    gender: { type: String, required: false },
    createdBy: { type: String, required: false },
    activeStatus: { type: Boolean, default: false },
    paymentStatus: { type: String, required: false },
    image: { type: String, required: false }, // Assuming image URL will be stored as a string
    imagePrivacy: { type: String, required: false },
    countryCode: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    deletereason: { type: String, required: false },
    suspendreason: { type: String, required: false },
    email: { type: String, required: false, default: null, unique: false },
    gallery: { type: [String], default: [] }, // Array of image paths
    
    password: { type: String, required: false },
    bureauId: { type: String, required: false },
    martialId: { type: String, required: false },
    profileStatus: { type: String, required: false },
    servicePreference: { type: String, required: false },
    visibleToAll: { type: String, required: false, default:"true" },
    showOtherProfiles: { type: String, required: false, default:"true" },

    step1: { type: String, required: false },
    step2: { type: String, required: false },
    step3: { type: String, required: false },
    step4: { type: String, required: false },
    step5: { type: String, required: false },
    step6: { type: String, required: false },
    step7: { type: String, required: false },
    step8: { type: String, required: false },
    step9: { type: String, required: false },

    // Personal Details Information
    fullName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    time: { type: String, required: false }, // Assuming time is stored as a string (HH:MM)
    maritalStatus: {
      type: String,
      enum: ["neverMarried", "awaitingDivorce", "divorced", "widow"],
      required: false,
    },
    maleKids: { type: Number, min: 0, max: 10, default: 0, required: false },
    femaleKids: { type: Number, min: 0, max: 10, default: 0, required: false },
    hasRelatives: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    height: { type: String, required: false }, // Storing height as a string (e.g., '5.5')
    weight: { type: Number, min: 30, max: 200, required: false },
    physicalState: {
      type: String,
   
      required: false,
    },
    eatingHabits: {
      type: String,
      required: false,
    },
    smokingHabits: {
      type: String,
      enum: ["yes", "no", "occasionally"],
      required: false,
    },
    drinkingHabits: {
      type: String,
      enum: ["yes", "no", "occasionally"],
      required: false,
    },

    // Form Details (Education and Employment Information)
    education: { type: String, required: false },
    employmentStatus: { type: String, required: false },
    occupation: { type: String, required: false },
    annualIncome: { type: String, required: false },
    jobLocation: { type: String, required: false },
    otherBusiness: {
      type: String,
      required: false,
      default: "null",
    },
    businessLocation: { type: [String], required: false },
    otherBusinessIncome: { type: String, required: false },
    extraTalentedSkills: { type: [String], required: false },

    // Form Details (Cultural & Religious Information)
    religion: {
      type: String,
      required: false,
    },
    motherTongue: {
      type: String,
  
      required: false,
    },
    languagesKnown: {
      type: [String], 
 
      required: false,
    },
    caste: {
      type: String,
      required: false,
    },
    subcaste: {
      type: String,
      required: false,
    },
    gotram: {
      type: String,
      required: false,
    },
    raasi: {
      type: String,
      required: false,
    },
    star: {
      type: String,
      required: false,
    },

    fatherEmployee: {
      type: String,
   
      required: false,
    },
    fatherOccupied: {
      type: String,
      
    },
    motherEmployee: {
      type: String,
    
      required: false,
    },
    motherOccupied: {
      type: String,
    
    },
    totalBrothers: {
      type: Number,
      min: 0,
      max: 10,
      required: false,
    },
    youngerBrothers: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalBrothers;
        },
        message: "Younger brothers cannot exceed total brothers.",
      },
    },
    elderBrothers: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalBrothers;
        },
        message: "Elder brothers cannot exceed total brothers.",
      },
    },
    marriedBrothers: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalBrothers;
        },
        message: "Married brothers cannot exceed total brothers.",
      },
    },
    totalSisters: {
      type: Number,
      min: 0,
      max: 10,
      required: false,
    },
    youngerSisters: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalSisters;
        },
        message: "Younger sisters cannot exceed total sisters.",
      },
    },
    elderSisters: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalSisters;
        },
        message: "Elder sisters cannot exceed total sisters.",
      },
    },
    marriedSisters: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalSisters;
        },
        message: "Married sisters cannot exceed total sisters.",
      },
    },
    familyValue: {
      type: String,
      enum: ["orthodox", "traditional", "moderate", "liberal", "add_another"],
      required: false,
    },
    familyType: {
      type: String,
      enum: ["joint", "nuclear"],
      required: false,
    },
    familyStatus: {
      type: String,
      enum: ["poor_family", "middle_class", "upper_middle_class", "rich_family", "ias_family", "ips_family"],
      required: false,
    },
    originalLocation: {
      type: String,
      required: false,
    },
    selectedLocation: {
      type: String,
      required: false,
    },

    // Family Property Details (from your earlier schema)
    houseType: { type: String, required: false },
    houseSqFeet: { type: Number, required: false },
    status: { type: String, required: false, default: 0 },
    houseValue: { type: Number, required: false },
    monthlyRent: { type: Number, required: false },
    houseLocation: { type: [String], required: false },
    openPlots: { type: String, required: false },
    openPlotsSqFeet: { type: Number, required: false },
    openPlotsValue: { type: Number, required: false },
    openPlotsLocation: { type: [String], required: false },
    numberOfHouses: { type: String, required: false },

    commercialshops: { type: String, required: false },
    shopssqyards: { type: String, required: false },

    // Apartment/Flat Details (added fields from the first schema)
    numberOfFlats: { type: String, required: false },
    flatType: { type: String, required: false },
    flatValue: { type: Number, required: false },
    flatLocation: { type: [String], required: false },
    agricultureLand: { type: String, required: false },
    agricultureLandValue: { type: Number, required: false },
    agricultureLandLocation: { type: [String], required: false },
    anyMoreProperties: { type: String, required: false },
    totalPropertiesValue: { type: Number, required: false },
    propertyNames: { type: String, required: false },

    // Location Details (Country, State, District, Citizenship)
    country: { type: String, required: false },
    state: { type: String, required: false },
    district: { type: String, required: false },
    citizenship: { type: String, required: false },

    partnerServicePreference: { type: [String], required: false }, // Now an array of strings
    partnerCreatedBy: { type: [String], required: false }, // Now an array of strings
    religionPreferences: { type: [String], required: false },
    castePreferences: { type: [String], required: false },
    subCastePreferences: { type: [String], required: false },
    maritalStatusPreferences: { type: [String], required: false },
    childrenPreferences: { type: [String], required: false },
    motherTonguePreferences: { type: [String], required: false },
    agePreferences : { type: [String], required: false },
    partnerEducationPreferences: { type: [String], required: false },
    partnerOccupationPreferences: { type: [String], required: false },
    partnerJobLocationPreferences: { type: [String], required: false },
    partnerAnnualIncome: { type: [String], required: false },
    familyPreferences: { type: [String], required: false },
    settledLocationPreferences : { type: [String], required: false },
    ownHousePreferences : { type: [String], required: false },
    squareYardPreferences : { type: [String], required: false },
    monthlyRentPreferences : { type: [String], required: false },
    plotPreference : { type: [String], required: false },
    flatPreference : { type: [String], required: false },
    ownLocationPreferences : { type: [String], required: false },
  agricultureLandPreference : { type: [String], required: false },
    totalPropertyValuePreference : { type: [String], required: false },
    countryLocationPreferences : { type: [String], required: false },
    stateLocationPreferences :{ type: [String], required: false },
    cityLocationPreferences : { type: [String], required: false },
    citizenshipPreferences : { type: [String], required: false },

    profileCompletion: { type: Number, default: 0 },


    // Don't show again functionality - array of bureau IDs
    dontshowagain: { type: [String], default: [] },

    // Custom words from Step10
    customWords: { type: [String], default: [] },

    // Profile views counter
    views: { type: Number, default: 0, min: 0 },

  },
  { timestamps: true }
);
 
// Create the User model with the merged schema
const User = mongoose.model("User", userSchema);

module.exports = User;
