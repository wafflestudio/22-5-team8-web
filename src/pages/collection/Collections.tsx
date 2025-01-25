import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import NoResultSvg from '../../assets/no_result.svg';
import CollectionBlock from '../../components/CollectionBlock';
import { Footerbar } from '../../components/Footerbar';
import type { Collection } from '../../utils/Types';

export const Collections = () => {
  const { user_id } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCollections = async () => {
      setError(null);
      setIsLoading(true);
      try {
        if (user_id === undefined) {
          throw new Error('User ID is undefined');
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
    };
    void fetchUserCollections();
  }, [user_id]);

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-none fixed top-0 w-full z-10 flex justify-between items-center px-4 py-3 bg-white">
          <span className="text-2xl font-bold text-black">컬렉션</span>
          <Link to={`/profile/${user_id ?? ''}/collections/new`}>
            <span className="text-sm text-[hotpink]">새 컬렉션</span>{' '}
            {/* 이것도 현재 로그인한 유저가 아니면 안 보여야 함 */}
          </Link>
        </div>
        <div className="flex-1 text-center px-4 py-2 pb-16 pt-16">
          {isLoading && <div>Loading...</div>}
          {error != null && <div className="text-red-500">Error: {error}</div>}
          {!isLoading && error == null && collections.length === 0 && (
            <div className="flex flex-col items-center h-[400px]">
              <img
                src={NoResultSvg}
                className="w-16 h-16 mb-4 opacity-30 filter grayscale"
              />
              <div className="text-gray-500 text-sm">결과가 없어요.</div>
            </div>
          )}
          {collections.map((collection) => (
            <CollectionBlock key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </>
  );
};
