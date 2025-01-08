import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import back from '../../assets/back.svg';
import share from '../../assets/share.svg';

export const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate(-1);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white">
      <div className="py-3 px-1">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
          >
            <img src={back} alt="뒤로가기" className="w-6 h-6" />
          </button>
          <div className="text-lg font-semibold">{title}</div>
          <button
            onClick={() => void handleShare()}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
          >
            <img src={share} alt="공유하기" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
