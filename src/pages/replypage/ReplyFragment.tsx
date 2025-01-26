import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import edit from '../../assets/edit.svg';
import noProfile from '../../assets/no_profile.svg';
import trash from '../../assets/trash.svg';
import { useAuth } from '../../components/AuthContext';
import { Modal } from '../../components/Modal';
import type { Reply } from '../../utils/Types';
import NeedLoginPopup from '../movie/NeedLoginPopup';
import ReplyPopup from './ReplyPopup';

const ReplyFragment = ({ reply: initialReply }: { reply: Reply }) => {
  const [isLike, setIsLike] = useState<boolean>(false);
  const [reply, setReply] = useState<Reply>(initialReply);
  const [isNeedLoginPopupOpen, setIsNeedLoginPopupOpen] =
    useState<boolean>(false);
  const [isReplyPopupOpen, setIsReplyPopupOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isLoggedIn, accessToken, user_id } = useAuth();

  useEffect(() => {
    setIsLike(reply.like);
  }, [reply]);

  const onClick = () => {
    if (!isLoggedIn || accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    const updateLike = async () => {
      try {
        const response = await fetch(`/api/comments/like/${initialReply.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = (await response.json()) as Reply;
        setReply(data);

        if (!response.ok) {
          throw new Error('Failed to update like');
        }
        setIsLike(!isLike);
      } catch (err) {
        console.error(err);
      }
    };

    void updateLike();

    setIsLike(!isLike);
  };

  const onClickEdit = () => {
    if (!isLoggedIn || accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    setIsReplyPopupOpen(true);
  };

  const onClickDelete = () => {
    if (!isLoggedIn || accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!isLoggedIn || accessToken === null) {
      setIsNeedLoginPopupOpen(true);
      return;
    }

    const deleteReply = async () => {
      try {
        const response = await fetch(`/api/comments/${reply.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete reply');
        }
      } catch (err) {
        console.error(err);
      }
    };

    void deleteReply();
    window.location.reload();
  };

  const handleReplyUpdate = (updatedReply: Reply) => {
    setReply(updatedReply);
  };

  return (
    <>
      <div key={reply.id} className="flex items-start border-b py-4">
        <Link to={`/profile/${reply.user_id}`}>
          <img
            src={reply.profile_url === null ? noProfile : reply.profile_url}
            alt={reply.user_name}
            className="w-10 h-10 rounded-full mr-2"
          />
        </Link>
        <div className="flex-1">
          <div className="flex justify-between">
            <Link to={`/profile/${reply.user_id}`} className="text-sm">
              {reply.user_name}
            </Link>
            <p className="text-xs text-gray-500">
              {new Date(
                new Date(reply.created_at).getTime() + 9 * 60 * 60 * 1000,
              ).toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-gray-800 mt-2">{reply.content}</p>
          <div
            className={`flex mt-4 text-xs ${isLike ? 'text-hotPink' : 'text-gray-500'} mt-2`}
          >
            <button onClick={onClick}>좋아요</button>
            <Recommend
              className="w-4 h-4 ml-2 mr-1"
              color={isLike ? '#FF2F6E' : '#6B7280'}
            />
            {reply.likes_count}
            {accessToken !== null && user_id === reply.user_id && (
              <div className="flex ml-auto">
                <img
                  onClick={onClickDelete}
                  src={trash}
                  alt="삭제"
                  className="w-4 h-4"
                />
                <img
                  onClick={onClickEdit}
                  src={edit}
                  alt="수정"
                  className="w-4 h-4 ml-4"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <NeedLoginPopup
        isOpen={isNeedLoginPopupOpen}
        onClose={() => {
          setIsNeedLoginPopupOpen(false);
        }}
      />
      <ReplyPopup
        isOpen={isReplyPopupOpen}
        onClose={() => {
          setIsReplyPopupOpen(false);
        }}
        reply={reply}
        onReplyUpdate={handleReplyUpdate}
      />
      <Modal
        isOpen={isModalOpen}
        title="알림"
        message="댓글을 삭제하시겠어요?"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

const Recommend = ({
  color,
  className,
}: {
  color: string;
  className: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill={color}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect width="4" height="11" x="2" y="10" fill={color} rx="0.75"></rect>
      <path
        fill={color}
        d="M7.5 9.31a.75.75 0 0 1 .22-.53l5.75-5.75a.75.75 0 0 1 1.06 0l.679.679a.75.75 0 0 1 .202.693L14.5 8.5h6.75a.75.75 0 0 1 .75.75v3.018a6 6 0 0 1-.485 2.364l-2.32 5.413a.75.75 0 0 1-.69.455H8.25a.75.75 0 0 1-.75-.75z"
      ></path>
    </svg>
  );
};

export default ReplyFragment;
