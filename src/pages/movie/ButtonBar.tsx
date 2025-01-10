import { useState } from 'react';

import add from '../../assets/add.svg';
import bookmark from '../../assets/bookmark.svg';
import etc from '../../assets/etc.svg';
import notWatching from '../../assets/not_watching.svg';
import comment from '../../assets/pencil.svg';
import watching from '../../assets/watching.svg';
import { useAuth } from '../../components/AuthContext';
import type { Movie } from '../../utils/Types';
import CommentPopup from './CommentPopup';
import NeedLoginPopup from './NeedLoginPopup';

const ButtonBar = ({ movie }: { movie: Movie }) => {
  const { isLoggedIn } = useAuth();

  const [buttonState, setButtonState] = useState<string>('');
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState<boolean>(false);

  const onClickBookmark = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (buttonState === 'bookmark') {
      setButtonState('');
      return;
    }
    setButtonState('bookmark');
  };

  const onClickWatching = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (buttonState === 'watching') {
      setButtonState('');
      return;
    }
    setButtonState('watching');
  };

  const onClickComment = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }
    setIsCommentPopupOpen(true);
  };

  const onClickEtc = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-11/12 bg-white text-gray-500 text-xs font-semibold">
        <button
          onClick={onClickBookmark}
          className="flex flex-col w-1/4 items-center gap-2"
        >
          <img
            src={buttonState === 'bookmark' ? bookmark : add}
            alt="bookmark"
          />
          <span className={buttonState === 'bookmark' ? 'text-hotPink' : ''}>
            보고싶어요
          </span>
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
          <img
            src={buttonState === 'watching' ? watching : notWatching}
            alt="watching"
          />
          <span className={buttonState === 'watching' ? 'text-hotPink' : ''}>
            보는 중
          </span>
        </button>
        <button
          onClick={onClickEtc}
          className="flex flex-col w-1/4 items-center gap-2"
        >
          <img src={etc} alt="etc" />
          <span>더보기</span>
        </button>
      </div>
      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={() => {
          setIsNeedLoginPopupOpen(false);
        }}
      />
      <CommentPopup
        isOpen={isCommentPopupOpen}
        onClose={() => {
          setIsCommentPopupOpen(false);
        }}
        movie={movie}
      />
    </>
  );
};

export default ButtonBar;
