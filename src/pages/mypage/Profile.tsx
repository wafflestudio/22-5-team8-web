import { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

import no_profile from '../../assets/no_profile.svg';
import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import MovieCalendar from '../../components/MovieCalendar';
import { fetchFollowingUserList } from '../../utils/Functions';
import { type UserProfile } from '../../utils/Types';

export const Profile = () => {
  const { view_user_id } = useParams();
  const viewUserId = Number(view_user_id);
  const { user_id, accessToken } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        if (user_id == null) {
          throw new Error('User ID is not available');
        }
        const followingList = await fetchFollowingUserList(user_id);
        setFollowing(followingList.some((user) => user.id === viewUserId));
      } catch (err) {
        console.error('Error checking following status:', err);
      }
    };

    if (user_id != null && viewUserId !== 0) {
      void checkFollowingStatus();
    }
  }, [user_id, viewUserId]);

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
      if (isNaN(viewUserId) || accessToken == null) {
        throw new Error('User ID is undefined');
      }

      const endpoint = `/api/users/follow/${viewUserId}`;
      const method = following ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${following ? 'unfollow' : 'follow'} the user`,
        );
      }
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
            <div className="w-20 h-20 rounded-full bg-gray-300">
              <img
                src={profile?.profile_url ?? no_profile}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Profile Info */}
            <div className="text-left">
              {<h1 className="text-xl font-bold">{profile?.username}</h1>}
              <p className="text-sm text-gray-400 mt-2">
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    void navigate(`/profile/${viewUserId}/followers`)
                  }
                >
                  팔로워{' '}
                  <span className="text-black font-bold">
                    {profile?.follower_count}
                  </span>
                </span>{' '}
                |{' '}
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    void navigate(`/profile/${viewUserId}/followings`)
                  }
                >
                  팔로잉{' '}
                  <span className="text-black font-bold">
                    {profile?.following_count}
                  </span>
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
        <div className="grid grid-cols-2 text-center pb-4 bg-white">
          <div onClick={() => void navigate(`/profile/${viewUserId}/reviews`)}>
            <p className="font-bold">{profile?.review_count}</p>
            <p className="text-gray-500">평가</p>
          </div>
          {/* 개발 시간 관계상 코멘트 목록은 삭제 */}
          <div
            onClick={() => {
              void navigate(`/profile/${viewUserId}/collections`);
            }}
          >
            <p className="font-bold">{profile?.collection_count}</p>
            <p className="text-gray-500">컬렉션</p>
          </div>
        </div>
        {/* Saved Items Section */}
        {/* 보관함도 사실상 무의미해서 삭제
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
        */}
        {/* Calendar Section */}
        <MovieCalendar />

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
