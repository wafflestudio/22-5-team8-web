import NoResultSvg from '../assets/no_result.svg';
import type { searchResult } from '../utils/Types';

type Category = '영화' | '인물' | '컬렉션' | '유저';

interface SearchResultBlockProps {
  searchResults: searchResult;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

export const SearchResultBlock = ({ searchResults, selectedCategory, setSelectedCategory }: SearchResultBlockProps) => {
  const categories: Category[] = ['영화', '인물', '컬렉션', '유저'];

  const getCategoryContent = () => {
    const categoryMap = {
      '영화': {
        list: searchResults.movie_list,
        render: (id: number) => <li key={id}>Movie ID: {id}</li>
      },
      '인물': {
        list: searchResults.participant_list,
        render: (id: number) => <li key={id}>Participant ID: {id}</li>
      },
      '컬렉션': {
        list: searchResults.collection_list,
        render: (id: number) => <li key={id}>Collection ID: {id}</li>
      },
      '유저': {
        list: searchResults.user_list,
        render: (id: number) => <li key={id}>User ID: {id}</li>
      }
    };

    const { list, render } = categoryMap[selectedCategory];
    
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <img 
            src={NoResultSvg} 
            alt="검색 결과 없음" 
            className="w-16 h-16 mb-4 opacity-30 filter grayscale" 
          />
          <p className="text-gray-500 text-sm">검색 결과가 없어요. 다른 검색어를 입력해보세요.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-2 mt-4">
        {list.map(render)}
      </ul>
    );
  };

  return (
    <>
      <div className="flex space-x-2 border-b">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => { setSelectedCategory(category); }}
            className={`py-3 px-4 text-center whitespace-nowrap ${
              selectedCategory === category
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {getCategoryContent()}
      </div>
    </>
  );
};
