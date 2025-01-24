import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';

import back from '../../assets/back.svg';
import CommnetFragment from '../../components/CommentFragment';
import { Footerbar } from '../../components/Footerbar';
import type { Review } from '../../utils/Types';

const CommentList = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate(-1);
  };

  const { movieId } = useParams();
  const [commentList, setCommentList] = useState<Review[]>([]);
  const id: number = parseInt(movieId == null ? '0' : movieId);

  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const response = await fetch(`/api/reviews/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch comment list');
        }
        const data = (await response.json()) as Review[];
        const validData = data.filter((review) => review.content !== '');
        setCommentList(validData);
        //console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    void fetchCommentList();
  }, [id]);

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
      <div className="flex flex-col pt-16 pb-20">
        {commentList.map((comment) => (
          <CommnetFragment
            key={comment.id}
            viewMode="commentPage"
            initialReview={comment}
          />
        ))}
        {commentList.length === 0 ? (
          <p className="text-center">코멘트가 없습니다.</p>
        ) : (
          ''
        )}
      </div>
      <div className="flex-none fixed z-10 bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};

export default CommentList;
