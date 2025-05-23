// src/App.tsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import AfflationPage from './pages/AfflationPage';
import { useAuthRefresh } from './hooks/useAuthRefresh';

function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useAuthRefresh();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile/me" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile/me"
          element={
            <PrivateRoute>
              <ProfilePage isSelf />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/afflation/:id"
          element={
            <PrivateRoute>
              <AfflationPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
