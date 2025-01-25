import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import noProfile from '../assets/no_profile.svg';
import { fetchUser } from '../utils/Functions';
import type { Collection, UserProfile } from '../utils/Types';

interface CollectionBlockProps {
  collection: Collection;
}

const CollectionBlock = ({ collection }: CollectionBlockProps) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = (await fetchUser(collection.user_id)) as UserProfile;
      setUserData(data);
    };
    void getUserData();
  }, [collection.user_id]);

  return (
    <Link to={`/collections/${collection.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <img
              src={
                userData?.profile_url === null
                  ? noProfile
                  : userData?.profile_url
              }
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-sm text-gray-600">{userData?.username}</div>
          </div>
          <div className="text-sm text-gray-500">
            {collection.movies.length}개의 영화
          </div>
        </div>
        <div className="text-lg font-semibold text-left mb-2">
          {collection.title}
        </div>
        <div className="text-sm text-left mb-2">{collection.overview}</div>
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
