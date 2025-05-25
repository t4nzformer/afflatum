import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import { fetchWithAuth } from '../hooks/fetchWithAuth';
import { useProfile } from '../hooks/useProfile';

type Echo = {
  type: 'image' | 'video';
  url: string;
};

type Project = {
  id: number;
  title: string;
  details: Record<string, Echo[]>;
  user: { username: string };
};

export default function FolderPage() {
  const { id, name } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [showEchoMenu, setShowEchoMenu] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [savedUsername, setSavedUsername] = useState<string | null>(null);

  const folderName = name as string;

  // Fetch project data
  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/api/projects/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        if (data?.user?.username && data.user.username !== savedUsername) {
          setSavedUsername(data.user.username);
        }
      });
  }, [id, savedUsername]);

  useEffect(() => {
    return () => setSavedUsername(null);
  }, [id]);

  const { profile, loading: profileLoading } = useProfile(savedUsername || undefined);

  const echoes: Echo[] = project?.details?.[folderName] ?? [];

  const quickItems = echoes.map((echo, index) => ({
    label: `${echo.type.toUpperCase()} ${index + 1}`,
  }));

  const handleAddEcho = async (type: 'image' | 'video') => {
    const url = prompt(`Enter ${type} URL:`)?.trim();
    if (!url || !project) return;

    setUpdating(true);

    const updatedDetails = {
      ...project.details,
      [folderName]: [...(project.details[folderName] || []), { type, url }],
    };

    try {
      const res = await fetchWithAuth(`http://localhost:8000/api/projects/${project.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: updatedDetails }),
      });
      const updated = await res.json();
      setProject(updated);
      setShowEchoMenu(false);
    } finally {
      setUpdating(false);
    }
  };

  if (!project || profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-neutral-700 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-700 flex justify-center px-2 relative">
      <div className="w-full max-w-md bg-gray-800 text-white flex flex-col items-center space-y-4 relative">

        {/* + Echo Button */}
        <div className="absolute top-8 right-4 z-50">
          <button
            onClick={() => setShowEchoMenu(!showEchoMenu)}
            className="bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 text-lg rounded-full flex items-center justify-center shadow"
            title="Add Echo"
          >
            ＋
          </button>
          {showEchoMenu && (
            <div className="absolute top-10 right-0 bg-neutral-800 border border-gray-700 rounded shadow-lg z-50">
              <button
                onClick={() => handleAddEcho('image')}
                className="block px-4 py-2 text-sm text-white hover:bg-neutral-700 w-full text-left"
              >
                Image
              </button>
              <button
                onClick={() => handleAddEcho('video')}
                className="block px-4 py-2 text-sm text-white hover:bg-neutral-700 w-full text-left"
              >
                Video
              </button>
            </div>
          )}
        </div>

        {/* Profile Header — breadcrumb = afflation title / folder */}
        <ProfileHeader
          profile={profile}
          stats={{ afflations: 0, followers: 632, following: 302 }}
          showBackButton
          showEditButtons
          showDivider
          title={folderName}
          quickItems={quickItems}
          quickType="echo"
          pathParts={[project.title, folderName]}
        />

        {/* Echo Grid */}
        <div className="grid grid-cols-2 gap-2 w-full p-2">
          {echoes.length > 0 ? (
            echoes.map((echo, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-800 border border-gray-600 flex items-center justify-center text-xs text-gray-300"
              >
                {echo.type.toUpperCase()}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No echoes yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
