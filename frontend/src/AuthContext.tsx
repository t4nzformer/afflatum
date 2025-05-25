import React, { createContext, useState, useEffect, useCallback } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthContextType = {
  isAuthenticated: boolean;
  authChecked: boolean;
  login: () => void;
  logout: () => void;
  setAuthChecked: (v: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authChecked: false,
  login: () => {},
  logout: () => {},
  setAuthChecked: () => {},
});

const getInitialAuth = (): boolean => {
  const token = localStorage.getItem('access');
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth());
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    if (!token || !refresh) {
      setIsAuthenticated(false);
      setAuthChecked(true);
      return;
    }

    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now();
      const isExpired = exp * 1000 < now;

      if (!isExpired) {
        setIsAuthenticated(true);
        setAuthChecked(true);
      } else {
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  }, []);

  const login = useCallback(() => setIsAuthenticated(true), []);

  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
  }, []);

  const setAuthCheckedCallback = useCallback((v: boolean) => setAuthChecked(v), []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authChecked, login, logout, setAuthChecked: setAuthCheckedCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
}
