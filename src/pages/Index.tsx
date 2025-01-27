import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import calendar_img from '../assets/calendar_img.png';
import recommend_img from '../assets/recommend_img.png';
import taste_analysis_img from '../assets/taste_analysis_img.png';
import watchapedia_logo from '../assets/watchapedia.png';
import { useAuth } from '../components/AuthContext';
import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';
import { MovieScroller } from '../components/MovieScroller';
import NeedLoginPopup from './movie/NeedLoginPopup';

export const Index = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoading, setIsLoading] = useState({
    watcha10: true,
    watcha_buying: true,
    box_office: true,
    netflix: true,
  });

  const handleAnalysisClick = useCallback(() => {
    if (accessToken == null) {
      setShowLoginPopup(true);
    } else {
      void navigate('/analysis');
    }
  }, [accessToken, navigate]);

  const handleRecommendClick = useCallback(() => {
    if (accessToken == null) {
      setShowLoginPopup(true);
    } else {
      void navigate('/recommend');
    }
  }, [accessToken, navigate]);

  const handleLoadComplete = useCallback((type: string) => {
    setIsLoading((prev) => ({ ...prev, [type]: false }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {showLoginPopup && (
        <div className="fixed inset-0 z-50">
          <NeedLoginPopup
            isOpen={showLoginPopup}
            onClose={() => {
              setShowLoginPopup(false);
            }}
          />
        </div>
      )}
      <div className="flex-none fixed top-0 w-full z-10">
        <Headbar />
      </div>
      <div className="flex justify-center mt-20 mb-2">
        <img src={watchapedia_logo} alt="Watchapedia Logo" className="w-72" />
      </div>
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-4">
        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="flex flex-col items-center">
            <img src={calendar_img} alt="Calendar" className="w-12 h-12 mb-1" />
            <h2 className="text-md">캘린더</h2>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={handleAnalysisClick}
          >
            <img
              src={taste_analysis_img}
              alt="Taste Analysis"
              className="w-12 h-12 mb-1"
            />
            <h2 className="text-md">취향분석</h2>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={handleRecommendClick}
          >
            <img
              src={recommend_img}
              alt="Recommendations"
              className="w-12 h-12 mb-1"
            />
            <h2 className="text-md">추천</h2>
          </div>
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">왓챠피디아 HOT 랭킹</h1>
          {isLoading.watcha10 && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="watcha10"
            onLoadComplete={handleLoadComplete}
          />
        </div>

        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">박스오피스 순위</h1>
          {isLoading.box_office && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="box_office"
            onLoadComplete={handleLoadComplete}
          />
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
