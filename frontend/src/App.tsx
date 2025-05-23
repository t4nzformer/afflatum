// App.tsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import { useProfile } from './useProfile';
import { useAuthRefresh } from './useAuthRefresh';

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
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-700 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-700 text-red-500 flex items-center justify-center">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-700 flex justify-center px-2 pt-6">
      <div className="w-full max-w-md bg-black text-white flex flex-col items-center space-y-4">

        {/* Username Header (Instagram-style top) */}
        <div className="w-full text-left text-white text-lg ml-6 mt-4">{profile.username}</div>

        {/* Profile Header */}
        <div className="flex items-center w-full">
          {/* Profile Image */}
          <img
            src={
              profile.profile_image
                ? profile.profile_image.startsWith('http')
                  ? profile.profile_image
                  : 'http://localhost:8000' + profile.profile_image
                : `https://placehold.co/80x80?text=${profile.username}`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-white ml-2"
          />

          {/* Stats */}
          <div className="flex flex-1 gap-x-16 justify-center">
            <div className="flex flex-col text-left">
              <div className="font-bold">60</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div className="flex flex-col text-left">
              <div className="font-bold">632</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="flex flex-col text-left">
              <div className="font-bold">302</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="w-full px-4">
          {profile.bio ? (
            <div className="text-sm text-gray-200">{profile.bio}</div>
          ) : (
            <div className="italic text-gray-400 text-sm">No bio yet.</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex space-x-2 px-2">
          <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Edit profile</button>
          <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Share profile</button>
          <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Email</button>
        </div>

        {/* Highlight Reels (mocked) */}
        <div className="w-full overflow-x-auto py-2 px-2">
          <div className="flex min-w-max">
            {['New', 'ColorTheory', 'TAROT(N)', 'profundity', 'something', 'nextOne', 'lastOne'].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center mx-1.5 w-20 flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-white bg-gray-700"></div>
                <div className="text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Grid toggle icons (mocked) */}
        <div className="w-full flex justify-around py-2 border-t border-gray-700">
          <button className="text-white text-xl">📷</button>
          <button className="text-gray-500 text-xl">🎞</button>
        </div>

        {/* Project Grid (mock) */}
        <div className="grid grid-cols-3 gap-1 w-full">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
