import { useState } from 'react';

import add from '../../assets/add.svg';
import bookmark from '../../assets/bookmark.svg';
import comment from '../../assets/comment.svg';
import etc from '../../assets/etc.svg';
import notWatching from '../../assets/not_watching.svg';
import watching from '../../assets/watching.svg';

const ButtonBar = ({ id }: { id: number }) => {
  console.debug(id);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  const onClickBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const onClickWatching = () => {
    setIsWatching(!isWatching);
  };

  const onClickComment = () => {};

  const onClickEtc = () => {};

  return (
    <div className="flex items-center justify-between w-11/12 bg-white text-gray-500 text-xs font-semibold">
      <button
        onClick={onClickBookmark}
        className="flex flex-col w-1/4 items-center gap-2"
      >
        <img src={isBookmarked ? bookmark : add} alt="bookmark" />
        <span className={isBookmarked ? 'text-hotPink' : ''}>보고싶어요</span>
      </button>
      <button
        onClick={onClickComment}
        className="flex flex-col w-1/4 items-center gap-2"
      >
        <img src={comment} alt="comment" />
        <span>코멘트</span>
      </button>
      <button
        onClick={onClickWatching}
        className="flex flex-col w-1/4 items-center gap-2"
      >
        <img src={isWatching ? watching : notWatching} alt="watching" />
        <span className={isWatching ? 'text-hotPink' : ''}>보는 중</span>
      </button>
      <button
        onClick={onClickEtc}
        className="flex flex-col w-1/4 items-center gap-2"
      >
        <img src={etc} alt="etc" />
        <span>더보기</span>
      </button>
    </div>
  );
};

export default ButtonBar;
