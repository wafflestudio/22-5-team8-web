import { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import MovieCalendar from '../../components/MovieCalendar';
import { type UserProfile } from '../../utils/Types';
import Analysis from '../analysis/Analysis';

export const Profile = () => {
  const { view_user_id } = useParams();
  const viewUserId = Number(view_user_id);
  const { user_id } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isNaN(viewUserId)) {
          throw new Error('User ID is undefined');
        }
        const response = await fetch(`/api/users/profile/${viewUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = (await response.json()) as UserProfile;
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchProfile();
  }, [viewUserId]);

  // Handle follow/unfollow button click
  const toggleFollow = async () => {
    try {
      if (isNaN(viewUserId)) {
        throw new Error('User ID is undefined');
      }

      const endpoint = `/api/users/follow/${viewUserId}`;

      const method = following ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, { method });
      if (!response.ok) {
        throw new Error(
          `Failed to ${following ? 'unfollow' : 'follow'} the user`,
        );
      }

      // Update local following state and follower count
      setFollowing(!following);
    } catch (err) {
      console.error('Error toggling follow status:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Top Profile Section */}
        <div className="w-full bg-white p-6 relative">
          <div className="flex flex-col items-start space-y-4">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full bg-gray-300"></div>
            {/* Profile Info */}
            <div className="text-left">
              {<h1 className="text-xl font-bold">{profile?.username}</h1>}
              <p className="text-sm text-gray-400 mt-2">
                팔로워{' '}
                <span className="text-black font-bold">
                  {profile?.follower_count}
                </span>{' '}
                | 팔로잉{' '}
                <span className="text-black font-bold">
                  {profile?.following_count}
                </span>
              </p>
              {<h1 className="text-xl font-bold">{profile?.status_message}</h1>}
            </div>
          </div>
          {/* Follow Button */}
          {user_id !== viewUserId && (
            <div className="w-full mt-3">
              <button
                onClick={() => {
                  void toggleFollow();
                }}
                className={`w-full py-2 px-4 rounded-md font-semibold ${
                  following
                    ? 'bg-white border border-gray-300 text-black'
                    : 'bg-black text-white'
                }`}
              >
                {following ? '팔로잉' : '팔로우'}
              </button>
            </div>
          )}
          {/* Cogwheel Icon */}
          {user_id === viewUserId && (
            <Link to="/mypage/settings">
              <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
                <FaCog className="w-6 h-6" />
              </button>
            </Link>
          )}
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-3 text-center pb-4 bg-white">
          <div>
            <p className="font-bold">{profile?.review_count}</p>
            <p className="text-gray-500">평가</p>
          </div>
          <div>
            <p className="font-bold">{profile?.review_count}</p>
            <p className="text-gray-500">코멘트</p>
          </div>
          <div
            onClick={() => {
              if (isNaN(viewUserId)) {
                void navigate(`/profile/${viewUserId}/collections`);
              }
            }}
          >
            <p className="font-bold">{profile?.collection_count}</p>
            <p className="text-gray-500">컬렉션</p>
          </div>
        </div>
        {/* Saved Items Section */}
        <div className="bg-white p-4">
          <h2 className="text-lg font-semibold mb-2">보관함</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm mt-2">영화</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm mt-2">시리즈</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm mt-2">책</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm mt-2">웹툰</p>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <MovieCalendar />

        {user_id === viewUserId && <Analysis mode="short" />}

        {/* Likes Section */}
        {user_id === viewUserId && (
          <div className="p-4 bg-gray-50">
            <h2 className="text-lg font-semibold">좋아요</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>좋아한 인물</span>
                <span className="text-gray-500">0</span>
              </div>
              <div className="flex justify-between">
                <span>좋아한 컬렉션</span>
                <span className="text-gray-500">0</span>
              </div>
              <div className="flex justify-between">
                <span>좋아한 코멘트</span>
                <span className="text-gray-500">0</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <Footerbar />
    </div>
  );
};
