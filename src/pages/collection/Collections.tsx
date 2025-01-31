import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import NoResultSvg from '../../assets/no_result.svg';
import { useAuth } from '../../components/AuthContext';
import CollectionBlock from '../../components/CollectionBlock';
import { Footerbar } from '../../components/Footerbar';
import type { Collection } from '../../utils/Types';

const PAGE_SIZE = 5;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hotpink]"></div>
  </div>
);

export const Collections = () => {
  const { user_id } = useAuth();
  const { page_user_id } = useParams();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastCollectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || node == null) return;
      if (observer.current != null) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries.length > 0 &&
          (entries[0]?.isIntersecting ?? false) &&
          hasMore
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    const fetchUserCollections = async () => {
      setError(null);
      setIsLoading(true);
      try {
        if (page_user_id === undefined) {
          throw new Error('User ID is undefined');
        }
        const begin = page * PAGE_SIZE;
        const response = await fetch(
          `/api/collections/list/${page_user_id}?begin=${begin}&end=${begin + PAGE_SIZE}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = (await response.json()) as Collection[];
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setCollections((prev) => [...prev, ...data]);
      } catch (err) {
        setError((err as Error).message);
        console.error('Collections fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchUserCollections();
  }, [page_user_id, page]);

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-none fixed top-0 w-full z-10 flex justify-between items-center px-4 py-3 bg-white">
          <span className="text-2xl font-bold text-black">컬렉션</span>
          {page_user_id !== undefined &&
            user_id !== null &&
            page_user_id === user_id.toString() && (
              <Link to={`/profile/${page_user_id}/collections/new`}>
                <span className="text-sm text-[hotpink]">새 컬렉션</span>{' '}
              </Link>
            )}
        </div>
        <div className="flex-1 text-center px-4 py-2 pb-16 pt-16">
          {error != null && <div className="text-red-500">Error: {error}</div>}
          {collections.map((collection, index) => (
            <div
              ref={
                index === collections.length - 1 ? lastCollectionRef : undefined
              }
              key={`${collection.id}-${index}`}
            >
              <CollectionBlock collection={collection} />
            </div>
          ))}
          {isLoading && <LoadingSpinner />}
          {!isLoading && error == null && collections.length === 0 && (
            <div className="flex flex-col items-center h-[400px]">
              <img
                src={NoResultSvg}
                className="w-16 h-16 mb-4 opacity-30 filter grayscale"
              />
              <div className="text-gray-500 text-sm">결과가 없어요.</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </>
  );
};
