import { useCallback, useState } from 'react';

import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';
import { MovieScroller } from '../components/MovieScroller';
import NeedLoginPopup from './movie/NeedLoginPopup';

export const Movies = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoading, setIsLoading] = useState({
    watcha10: true,
    watcha_buying: true,
    box_office: true,
    netflix: true,
  });

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
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-16">
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
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">왓챠피디아 구매 순위</h1>
          {isLoading.watcha_buying && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="watcha_buying"
            onLoadComplete={handleLoadComplete}
          />
        </div>

        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">넷플릭스 순위</h1>
          {isLoading.netflix && (
            <div className="h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <MovieScroller
            chart_type="netflix"
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
