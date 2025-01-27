import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import back from '../../assets/back.svg';
import { Footerbar } from '../../components/Footerbar';
import Histogram from './Histogram';
import WordCloud from './WordCloud';

const Analysis = () => {
  const navigate = useNavigate();
  const { countries, genres, watchTime } = mockApiResponse;

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
        <Histogram />
        <hr className="my-8" />

        <h2 className="text-2xl font-bold">영화 선호 태그</h2>
        <WordCloud />
        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">영화 선호국가</h2>
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

        <h2 className="text-2xl font-bold mb-4">영화 선호장르</h2>
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

        <h2 className="text-2xl font-bold mb-4">영화 감상 시간</h2>
        <div className="flex flex-col text-hotPink items-center justify-center">
          <p className="text-2xl font-bold">{watchTime} 시간</p>
          <p className="text-sm mt-1">에이 설마 이것만 본 건 아닐 거예요.</p>
        </div>
        <hr className="my-8" />
      </div>
      <div className="fixed bottom-0 w-full">
        <Footerbar />
      </div>
    </>
  );
};

const mockApiResponse = {
  countries: [
    { name: '한국', score: 97, count: 12 },
    { name: '미국', score: 91, count: 4 },
    { name: '영국', score: 88, count: 2 },
    { name: '캐나다', score: 68, count: 1 },
  ],
  genres: [
    { name: '드라마', score: 93, count: 11 },
    { name: '액션', score: 91, count: 7 },
    { name: '코미디', score: 89, count: 4 },
    { name: '미스터리', score: 88, count: 3 },
    { name: '로맨스', score: 87, count: 5 },
    { name: '범죄', score: 84, count: 2 },
    { name: '공연실황', score: 82, count: 1 },
    { name: '판타지', score: 81, count: 2 },
    { name: 'SF', score: 79, count: 3 },
    { name: '음악', score: 76, count: 3 },
  ],
  watchTime: 35,
};

export default Analysis;
