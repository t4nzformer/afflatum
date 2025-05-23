import type { JSX } from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, authChecked } = useContext(AuthContext);

  if (!authChecked) {
    return null; // or a loading spinner if you want
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
