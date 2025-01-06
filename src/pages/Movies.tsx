import { Link } from 'react-router-dom';

import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';

export const Movies = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none">
        <Headbar />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1>Movies page</h1>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          to="/movies/1"
        >
          Go to MoviePage
        </Link>
      </div>
      <div className="flex-none">
        <Footerbar />
      </div>
    </div>
  );
};
