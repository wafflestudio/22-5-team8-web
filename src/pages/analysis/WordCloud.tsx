type Tag = {
  text: string;
  weight: number;
};

const tags: Tag[] = [
  { text: '블록버스터', weight: 8 },
  { text: '명작', weight: 6 },
  { text: '연기력', weight: 5 },
  { text: '스릴있는', weight: 4 },
  { text: '영상미', weight: 4 },
  { text: 'OST', weight: 3 },
  { text: '완성도', weight: 2 },
  { text: '강렬한', weight: 2 },
  { text: '철학적인', weight: 1 },
  { text: '워너 브라더스', weight: 1 },
];

const shuffleArray = (array: ReadonlyArray<Tag>): Tag[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]; // undefined 처리
    if (temp !== undefined && shuffled[randomIndex] != null) {
      shuffled[i] = shuffled[randomIndex];
      shuffled[randomIndex] = temp;
    }
  }
  return shuffled;
};

export default function WordCloud() {
  return (
    <div
      className="flex flex-wrap justify-center items-center gap-2 mx-auto mt-4 text-center"
      style={{
        width: '300px', // 전체 영역의 너비
        height: '150px', // 전체 영역의 높이
        padding: '20px 40px 20px 40px', // 안쪽 여백
        border: '1px solid transparent', // 타원형 경계선 (필요 시)
        borderRadius: '1s00%', // 타원 형태로 배치
        textAlign: 'center', // 텍스트 중앙 정렬
        overflowWrap: 'break-word', // 긴 단어 줄바꿈
        lineHeight: '1', // 줄 간격
      }}
    >
      {shuffleArray(tags).map((tag, index) => (
        <span
          key={index}
          className={`text-hotPink p-1`}
          style={{
            fontSize: `${tag.weight + 10}px`, // 글자의 크기 조정
            fontWeight: tag.weight > 5 ? 'bold' : 'normal',
            whiteSpace: 'nowrap', // 단어 간 줄바꿈 방지
          }}
        >
          {tag.text}
        </span>
      ))}
    </div>
  );
}
