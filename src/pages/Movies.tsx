import { Footerbar } from '../components/Footerbar';
import { Headbar } from '../components/Headbar';

export const Movies = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-none">
        <Headbar />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <h1>Movies page</h1>
      </div>
      <div className="flex-none">
        <Footerbar />
      </div>
    </div>
  );
};
