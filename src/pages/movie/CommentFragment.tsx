import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import comment from '../../assets/comment.svg';
import noProfile from '../../assets/no_profile.svg';
import recommend from '../../assets/recommend.svg';
import { useAuth } from '../../components/AuthContext';
import type { Reply, Review } from '../../utils/Types';
import NeedLoginPopup from './NeedLoginPopup';

type CommnetFragmentProps = {
  viewMode: 'moviePage' | 'commentPage';
  initialReview: Review | null;
};

const CommnetFragment = ({ viewMode, initialReview }: CommnetFragmentProps) => {
  const [review, setReview] = useState<Review | null>(initialReview);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [replyList, setReplyList] = useState<Reply[] | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const { isLoggedIn, accessToken } = useAuth();

  const closeNeedLoginPopup = () => {
    setIsNeedLoginPopupOpen(false);
  };

  useEffect(() => {
    const fetchReplyList = async () => {
      if (review === null) {
        return;
      }

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
            &#9733; {review.rating.toFixed(1)}
          </div>
        </div>
        <hr className="my-1 bg-gray-300" />
        <Link
          to={`/comments/${review.id}`}
          className={`text-sm m-2 ${viewMode === 'moviePage' ? 'h-40' : 'h-auto'} text-ellipsis overflow-hidden whitespace-pre-line`}
        >
          {review.content}
        </Link>
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
