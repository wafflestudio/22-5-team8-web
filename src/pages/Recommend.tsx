import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../components/AuthContext';
import { Footerbar } from '../components/Footerbar';
import { fetchMovie } from '../utils/Functions';
import type { Recommendation } from '../utils/Types';

export const Recommend = () => {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [expectedRecommendations, setExpectedRecommendations] = useState<
    Recommendation[]
  >([]);
  const [differenceRecommendations, setDifferenceRecommendations] = useState<
    Recommendation[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      if (accessToken == null) {
        setError('No access token available');
        setExpectedRecommendations([]);
        setDifferenceRecommendations([]);
        setIsLoading(false);
        return;
      }

      try {
        const [expectedResponse, differenceResponse] = await Promise.all([
          fetch(`/api/recommend/expect`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch(`/api/recommend/difference`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        if (!expectedResponse.ok || !differenceResponse.ok) {
          throw new Error(`Failed to fetch recommendations`);
        }

        const expectedData =
          (await expectedResponse.json()) as Recommendation[];
        const differenceData =
          (await differenceResponse.json()) as Recommendation[];

        const expectedWithMovies = (await Promise.all(
          expectedData.map(async (recommendation) => ({
            ...recommendation,
            movie: await fetchMovie(recommendation.movie_id),
          })),
        )) as Recommendation[];

        const differenceWithMovies = (await Promise.all(
          differenceData.map(async (recommendation) => ({
            ...recommendation,
            movie: await fetchMovie(recommendation.movie_id),
          })),
        )) as Recommendation[];

        setExpectedRecommendations(expectedWithMovies);
        setDifferenceRecommendations(differenceWithMovies);
        setError(null);
      } catch (err) {
        console.error('Detailed error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setExpectedRecommendations([]);
        setDifferenceRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecommendations();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">로딩 중...</div>
        </div>
        <div className="flex-none fixed bottom-0 w-full z-10">
          <Footerbar />
        </div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <div className="flex-1 text-left px-4 py-2 pb-16 pt-4">
          <div className="text-red-500">Error: {error}</div>
        </div>
        <div className="flex-none fixed bottom-0 w-full z-10">
          <Footerbar />
        </div>
      </div>
    );
  }

  const RecommendationList = ({
    recommendations,
    title,
  }: {
    recommendations: Recommendation[];
    title: string;
  }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.movie_id}
            className="flex-none w-[90vw] snap-center first:ml-4 last:mr-4 cursor-pointer"
            onClick={() => {
              void navigate(`/movies/${recommendation.movie_id}`);
            }}
          >
            <div className="mr-4">
              <div className="relative">
                <img
                  src={recommendation.movie.backdrop_url}
                  alt={recommendation.movie.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 flex rounded overflow-hidden">
                  <span className="bg-white text-hotPink px-2 py-1">예상</span>
                  <span className="bg-hotPink text-white px-2 py-1">
                    {recommendation.expected_rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-bold text-lg line-clamp-2">
                  {recommendation.movie.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {recommendation.movie.year} ·{' '}
                  {recommendation.movie.countries.join(' / ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1 py-2 pb-16 pt-4">
        <h1 className="text-2xl font-bold mb-6 px-4">추천</h1>
        <RecommendationList
          recommendations={expectedRecommendations}
          title={`${user?.username ?? '사용자'}님이 놓쳐선 안 될 강력 추천 작품들`}
        />
        <div className="h-8"></div>
        <RecommendationList
          recommendations={differenceRecommendations}
          title={`${user?.username ?? '사용자'}님이 특별히 좋아할 작품들`}
        />
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
