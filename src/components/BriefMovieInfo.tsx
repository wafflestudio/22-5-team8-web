interface BriefMovieInfoProps {
  poster: {
    id: number;
    imageUrl: string;
    title: string;
  };
}

export const BriefMovieInfo = ({ poster }: BriefMovieInfoProps) => {
  return (
    <div className="flex-none w-[100px] snap-start">
      <div className="flex flex-col gap-1">
        <img src={poster.imageUrl} className="w-full object-cover" />
        <h1 className="text-sm truncate">{poster.title}</h1>
      </div>
    </div>
  );
};
