import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  username: string;
  login_id: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  user_id: number | null;
  login: (accessToken: string, refreshToken: string, user_id: number) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  user_id: null,
  login: () => {},
  fetchUser: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user_id, setUserId] = useState<number | null>(null);

  // Logout function
  const logout = useCallback(() => {
    console.debug('Logging out...');
    setIsLoggedIn(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_id');
  }, []);

  // Login function
  const login = (
    loginAccessToken: string,
    loginRefreshToken: string,
    loginUserId: number,
  ) => {
    console.debug('Logging in...');
    setIsLoggedIn(true);
    setAccessToken(loginAccessToken);
    setRefreshToken(loginRefreshToken);
    setUserId(loginUserId);
    void fetchUser();
    localStorage.setItem('accessToken', loginAccessToken);
    localStorage.setItem('refreshToken', loginRefreshToken);
    localStorage.setItem('user_id', loginUserId.toString());
  };

  const refreshAccessToken = useCallback(async () => {
    console.debug('Refreshing access token...');
    if (refreshToken === null || refreshToken === '') {
      console.error('No refresh token available');
      logout();
      return;
    }

    try {
      const response = await fetch('/api/users/refresh', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const data = (await response.json()) as {
        access_token: string;
        refresh_token: string;
        user_id: number;
      };
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    } catch (err) {
      console.error('Error refreshing token:', err);
      logout(); // Log the user out if refreshing fails
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    console.debug('Setting up token refresh timer...');
    if (accessToken === null || accessToken === '') return;

    const tokenParts = accessToken.split('.');

    if (tokenParts[1] === undefined || tokenParts[1].trim() === '') {
      console.error('Invalid token');
      logout();
      return;
    }
    const tokenPayload: { exp: number } = JSON.parse(atob(tokenParts[1])) as {
      exp: number;
    };
    const expirationTime = tokenPayload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // Calculate the time to refresh the token (e.g., 1 minute before expiration)
    const refreshTime = expirationTime - currentTime - 60 * 1000;

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        void refreshAccessToken();
      }, refreshTime);

      return () => {
        clearTimeout(timer);
      }; // Clear timer on cleanup
    }
  }, [accessToken, refreshAccessToken, logout]);

  // Fetch user information
  const fetchUser = async () => {
    console.debug('Fetching user information...');
    if (accessToken === null || accessToken === '') return;

    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }

      const data: User = (await response.json()) as User;
      setUser(data); // Example response: { login_id: 'testid', username: 'testname' }
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      console.error(err);
      logout(); // Logout if the user info cannot be fetched
    }
  };

  // Load tokens and user info from localStorage on app initialization
  useEffect(() => {
    console.debug('Initializing auth context...');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserId = localStorage.getItem('user_id');
    const storedUser = localStorage.getItem('user');

    if (
      storedAccessToken !== null &&
      storedAccessToken !== '' &&
      storedRefreshToken !== null &&
      storedRefreshToken !== ''
    ) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsLoggedIn(true);
    }

    if (storedUserId !== null && storedUserId !== '') {
      setUserId(Number(storedUserId));
    }

    if (storedUser !== null && storedUser !== '') {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        accessToken,
        refreshToken,
        user_id,
        login,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
