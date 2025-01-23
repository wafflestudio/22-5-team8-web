import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import comment from '../assets/comment.svg';
import edit from '../assets/edit.svg';
import noProfile from '../assets/no_profile.svg';
import recommend from '../assets/recommend.svg';
import trash from '../assets/trash.svg';
import NeedLoginPopup from '../pages/movie/NeedLoginPopup';
import { deleteReview, newReview } from '../utils/Functions';
import type { Reply, Review } from '../utils/Types';
import { useAuth } from './AuthContext';

type CommnetFragmentProps = {
  viewMode: 'moviePage' | 'commentPage' | 'myComment';
  initialReview: Review | null;
  openPopup?: () => void;
};

const CommnetFragment = ({
  viewMode,
  initialReview,
  openPopup = () => {},
}: CommnetFragmentProps) => {
  const [review, setReview] = useState<Review | null>(initialReview);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [replyList, setReplyList] = useState<Reply[] | null>(null);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const { isLoggedIn, accessToken } = useAuth();
  const navigate = useNavigate();

  const closeNeedLoginPopup = () => {
    setIsNeedLoginPopupOpen(false);
  };

  useEffect(() => {
    const fetchReplyList = async () => {
      if (review === null) {
        return;
      }

      if (review.spoiler) setShowContent(false);

      try {
        const response = await fetch(`/api/comments/${review.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reply list');
        }
        const data = (await response.json()) as Reply[];
        setReplyList(data);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchReplyList();
  }, [review]);

  useEffect(() => {
    const updateReview = async () => {
      if (initialReview === null) {
        return;
      }

      try {
        const response = await fetch(`/api/reviews/${initialReview.movie_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        const data = (await response.json()) as Review[];

        const findReview = data.find((r) => r.id === initialReview.id);
        setReview(findReview === undefined ? null : findReview);
      } catch (err) {
        console.error(err);
      }
    };

    void updateReview();
  }, [liked, initialReview]);

  if (review === null) {
    return (
      <div>
        <h1 className="my-2 mx-4">리뷰가 없습니다.</h1>
      </div>
    );
  }

  const onClick = () => {
    const updateLike = async () => {
      try {
        if (!isLoggedIn || accessToken === null) {
          setIsNeedLoginPopupOpen(true);
          return;
        }

        const response = await fetch(`/api/reviews/like/${review.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to update like');
        }
        setLiked(!liked);
      } catch (err) {
        console.error(err);
      }
    };

    void updateLike();
  };

  const handleDelete = async () => {
    if (accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    try {
      await deleteReview(review.id, accessToken, () => {});
      await newReview(
        review.movie_id,
        accessToken,
        '',
        review.rating === null ? 0 : review.rating,
        false,
        review.status,
        () => {},
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    openPopup();
  };

  if (viewMode === 'myComment') {
    return (
      <>
        <div className="py-2 px-4 rounded-lg">
          <div className="border rounded-lg p-4 bg-white flex flex-col items-center">
            <img
              src={noProfile}
              alt="프로필"
              className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center"
            />
            <Link
              to={`/comments/${review.movie_id}/${review.id}`}
              className={`mb-2 text-ellipsis overflow-hidden line-clamp-3 whitespace-pre-line`}
            >
              {review.content}
            </Link>
            <div className="flex items-center mb-1 space-x-4 scale-90">
              <button
                onClick={void handleDelete}
                className="flex items-center text-gray-600"
              >
                <img src={trash} alt="삭제" className="w-5 h-5 mr-1" />
                삭제
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleEdit}
                className="flex items-center text-gray-600"
              >
                <img src={edit} alt="수정" className="w-5 h-5 mr-1" />
                수정
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`flex flex-col rounded my-2 mx-4 p-2 bg-gray-100`}>
        <div className="flex items-center">
          <img
            src={noProfile}
            alt="프로필"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="ml-2">{review.user_name}</h2>
          <div className="ml-auto mr-2 text-sm bg-white rounded-full px-2 text-center">
            &#9733;{' '}
            {review.rating !== null ? review.rating.toFixed(1) : '평가 전'}
          </div>
        </div>
        <hr className="my-1 bg-gray-300" />
        <div
          onClick={() => {
            void navigate(`/comments/${review.movie_id}/${review.id}`);
          }}
          className={`text-sm m-2 ${viewMode === 'moviePage' ? 'h-40' : 'h-auto'} text-ellipsis overflow-hidden whitespace-pre-line`}
        >
          {showContent ? (
            review.content
          ) : (
            <div className="flex">
              스포일러가 있어요!!&nbsp;
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContent(!showContent);
                }}
                className="text-hotPink"
              >
                보기
              </button>
            </div>
          )}
        </div>
        <hr className="my-1 bg-gray-300" />
        <div className="flex items-center p-1">
          <img src={recommend} alt="추천" className="w-4 h-4" />
          <div className="ml-1">{review.likes_count}</div>
          <img src={comment} alt="댓글" className="w-4 h-4 ml-2" />
          <div className="ml-1">
            {replyList === null ? 0 : replyList.length}
          </div>
        </div>
        <hr className="my-1 bg-gray-300" />
        <button className="text-hotPink" onClick={onClick}>
          좋아요
        </button>
      </div>
      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={closeNeedLoginPopup}
      />
    </>
  );
};

export default CommnetFragment;
