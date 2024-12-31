import { Link } from 'react-router-dom';

import home from '../assets/home.svg';
import login from '../assets/login.svg';
import search from '../assets/search.svg';

export const Footerbar = () => {
  return (
    <div className="bg-white">
      <div className="pt-4">
        <div className="flex justify-center gap-16">
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
          <Link to="/sign_in">
            <div className="flex flex-col items-center">
              <img src={login} className="w-6 h-6 mb-1" />
              <div className="text-xs">로그인</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
