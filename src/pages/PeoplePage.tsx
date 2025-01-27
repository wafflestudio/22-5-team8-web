import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate, useParams } from 'react-router-dom';

import back from '../assets/back.svg';
import noProfile from '../assets/no_profile.svg';
import { Footerbar } from '../components/Footerbar';
import type {
  People,
  PeopleMovieCredit,
  PeopleMovieCreditResponse,
} from '../utils/Types';

const PeoplePage = () => {
  const [role, setRole] = useState<string>('감독');
  const [people, setPeople] = useState<People | null>(null);
  const [movieCredits, setMovieCredits] = useState<PeopleMovieCreditResponse[]>(
    [],
  );
  const [currentRoleMovies, setCurrentRoleMovies] = useState<
    PeopleMovieCredit[]
  >([]);
  const { peopleId } = useParams();
  const id: number = parseInt(peopleId == null ? '0' : peopleId);
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate(-1);
  };

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`/api/participants/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch people');
        }
        const data = (await response.json()) as People;
        console.debug(data);

        setPeople(data);

        const response2 = await fetch(`/api/participants/${id}/movies`);
        if (!response2.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data2 = (await response2.json()) as PeopleMovieCreditResponse[];
        //console.log(data2);
        setMovieCredits(data2);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchPeople();
  }, [id]);

  useEffect(() => {
    if (movieCredits.length === 0) {
      return;
    }
    const newRoleCredits = movieCredits.find((data) => data.role === role);
    setCurrentRoleMovies(
      newRoleCredits === undefined ? [] : newRoleCredits.movies,
    );
  }, [movieCredits, role]);

  if (people === null) {
    return (
      <div>
        <div className="flex items-center bg-white fixed z-10 top-0 w-full">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 p-4 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
          >
            <img src={back} alt="뒤로가기" className="w-6 h-6" />
          </button>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center font-semibold">
            {'Loading...'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex drop-shadow  items-center bg-white fixed z-10 top-0 w-full">
        <button
          onClick={handleBack}
          className={`flex items-center space-x-2 p-4 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
        >
          <img src={back} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-center font-semibold">
          {people.name}
        </h1>
      </div>
      <div className="flex pt-20 px-6 items-center">
        <img
          src={people.profile_url === null ? noProfile : people.profile_url}
          alt={people.name}
          className="w-16 h-16 scale-125 rounded-md object-cover"
        />
        <div className="flex flex-col ml-6">
          <p className="text-lg font-semibold">{people.name}</p>
          <p className="pt-1 text-sm text-gray-500">
            {people.roles.join(', ')}
          </p>
        </div>
      </div>
      <h1 className="text-xl font-semibold px-4 pt-8">영화</h1>
      <div className="flex pt-2 px-2">
        <button
          onClick={() => {
            setRole('감독');
          }}
          className={`scale-75 text-xl px-5 py-2 rounded ${
            role === '감독'
              ? 'bg-black text-white'
              : 'border border-gray-300 text-gray-800'
          }`}
        >
          감독
        </button>
        <button
          onClick={() => {
            setRole('출연');
          }}
          className={`scale-75 text-xl px-5 py-2 rounded ${
            role === '출연'
              ? 'bg-black text-white'
              : 'border border-gray-300 text-gray-800'
          }`}
        >
          출연
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-10">
        {currentRoleMovies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="border p-4 flex space-x-4 items-center"
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div className="items-center">
              <h3 className="font-bold text-lg pb-1">{movie.title}</h3>
              <p className="text-gray-500 text-sm">
                {movie.year} | {movie.cast}
              </p>
              <p className="text-gray-500 text-sm">
                평점 &#9733;
                {movie.average_rating != null
                  ? movie.average_rating.toFixed(1)
                  : 'N/A'}
              </p>
            </div>
          </Link>
        ))}
        <div className="pt-4">
          {currentRoleMovies.length === 0 ? (
            <p className="text-center">영화가 없습니다.</p>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};

export default PeoplePage;
