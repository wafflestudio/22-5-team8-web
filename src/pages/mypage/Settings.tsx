import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/AuthContext';

export const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout(); // Call the logout function
    await navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <div className="flex flex-col h-screen p-6 relative">
      {/* X Icon to Go Back */}
      <button
        onClick={() => {
          void navigate('/mypage'); // Explicitly ignore the promise
        }}
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">설정</h1>

      {/* Logout Button */}
      <button
        onClick={() => {
          handleLogout().catch((err: unknown) => {
            console.error('Logout failed:', err);
          });
        }}
        className="mt-auto bg-red-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-red-600"
      >
        로그아웃
      </button>
    </div>
  );
};
