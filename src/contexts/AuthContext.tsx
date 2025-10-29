import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('Checking auth - Token exists:', !!storedToken); // Debug log
    
    if (storedToken) {
      // Validate token with backend
      try {
        const response = await fetch('/api/dashboard/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });
        
        if (response.ok) {
          // Token is valid
          setToken(storedToken);
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              console.log('Auth restored successfully for user:', userData.email); // Debug log
            } catch (error) {
              console.error('Error parsing stored user data:', error);
              logout();
            }
          }
        } else {
          // Token is invalid, clear it
          console.log('Token validation failed, clearing auth'); // Debug log
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        // If server is down, keep token but don't set user
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            logout();
          }
        }
      }
    } else {
      console.log('No stored token found'); // Debug log
    }
    setIsLoading(false);
  };

  const login = (newToken: string, newUser: User) => {
    console.log('Logging in user:', newUser.email); // Debug log
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    console.log('Logging out user'); // Debug log
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = !!token && !!user;
  console.log('Auth state:', { isAuthenticated, hasToken: !!token, hasUser: !!user }); // Debug log

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};