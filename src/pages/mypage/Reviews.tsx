import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';
import NoResultSvg from '../../assets/no_result.svg';
import { Footerbar } from '../../components/Footerbar';
import { fetchMovie } from '../../utils/Functions';
import type { Review } from '../../utils/Types';

const ITEMS_PER_PAGE = 9;

export const Reviews = () => {
  const { page_user_id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async (pageNum: number) => {
      if (page_user_id == null) return;
      try {
        setIsLoading(true);
        setError(null);
        const begin = pageNum * ITEMS_PER_PAGE;
        const end = begin + ITEMS_PER_PAGE;
        const response = await fetch(
          `/api/reviews/user/${page_user_id}?begin=${begin}&end=${end}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = (await response.json()) as Review[];

        const reviewsWithMovies = (await Promise.all(
          data.map(async (review) => {
            const movie = await fetchMovie(review.movie_id);
            return { ...review, movie };
          }),
        )) as Review[];

        if (reviewsWithMovies.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
        setReviews((prev) => [...prev, ...reviewsWithMovies]);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch reviews',
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchReviews(0);
  }, [setReviews, page_user_id]);

  useEffect(() => {
    const fetchReviews = async (pageNum: number) => {
      if (page_user_id == null) return;
      try {
        setIsLoading(true);
        setError(null);
        const begin = pageNum * ITEMS_PER_PAGE;
        const end = begin + ITEMS_PER_PAGE;
        const response = await fetch(
          `/api/reviews/user/${page_user_id}?begin=${begin}&end=${end}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = (await response.json()) as Review[];

        const reviewsWithMovies = (await Promise.all(
          data.map(async (review) => {
            const movie = await fetchMovie(review.movie_id);
            return { ...review, movie };
          }),
        )) as Review[];

        if (reviewsWithMovies.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
        setReviews((prev) => [...prev, ...reviewsWithMovies]);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch reviews',
        );
      } finally {
        setIsLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if ((entries[0]?.isIntersecting ?? false) && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
          void fetchReviews(page + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current != null) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, page, page_user_id]);

  return (
    <>
      <div className="flex flex-col min-h-screen relative p-4 pb-24">
        <img
          src={back}
          className="w-6 h-6 cursor-pointer mb-6"
          onClick={() => void navigate(-1)}
        />

        <h1 className="text-xl font-bold mb-12">평가한 작품들</h1>
        {isLoading && <div>Loading...</div>}
        {error != null && <div className="text-red-500">{error}</div>}
        {!isLoading && error == null && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <img src={NoResultSvg} alt="No reviews" className="w-32 h-32" />
            <p>아직 평가가 없습니다.</p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col cursor-pointer"
              onClick={() => void navigate(`/movies/${review.movie_id}`)}
            >
              <img
                src={review.movie.poster_url}
                alt={review.movie.title}
                className="w-full h-36 object-cover rounded"
              />
              <h3 className="mt-2 text-sm line-clamp-2">
                {review.movie.title}
              </h3>
              <div className="text-sm text-gray-600">
                평가함 ★ {review.rating}
              </div>
            </div>
          ))}
        </div>
        <div
          ref={observerTarget}
          className="h-8 flex items-center justify-center"
        >
          {isLoading && <div>Loading...</div>}
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </>
  );
};
