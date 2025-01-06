import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';
import { MovieScroller } from '../components/MovieScroller';

export const Index = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-none fixed top-0 w-full">
        <Headbar />
      </div>
      <div className="flex-1 text-left px-4 py-2 pb-16 pt-16">
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">왓챠피디아 HOT 랭킹</h1>
          <MovieScroller />
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">영화 공개 예정작</h1>
          <MovieScroller />
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">시리즈 공개 예정작</h1>
          <MovieScroller />
        </div>
        <div className="mt-2 mb-2">
          <h1 className="text-xl font-bold">박스오피스 순위</h1>
          <MovieScroller />
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};
