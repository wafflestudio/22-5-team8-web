import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import { type UserProfile } from '../../utils/Types';
import { MyPage } from './MyPage';

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

  // Check if the user is viewing their own profile
  if (user_id === viewUserId) {
    return <MyPage />;
  }

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
      <div className="flex-1 overflow-y-auto bg-gray-100">
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
        <div className="bg-gray-100 p-4">
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
        <div className="p-4">
          <h2 className="text-lg font-semibold">캘린더</h2>
          <div className="text-center py-4">
            <p className="text-xl font-bold">2025.1</p>
          </div>
          <div className="grid grid-cols-7 text-sm">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className={`py-4 ${i + 1 === 6 ? 'text-pink-500' : ''}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footerbar />
    </div>
  );
};
