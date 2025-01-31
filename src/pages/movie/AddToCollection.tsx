import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import add from '../../assets/add.svg';
import { useAuth } from '../../components/AuthContext';
import { patchCollection } from '../../utils/Functions';
import type { Collection } from '../../utils/Types';

interface AddToCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AddToCollection = ({
  isOpen,
  onClose,
  onConfirm,
}: AddToCollectionProps) => {
  const { accessToken, user_id } = useAuth();
  const { movieId } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (user_id === null) {
        throw new Error('로그인이 필요합니다');
      }

      const response = await fetch(`/api/collections/list/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = (await response.json()) as Collection[];
      setCollections(data);
    } catch (err) {
      setError((err as Error).message);
      console.error('Collections fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    if (isOpen) {
      void fetchCollections();
    }
  }, [isOpen, fetchCollections]);

  const isMovieInCollection = (collection: Collection): boolean => {
    if (movieId === undefined) return false;
    return collection.movies.some((movie) => movie.id === parseInt(movieId));
  };

  const handleCollectionToggle = (collection: Collection) => {
    if (isMovieInCollection(collection)) return;
    setSelectedCollections((prev) => {
      if (prev.includes(collection)) {
        return prev.filter((id) => id !== collection);
      }
      return [...prev, collection];
    });
  };

  const handleConfirm = async () => {
    try {
      await Promise.all(
        selectedCollections.map((collection) => {
          if (movieId !== undefined) {
            if (accessToken !== null) {
              return patchCollection(
                collection.id,
                collection.title,
                collection.overview,
                [parseInt(movieId)],
                [],
                accessToken,
              );
            }
            return Promise.reject(new Error('accessToken is null'));
          }
          return Promise.reject(new Error('movieId is undefined'));
        }),
      );
      onConfirm();
      setSelectedCollections([]);
    } catch (err) {
      setError((err as Error).message);
      console.error('Failed to update collections:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex items-center justify-between p-2 border-b">
        <button onClick={onClose} className="text-hotPink px-4">
          취소
        </button>
        <h1 className="font-bold">컬렉션에 추가</h1>
        <button
          onClick={() => {
            void handleConfirm();
          }}
          className="text-hotPink px-4"
        >
          확인
        </button>
      </div>
      <div className="p-4">
        {isLoading && <div className="text-center">로딩 중...</div>}
        {error != null && (
          <div className="text-red-500 text-center">{error}</div>
        )}
        {!isLoading && error == null && (
          <ul className="divide-y divide-gray-200">
            <li>
              <Link
                to={
                  user_id !== null && movieId !== undefined
                    ? `/profile/${user_id}/collections/new/?movie=${movieId}`
                    : '#'
                }
                className="block w-full p-3 items-start gap-3 hover:bg-gray-50"
              >
                <div className="w-5 h-5 mt-1">
                  <img src={add} alt="add" className="w-5 h-5" />
                </div>
                <div className="flex-grow pb-2">
                  <div className="font-medium">새 컬렉션</div>
                </div>
              </Link>
            </li>
            {collections.map((collection) => {
              const hasMovie = isMovieInCollection(collection);
              return (
                <li
                  key={collection.id}
                  className={`p-3 flex items-start gap-3 ${
                    !hasMovie ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (!hasMovie) handleCollectionToggle(collection);
                  }}
                >
                  <div className="w-5 h-5 mt-1">
                    {!hasMovie && (
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(collection)}
                        readOnly
                        className="w-full h-full rounded-full appearance-none border-2 border-gray-300 bg-white transition-colors checked:bg-hotPink checked:border-hotPink pointer-events-none"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{collection.title}</div>
                    <div className="text-gray-500 text-sm">
                      {collection.movies.length}개의 작품
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddToCollection;
