import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../components/AuthContext';
import type { LoginResponse } from '../utils/Types';

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const processGoogleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code == null) {
        console.debug('No code found in URL');
        return;
      }

      try {
        const response = await fetch(`/api/auth/google/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Google login failed');
        }

        const data = (await response.json()) as LoginResponse;
        login(data.access_token, data.refresh_token, data.user_id);
        void navigate('/');
      } catch (error) {
        console.error('Google login error:', error);
        //navigate('/login');
      }
    };

    void processGoogleCallback();
  }, [login, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
      }}
    >
      <div>
        구글 로그인 처리중...
        <div
          style={{
            marginTop: '10px',
            fontSize: '0.9rem',
            color: '#666',
          }}
        >
          잠시만 기다려주세요
        </div>
      </div>
    </div>
  );
};
