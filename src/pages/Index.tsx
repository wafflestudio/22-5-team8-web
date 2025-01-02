import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';
import { MovieScroller } from '../components/MovieScroller';

export const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none">
        <Headbar />
      </div>
      <div className="flex-1 text-left px-4 py-2">
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
      <div className="flex-none">
        <Footerbar />
      </div>
    </div>
  );
};
