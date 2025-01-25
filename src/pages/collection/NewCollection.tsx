import { useEffect, useState } from 'react';

import { Footerbar } from '../../components/Footerbar';
import { fetchMovie } from '../../utils/Functions';
import type { Movie } from '../../utils/Types';
import { SearchMovie } from './SearchMovie';

export const NewCollection = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [movieDetails, setMovieDetails] = useState<Movie[]>([]);

  const handleMoviesSubmit = (movies: number[]) => {
    setSelectedMovies((prev) => {
      const uniqueMovies = movies.filter((movieId) => !prev.includes(movieId));
      return [...prev, ...uniqueMovies];
    });
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const details = await Promise.all(
        selectedMovies.map((id) => fetchMovie(id)),
      );
      setMovieDetails(details as Movie[]);
    };

    if (selectedMovies.length > 0) {
      void getMovieDetails();
    }
  }, [selectedMovies]);

  /* 내 id가 아니면 이 페이지에 못 들어오게 막을 거긴 하지만 그래도 주소 같은 걸 치고 들어왔다면 접근할 수 없다는 뭐 그런 걸 해야 됨 */
  /* NewCollection에 이미 추가된 영화는 SearchMovies에서 선택 못하게 해야 함 */
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed top-0 w-full z-10 flex justify-between items-center px-4 py-3 bg-white">
        <div className="text-2xl font-bold text-black">새 컬렉션</div>
      </div>
      <div className="flex-grow pt-16 pb-20 px-4">
        <div className="flex justify-end mb-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-gray-500 text-sm">
            만들기
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="컬렉션 제목"
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="컬렉션 설명"
            rows={6}
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />

          <div className="mt-6">
            <h2 className="text-black font-bold mb-2 text-lg">작품들</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <button
                  className="relative w-full작 pb-[150%] bg-gray-100"
                  onClick={() => {
                    setShowSearch(true);
                  }}
                >
                  <div className="absolute inset-0 border-2 border-gray-200 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-7xl font-light text-gray-300">+</div>
                    <div className="text-xs text-gray-400 mt-1">작품 추가</div>
                  </div>
                </button>
              </div>
              {movieDetails.map((movie) => (
                <div key={movie.id} className="flex flex-col gap-1">
                  <div className="relative w-full pb-[150%]">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <SearchMovie
          onClose={() => {
            setShowSearch(false);
          }}
          onSubmit={handleMoviesSubmit}
        />
      )}

      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
