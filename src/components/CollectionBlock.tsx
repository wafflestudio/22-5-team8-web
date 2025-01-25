import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchUser } from '../utils/Functions';
import type { Collection, UserProfile } from '../utils/Types';

interface CollectionBlockProps {
  collection: Collection;
}

const CollectionBlock = ({ collection }: CollectionBlockProps) => {
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    const getUserData = async () => {
      const data = (await fetchUser(collection.user_id)) as UserProfile;
      setNickname(data.username);
    };
    void getUserData();
  }, [collection.user_id]);

  return (
    <Link to={`/collections/${collection.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">{nickname}</div>
          <div className="text-sm text-gray-500">
            {collection.movies.length}개의 영화
          </div>
        </div>
        <div className="text-lg font-semibold text-left mb-2">
          {collection.title}
        </div>
        <hr className="my-2 border-gray-200" />
        <div className="flex gap-4 text-sm text-gray-500">
          <div>좋아요 {collection.likes_count}</div>
          <div>댓글 {collection.comments_count}</div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionBlock;
