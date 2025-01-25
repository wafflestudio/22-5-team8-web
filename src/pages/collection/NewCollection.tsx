import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import { fetchMovie } from '../../utils/Functions';
import type { Collection, Movie } from '../../utils/Types';
import { SearchMovie } from './SearchMovie';

export const NewCollection = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [tempMovies, setTempMovies] = useState<number[]>([]);
  const [movieDetails, setMovieDetails] = useState<Movie[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMoviesSubmit = (movies: number[]) => {
    setSelectedMovies((prev) => {
      const uniqueMovies = movies.filter((movieId) => !prev.includes(movieId));
      return [...prev, ...uniqueMovies];
    });
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const moviesToFetch = isEditing ? tempMovies : selectedMovies;
      const details = await Promise.all(
        moviesToFetch.map((id) => fetchMovie(id)),
      );
      setMovieDetails(details as Movie[]);
    };

    void getMovieDetails();
  }, [selectedMovies, tempMovies, isEditing]);

  const handleEditStart = () => {
    setTempMovies([...selectedMovies]);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setTempMovies([]);
    setIsEditing(false);
  };

  const handleEditConfirm = () => {
    setSelectedMovies([...tempMovies]);
    setTempMovies([]);
    setIsEditing(false);
  };

  const handleRemoveMovie = (movieId: number) => {
    setTempMovies(tempMovies.filter((id) => id !== movieId));
  };

  const createCollection = async () => {
    if (title.length === 0 || isEditing || isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`,
        },
        body: JSON.stringify({
          title,
          overview: description,
          movie_ids: movieDetails.map((movie) => movie.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const data = (await response.json()) as Collection;
      void navigate(`/collections/${data.id}`);
    } catch (err) {
      setError((err as Error).message);
      console.error('Collection creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /* 내 id가 아니면 이 페이지에 못 들어오게 막을 거긴 하지만 그래도 주소 같은 걸 치고 들어왔다면 접근할 수 없다는 뭐 그런 걸 해야 됨 */
  /* NewCollection에 이미 추가된 영화는 SearchMovies에서 선택 못하게 해야 함 */
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed top-0 w-full z-10 flex justify-between items-center px-4 py-3 bg-white">
        <div className="text-2xl font-bold text-black">새 컬렉션</div>
      </div>
      <div className="flex-grow pt-16 pb-20 px-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              void createCollection();
            }}
            disabled={title.length === 0 || isEditing || isLoading}
            className={`px-3 py-1 border border-gray-300 rounded text-sm ${
              title.length > 0 && !isEditing && !isLoading
                ? 'text-hotPink'
                : 'text-gray-500'
            }`}
          >
            {isLoading ? '생성 중...' : '만들기'}
          </button>
        </div>

        <div className="space-y-4">
          {error !== null && (
            <div className="mt-2 text-red-500 text-center">{error}</div>
          )}
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="컬렉션 제목"
              className="w-full p-2 border-none focus:ring-0"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
          </div>

          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="컬렉션 설명"
              rows={6}
              className="w-full p-2 border-none focus:ring-0"
            />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300"></div>
          </div>

          <div className="mt-6">
            <div className="text-black mb-2 text-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="font-bold">작품들</div>
                <div className="ml-2 text-sm text-gray-400 font-medium">
                  ({selectedMovies.length}/1000)
                </div>
              </div>
              {selectedMovies.length > 0 && (
                <div className="flex gap-4">
                  {isEditing ? (
                    <>
                      <button
                        className="text-sm text-hotPink"
                        onClick={handleEditCancel}
                      >
                        취소
                      </button>
                      <button
                        className={`text-sm ${
                          selectedMovies.length - tempMovies.length > 0
                            ? 'text-hotPink'
                            : 'text-gray-400'
                        }`}
                        onClick={handleEditConfirm}
                      >
                        {selectedMovies.length - tempMovies.length}개 제거
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-sm text-hotPink"
                      onClick={handleEditStart}
                    >
                      수정하기
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <button
                  className="relative w-full작 pb-[150%] bg-gray-100"
                  onClick={() => {
                    if (!isEditing) {
                      setShowSearch(true);
                    }
                  }}
                  disabled={isEditing}
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
                    {isEditing && (
                      <button
                        className="absolute left-2 top-2 z-10 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        onClick={() => {
                          handleRemoveMovie(movie.id);
                        }}
                      >
                        <svg width="12" height="2" viewBox="0 0 12 2">
                          <line
                            x1="0"
                            y1="1"
                            x2="12"
                            y2="1"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    )}
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
