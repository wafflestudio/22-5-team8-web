import { useEffect, useState } from 'react';

import { useAuth } from '../../components/AuthContext';
import ToggleButton from '../../components/ToggleButton';
import { newReview, updateReview } from '../../utils/Functions';
import type { Movie, Review } from '../../utils/Types';

type CommentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  myReview: Review | null;
  onReviewUpdate: (updatedReview: Review | null) => void;
};

const CommentPopup = ({
  isOpen,
  onClose,
  movie,
  myReview,
  onReviewUpdate,
}: CommentPopupProps) => {
  const [isOn, setIsOn] = useState(false);
  const [text, setText] = useState('');
  const { accessToken } = useAuth();

  useEffect(() => {
    if (myReview !== null) {
      setText(myReview.content);
      setIsOn(myReview.spoiler);
    }
  }, [myReview]);

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    if (inputText.length > 10000) setText(inputText.slice(0, 10000));
    else setText(inputText);
  };

  const onToggle = () => {
    setIsOn(!isOn);
  };

  const onSave = () => {
    if (accessToken === null) {
      return;
    }

    if (myReview === null) {
      void newReview(movie.id, accessToken, text, 0, isOn, '', onReviewUpdate);
    } else {
      void updateReview(
        myReview.id,
        accessToken,
        text,
        myReview.rating === null ? 0 : myReview.rating,
        isOn,
        myReview.status,
        onReviewUpdate,
      );
    }

    onClose();
  };

  return (
    <div className="flex flex-col fixed inset-0 z-50 w-100 h-100 bg-white color-hotPink">
      <div className="flex justify-between items-center px-4 py-2">
        <svg
          className="cursor-pointer"
          onClick={onClose}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path
            fill="#FF2F6E"
            fillRule="evenodd"
            d="M15.279 2.72a.666.666 0 0 0-.942 0L9 8.059 3.663 2.721a.666.666 0 1 0-.942.942L8.058 9l-5.337 5.337a.666.666 0 0 0 .942.942L9 9.942l5.337 5.337a.666.666 0 0 0 .942-.942L9.942 9l5.337-5.337a.666.666 0 0 0 0-.942"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="font-bold">{movie.title}</h1>
        <button
          className={text !== '' ? 'text-hotPink' : 'text-gray-400'}
          onClick={onSave}
        >
          저장
        </button>
      </div>
      <hr className="w-full mb-1 bg-gray-300" />
      <div className="flex items-center px-4 py-1">
        <h2 className="text-xs text-gray-400">스포일러</h2>
        <ToggleButton initialState={isOn} onToggle={onToggle} />
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="이 작품에 대한 생각을 자유롭게 표현해주세요."
        className="w-full h-full px-4 focus:outline-none focus:ring-0 border-none text-sm text-start"
      />
      <div className="px-4 py-2 text-sm text-gray-400">
        {text.length} / 10000
      </div>
    </div>
  );
};

export default CommentPopup;
