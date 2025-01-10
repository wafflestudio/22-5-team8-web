import { Link } from 'react-router-dom';

import type { Movie } from '../utils/Types';

type BriefMovieInfoProps = {
  movie: Movie;
  index: number;
};

export const BriefMovieInfo = ({ movie, index }: BriefMovieInfoProps) => {
  return (
    <Link className="flex-none w-[100px] snap-start" to={`/movies/${movie.id}`}>
      <div className="flex flex-col gap-1">
        <div className="relative">
          <div className="absolute top-1 left-1 bg-black/70 px-2 rounded">
            <span className="text-white text-sm font-bold">{index}</span>
          </div>
          <img
            src={movie.poster_url}
            className="w-full object-cover rounded-sm"
          />
        </div>
        <h1 className="text-sm truncate">{movie.title}</h1>
        <h1 className="text-gray-500 text-xs">
          평균★{' '}
          {movie.average_rating === null
            ? '별점 없음'
            : movie.average_rating.toFixed(1)}
        </h1>
      </div>
    </Link>
  );
};
