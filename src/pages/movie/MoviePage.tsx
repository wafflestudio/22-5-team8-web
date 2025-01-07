import { Footerbar } from '../../components/Footerbar';
import ButtonBar from './ButtonBar';
import type { Participant } from './CastList';
import CastList from './CastList';
import { Header } from './Header';
import StarRating from './StarRating';

type MovieData = {
  id: number;
  title: string;
  original_title: string;
  year: string;
  genres: string[];
  countries: string[];
  synopsis: string;
  average_rating: string | null;
  running_time: number;
  grade: string | null;
  poster_url: string;
  backdrop_url: string;
  participants: Participant[];
};

export const MoviePage = () => {
  // test cast data
  const castData: Participant[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `Actor ${i + 1}`,
    role: i > 5 ? '' : `Role ${i + 1}`,
    profile_url: `https://picsum.photos/200/300?random=${Math.random()}`,
  }));

  const testData: MovieData = {
    id: 1,
    title: '파이트 클럽',
    original_title: 'Fight Club',
    year: '1999',
    genres: ['드라마', '액션'],
    countries: ['미국', '독일', '이탈리아'],
    synopsis: `당신이 알고 있는 모든 것은 허구다!

비싼 가구들로 집 안을 채우지만 삶에 강한 공허함을 느끼는 자동차 리콜 심사관 ‘잭’. 거부할 수 없는 매력의 거친 남자 ‘테일러 더든’과의 우연한 만남으로 본능이 이끄는 대로 삶을 살기로 결심한다. 어느 날, “싸워봐야 네 자신을 알게 된다”라는 테일러 더든의 말에 통쾌한 한 방을 날리는 잭. 두 사람은 여태껏 경험해보지 못한 강렬한 카타르시스를 느끼며 ‘파이트 클럽’이라는 비밀 조직을 결성하고, 폭력으로 세상에 저항하는 거대한 집단이 형성된다. 하지만, 걷잡을 수 없이 커진 ‘파이트 클럽’은 시간이 지날수록 의미가 변질되고, 잭과 테일러 더든 사이의 갈등도 점차 깊어져 가는데…

거침없는 진짜 남자들의 진짜 싸움이 시작된다!`,
    average_rating: '4.1',
    running_time: 139,
    grade: '청불',
    poster_url: `https://an2-img.amz.wtchn.net/image/v2/GBRSGHdS2M-RVVoTrHcvnw.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMMjlxZFd0aE4zSmpZemwxZWpkellXWmhaVzl3SW4wLjlxSHZfZjRNVGZyMTVJTFR2S2loRWJmXzk5ZFE2TEc4WFVHS2FiTzhwdEU`,
    backdrop_url: `https://an2-img.amz.wtchn.net/image/v2/0CixI1Hp5q2TixrjBXqeOg.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk1Ua3lNSGd4TURnd2NUZ3dJbDBzSW5BaU9pSXZkakV2YlRONlpqWnBaREoyYUdJemNtZDBabTFuYUdjaWZRLkdIUVJ1WWZGYWRrNmFUUTVCMWwxZDBUcTZqUG12Zi1udXdsbmFGNzYyTms`,
    participants: castData,
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed z-10 top-0 w-full">
        <Header title={testData.title} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-start py-16">
        <div className="relative w-full aspect-[3/4] mb-3">
          <img
            src={testData.backdrop_url}
            alt={testData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <p className="text-4xl font-semibold">{testData.title}</p>
            <p className="text-sm mt-6">{testData.original_title}</p>
            <p className="text-sm mt-2">
              {testData.year} · {testData.genres.join('/')} ·{' '}
              {testData.countries.join(', ')}
            </p>
            <p className="text-sm my-2">
              {Math.floor(testData.running_time / 60)}시간{' '}
              {testData.running_time % 60}분 · {testData.grade}
            </p>
          </div>
        </div>
        <StarRating />
        <hr className="w-11/12 my-3 bg-gray-300" />
        <div className="flex w-11/12 justify-center items-center my-2">
          <div className="text-sm text-gray-500 whitespace-pre-line text-center">
            평균 별점
            <br />
            (평가 수)
          </div>
          <div className="ml-4 mr-4 text-4xl font-bold text-gray-700">
            {testData.average_rating}
          </div>
        </div>
        <hr className="w-11/12 my-3 bg-gray-300" />
        <ButtonBar id={testData.id} />
        <hr className="w-11/12 my-3 bg-gray-300" />
        <div className="w-11/12 my-3 text-gray-700 text-sm whitespace-pre-line">
          {testData.synopsis}
        </div>
        <div className="w-9/12 my-5 items-center justify-center">
          <img src={testData.poster_url} alt={testData.title} />
        </div>
        <hr className="w-11/12 my-3 bg-gray-300" />
        <div className="w-full max-w-screen-md overflow-hidden">
          <CastList participants={castData} />
        </div>
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};
