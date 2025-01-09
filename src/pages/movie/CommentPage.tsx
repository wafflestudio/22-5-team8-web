import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';

const CommentPage = () => {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const id: number = parseInt(commentId == null ? '0' : commentId);

  const handleBack = () => {
    void navigate(-1);
  };

  useEffect(() => {}, [id]);

  return (
    <div className="flex flex-col">
      <div className="flex drop-shadow items-center fixed z-10 top-0 w-full bg-white">
        <button
          onClick={handleBack}
          className={`flex items-center space-x-2 p-4 rounded ${isMobile ? '' : 'hover:bg-gray-100'}`}
        >
          <img src={back} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">코멘트</h1>
      </div>
    </div>
  );
};

export default CommentPage;
