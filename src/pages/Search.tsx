import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import search from '../assets/search.svg';
import { Footerbar } from '../components/Footerbar';
import { SearchResultBlock } from '../components/SearchResultBlock';
import type { searchResult } from '../utils/Types';

type Category = '영화' | '인물' | '컬렉션' | '유저';

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<searchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('영화');


  useEffect(() => {
    const query = searchParams.get('query');
    if (query != null) {
      setSearchText(query);
      void performSearch(query);
    }
  }, [searchParams]);

  const handleClear = () => {
    setSearchText('');
    setSearchResults(null);
  };

  const performSearch = async (query: string) => {
    setError(null);
    try {
      const response = await fetch(`/api/search?search_q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json() as searchResult;
      setSearchResults(data);
    } catch (err) {
      setError((err as Error).message);
      console.error('Search error:', err);
    }
  };

  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      void navigate(`/search?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed top-0 w-full z-10 px-4 pb-0 bg-white overflow-visible">
        <div className="relative mt-3 mb-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); }}
            placeholder="콘텐츠, 인물, 컬렉션, 유저를 검색하세요"
            className="w-full px-4 py-2 pl-12 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <img
            src={search}
            alt="search"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50 cursor-pointer"
            onClick={() => { handleSearch(); }}
          />
          {(searchText !== "") && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        {error !== null && (
          <div className="mt-2 text-red-500 text-center">{error}</div>
        )}
      </div>
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-16">
        {(searchResults != null) && (
          <SearchResultBlock
            searchResults={searchResults}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
      </div>

      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
