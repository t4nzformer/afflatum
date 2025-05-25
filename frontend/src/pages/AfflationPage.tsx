import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ContextMenu from '../components/ContextMenu';
import { fetchWithAuth } from '../hooks/fetchWithAuth';
import { useProfile } from '../hooks/useProfile';

type Project = {
  id: number;
  title: string;
  type: string;
  details: Record<string, any>;
  user: { username: string };
};

const SECTIONS = ['Manifesto', 'Inspirations', 'Process', 'Thoughts', 'Result'];

export default function AfflationPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [savedUsername, setSavedUsername] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/api/projects/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
        if (data?.user?.username !== savedUsername) {
          setSavedUsername(data.user.username);
        }
      });
  }, [id, savedUsername]);

  useEffect(() => {
    return () => setSavedUsername(null);
  }, [id]);

  const { profile, loading: profileLoading } = useProfile(savedUsername || undefined);

  const availableSections = SECTIONS.filter(s => !(project?.details?.[s]));

  const handleCreateSection = async (section: string) => {
    if (!project) return;
    setUpdating(true);
    const updatedDetails = { ...project.details, [section]: [] };
    try {
      const res = await fetchWithAuth(`http://localhost:8000/api/projects/${project.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: updatedDetails }),
      });
      const updated = await res.json();
      setProject(updated);
      setShowSectionMenu(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSection = async (section: string | number) => {
    if (!project) return;
    const confirmed = window.confirm(`Delete section "${section}"?`);
    if (!confirmed) return;
    const updatedDetails = { ...project.details };
    delete updatedDetails[section];
    const res = await fetchWithAuth(`http://localhost:8000/api/projects/${project.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ details: updatedDetails }),
    });
    const updated = await res.json();
    setProject(updated);
    setContextMenu(null);
  };

  if (loading || profileLoading || !project || !profile) {
    return (
      <div className="min-h-screen bg-neutral-700 text-white flex items-center justify-center">
        Loading afflation...
      </div>
    );
  }

  const folders = Object.keys(project.details || {}).map((title) => ({ title }));

  return (
    <div className="min-h-screen bg-neutral-700 flex justify-center px-2 relative" onClick={() => setContextMenu(null)}>
      <div className="w-full max-w-md bg-gray-800 text-white flex flex-col items-center space-y-4 relative">

        {availableSections.length > 0 && (
          <div className="absolute top-8 right-4 z-50">
            <button
              onClick={() => setShowSectionMenu(!showSectionMenu)}
              className="bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 text-lg rounded-full flex items-center justify-center shadow"
              title="Add folder"
            >
              ＋
            </button>
          </div>
        )}

        <ProfileHeader
          profile={profile}
          stats={{
            afflations: Object.keys(project.details).length,
            followers: 632,
            following: 302,
          }}
          showBackButton
          showEditButtons
          showDivider
          quickItems={folders}
          quickType="folder"
          parentId={project.id}
          pathParts={[project.title]}
        />

        <div className="grid grid-cols-3 gap-2 w-full p-2 relative">
          {Object.keys(project.details).map((section) => (
            <Link
              to={`/afflation/${project.id}/whisper/${section}`}
              key={section}
              onContextMenu={(e) => {
                e.preventDefault();
                const container = e.currentTarget.closest('.max-w-md') as HTMLElement;
                if (!container) return;
                const bounds = container.getBoundingClientRect();
                setContextMenu({ id: section, x: e.clientX - bounds.left, y: e.clientY - bounds.top });
              }}
              className="aspect-square bg-gray-800 flex items-center justify-center text-xs text-gray-300 border border-gray-600 cursor-pointer hover:brightness-110"
            >
              {section}
            </Link>
          ))}
        </div>

        {contextMenu && (
          <ContextMenu
            type="folder"
            id={contextMenu.id}
            position={{ x: contextMenu.x, y: contextMenu.y }}
            onDelete={handleDeleteSection}
            onRename={() => {
              setContextMenu(null);
              alert('Rename not implemented yet');
            }}
            onClose={() => setContextMenu(null)}
          />
        )}

        {showSectionMenu && (
          <div className="absolute top-16 right-4 bg-neutral-800 border border-gray-700 rounded shadow-lg z-50">
            {availableSections.map((section) => (
              <button
                key={section}
                onClick={() => handleCreateSection(section)}
                disabled={updating}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-neutral-700 text-white"
              >
                {section}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
