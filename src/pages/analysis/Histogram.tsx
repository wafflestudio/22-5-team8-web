const scoreData = [
  { score: 0.5, count: 2 },
  { score: 1, count: 3 },
  { score: 1.5, count: 1 },
  { score: 2, count: 5 },
  { score: 2.5, count: 6 },
  { score: 3, count: 8 },
  { score: 3.5, count: 10 },
  { score: 4, count: 12 },
  { score: 4.5, count: 0 },
  { score: 5, count: 4 },
];

export default function Histogram() {
  const maxCount = Math.max(...scoreData.map((d) => d.count)); // 최대 개수
  const allCount = scoreData.reduce((acc, cur) => acc + cur.count, 0); // 전체 개수
  const average_rating =
    scoreData.reduce((acc, cur) => acc + cur.count * cur.score, 0) /
    scoreData.reduce((acc, cur) => acc + cur.count, 0); // 평균 평점
  const maxScoreData = scoreData.find((data) => data.count === maxCount);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end justify-center gap-1 mt-6">
        {scoreData.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`bg-hotPink`}
              style={{
                height: `${(data.count / maxCount) * 80}px`, // 막대의 높이 비율
                width: '24px',
                opacity: `${data.count === maxCount ? 1 : 0.65}`,
                borderRadius: '4px',
              }}
            ></div>
            <div className="mt-2 text-sm text-gray-500">{data.score}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4 gap-10">
        <div className="flex flex-col items-center w-20">
          <div className="text-lg font-bold">{average_rating.toFixed(1)}</div>
          <div className="text-sm">별점 평균</div>
        </div>
        <div className="flex flex-col items-center w-20">
          <div className="text-lg font-bold">{allCount}</div>
          <div className="text-sm">별점 개수</div>
        </div>
        <div className="flex flex-col items-center w-20">
          <div className="text-lg font-bold">
            {maxScoreData != null ? maxScoreData.score.toFixed(1) : 'N/A'}
          </div>
          <div className="text-sm">많이 준 별점</div>
        </div>
      </div>
    </div>
  );
}
