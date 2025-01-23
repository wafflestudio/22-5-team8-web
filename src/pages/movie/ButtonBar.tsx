import { useEffect, useState } from 'react';

import add from '../../assets/add.svg';
import bookmark from '../../assets/bookmark.svg';
import etc from '../../assets/etc.svg';
import notWatching from '../../assets/not_watching.svg';
import comment from '../../assets/pencil.svg';
import watching from '../../assets/watching.svg';
import { useAuth } from '../../components/AuthContext';
import { newReview, updateReview } from '../../utils/Functions';
import type { Movie, Review } from '../../utils/Types';
import CommentPopup from './CommentPopup';
import NeedLoginPopup from './NeedLoginPopup';

const ButtonBar = ({
  movie,
  myReview,
  onReviewUpdate,
}: {
  movie: Movie;
  myReview: Review | null;
  onReviewUpdate: (updatedReview: Review | null) => void;
}) => {
  const { isLoggedIn, accessToken } = useAuth();

  const [buttonState, setButtonState] = useState<'' | 'WatchList' | 'Watching'>(
    '',
  );
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    //console.log("myReview: ", myReview);
    if (myReview !== null) {
      setButtonState(myReview.status);
    }
  }, [myReview]);

  const onStateChange = (state: '' | 'WatchList' | 'Watching') => {
    //console.log(buttonState);
    if (!isLoggedIn || accessToken === null) {
      return;
    }

    if (myReview === null) {
      void newReview(
        movie.id,
        accessToken,
        '',
        0,
        false,
        state,
        onReviewUpdate,
      );
    } else {
      void updateReview(
        myReview.id,
        accessToken,
        myReview.content,
        myReview.rating === null ? 0 : myReview.rating,
        myReview.spoiler,
        state,
        onReviewUpdate,
      );
    }
  };

  const onClickBookmark = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (buttonState === 'WatchList') {
      setButtonState('');
      onStateChange('');
      return;
    }
    setButtonState('WatchList');
    onStateChange('WatchList');
  };

  const onClickWatching = () => {
    if (!isLoggedIn) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (buttonState === 'Watching') {
      setButtonState('');
      onStateChange('');
      return;
    }
    setButtonState('Watching');
    onStateChange('Watching');
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
            src={buttonState === 'WatchList' ? bookmark : add}
            alt="bookmark"
          />
          <span className={buttonState === 'WatchList' ? 'text-hotPink' : ''}>
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
            src={buttonState === 'Watching' ? watching : notWatching}
            alt="watching"
          />
          <span className={buttonState === 'Watching' ? 'text-hotPink' : ''}>
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
        myReview={myReview}
        onReviewUpdate={onReviewUpdate}
      />
    </>
  );
};

export default ButtonBar;
