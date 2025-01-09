import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { useAuth } from '../../components/AuthContext';
import type { Review } from '../../utils/Types';
import NeedLoginPopup from './NeedLoginPopup';

const StarRating = ({
  movieId,
  myReview = null,
}: {
  movieId: number;
  myReview: Review | null;
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const { isLoggedIn, accessToken } = useAuth();

  const openNeedLoginPopup = () => {
    setIsNeedLoginPopupOpen(true);
  };
  const closeNeedLoginPopup = () => {
    setIsNeedLoginPopupOpen(false);
  };

  useEffect(() => {
    if (myReview !== null) {
      setRating(myReview.rating);
    }
  }, [myReview]);

  const handleClick = (value: number, event: MouseEvent<HTMLSpanElement>) => {
    if (!isLoggedIn || accessToken === null) {
      openNeedLoginPopup();
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isHalf = clickX < width / 2;
    const newRating = isHalf ? value - 0.5 : value;

    // 같은 별점을 다시 클릭하면 점수 취소
    setRating((prev) => (prev === newRating ? 0 : newRating));

    // 별점을 클릭할 때마다 서버에 저장
    // 이미 리뷰 존재 시 Patch, 없으면 Post로 구현해야 함

    void (async () => {
      try {
        const response = await fetch(`/api/reviews/${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ content: 'test', rating: newRating }),
        });

        //const data = (await response.json()) as Review;
        //console.log(data);

        if (!response.ok) {
          throw new Error('Failed to save rating');
        }
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleMouseEvent = (
    value: number,
    event: MouseEvent<HTMLSpanElement>,
  ) => {
    if (isMobile) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - left;
    const isHalf = hoverX < width / 2;
    setHover(isHalf ? value - 0.5 : value);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const getFeedback = (score: number) => {
    switch (score) {
      case 5:
        return '최고예요!';
      case 4.5:
        return '훌륭해요!';
      case 4:
        return '재미있어요';
      case 3.5:
        return '볼만해요';
      case 3:
        return '보통이에요';
      case 2.5:
        return '부족해요';
      case 2:
        return '별로예요';
      case 1.5:
        return '재미없어요';
      case 1:
        return '싫어요';
      case 0.5:
        return '최악이에요';
      default:
        return '평가하기';
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const isHalf =
              hover === 0 ? rating === value - 0.5 : hover === value - 0.5;
            const isFull = hover === 0 ? rating >= value : hover >= value;

            return (
              <div
                key={index}
                className="relative"
                onClick={(event) => {
                  handleClick(value, event);
                }}
                onMouseEnter={(event) => {
                  handleMouseEvent(value, event);
                }}
                onMouseMove={(event) => {
                  handleMouseEvent(value, event);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className={`text-5xl cursor-pointer ${isFull ? 'text-hotPink' : 'text-gray-300'}`}
                >
                  &#9733;
                </span>
                {isHalf && (
                  <span
                    className="absolute left-0 top-0 text-5xl cursor-pointer text-hotPink overflow-hidden"
                    style={{ width: '50%' }}
                  >
                    &#9733;
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm font-medium">{getFeedback(rating)}</p>
      </div>

      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={closeNeedLoginPopup}
      />
    </>
  );
};

export default StarRating;
