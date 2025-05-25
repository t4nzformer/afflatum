import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import AfflationPage from './pages/AfflationPage';
import FolderPage from './pages/FolderPage'; // new import
import { useAuthRefresh } from './hooks/useAuthRefresh';

function App() {
  const { isAuthenticated, logout, authChecked } = useContext(AuthContext);
  const navigate = useNavigate();

  useAuthRefresh();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700"
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
        <Route
          path="/afflation/:id/whisper/:name" // whisper path kept
          element={
            <PrivateRoute>
              <FolderPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
