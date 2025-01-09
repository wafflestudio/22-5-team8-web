import { Link, useLocation } from 'react-router-dom';

export const Headbar = () => {
  const location = useLocation();

  const getLinkStyle = (path: string) => {
    return `text-2xl font-bold ${location.pathname === path ? 'text-black' : 'text-gray-500'}`;
  };

  return (
    <div className="bg-white relative">
      <div className="p-4">
        <div className="flex items-center">
          <Link to="/" className={getLinkStyle('/')}>
            홈
          </Link>
          <div className="mx-4 h-6 w-[1px] bg-gray-300"></div>
          <Link to="/movies" className={getLinkStyle('/movies')}>
            영화
          </Link>
        </div>
      </div>
    </div>
  );
};
