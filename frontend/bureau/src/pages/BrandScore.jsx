import React, { useEffect, useState } from "react";
import apiClient, { apiEndpoints } from "../components/Apis1";
import { useTranslation } from "react-i18next";


const BrandScore = () => {
    const { t } = useTranslation();
  const [mongoScore, setMongoScore] = useState(0);
  const [completeProfiles, setCompleteProfiles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoadingScore, setIsLoadingScore] = useState(true);

  const bureauId = localStorage.getItem("bureauId");

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoadingScore(true);
      try {
        const response = await apiClient.get(
          `${apiEndpoints.completedProfiles}/${bureauId}`
        ); 


        if (response.data && response.data.counters) {
          const complete = response.data.counters.completeProfiles || 0;
          const total = response.data.counters.totalUsers || complete;

          // ✅ ensure minimum 0.1% if score is between 0 and 1
         // ✅ Each 80–100% profile adds 0.1% to score
        let score = complete * 0.1;

        // ✅ Cap at 100%
        if (score > 100) score = 100;

        // ✅ If some progress, but less than 0.1, round it to show 0.1%
        if (score > 0 && score < 0.1) {
          score = 0.1;
        }
 
          setCompleteProfiles(complete);
          setTotalUsers(total);
          setMongoScore(score.toFixed(1)); // show one decimal place
        }
      } catch (error) {
        console.error("Error fetching brand score:", error);
        setMongoScore(0);
      } finally {
        setIsLoadingScore(false);
      }
    };

    if (bureauId) fetchScore();
  }, [bureauId]); 


  return (
    <div className="">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{t("brandvaluescore")}</h3>
        {isLoadingScore ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <div className="text-2xl font-bold">{mongoScore}%</div>
        )}
      </div>

      <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-3">
        <div
          className="bg-white h-3 rounded-full transition-all duration-500"
          style={{ width: `${mongoScore}%` }}
        ></div>
      </div>

      {!isLoadingScore && (
        <div className="text-center mb-3">
          <div className="text-blue-200 text-sm">
            <strong>{t("completeprofiles")}:</strong> {completeProfiles} {t("profiles")} {t("crossed")} 80% {t("data")} {t("completeness")}
          </div>
        </div>
      )}
        <div className="mb-3">
                      {/* <div className="text-green-200 text-center font-semibold">
                        ✅ Profile Status: Active
                    </div>
                    <div className="text-orange-200">
                      <strong>Good start!</strong> Keep improving your profile to get better results.
                    </div> */}
                    </div>
      {/* <div>
         {!isLoadingScore && (
                  <div className="mb-3">
                    {checkpoints.editWebsite && checkpoints.navbarLogo && checkpoints.sliderImages ? (
                      <div className="text-green-200 text-center font-semibold">
                        ✅ Profile Status: Active
                    </div>
                    ) : (
                      <div className="text-red-200 text-center font-semibold">
                        ❌ Profile Status: Inactive
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-sm">
                  {mongoScore === 0 ? (
                    <div className="text-yellow-200">
                      <strong>Your business profile is incomplete!</strong><br />
                      Please complete your profile to get better response for your business.
                    </div>
                  ) : mongoScore < 50 ? (
                    <div className="text-orange-200">
                      <strong>Good start!</strong> Keep improving your profile to get better results.
                    </div>
                  ) : mongoScore < 80 ? (
                    <div className="text-green-200">
                      <strong>Great progress!</strong> Your profile is performing well.
                    </div>
                  ) : (
                    <div className="text-green-100">
                      <strong>Excellent!</strong> Your profile is fully optimized for maximum results.
                    </div>
                  )}
                </div>
              </div> */}
      
             
    </div>
    
  );
};

export default BrandScore;
