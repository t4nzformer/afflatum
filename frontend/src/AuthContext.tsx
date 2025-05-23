import React, { createContext, useState, useEffect } from 'react';

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

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                // token expired; wait for useAuthRefresh to handle it
                setAuthChecked(false);
            }
        } catch (e) {
            console.error('Failed to decode token:', e);
            setIsAuthenticated(false);
            setAuthChecked(true);
        }
    }, []);

    const login = () => setIsAuthenticated(true);

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, authChecked, login, logout, setAuthChecked }}
        >
            {children}
        </AuthContext.Provider>
    );
}
