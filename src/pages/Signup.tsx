import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Signup = () => {
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [id, setId] = useState('');
  const [isIdValid, setIsIdValid] = useState(true);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  const idRegex = /^[a-zA-Z0-9_.]{6,20}$/;
  const passwordRegex =
    /^(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[^\w\s])|(?=.*\d)(?=.*[^\w\s])).{8,20}$/;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsNameValid(nameRegex.test(e.target.value));
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    setIsIdValid(idRegex.test(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(passwordRegex.test(e.target.value));
  };

  const handleSignup = async () => {
    setError(null);
    const signupData = {
      username: name,
      login_id: id,
      login_password: password,
    };

    try {
      const response = await fetch(`/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('이미 존재하는 이름 또는 아이디입니다.');
        }
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
          type="text"
          placeholder="이름"
          value={name}
          onChange={handleNameChange}
          className={`w-full p-3 border ${
            isNameValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md`}
        />
        {!isNameValid && (
          <div className="text-red-500 text-sm">정확하지 않은 이름입니다.</div>
        )}
        <input
          type="id"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
          className={`w-full p-3 border ${
            isIdValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md mt-4`}
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
            비밀번호는 영문, 숫자, 특수문자 중 2개 이상을 조합하여 최소 8자리,
            최대 20자리여야 합니다.
          </div>
        )}
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
          className="w-full bg-pink-500 text-white p-3 rounded-md font-semibold mt-6 mb-6"
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
