import { Link } from 'react-router-dom';

export const Headbar = () => {
  return (
    <div className="bg-white mt-2">
      <div className="p-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            홈
          </Link>
          <div className="mx-4 h-6 w-[1px] bg-gray-300"></div>
          <Link to="/movies" className="text-2xl font-bold">
            영화
          </Link>
        </div>
      </div>
    </div>
  );
};
