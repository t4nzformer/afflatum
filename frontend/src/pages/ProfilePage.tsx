// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import CreateAfflationModal from '../components/CreateAfflationModal';

type Project = {
  id: number;
  title: string;
  type: string;
  cover_image: string | null;
  created_at: string;
};

type ProfilePageProps = {
  isSelf?: boolean;
};

export default function ProfilePage({ isSelf = false }: ProfilePageProps) {
  const { username: paramUsername } = useParams();
  const { profile, loading } = useProfile(isSelf ? undefined : paramUsername);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ id: number; x: number; y: number } | null>(null);

  const fetchProjects = () => {
    fetch('http://localhost:8000/api/projects/mine/', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setProjectsLoading(false);
      })
      .catch(() => setProjectsLoading(false));
  };

  useEffect(() => {
    if (isSelf) {
      fetchProjects();
    }
  }, [isSelf]);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Delete this afflation? This cannot be undone.');
    if (!confirm) return;
    await fetch(`http://localhost:8000/api/projects/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access'),
      },
    });
    setContextMenu(null);
    fetchProjects();
  };

  if (loading || (isSelf && projectsLoading)) {
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
    <div className="min-h-screen bg-neutral-700 flex justify-center px-2 pt-6 relative" onClick={() => setContextMenu(null)}>
      <div className="w-full max-w-md bg-black text-white flex flex-col items-center space-y-4 relative">
        {/* Floating + Button */}
        {isSelf && (
          <div className="absolute top-4 right-4 z-50">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 text-lg rounded-full flex items-center justify-center shadow"
              onClick={() => setShowModal(true)}
              title="Create Afflation"
            >
              ＋
            </button>
          </div>
        )}

        <div className="w-full text-left text-white text-lg ml-6 mt-4">
          {profile.username ?? 'Unknown user'}
        </div>

        {/* Profile Header */}
        <div className="flex items-center w-full">
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

          <div className="flex flex-1 gap-x-16 justify-center">
            <div className="flex flex-col text-left">
              <div className="font-bold">{projects.length ?? 0}</div>
              <div className="text-xs text-gray-400">Afflations</div>
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
        {isSelf ? (
          <div className="w-full flex space-x-2 px-2">
            <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Edit profile</button>
            <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Share profile</button>
            <button className="flex-1 bg-neutral-800 rounded-md py-1 text-sm">Email</button>
          </div>
        ) : (
          <div className="w-full flex px-2">
            <button className="w-full bg-blue-600 rounded-md py-1 text-sm">Follow</button>
          </div>
        )}

        {/* Highlights (mocked) */}
        <div className="w-full overflow-x-auto py-2 px-2">
          <div className="flex min-w-max">
            {['New', 'ColorTheory', 'TAROT(N)', 'profundity'].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center mx-1.5 w-20 flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-white bg-gray-700"></div>
                <div className="text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Grid or Empty Message */}
        <div className="w-full py-4 border-t border-gray-700">
          {projects.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 w-full">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (isSelf) setContextMenu({ id: project.id, x: e.clientX, y: e.clientY });
                  }}
                  className="relative aspect-square bg-gray-800 cursor-pointer hover:brightness-110"
                >
                  <Link to={`/afflation/${project.id}`} className="block w-full h-full">
                    {project.cover_image ? (
                      <img
                        src={
                          project.cover_image.startsWith('http')
                            ? project.cover_image
                            : 'http://localhost:8000' + project.cover_image
                        }
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                        {project.title}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm">
              No afflations yet.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CreateAfflationModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          className="absolute bg-neutral-800 border border-gray-700 rounded shadow z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <button
            onClick={() => handleDelete(contextMenu.id)}
            className="block px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 w-full text-left"
          >
            Delete Afflation
          </button>
          <button
            onClick={() => {
              setContextMenu(null);
              alert('Rename not implemented yet');
            }}
            className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700 w-full text-left"
          >
            Rename (soon)
          </button>
        </div>
      )}
    </div>
  );
}
