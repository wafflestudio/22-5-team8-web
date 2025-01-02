import { BriefMovieInfo } from '../components/BriefMovieInfo';

export const MovieScroller = () => {
  // for test
  const testPosters = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Movie ${i + 1}`,
    imageUrl: `https://picsum.photos/200/300?random=${Math.random()}`,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex overflow-x-auto gap-4 p-4 w-full scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {testPosters.map((poster) => (
          <BriefMovieInfo key={poster.id} poster={poster} />
        ))}
      </div>
    </div>
  );
};
