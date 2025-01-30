import { useContext, useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa'; // Cogwheel icon from react-icons
import { Link } from 'react-router-dom';

import { AuthContext } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import MovieCalendar from '../../components/MovieCalendar';

export const MyPage = () => {
  const { fetchUser } = useContext(AuthContext);
  const [user, setUser] = useState({ username: '', login_id: '' });

  useEffect(() => {
    const getUser = async () => {
      console.debug('Fetching user...');
      await fetchUser();
      const storedUser = localStorage.getItem('user');
      console.debug('Stored user:', storedUser);
      if (storedUser !== null) {
        setUser(
          JSON.parse(storedUser) as { username: string; login_id: string },
        );
      }
    };
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      setUser(JSON.parse(storedUser) as { username: string; login_id: string });
    } else {
      getUser().catch((error: unknown) => {
        console.error('Failed to fetch user:', error);
      });
    }
  }, [fetchUser]);

  const { username, login_id } = user;

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Top Profile Section */}
        <div className="bg-white p-6 relative">
          <div className="flex flex-col items-start space-y-4">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full bg-gray-300"></div>
            {/* Profile Info */}
            <div className="text-left">
              {<h1 className="text-xl font-bold">{username}</h1>}
              {<p className="text-sm text-gray-600">{login_id}</p>}
              <p className="text-sm text-gray-400 mt-2">
                팔로워 <span className="text-black font-bold">0</span> | 팔로잉{' '}
                <span className="text-black font-bold">1</span>
              </p>
            </div>
          </div>
          {/* Cogwheel Icon */}
          <Link to="/mypage/settings">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
              <FaCog className="w-6 h-6" />
            </button>
          </Link>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-3 text-center py-4 bg-white">
          <div>
            <p className="font-bold">0</p>
            <p className="text-gray-500">평가</p>
          </div>
          <div>
            <p className="font-bold">0</p>
            <p className="text-gray-500">코멘트</p>
          </div>
          <div>
            <p className="font-bold">0</p>
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

        {/* Likes Section */}
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
      </div>

      {/* Footer Section */}
      <Footerbar />
    </div>
  );
};
