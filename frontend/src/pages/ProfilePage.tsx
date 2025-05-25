import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import CreateAfflationModal from '../components/CreateAfflationModal';
import ProfileHeader from '../components/ProfileHeader';
import ContextMenu from '../components/ContextMenu';
import { fetchWithAuth } from '../hooks/fetchWithAuth';

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
  const [contextMenu, setContextMenu] = useState<{ id: number | string; x: number; y: number } | null>(null);

  const fetchProjects = () => {
    fetchWithAuth('http://localhost:8000/api/projects/mine/')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setProjectsLoading(false);
      })
      .catch(() => setProjectsLoading(false));
  };

  useEffect(() => {
    if (isSelf) fetchProjects();
  }, [isSelf]);

  const handleDelete = async (id: string | number) => {
    const confirm = window.confirm('Delete this afflation? This cannot be undone.');
    if (!confirm) return;
    await fetchWithAuth(`http://localhost:8000/api/projects/${id}/`, { method: 'DELETE' });
    setContextMenu(null);
    fetchProjects();
  };

  const handleRename = () => {
    setContextMenu(null);
    alert('Rename not implemented yet');
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
    <div
      className="min-h-screen bg-neutral-700 flex justify-center px-2 relative"
      onClick={() => setContextMenu(null)}
    >
      <div className="w-full max-w-md bg-gray-800 text-white flex flex-col items-center space-y-4 relative">
        {isSelf && (
          <div className="absolute top-8 right-4 z-50">
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 text-lg rounded-full flex items-center justify-center shadow"
              onClick={() => setShowModal(true)}
              title="Create Afflation"
            >
              ＋
            </button>
          </div>
        )}

        <ProfileHeader
          profile={profile}
          stats={{ afflations: projects.length, followers: 632, following: 302 }}
          showEditButtons={isSelf}
          showDivider
          quickItems={projects}
          quickType="afflation"
          pathParts={[profile.username]}
        />

        {projects.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 w-full p-2">
            {projects.map((project) => (
              <Link
                to={`/afflation/${project.id}`}
                key={project.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (isSelf) setContextMenu({ id: project.id, x: e.clientX, y: e.clientY });
                }}
                className="aspect-square bg-gray-800 border border-gray-600 flex items-center justify-center text-sm text-gray-300 hover:brightness-110"
              >
                {project.title}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm w-full p-4">No afflations yet.</div>
        )}
      </div>

      {showModal && (
        <CreateAfflationModal onClose={() => setShowModal(false)} onCreated={fetchProjects} />
      )}

      {contextMenu && (
        <ContextMenu
          type="afflation"
          id={contextMenu.id}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onDelete={handleDelete}
          onRename={handleRename}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
