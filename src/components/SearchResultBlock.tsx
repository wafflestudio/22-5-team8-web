import { useSearchParams } from 'react-router-dom';

import noProfile from '../assets/no_profile.svg';
import NoResultSvg from '../assets/no_result.svg';
import type {
  SearchResult,
} from '../utils/Types';

type Category = 'movie' | 'person' | 'collection' | 'user';

type SearchResultBlockProps = {
  searchResults: SearchResult;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

export const SearchResultBlock = ({
  searchResults,
  selectedCategory,
  setSelectedCategory,
}: SearchResultBlockProps) => {
  const [, setSearchParams] = useSearchParams();

  const categories: Category[] = ['movie', 'person', 'collection', 'user'];

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSearchParams((params) => {
      params.set('category', category);
      return params;
    });
  };

  const getCategoryContent = () => {

    if (selectedCategory === 'movie' && searchResults.movies.length > 0) {
      return (
        <ul className="mt-4">
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
                    people.profile_url === null ? noProfile : people.profile_url
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
    if (selectedCategory === 'collection' && searchResults.collections.length > 0) {
      return (
        <ul className="mt-4">
          {searchResults.collections.map((collection) => (
            <li
              key={collection.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <a
                href={`/collection/${collection.id}`}
                className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="ml-4 flex flex-col justify-center">
                  <h3 className="text-sm">{collection.title}</h3>
                </div>
              </a>
            </li>
          ))}
        </ul>
      );
    }
    if (selectedCategory === 'user' && searchResults.users.length > 0) {
      return (
        <ul className="mt-4">
          {searchResults.users.map((user, index) => (
            <li
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <a
                href={`/profile/${user.user_id}`}
                className="flex py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <img
                  src={user.profile_url === null ? noProfile : user.profile_url}
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

  const getCategoryLabel = (category: Category): string => {
    const labels: Record<Category, string> = {
      movie: '영화',
      person: '인물',
      collection: '컬렉션',
      user: '유저',
    };
    return labels[category];
  };

  return (
    <>
      <div className="flex space-x-2 border-b">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              handleCategoryClick(category);
            }}
            className={`py-3 px-4 text-center whitespace-nowrap ${
              selectedCategory === category
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>
      <div className="mt-4">{getCategoryContent()}</div>
    </>
  );
};
