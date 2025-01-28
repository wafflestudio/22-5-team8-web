import { useContext, useEffect, useRef, useState } from 'react';
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
import { fetchCollection, fetchUser } from '../../utils/Functions';
import type { Collection, UserProfile } from '../../utils/Types';

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
      }
    };
    void getCollection();
  }, [collectionId]);

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
            <button className="flex items-center text-gray-600">
              <img src={notRecommend} alt="좋아요" className="w-5 h-5 mr-1" />
            </button>
            <button
              onClick={() => {}}
              className="flex items-center text-gray-600"
            >
              <img src={replyIcon} alt="댓글" className="w-5 h-5 mr-1" />
            </button>
            <button className="flex items-center text-gray-600">
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
    </>
  );
};

export default CollectionPage;
