import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import back from '../../assets/back.svg';
import no_profile from '../../assets/no_profile.svg';
import no_result from '../../assets/no_result.svg';
import { useAuth } from '../../components/AuthContext';
import { Footerbar } from '../../components/Footerbar';
import { fetchBlokedUserList, fetchUser } from '../../utils/Functions';
import type { UserProfile } from '../../utils/Types';

export const Block = () => {
  const { user_id } = useAuth();
  const navigate = useNavigate();
  const [blockedUserDetails, setBlockedUserDetails] = useState<UserProfile[]>(
    [],
  );

  useEffect(() => {
    const fetchBlocked = async () => {
      console.debug(user_id);
      try {
        if (user_id == null) return;
        const users = await fetchBlokedUserList(Number(user_id));
        const userDetails = (await Promise.all(
          users.map(async (userId) => {
            const userInfo = await fetchUser(userId);
            return userInfo;
          }),
        )) as UserProfile[];
        setBlockedUserDetails(userDetails);
      } catch (error) {
        console.error('Error fetching blocked users:', error);
      }
    };

    void fetchBlocked();
  }, [user_id]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1 px-4 py-2 pb-16 pt-4">
        <div className="flex items-center mb-4">
          <img
            src={back}
            alt="Back"
            className="w-6 h-6 cursor-pointer"
            onClick={() => void navigate(-1)}
          />
        </div>
        <h1 className="text-xl font-bold ml-2 mt-6">차단된 사용자</h1>
        {blockedUserDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-400">
            <img
              src={no_result}
              className="w-16 h-16 mb-4 opacity-30 filter grayscale"
            />
            <p>결과가 없어요</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blockedUserDetails.map((user) => {
              return (
                <Link
                  key={user.user_id}
                  to={`/profile/${user.user_id}`}
                  className="flex items-center space-x-4 py-4 px-2 hover:bg-gray-50"
                >
                  <img
                    src={user.profile_url ?? no_profile}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p>{user.username}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex-none fixed bottom-0 w-full z-10">
        <Footerbar />
      </div>
    </div>
  );
};
