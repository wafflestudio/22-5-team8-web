import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';
import etc from '../../assets/etc.svg';
import noProfile from '../../assets/no_profile.svg';
import notRecommend from '../../assets/not_recommend.svg';
import replyIcon from '../../assets/reply.svg';
import share from '../../assets/share.svg';
import { AuthContext } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import { Modal } from '../../components/Modal';
import {
  fetchBlokedUserList,
  fetchCollection,
  fetchCollectionCommentList,
  fetchUser,
} from '../../utils/Functions';
import type {
  Collection,
  CollectionComment,
  UserProfile,
} from '../../utils/Types';
import NeedLoginPopup from '../movie/NeedLoginPopup';
import CollectionCommentFragment from './CollectionCommentFragment';

const CollectionPage = () => {
  const { accessToken, user_id } = useContext(AuthContext);
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [isNewComment, setIsNewComment] = useState<boolean>(false);
  const [commentList, setCommentList] = useState<CollectionComment[]>([]);
  const [blockedUserList, setBlockedUserList] = useState<number[]>([]);

  const PAGE_SIZE = 10;

  const [begin, setBegin] = useState(0);
  const [end, setEnd] = useState(PAGE_SIZE); // 초기 로드 범위
  const [isLoadingComments, setIsLoadingComments] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부

  const commentRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  const scrollToComment = () => {
    if (commentRef.current != null) {
      const headerHeight = 48; // 헤더의 높이(px 단위)
      const elementPosition = commentRef.current.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    isInitialRender.current = true;

    if (user_id !== null) {
      fetchBlokedUserList(user_id)
        .then((data) => {
          //console.log(data);
          setBlockedUserList(data);
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  }, [accessToken, user_id]);

  const fetchComments = useCallback(() => {
    if (isLoadingComments || !hasMore || collectionId === undefined) return;
    setIsLoadingComments(true);

    fetchCollectionCommentList(Number(collectionId), begin, end)
      .then((data) => {
        if (data === null) {
          setCommentList([]);
          setHasMore(false);
        } else {
          setCommentList((prev) => {
            const uniqueComments = data.filter(
              (newComment) =>
                !prev.some((existing) => existing.id === newComment.id),
            );
            return [...prev, ...uniqueComments];
          });
          if (data.length < PAGE_SIZE) setHasMore(false);
        }
        //console.log(data);
      })
      .catch((err: unknown) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingComments(false);
        setBegin(end);
        setEnd(end + PAGE_SIZE);
      });
  }, [begin, collectionId, end, hasMore, isLoadingComments]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !isLoading &&
      hasMore
    ) {
      //console.log('fetch');
      fetchComments();
    }
  }, [fetchComments, hasMore, isLoading]);

  // 초기 데이터 로드
  useEffect(() => {
    if (isInitialRender.current) {
      //console.log('initial fetch');
      if (accessToken !== null) {
        setBegin(0);
        setEnd(PAGE_SIZE);
        setIsLoadingComments(false);
        //console.log('reset');
      }
      isInitialRender.current = false;
      fetchComments();
    }
  }, [accessToken, fetchComments]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const getIsLike = async () => {
      try {
        if (collectionId != null && accessToken != null) {
          const response = await fetch(
            `/api/collections/like/${collectionId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error('Failed to fetch like status');
          }

          const data = (await response.json()) as boolean;
          setIsLike(data);
        }
      } catch (err) {
        console.error('Failed to fetch like status:', err);
      }
    };

    void getIsLike();
  }, [accessToken, collectionId]);

  useEffect(() => {
    const getCollection = async () => {
      try {
        if (collectionId != null) {
          const collectionData = (await fetchCollection(
            Number(collectionId),
          )) as Collection;
          setCollection(collectionData);
          const userData = (await fetchUser(
            collectionData.user_id,
          )) as UserProfile;
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to fetch collection:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
        setIsNewComment(false);
      }
    };
    void getCollection();
  }, [collectionId, isNewComment, isLike]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current != null &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRecommend = () => {
    if (accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (collectionId == null) {
      return;
    }

    const updateLike = async () => {
      try {
        const response = await fetch(`/api/collections/like/${collectionId}`, {
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

  const handleDelete = async () => {
    setError(null);
    try {
      if (collectionId != null) {
        setIsLoading(true);
        const response = await fetch(`/api/collections/${collectionId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`Failed to delete collection: ${response.status}`);
        }

        if (user != null) {
          void navigate(`/profile/${user.user_id}/collections`);
        }
      }
    } catch (err) {
      setError((err as Error).message);
      console.error('Collection deletion error:', err);
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('링크 복사 실패:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    if (collectionId == null || comment === '') {
      return;
    }

    try {
      const response = await fetch(`/api/collection_comments/${collectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      //console.log(response);
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setComment('');
      setIsNewComment(true);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error != null) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  if (collection == null) {
    return (
      <div className="container mx-auto px-4 py-8">Collection not found</div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <div className="fixed top-0 left-0 right-0 bg-white z-20 px-4 py-2">
          <div className="flex justify-between items-center">
            <img
              src={back}
              className="w-5 h-5 fill-current"
              onClick={() => {
                void navigate(-1);
              }}
            />
            {user_id === collection.user_id && (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={etc}
                  className="cursor-pointer w-8 h-8"
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                  }}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border">
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setShowDropdown(false);
                          setShowDeleteModal(true);
                        }}
                      >
                        삭제
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setShowDropdown(false);
                          if (collectionId != null) {
                            void navigate(`/collections/${collectionId}/edit`);
                          }
                        }}
                      >
                        수정하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 px-4 py-2 pb-16 pt-16">
          {user != null && (
            <Link
              to={`/profile/${user.user_id}`}
              className="flex items-center mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={user.profile_url === null ? noProfile : user.profile_url}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 font-medium">{user.username}</div>
            </Link>
          )}

          <h1 className="text-2xl font-bold mb-2 text-left">
            {collection.title}
          </h1>
          <p className="text-gray-600 mb-4 text-left">{collection.overview}</p>

          <div className="flex items-center text-gray-600 mb-4 text-left">
            <div>좋아요 {collection.likes_count}</div>
            <div className="mx-2">•</div>
            <div>댓글 {collection.comments_count}</div>
            <div className="mx-2">•</div>
            <div>{new Date(collection.created_at).toLocaleDateString()}</div>
          </div>

          <div className="flex justify-between items-center px-16 border-y py-2">
            <button
              onClick={handleRecommend}
              className="flex items-center text-gray-600"
            >
              {isLike ? (
                <Recommend className="w-5 h-5 mr-1" />
              ) : (
                <img src={notRecommend} alt="좋아요" className="w-5 h-5 mr-1" />
              )}
            </button>
            <button
              onClick={scrollToComment}
              className="flex items-center text-gray-600"
            >
              <img src={replyIcon} alt="댓글" className="w-5 h-5 mr-1" />
            </button>
            <button
              className="flex items-center text-gray-600"
              onClick={() => void handleShare()}
            >
              <img src={share} alt="공유" className="w-5 h-5 mr-1" />
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 text-left">작품들</h2>
            <div className="grid grid-cols-3 gap-4">
              {collection.movies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="rounded"
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-auto rounded"
                  />
                  <div className="mt-1 text-sm line-clamp-2">{movie.title}</div>
                </Link>
              ))}
            </div>
          </div>

          <hr className="w-11/12 my-5 bg-gray-300" />

          <div ref={commentRef} className="mt-4">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold text-left mr-2">댓글</h2>
              <div className="text-gray-600">{collection.comments_count}</div>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="컬렉션에 댓글을 남겨보세요."
                className="flex-grow mr-2 px-2 py-2 border-none bg-gray-100 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-hotPink"
              />

              <button
                onClick={() => void handleSubmit()}
                className={`${comment === '' ? '' : 'text-hotPink'} flex items-center gap-1 px-2 py-2 bg-white text-gray-700 rounded-md`}
              >
                {comment === '' ? (
                  <img src={replyIcon} alt="댓글" className="w-5 h-5" />
                ) : (
                  <Reply className="w-5 h-5" />
                )}
                등록
              </button>
            </div>
            <div className="gap-4">
              {commentList
                .filter((com) => !blockedUserList.includes(com.user_id))
                .map((initialComment) => (
                  <CollectionCommentFragment
                    initialComment={initialComment}
                    key={initialComment.id}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="flex-none fixed bottom-0 w-full z-10">
          <Footerbar />
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        title="알림"
        message="컬렉션을 정말 삭제하시겠어요? 삭제된 컬렉션은 복구할 수 없어요."
        onConfirm={() => {
          void handleDelete();
        }}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
      />

      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={() => {
          setIsNeedLoginPopupOpen(false);
        }}
      />
    </>
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

const Reply = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className}
    >
      <path
        fill="#FF2F6E"
        d="M12 2C6.47 2 2 5.83 2 10.56a8.19 8.19 0 0 0 4 6.84v3.4a.5.5 0 0 0 .84.36l2.23-2.11.25-.25c.878.206 1.778.31 2.68.31 5.52 0 10-3.83 10-8.55S17.52 2 12 2m0 15.61a10 10 0 0 1-2.66-.35L7.2 19.17v-2.79a6.86 6.86 0 0 1-3.71-5.82c0-3.69 3.58-7.06 8.5-7.06s8.5 3.37 8.5 7.06-3.61 7.05-8.49 7.05"
      ></path>
    </svg>
  );
};

export default CollectionPage;
