import { Footerbar } from '../../components/Footerbar';

export const MyPage = () => {
  return (
    <div className="h-screen overflow-y-auto">
      {/* Profile Section */}
      <div className="bg-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-300"></div>
          <div>
            <h1 className="text-xl font-bold">박인혁</h1>
            <p className="text-gray-600">alexander211@naver.com</p>
            <p className="text-sm text-gray-400">프로필 • 로그인 1</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 text-center py-4">
        <div>
          <p className="font-bold">0</p>
          <p className="text-gray-500">평가</p>
        </div>
        <div>
          <p className="font-bold">0</p>
          <p className="text-gray-500">코멘트</p>
        </div>
        <div>
          <p className="font-bold">0</p>
          <p className="text-gray-500">컬렉션</p>
        </div>
      </div>

      {/* Saved Items Section */}
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">보관함</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
            <p className="text-sm mt-2">영화</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
            <p className="text-sm mt-2">시리즈</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
            <p className="text-sm mt-2">책</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
            <p className="text-sm mt-2">웹툰</p>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">캘린더</h2>
        <div className="text-center py-4">
          <p className="text-xl font-bold">2025.1</p>
        </div>
        <div className="grid grid-cols-7 text-sm">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => (
            <div
              key={i}
              className={`py-4 ${i + 1 === 6 ? 'text-pink-500' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Likes Section */}
      <div className="p-4 bg-gray-50">
        <h2 className="text-lg font-semibold">좋아요</h2>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span>좋아한 인물</span>
            <span className="text-gray-500">0</span>
          </div>
          <div className="flex justify-between">
            <span>좋아한 컬렉션</span>
            <span className="text-gray-500">0</span>
          </div>
          <div className="flex justify-between">
            <span>좋아한 코멘트</span>
            <span className="text-gray-500">0</span>
          </div>
        </div>
      </div>
      <div className="flex-none fixed bottom-0 w-full">
        <Footerbar />
      </div>
    </div>
  );
};
