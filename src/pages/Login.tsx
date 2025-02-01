import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../components/AuthContext';
import { useReturnPath } from '../components/ReturnPathContext';
import type { LoginResponse } from '../utils/Types';

export const Login = () => {
  const [id, setId] = useState('');
  const [isIdValid, setIsIdValid] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { returnPath, setReturnPath } = useReturnPath();

  const idRegex = /^[a-zA-Z0-9_.]{6,20}$/;
  const passwordRegex = /^.{8,20}$/;

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setIsIdValid(idRegex.test(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(passwordRegex.test(e.target.value));
  };

  const handleLogin = async () => {
    setError(null);
    const loginData = {
      login_id: id,
      login_password: password,
    };

    try {
      const response = await fetch(`/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = (await response.json()) as LoginResponse;
      login(data.access_token, data.refresh_token, data.user_id);

      console.debug('Login successful:', data);
      try {
        if (returnPath !== null) {
          await navigate(returnPath);
          setReturnPath(null);
        } else {
          await navigate('/');
        }
        window.location.reload();
      } catch (err) {
        console.error('Navigation error:', err);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center">
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-hotPink">
          WATCHA<span className="text-gray-800">PEDIA</span>
        </h1>
        <h2 className="text-xl font-semibold text-center mb-6">로그인</h2>

        <input
          type="id"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
          className={`w-full p-3 border ${
            isIdValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md`}
        />
        {!isIdValid && (
          <div className="text-red-500 text-sm">
            정확하지 않은 아이디입니다.
          </div>
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          className={`w-full p-3 border ${
            isPasswordValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md mt-4`}
        />
        {!isPasswordValid && (
          <div className="text-red-500 text-sm">
            비밀번호는 8자 이상 20자 이하여야 합니다.
          </div>
        )}
        <button
          onClick={() => {
            handleLogin()
              .then(() => {
                console.debug('Login successful');
              })
              .catch((err: unknown) => {
                console.error('Error during login:', err);
              });
          }}
          className="w-full bg-hotPink text-white p-3 rounded-md font-semibold mt-6"
        >
          로그인
        </button>

        {error !== null && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}

        <div className="text-center mt-4">
          <a href="#" className="text-hotPink text-sm">
            비밀번호를 잊어버리셨나요?
          </a>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm">계정이 없으신가요? </span>
          <Link to="/signup">
            <a href="#" className="text-hotPink text-sm font-semibold">
              회원가입
            </a>
          </Link>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>
          <span className="mx-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        <div className="flex justify-center space-x-6">
          <a href="/api/auth/kakao">
            <CircleIcon bgColor="bg-yellow-400">
              <KakaoIcon />
            </CircleIcon>
          </a>
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
