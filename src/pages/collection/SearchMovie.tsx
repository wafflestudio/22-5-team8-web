import React, { useState } from 'react';

interface SearchMovieProps {
  onClose: () => void;
}

export const SearchMovie = ({ onClose }: SearchMovieProps) => {
  return (
    <div className="fixed inset-0 bg-white z-20 flex flex-col h-screen">
      <button onClick={onClose} className="mt-4 ml-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="hotpink"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-lg font-bold">작품 추가</div>
        <button className="text-gray-500">0개 추가하기</button>
      </div>
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="검색하여 작품 추가하기"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{/* 대충 검색 결과 */}</div>
    </div>
  );
};

const App = () => {
  const [isSearchMovieVisible, setIsSearchMovieVisible] = useState(false);

  const handleOpenSearchMovie = () => {
    setIsSearchMovieVisible(true);
  };

  const handleCloseSearchMovie = () => {
    setIsSearchMovieVisible(false);
  };

  return (
    <div>
      <button onClick={handleOpenSearchMovie}>작품 추가</button>
      {isSearchMovieVisible && <SearchMovie onClose={handleCloseSearchMovie} />}
    </div>
  );
};

export default App;
