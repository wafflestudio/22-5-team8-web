import { useParams } from 'react-router-dom';

import { Footerbar } from '../../components/Footerbar';

export const MonthlyMovies = () => {
  const { date } = useParams();
  console.debug('date:', date);
  return (
    <div className="flex flex-col h-screen">
      <p>asdf</p>
      {/* Footer Section */}
      <Footerbar />
    </div>
  );
};
