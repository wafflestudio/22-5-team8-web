import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';
import bookmark from '../../assets/bookmark_gray.svg';
import noProfile from '../../assets/no_profile.svg';
import notRecommend from '../../assets/not_recommend.svg';
import watching from '../../assets/not_watching.svg';
import replyIcon from '../../assets/reply.svg';
import share from '../../assets/share.svg';
import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import {
  fetchLoggedInReplyList,
  fetchMovie,
  fetchReplyList,
  fetchReviewWithId,
} from '../../utils/Functions';
import type { Movie, Reply, Review } from '../../utils/Types';
import NeedLoginPopup from '../movie/NeedLoginPopup';
import ReplyFragment from './ReplyFragment';
import ReplyPopup from './ReplyPopup';

const CommentPage = () => {
  const { movieId: movieIdString, commentId: reviewIdString } = useParams();
  const navigate = useNavigate();
  const isInitialRender = useRef(true);
  const movieId: number = parseInt(movieIdString == null ? '0' : movieIdString);
  const reviewId: number = parseInt(
    reviewIdString == null ? '0' : reviewIdString,
  );
  const { accessToken } = useAuth();

  const PAGE_SIZE = 10;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [replyList, setReplyList] = useState<Reply[]>([]);
  const [begin, setBegin] = useState(0);
  const [end, setEnd] = useState(PAGE_SIZE); // 초기 로드 범위
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const [loggedInReplyList, setLoggedInReplyList] = useState<Reply[]>([]);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [isReplyPopupOpen, setIsReplyPopupOpen] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);

  const fetchReplies = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    if (accessToken === null) {
      fetchReplyList(reviewId, begin, end)
        .then((data) => {
          if (data === null) {
            setReplyList([]);
            setHasMore(false);
          } else {
            setReplyList((prev) => {
              const uniqueReplies = data.filter(
                (newReply) =>
                  !prev.some((existing) => existing.id === newReply.id),
              );
              return [...prev, ...uniqueReplies];
            });
            if (data.length < PAGE_SIZE) setHasMore(false);
          }
          //console.log(data);
        })
        .catch((err: unknown) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
          setBegin(end);
          setEnd(end + PAGE_SIZE);
        });
    } else {
      fetchLoggedInReplyList(reviewId, accessToken, begin, end)
        .then((data) => {
          if (data === null) {
            setLoggedInReplyList([]);
            setHasMore(false);
          } else {
            setLoggedInReplyList((prev) => {
              const uniqueReplies = data.filter(
                (newReply) =>
                  !prev.some((existing) => existing.id === newReply.id),
              );
              return [...prev, ...uniqueReplies];
            });
            if (data.length < PAGE_SIZE) setHasMore(false);
          }
          //console.log(data);
        })
        .catch((err: unknown) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
          setBegin(end);
          setEnd(end + PAGE_SIZE);
        });
    }
  }, [accessToken, begin, end, hasMore, isLoading, reviewId]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      hasMore
    ) {
      //console.log('fetch');
      fetchReplies();
    }
  }, [fetchReplies, hasMore, isLoading]);

  // 초기 데이터 로드
  useEffect(() => {
    if (isInitialRender.current) {
      //console.log('initial fetch');
      if (accessToken !== null) {
        setBegin(0);
        setEnd(PAGE_SIZE);
        setIsLoading(false);
        //console.log('reset');
      }
      isInitialRender.current = false;
      fetchReplies();
    }
  }, [accessToken, fetchReplies]);

  useEffect(() => {
    isInitialRender.current = true;
  }, [accessToken]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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

  const handleRecommend = () => {
    if (accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    const updateLike = async () => {
      try {
        const response = await fetch(`/api/reviews/like/${reviewId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to update like');
        }
        setIsLike(!isLike);
      } catch (err) {
        console.error(err);
      }
    };

    void updateLike();
  };

  const handleReply = () => {
    if (accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    setIsReplyPopupOpen(true);
  };

  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    const fetchLoggedInReview = async () => {
      try {
        const response = await fetch(`/api/reviews/list/${movieId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch first review');
        }
        const data = (await response.json()) as Review[];
        const reviewData = data.find((r) => r.id === reviewId);
        setIsLike(reviewData?.like ?? false);
      } catch (err) {
        console.error(err);
      }
    };
    void fetchLoggedInReview();
  }, [accessToken, reviewId, movieId]);

  useEffect(() => {
    fetchMovie(movieId)
      .then((data) => {
        setMovie(data);
        //console.log(data);
      })
      .catch((err: unknown) => {
        console.error(err);
      });

    fetchReviewWithId(reviewId)
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
  }, [movieId, reviewId, isLike]);

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
                    <p className="text-xs text-gray-500">
                      {new Date(
                        new Date(review.created_at).getTime() +
                          9 * 60 * 60 * 1000,
                      ).toLocaleString()}
                    </p>
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
            <span className="ml-3 mr-auto">댓글 {replyList.length}</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-16 border-y py-2">
          <button
            onClick={() => {
              handleRecommend();
            }}
            className="flex items-center text-gray-600"
          >
            {isLike ? (
              <Recommend className="w-5 h-5 mr-1" />
            ) : (
              <img src={notRecommend} alt="좋아요" className="w-5 h-5 mr-1" />
            )}
          </button>
          <button
            onClick={() => {
              handleReply();
            }}
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
          {replyList.length === 0 && loggedInReplyList.length === 0 ? (
            <div className="py-2 text-sm">댓글이 없습니다.</div>
          ) : (
            (accessToken === null ? replyList : loggedInReplyList).map(
              (reply) => (
                <div key={reply.id}>
                  <ReplyFragment reply={reply} />
                </div>
              ),
            )
          )}
        </div>
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={() => {
          setIsNeedLoginPopupOpen(false);
        }}
      />
      <ReplyPopup
        isOpen={isReplyPopupOpen}
        onClose={() => {
          setIsReplyPopupOpen(false);
          window.location.reload();
        }}
        review={review}
        onReplyUpdate={() => {}}
      />
    </div>
  );
};

const Recommend = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#FF2F6E"
      viewBox="0 0 24 24"
      className={props.className}
    >
      <rect width="4" height="11" x="2" y="10" fill="#FF2F6E" rx="0.75"></rect>
      <path
        fill="#FF2F6E"
        d="M7.5 9.31a.75.75 0 0 1 .22-.53l5.75-5.75a.75.75 0 0 1 1.06 0l.679.679a.75.75 0 0 1 .202.693L14.5 8.5h6.75a.75.75 0 0 1 .75.75v3.018a6 6 0 0 1-.485 2.364l-2.32 5.413a.75.75 0 0 1-.69.455H8.25a.75.75 0 0 1-.75-.75z"
      ></path>
    </svg>
  );
};

export default CommentPage;
