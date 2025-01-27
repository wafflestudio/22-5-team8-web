import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import search from '../assets/search.svg';
import { Footerbar } from '../components/Footerbar';
import { SearchResultBlock } from '../components/SearchResultBlock';
import {
  fetchCollection,
  fetchMovie,
  fetchPeople,
  fetchUser,
} from '../utils/Functions';
import type {
  Collection,
  Movie,
  People,
  SearchCategory,
  SearchResult,
  SearchResultRaw,
  UserProfile,
} from '../utils/Types';

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory>('movie');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const query = useMemo(() => searchParams.get('query'), [searchParams]);
  const category = useMemo(
    () => searchParams.get('category') ?? 'movie',
    [searchParams],
  );

  useEffect(() => {
    if (
      category.length > 0 &&
      ['movie', 'genre', 'person', 'collection', 'user'].includes(category)
    ) {
      setSelectedCategory(category as SearchCategory);
    }
  }, [category]);

  useEffect(() => {
    if (query != null) {
      setSearchText(query);
      void performSearch(query);
    }
  }, [query]);

  const handleClear = () => {
    setSearchText('');
    setSearchResults(null);
  };

  const performSearch = async (searchQuery: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?search_q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = (await response.json()) as SearchResultRaw;
      const movieDetails = (await Promise.all(
        data.movie_list.map((id) => fetchMovie(id)),
      )) as Movie[];
      const peopleDetails = (await Promise.all(
        data.participant_list.map((id) => fetchPeople(id)),
      )) as People[];
      const _collectionDetails = (await Promise.all(
        data.collection_list.map((id) => fetchCollection(id)),
      )) as Collection[];
      const _userDetails = (await Promise.all(
        data.user_list.map((id) => fetchUser(id)),
      )) as UserProfile[];

      const _genreDetails: Record<string, Movie[]> = {};
      await Promise.all(
        Object.entries(data.movie_dict_by_genre).map(
          async ([genre, movieIds]) => {
            _genreDetails[genre] = (await Promise.all(
              movieIds.map((id) => fetchMovie(id)),
            )) as Movie[];
          },
        ),
      );

      setSearchResults({
        movies: movieDetails,
        users: _userDetails,
        people: peopleDetails,
        collections: _collectionDetails,
        genres: _genreDetails,
      });
    } catch (err) {
      setError((err as Error).message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      const searchQuery = `query=${encodeURIComponent(searchText.trim())}`;
      const categoryQuery =
        selectedCategory !== 'movie' ? `&category=${selectedCategory}` : '';
      void navigate(`/search?${searchQuery}${categoryQuery}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed top-0 w-full z-10 px-4 pb-0 bg-white overflow-visible">
        <div className="relative mt-3 mb-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
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
            onClick={() => {
              handleSearch();
            }}
          />
          {searchText !== '' && (
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
        {isLoading ? (
          <div className="text-center mt-8">검색 중...</div>
        ) : (
          searchResults != null && (
            <SearchResultBlock
              searchResults={searchResults}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )
        )}
      </div>

      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
