import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate, useParams } from 'react-router-dom';

import back from '../assets/back.svg';
import bookmark from '../assets/bookmark_gray.svg';
import noProfile from '../assets/no_profile.svg';
import notRecommend from '../assets/not_recommend.svg';
import watching from '../assets/not_watching.svg';
import replyIcon from '../assets/reply.svg';
import share from '../assets/share.svg';
import { Footerbar } from '../components/Footerbar';
import {
  fetchMovie,
  fetchReplyList,
  fetchReviewWithId,
} from '../utils/Functions';
import type { Movie, Reply, Review } from '../utils/Types';
import NeedLoginPopup from './movie/NeedLoginPopup';

const CommentPage = () => {
  const { movieId: movieIdString, commentId: commentIdString } = useParams();
  const navigate = useNavigate();
  const movieId: number = parseInt(movieIdString == null ? '0' : movieIdString);
  const commentId: number = parseInt(
    commentIdString == null ? '0' : commentIdString,
  );

  const [movie, setMovie] = useState<Movie | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [replyList, setReplyList] = useState<Reply[] | null>(null);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);

  const closeNeedLoginPopup = () => {
    setIsNeedLoginPopupOpen(false);
  };

  const handleBack = () => {
    void navigate(-1);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleRecommend = async () => {};

  useEffect(() => {
    fetchMovie(movieId)
      .then((data) => {
        setMovie(data);
        //console.log(data);
      })
      .catch((err: unknown) => {
        console.error(err);
      });

    fetchReviewWithId(commentId)
      .then((data) => {
        setReview(data);
        if (data !== null) {
          setShowContent(!data.spoiler);
        }
        //console.log(data);
      })
      .catch((err: unknown) => {
        console.error(err);
      });

    fetchReplyList(commentId)
      .then((data) => {
        setReplyList(data);
        //console.log(data);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, [movieId, commentId]);

  if (review === null || movie === null) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex drop-shadow items-center fixed z-10 top-0 w-full bg-white">
        <button
          onClick={handleBack}
          className={`flex items-center space-x-2 p-4 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
        >
          <img src={back} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">코멘트</h1>
      </div>
      <div className="py-16 px-4 min-h-screen">
        <div className="pt-2 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start">
                  <Link to={`/profile/${review.user_id}`}>
                    <img
                      src={
                        review.profile_url === null
                          ? noProfile
                          : review.profile_url
                      }
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                  </Link>
                  <div>
                    <p className="text-sm">{review.user_name}</p>
                    <p className="text-xs text-gray-500">{review.created_at}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div>
                  <h2 className="text-sm font-bold">{movie.title}</h2>
                  <p className="text-xs text-gray-500">시리즈 · {movie.year}</p>
                  <div className="w-fit mt-2 text-sm bg-gray-100 rounded-full px-2 text-center">
                    {review.rating !== null && review.rating !== 0 ? (
                      `★ ${review.rating.toFixed(1)}`
                    ) : review.status === '' ? (
                      '평가 전'
                    ) : review.status === 'Watching' ? (
                      <div className="flex items-center justify-center">
                        <img className="w-4 h-4 mr-1" src={watching}></img>
                        {'보는 중'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <img className="w-4 h-4 mr-1" src={bookmark}></img>
                        {'보고싶어요'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Link to={`/movies/${movieId}`}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded mr-0 mt-0 mb-auto"
              />
            </Link>
          </div>
          <div className="text-gray-800 mb-10">
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
          <div className="flex justify-between items-center text-sm text-gray-600 py-2">
            <span>좋아요 {review.likes_count}</span>
            <span className="ml-3 mr-auto">댓글 {replyList?.length}</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-16 border-y py-2">
          <button
            onClick={() => void handleRecommend()}
            className="flex items-center text-gray-600"
          >
            <img src={notRecommend} alt="좋아요" className="w-5 h-5 mr-1" />
          </button>
          <button
            onClick={() => {}}
            className="flex items-center text-gray-600"
          >
            <img src={replyIcon} alt="댓글" className="w-5 h-5 mr-1" />
          </button>
          <button
            onClick={() => void handleShare()}
            className="flex items-center text-gray-600"
          >
            <img src={share} alt="공유" className="w-5 h-5 mr-1" />
          </button>
        </div>
        <div>
          {replyList === null || replyList.length === 0 ? (
            <div className="py-2 text-sm">댓글이 없습니다.</div>
          ) : (
            replyList.map((reply) => (
              <div key={reply.id} className="flex items-start border-b py-4">
                <img
                  src={
                    reply.profile_url === null ? noProfile : reply.profile_url
                  }
                  alt={reply.user_name}
                  className="w-8 h-8 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-bold text-sm">{reply.user_name}</p>
                    <p className="text-xs text-gray-500">{reply.created_at}</p>
                  </div>
                  <p className="text-sm text-gray-800 mt-2">{reply.content}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    좋아요 {reply.likes_count}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={closeNeedLoginPopup}
      />
    </div>
  );
};

export default CommentPage;
