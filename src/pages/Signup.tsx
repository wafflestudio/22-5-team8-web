import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    const baseUrl = 'http://3.39.11.124';
    const signupData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch(`${baseUrl}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        throw new Error('Signup failed. Please check your credentials.');
      }

      alert('회원가입 성공!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          WATCHA<span className="text-gray-800">PEDIA</span>
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">회원가입</h2>

        <input
          type="name"
          placeholder="이름"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-full p-3 border rounded-md mb-4"
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full p-3 border rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full p-3 border rounded-md mb-6"
        />
        <button
          onClick={() => {
            handleSignup()
              .then(() => {
                console.debug('Signup successful');
              })
              .catch((err: unknown) => {
                console.error('Error during signup:', err);
              });
          }}
          className="w-full bg-pink-500 text-white p-3 rounded-md font-semibold"
        >
          회원가입
        </button>

        {error !== null && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}

        <div className="text-center mt-2">
          <span className="text-sm">이미 가입하셨나요? </span>
          <Link to="/login">
            <a href="#" className="text-pink-500 text-sm font-semibold">
              로그인
            </a>
          </Link>
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
