import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Project = {
  id: number;
  title: string;
  type: string;
  details: Record<string, any>;
  user: { username: string };
};

type UserProfile = {
  username: string;
  bio: string;
  profile_image: string | null;
};

const SECTIONS = ['Manifesto', 'Inspirations', 'Process', 'Thoughts', 'Result'];

export default function AfflationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ section: string; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${id}/`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('access') },
    })
      .then(res => res.json())
      .then(data => setProject(data));
  }, [id]);

  useEffect(() => {
    if (project?.user?.username) {
      fetch(`http://localhost:8000/api/profiles/${project.user.username}/`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('access') },
      })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setLoading(false);
        });
    }
  }, [project]);

  const availableSections = SECTIONS.filter(s => !(project?.details?.[s]));

  const handleCreateSection = async (section: string) => {
    if (!project) return;
    setUpdating(true);
    const newDetails = {
      ...project.details,
      [section]: []
    };
    try {
      const res = await fetch(`http://localhost:8000/api/projects/${project.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
        body: JSON.stringify({ details: newDetails }),
      });
      const updated = await res.json();
      setProject(updated);
      setShowSectionMenu(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSection = async (section: string) => {
    if (!project) return;
    const confirm = window.confirm(`Delete section "${section}"?`);
    if (!confirm) return;
    const newDetails = { ...project.details };
    delete newDetails[section];
    const res = await fetch(`http://localhost:8000/api/projects/${project.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access'),
      },
      body: JSON.stringify({ details: newDetails }),
    });
    const updated = await res.json();
    setProject(updated);
    setContextMenu(null);
  };

  const handleRightClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    const container = e.currentTarget.closest('.max-w-md') as HTMLElement;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    setContextMenu({ section, x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  if (loading || !project || !profile) {
    return (
      <div className="min-h-screen bg-neutral-700 text-white flex items-center justify-center">
        Loading afflation...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-neutral-700 flex justify-center px-2 pt-6 relative"
      onClick={() => setContextMenu(null)}
    >
      <div className="w-full max-w-md bg-black text-white flex flex-col items-center space-y-4 relative">
        {/* Top Buttons */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl bg-neutral-800 px-3 py-1 rounded-full hover:bg-neutral-700"
            title="Back"
          >
            ←
          </button>
          {availableSections.length > 0 && (
            <button
              onClick={() => setShowSectionMenu(!showSectionMenu)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 text-lg rounded-full flex items-center justify-center shadow"
              title="Add folder"
            >
              ＋
            </button>
          )}
        </div>

        <div className="w-full text-left text-white text-lg ml-6 mt-4">{project.title}</div>

        {/* Profile */}
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
              <div className="font-bold">{Object.keys(project.details).length}</div>
              <div className="text-xs text-gray-400">Sections</div>
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

        <div className="w-full px-4">
          {profile.bio ? (
            <div className="text-sm text-gray-200">{profile.bio}</div>
          ) : (
            <div className="italic text-gray-400 text-sm">No bio yet.</div>
          )}
        </div>

        {/* Highlights */}
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

        {/* Folder Grid */}
        <div className="grid grid-cols-3 gap-2 w-full p-2 relative">
          {Object.keys(project.details).map((section) => (
            <div
              key={section}
              onContextMenu={(e) => handleRightClick(e, section)}
              className="aspect-square bg-gray-800 flex items-center justify-center text-xs text-gray-300 border border-gray-600 cursor-pointer"
            >
              {section}
            </div>
          ))}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="absolute bg-neutral-800 border border-gray-700 rounded shadow z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => handleDeleteSection(contextMenu.section)}
              className="block px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 w-full text-left"
            >
              Delete Section
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

        {/* + Menu */}
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
