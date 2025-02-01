import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import noProfile from '../assets/no_profile.svg';
import NoResultSvg from '../assets/no_result.svg';
import type { SearchCategory, SearchResult } from '../utils/Types';
import CollectionBlock from './CollectionBlock';

type SearchResultBlockProps = {
  searchResults: SearchResult;
  selectedCategory: SearchCategory;
  setSelectedCategory: (category: SearchCategory) => void;
  lastElementRef: (node: HTMLDivElement | null) => void;
  isLoading: boolean;
  hasMore: boolean;
  initialLoading: boolean;
  blockedUserList: number[];
};

export const SearchResultBlock = ({
  searchResults,
  selectedCategory,
  setSelectedCategory,
  lastElementRef,
  isLoading,
  hasMore,
  initialLoading,
  blockedUserList,
}: SearchResultBlockProps) => {
  const [, setSearchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const categories: SearchCategory[] = [
    'movie',
    'genre',
    'person',
    'collection',
    'user',
  ];

  useEffect(() => {
    if (
      selectedCategory === 'genre' &&
      Object.keys(searchResults.genres).length > 0
    ) {
      const firstGenre = Object.keys(searchResults.genres)[0] ?? 'all';
      setSelectedGenre(firstGenre);
    } else if (selectedCategory === 'movie') {
      setSelectedGenre('all');
    }
  }, [selectedCategory, searchResults.genres]);

  const handleCategoryClick = (category: SearchCategory) => {
    setSelectedCategory(category);
    setSearchParams((params) => {
      params.set('category', category);
      return params;
    });
  };

  const getCategoryContent = () => {
    const content = () => {
      const nonBlockedUsers = searchResults.users.filter(
        (user) => !blockedUserList.includes(user.user_id),
      );

      if (selectedCategory === 'movie' && searchResults.movies.length > 0) {
        return (
          <ul>
            {searchResults.movies.map((movie) => (
              <li
                key={movie.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <a
                  href={`/movies/${movie.id}`}
                  className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={movie.poster_url}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex flex-col justify-center">
                    <h3 className="text-sm">{movie.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{movie.year}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        );
      }
      if (
        selectedCategory === 'genre' &&
        Object.keys(searchResults.genres).length > 0
      ) {
        return (
          <>
            <div className="flex space-x-2 mt-4 mb-4 overflow-x-auto scrollbar-hide">
              {Object.keys(searchResults.genres).map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(genre);
                  }}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
                    ${
                      selectedGenre === genre
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {selectedGenre.length > 0 &&
              searchResults.genres[selectedGenre] != null && (
                <ul>
                  {searchResults.genres[selectedGenre].map((movie) => (
                    <li
                      key={movie.id}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <a
                        href={`/movies/${movie.id}`}
                        className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <img
                          src={movie.poster_url}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="ml-4 flex flex-col justify-center">
                          <h3 className="text-sm">{movie.title}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {movie.year}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
          </>
        );
      }
      if (selectedCategory === 'person' && searchResults.people.length > 0) {
        return (
          <ul className="mt-4">
            {searchResults.people.map((people) => (
              <li
                key={people.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <a
                  href={`/people/${people.id}`}
                  className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      people.profile_url === null
                        ? noProfile
                        : people.profile_url
                    }
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="ml-4 flex flex-col justify-center">
                    <h3 className="text-sm">{people.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {people.roles.join(', ')}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        );
      }
      if (
        selectedCategory === 'collection' &&
        searchResults.collections.length > 0
      ) {
        return (
          <ul className="mt-4">
            {searchResults.collections.map((collection) => (
              <CollectionBlock key={collection.id} collection={collection} />
            ))}
          </ul>
        );
      }
      if (selectedCategory === 'user' && nonBlockedUsers.length > 0) {
        return (
          <ul className="mt-4">
            {nonBlockedUsers.map((user, index) => (
              <li
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <a
                  href={`/profile/${user.user_id}`}
                  className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user.profile_url === null ? noProfile : user.profile_url
                    }
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="ml-4 flex flex-col justify-center">
                    <h3 className="text-sm">{user.username}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      평가 {user.review_count}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <img
            src={NoResultSvg}
            alt="검색 결과 없음"
            className="w-16 h-16 mb-4 opacity-30 filter grayscale"
          />
          <p className="text-gray-500 text-sm">
            검색 결과가 없어요. 다른 검색어를 입력해보세요.
          </p>
        </div>
      );
    };

    return (
      <>
        {content()}
        <div ref={lastElementRef} className="h-4" />
        {isLoading && hasMore && (
          <div className="flex items-center justify-center py-4 mb-16 space-x-2">
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
      </>
    );
  };

  const getCategoryLabel = (category: SearchCategory): string => {
    const labels: Record<SearchCategory, string> = {
      movie: '영화',
      genre: '장르',
      person: '인물',
      collection: '컬렉션',
      user: '유저',
    };
    return labels[category];
  };

  return (
    <>
      <div className="flex flex-wrap border-b">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              handleCategoryClick(category);
            }}
            className={`py-2 px-3 text-center whitespace-nowrap ${
              selectedCategory === category
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>
      {initialLoading ? (
        <div className="text-center mt-8">검색 중...</div>
      ) : (
        <div className="mt-4">{getCategoryContent()}</div>
      )}
    </>
  );
};
