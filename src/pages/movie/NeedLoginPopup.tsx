import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useReturnPath } from '../../components/ReturnPathContext';

type NeedLoginPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NeedLoginPopup = ({ isOpen, onClose }: NeedLoginPopupProps) => {
  const { setReturnPath } = useReturnPath();
  const location = useLocation();
  const navigate = useNavigate();

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    return null;
  }

  const handleOnLoginClick = () => {
    setReturnPath(location.pathname);
    void navigate('/login');
  };

  return (
    <div className="flex flex-col fixed inset-0 z-50 w-100 h-100 bg-white color-hotPink">
      <div className="p-4">
        <svg
          className="cursor-pointer"
          onClick={onClose}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path
            fill="#FF2F6E"
            fillRule="evenodd"
            d="M15.279 2.72a.666.666 0 0 0-.942 0L9 8.059 3.663 2.721a.666.666 0 1 0-.942.942L8.058 9l-5.337 5.337a.666.666 0 0 0 .942.942L9 9.942l5.337 5.337a.666.666 0 0 0 .942-.942L9.942 9l5.337-5.337a.666.666 0 0 0 0-.942"
            clipRule="evenodd"
          />
        </svg>
        <div className="py-60 px-5 flex flex-col justify-center items-center">
          <div className="flex gap-1">
            <h1 className="text-4xl font-bold text-hotPink">WATCHA</h1>
            <h1 className="text-4xl font-bold text-gray-700">PEDIA</h1>
          </div>
          <h2 className="pt-20 font-semibold text-center text-gray-700 whitespace-pre-line">
            {`회원가입 혹은 로그인이 필요한 기능이에요.
            왓챠피디아를 더 편하게 이용해 보세요.`}
          </h2>
        </div>
        <div className="flex flex-col gap-y-5 justify-center items-center">
          <Link
            to="/signup"
            className="text-white bg-hotPink rounded w-full h-12 flex justify-center items-center"
          >
            회원가입
          </Link>
          <button onClick={handleOnLoginClick} className="text-hotPink">
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedLoginPopup;
