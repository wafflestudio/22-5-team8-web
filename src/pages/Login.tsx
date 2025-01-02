export const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          WATCHA<span className="text-gray-800">PEDIA</span>
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">로그인</h2>

        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 border rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 border rounded-md mb-6"
        />
        <button className="w-full bg-pink-500 text-white p-3 rounded-md font-semibold">
          로그인
        </button>

        <div className="text-center mt-4">
          <a href="#" className="text-pink-500 text-sm">
            비밀번호를 잊어버리셨나요?
          </a>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm">계정이 없으신가요? </span>
          <a href="#" className="text-pink-500 text-sm font-semibold">
            회원가입
          </a>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>
          <span className="mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        <div className="flex justify-center space-x-6">
          <CircleIcon bgColor="bg-yellow-400">
            <KakaoIcon />
          </CircleIcon>
          <CircleIcon bgColor="bg-white border">
            <GoogleIcon />
          </CircleIcon>
          <CircleIcon bgColor="bg-blue-400">
            <TwitterIcon />
          </CircleIcon>
          <CircleIcon bgColor="bg-black">
            <AppleIcon />
          </CircleIcon>
          <CircleIcon bgColor="bg-green-500">
            <LineIcon />
          </CircleIcon>
        </div>

        <div className="bg-gray-100 p-4 mt-6 rounded-md text-center text-sm text-gray-600">
          TIP. 왓챠 계정이 있으신가요? 왓챠와 왓챠피디아는 같은 계정을 사용해요.
        </div>
      </div>
    </div>
  );
};

function CircleIcon({
  bgColor,
  children,
}: {
  bgColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full ${bgColor}`}
    >
      {children}
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="yellow" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" stroke="gray" strokeWidth="2" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="blue" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="black" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="green" />
    </svg>
  );
}
