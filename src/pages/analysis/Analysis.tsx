import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import back from '../../assets/back.svg';
import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import type {
  UserAnalysisPreference,
  UserAnalysisRating,
} from '../../utils/Types';
import Histogram from './Histogram';
import WordCloud from './WordCloud';

const Analysis = ({ mode }: { mode: 'default' | 'short' }) => {
  const navigate = useNavigate();
  //const { countries, genres, watchTime } = mockApiResponse;
  const { user_id } = useAuth();
  const [analysisRating, setAnalysisRating] =
    useState<UserAnalysisRating | null>(null);
  const [analysisPreference, setAnalysisPreference] =
    useState<UserAnalysisPreference | null>(null);

  const [countries, setCountries] = useState<
    { name: string; score: number; count: number }[]
  >([]);
  const [genres, setGenres] = useState<
    { name: string; score: number; count: number }[]
  >([]);
  const [actors, setActors] = useState<
    { name: string; score: number; count: number }[]
  >([]);
  const [directors, setDirectors] = useState<
    { name: string; score: number; count: number }[]
  >([]);

  useEffect(() => {
    if (user_id === null) {
      return;
    }

    const fetchAnalysisRating = async () => {
      try {
        const response = await fetch(
          `/api/analysis/${user_id}?search_q=rating`,
        );
        if (!response.ok) {
          throw new Error('fetch failed');
        }

        const data = (await response.json()) as UserAnalysisRating;
        setAnalysisRating(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAnalysisPreference = async () => {
      try {
        const response = await fetch(
          `/api/analysis/${user_id}?search_q=preference`,
        );
        if (!response.ok) {
          throw new Error('fetch failed');
        }

        const data = (await response.json()) as UserAnalysisPreference;
        setAnalysisPreference(data);

        setCountries(
          Object.entries(data.country_dict)
            .map(([name, value]) => ({
              name,
              score: Math.trunc(value[0]),
              count: value[1],
            }))
            .sort((a, b) => b.score - a.score),
        );

        setGenres(
          Object.entries(data.genre_dict)
            .map(([name, value]) => ({
              name,
              score: Math.trunc(value[0]),
              count: value[1],
            }))
            .sort((a, b) => b.score - a.score),
        );

        setActors(
          Object.entries(data.actor_dict)
            .map(([name, value]) => ({
              name,
              score: Math.trunc(value[0]),
              count: value[1],
            }))
            .sort((a, b) => b.score - a.score),
        );

        setDirectors(
          Object.entries(data.director_dict)
            .map(([name, value]) => ({
              name,
              score: Math.trunc(value[0]),
              count: value[1],
            }))
            .sort((a, b) => b.score - a.score),
        );
      } catch (error) {
        console.error(error);
      }
    };

    void fetchAnalysisRating();
    void fetchAnalysisPreference();
  }, [navigate, user_id]);

  if (analysisRating == null || analysisPreference == null) {
    return <div>Loading...</div>;
  }

  if (mode === 'short') {
    return (
      <div className="flex flex-col p-4">
        <h2 className="text-2xl font-bold">별점 분포</h2>
        <Histogram analysisRating={analysisRating} />
        <button
          className="flex rounded bg-gray-200 mx-2 mt-4 px-1 py-2 text-"
          onClick={() => void navigate('/analysis')}
        >
          <div className="ml-2 mr-auto">모든 분석 보기</div>
          <div className="mr-2 font-bold">{'>'}</div>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex drop-shadow items-center fixed z-10 top-0 w-full bg-white">
        <button
          onClick={() => void navigate(-1)}
          className={`flex items-center space-x-2 p-4 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
        >
          <img src={back} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">취향분석</h1>
      </div>
      <div className="flex flex-col p-4 pt-20">
        <h2 className="text-2xl font-bold">별점 분포</h2>
        <Histogram analysisRating={analysisRating} />
        <hr className="my-8" />

        <h2 className="text-2xl font-bold">영화 선호 태그</h2>
        <WordCloud analysisPreference={analysisPreference} />
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">영화 선호 국가</h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {countries.slice(0, 3).map((country) => (
            <div key={country.name} className="text-center w-24">
              <p className="text-lg font-semibold">{country.name}</p>
              <p className="text-sm text-gray-600">
                {country.score}점 · {country.count}편
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 mx-4">
          {countries.slice(3).map((country) => (
            <div
              key={country.name}
              className="flex justify-between items-center py-1 text-gray-500"
            >
              <p>{country.name}</p>
              <p className="text-sm">
                {country.score}점 · {country.count}편
              </p>
            </div>
          ))}
        </div>
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">영화 선호 장르</h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {genres.slice(0, 3).map((genre) => (
            <div key={genre.name} className="text-center w-24">
              <p className="text-lg font-semibold">{genre.name}</p>
              <p className="text-sm text-gray-600">
                {genre.score}점 · {genre.count}편
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 mx-4">
          {genres.slice(3).map((genre) => (
            <div
              key={genre.name}
              className="flex justify-between items-center py-1 text-gray-500"
            >
              <p>{genre.name}</p>
              <p className="text-sm">
                {genre.score}점 · {genre.count}편
              </p>
            </div>
          ))}
        </div>
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">선호 배우</h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {actors.slice(0, 3).map((actor) => (
            <div key={actor.name} className="text-center w-24">
              <p className="text-lg font-semibold">{actor.name}</p>
              <p className="text-sm text-gray-600">
                {actor.score}점 · {actor.count}편
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 mx-4">
          {actors.slice(3).map((actor) => (
            <div
              key={actor.name}
              className="flex justify-between items-center py-1 text-gray-500"
            >
              <p>{actor.name}</p>
              <p className="text-sm">
                {actor.score}점 · {actor.count}편
              </p>
            </div>
          ))}
        </div>
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">선호 감독</h2>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {directors.slice(0, 3).map((director) => (
            <div key={director.name} className="text-center w-24">
              <p className="text-lg font-semibold">{director.name}</p>
              <p className="text-sm text-gray-600">
                {director.score}점 · {director.count}편
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 mx-4">
          {directors.slice(3).map((director) => (
            <div
              key={director.name}
              className="flex justify-between items-center py-1 text-gray-500"
            >
              <p>{director.name}</p>
              <p className="text-sm">
                {director.score}점 · {director.count}편
              </p>
            </div>
          ))}
        </div>
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">영화 감상 시간</h2>
        <div className="flex flex-col text-hotPink items-center justify-center">
          <p className="text-2xl font-bold">
            {analysisRating.viewing_time} 시간
          </p>
          <p className="text-sm mt-1">{analysisRating.viewing_message}</p>
        </div>
        <hr className="my-10" />
      </div>
      <div className="fixed bottom-0 w-full">
        <Footerbar />
      </div>
    </>
  );
};

export default Analysis;
