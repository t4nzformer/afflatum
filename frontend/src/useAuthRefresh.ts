import { useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuthRefresh() {
  const { login, logout, setAuthChecked } = useContext(AuthContext);

  useEffect(() => {
    const refreshAccessToken = async () => {
      const access = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');

      if (!access || !refresh) {
        setAuthChecked(true);
        return;
      }

      try {
        const { exp } = JSON.parse(atob(access.split('.')[1]));
        const isExpired = exp * 1000 < Date.now();

        if (!isExpired) {
          login();
          setAuthChecked(true);
          return;
        }

        const res = await fetch('http://localhost:8000/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        });

        if (!res.ok) throw new Error('Refresh failed');

        const data = await res.json();
        localStorage.setItem('access', data.access);
        login();
      } catch (err) {
        logout();
      } finally {
        setAuthChecked(true);
      }
    };

    refreshAccessToken();
  }, [login, logout, setAuthChecked]);
}
