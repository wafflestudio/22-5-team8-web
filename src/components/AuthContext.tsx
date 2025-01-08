import { createContext, type ReactNode, useContext, useState } from 'react';

// Define the structure of the AuthContext
interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  updateAccessToken: (token: string) => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Handle login and store tokens
  const login = (tokens: { accessToken: string; refreshToken: string }) => {
    setIsLoggedIn(true);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  // Handle logout
  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Update access token without logging out
  const updateAccessToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        accessToken,
        refreshToken,
        login,
        logout,
        updateAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
