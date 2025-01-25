import { Link } from 'react-router-dom';

import home from '../assets/home.svg';
import login from '../assets/login.svg';
import news from '../assets/news.svg';
import search from '../assets/search.svg';
import star from '../assets/star.svg';
import { useAuth } from './AuthContext';
import { useReturnPath } from './ReturnPathContext';

export const Footerbar = () => {
  const { isLoggedIn, user_id } = useAuth();
  const { setReturnPath } = useReturnPath();

  return (
    <div className="bg-white">
      <div className="pt-4">
        <div className="flex justify-center gap-12">
          <Link to="/">
            <div className="flex flex-col items-center">
              <img src={home} className="w-6 h-6 mb-1" />
              <div className="text-xs">홈</div>
            </div>
          </Link>
          <Link to="/search">
            <div className="flex flex-col items-center">
              <img src={search} className="w-6 h-6 mb-1" />
              <div className="text-xs">검색</div>
            </div>
          </Link>
          {!isLoggedIn && (
            <Link
              to="/login"
              onClick={() => {
                setReturnPath(location.pathname);
              }}
            >
              <div className="flex flex-col items-center">
                <img src={login} className="w-6 h-6 mb-1" />
                <div className="text-xs">로그인</div>
              </div>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/rating">
              <div className="flex flex-col items-center">
                <img src={star} className="w-6 h-6 mb-1" />
                <div className="text-xs">평가</div>
              </div>
            </Link>
          )}
          {isLoggedIn && (
            <Link to="/news">
              <div className="flex flex-col items-center">
                <img src={news} className="w-6 h-6 mb-1" />
                <div className="text-xs">소식</div>
              </div>
            </Link>
          )}
          {isLoggedIn && user_id !== null && (
            <Link to={`/profile/${user_id}`}>
              <div className="flex flex-col items-center">
                <img src={login} className="w-6 h-6 mb-1" />
                <div className="text-xs">나의 왓챠</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
