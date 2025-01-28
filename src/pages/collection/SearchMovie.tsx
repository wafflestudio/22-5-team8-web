import { useState } from 'react';

import SearchSVG from '../../assets/search.svg';
import { fetchMovie } from '../../utils/Functions';
import type { Movie, SearchResultRaw } from '../../utils/Types';

interface SearchMovieProps {
  onClose: () => void;
  onSubmit?: (selectedMovies: number[]) => void;
}

export const SearchMovie = ({ onClose, onSubmit }: SearchMovieProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const performSearch = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?search_q=${searchText}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = (await response.json()) as SearchResultRaw;
      const movieDetails = (await Promise.all(
        data.movie_list.map((id) => fetchMovie(id)),
      )) as Movie[];
      setSearchResults(movieDetails);
    } catch (err) {
      setError((err as Error).message);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchText.trim().length > 0) {
      void performSearch();
    }
  };

  const handleMovieToggle = (movieId: number) => {
    setSelectedMovies((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  const handleSubmit = () => {
    if (onSubmit != null) {
      onSubmit(selectedMovies);
    }
    onClose();
  };

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
        <button
          className={
            selectedMovies.length > 0 ? 'text-hotPink' : 'text-gray-500'
          }
          onClick={handleSubmit}
        >
          {selectedMovies.length}개 추가하기
        </button>
      </div>
      <div className="px-4 border-b">
        <div className="relative">
          <div className="relative mt-3 mb-3">
            <input
              type="text"
              placeholder="검색하여 작품 추가하기"
              className="w-full px-4 py-2 pl-12 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <img
              src={SearchSVG}
              alt="search"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50 cursor-pointer"
              onClick={() => {
                handleSearch();
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {error !== null && (
          <div className="mt-2 text-red-500 text-center">{error}</div>
        )}
        {isLoading ? (
          <div className="text-center mt-8">검색 중...</div>
        ) : (
          searchResults != null && (
            <div>
              {searchResults.length === 0 ? (
                <div className="text-center mt-8 text-gray-500">
                  검색 결과가 없습니다
                </div>
              ) : (
                searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-4 p-4 border-b cursor-pointer"
                    onClick={() => {
                      handleMovieToggle(movie.id);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedMovies.includes(movie.id)}
                        readOnly
                        className="w-5 h-5 rounded-full appearance-none border-2 border-gray-300 bg-white transition-colors checked:bg-hotPink checked:border-hotPink pointer-events-none"
                      />
                    </div>
                    <div className="w-20 h-28 flex-shrink-0">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{movie.title}</span>
                      <span className="text-sm text-gray-500">
                        {movie.year}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
