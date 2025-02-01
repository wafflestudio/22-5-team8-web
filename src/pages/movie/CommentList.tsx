import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';
import { useAuth } from '../../components/AuthContext';
import CommnetFragment from '../../components/CommentFragment';
import { Footerbar } from '../../components/Footerbar';
import ToggleButton from '../../components/ToggleButton';
import {
  fetchBlokedUserList,
  fetchFollowingUsers,
} from '../../utils/Functions';
import type { Review } from '../../utils/Types';

const CommentList = () => {
  const navigate = useNavigate();
  const { accessToken, user_id } = useAuth();
  const isInitialRender = useRef(true);

  const PAGE_SIZE = 10;

  const { movieId } = useParams();
  const [commentList, setCommentList] = useState<Review[]>([]);
  const [loggedInCommentList, setLoggedInCommentList] = useState<Review[]>([]);
  const [begin, setBegin] = useState(0);
  const [end, setEnd] = useState(PAGE_SIZE); // 초기 로드 범위
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
  const [blockedUserList, setBlockedUserList] = useState<number[]>([]);
  const [followingUserList, setFollowingUserList] = useState<number[]>([]);
  const id: number = parseInt(movieId == null ? '0' : movieId);
  const [isOn, setIsOn] = useState(false);

  const handleBack = () => {
    void navigate(-1);
  };

  useEffect(() => {
    if (user_id !== null) {
      fetchBlokedUserList(user_id)
        .then((data) => {
          //console.log(data);
          setBlockedUserList(data);
        })
        .catch((err: unknown) => {
          console.error(err);
        });

      fetchFollowingUsers(user_id)
        .then((data) => {
          //console.log(data);
          setFollowingUserList(data);
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  }, [accessToken, user_id]);

  // 코멘트 데이터 가져오기
  const fetchCommentList = useCallback(async () => {
    if (isLoading || !hasMore) return; // 이미 로딩 중이거나 더 가져올 데이터가 없으면 중단
    setIsLoading(true);

    //console.log(begin, end, accessToken);

    try {
      if (accessToken === null) {
        const response = await fetch(
          `/api/reviews/movie/${id}?begin=${begin}&end=${end}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comment list');
        }
        const data = (await response.json()) as Review[];
        const validData = data.filter((review) => review.content !== '');
        setCommentList((prev) => {
          // 중복 데이터 제거
          const uniqueComments = validData.filter(
            (newComment) =>
              !prev.some((existing) => existing.id === newComment.id),
          );
          return [...prev, ...uniqueComments];
        });
        if (data.length < end - begin - 1) setHasMore(false); // 가져온 데이터가 요청한 범위보다 적으면 더 이상 데이터 없음
      } else {
        const response = await fetch(
          `/api/reviews/list/${id}?begin=${begin}&end=${end}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comment list');
        }
        const data = (await response.json()) as Review[];
        const validData = data.filter((review) => review.content !== '');
        setLoggedInCommentList((prev) => {
          // 중복 데이터 제거
          const uniqueComments = validData.filter(
            (newComment) =>
              !prev.some((existing) => existing.id === newComment.id),
          );
          return [...prev, ...uniqueComments];
        });
        if (data.length < end - begin - 1) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setBegin(end); // 다음 요청 범위 설정
      setEnd(end + PAGE_SIZE);
    }
  }, [accessToken, id, begin, end, isLoading, hasMore]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      hasMore
    ) {
      //console.log('fetch');
      void fetchCommentList();
    }
  }, [fetchCommentList, hasMore, isLoading]);

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
      void fetchCommentList();
    }
  }, [accessToken, fetchCommentList]);

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

  return (
    <div className="flex flex-col">
      <div className="flex drop-shadow items-center fixed z-10 top-0 w-full bg-white">
        <button
          onClick={handleBack}
          className={`flex items-center space-x-2 p-4 rounded ${
            isMobile ? '' : 'hover:bg-gray-100'
          }`}
        >
          <img src={back} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">코멘트</h1>
        <div className="flex items-center ml-auto mr-4 text-center">
          <h2 className="text-sm font-bold">친구</h2>
          <ToggleButton
            initialState={isOn}
            onToggle={() => {
              setIsOn(!isOn);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col pt-16 pb-20">
        {(accessToken === null ? commentList : loggedInCommentList)
          .filter(
            (comment) =>
              !blockedUserList.includes(comment.user_id) &&
              (isOn ? followingUserList.includes(comment.user_id) : true),
          )
          .map((comment) => (
            <CommnetFragment
              key={comment.id}
              viewMode="commentPage"
              initialReview={comment}
            />
          ))}
        {isLoading && <p className="text-center">Loading...</p>}
        {!isLoading &&
          (accessToken === null ? commentList : loggedInCommentList).length ===
            0 && <p className="text-center">코멘트가 없습니다.</p>}
        {!hasMore && <p className="text-center"></p>}
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};

export default CommentList;
