import { useEffect, useState } from 'react';

import { BriefMovieInfo } from '../components/BriefMovieInfo';
import type { Movie } from '../utils/Types';

type MovieScrollerProps = {
  chart_type?: string;
};

export const MovieScroller = ({ chart_type }: MovieScrollerProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setError(null);
      const fetchUrl =
        chart_type !== undefined && chart_type !== ''
          ? `/api/movies?chart_type=${chart_type}`
          : '/api/movies';
      try {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = (await response.json()) as Movie[];
        data.reverse();
        setMovies(data);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, [chart_type]);

  return (
    <div className="relative z-0">
      {error !== null && (
        <div className="mt-4 text-red-500 text-center">{error}</div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex overflow-x-auto gap-4 p-4 w-full scroll-smooth snap-x snap-mandatory scrollbar-hide">
          {movies.map((movie, index) => (
            <BriefMovieInfo key={movie.id} movie={movie} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
