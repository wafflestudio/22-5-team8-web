import { Footerbar } from '../../components/Footerbar';
import { Header } from './Header';
import StarRating from './StarRating';

export const MoviePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none">
        <Header />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1>Movie Detail Page</h1>
        <StarRating />
      </div>
      <div className="flex-none">
        <Footerbar />
      </div>
    </div>
  );
};
