import { useNavigate, Link } from 'react-router-dom';

type UserProfile = {
  username: string;
  bio: string;
  profile_image: string | null;
};

type QuickItem = {
  id?: number | string;
  title?: string;
  label?: string;
};

type Props = {
  profile: UserProfile;
  stats: { afflations: number; followers: number; following: number };
  showBackButton?: boolean;
  showEditButtons?: boolean;
  showDivider?: boolean;
  title?: string;
  quickItems?: QuickItem[];
  quickType?: 'afflation' | 'folder' | 'echo';
  parentId?: number | string;
  pathParts?: string[];
};

export default function ProfileHeader({
  profile,
  stats,
  showBackButton = false,
  showEditButtons = false,
  showDivider = true,
  title,
  quickItems,
  quickType,
  parentId,
  pathParts,
}: Props) {
  const navigate = useNavigate();

  const generatePath = (item: QuickItem) => {
    if (quickType === 'folder') {
      return `/afflation/${parentId}/whisper/${item.title}`;
    }
    if (quickType === 'echo') {
      return '#';
    }
    return `/afflation/${item.id}`;
  };

  const breadcrumbParts = pathParts && pathParts.length > 0
    ? pathParts
    : title ? [title] : [];

  return (
    <div className="relative w-full max-w-md bg-paper text-ink flex flex-col items-center space-y-4 overflow-visible">
      {/* Top Row */}
      <div className="w-full flex items-center justify-between px-4 pt-4">
        {showBackButton ? (
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-ink px-3 py-1 rounded-full hover:bg-gray-300 h-9"
            title="Back"
          >
            ←
          </button>
        ) : (
          <div className="w-[42px] h-9" />
        )}
        <div className="text-lg font-medium truncate">
          {breadcrumbParts.join(' / ')}
        </div>
        <div className="w-[42px]" />
      </div>

      {/* Avatar + RGB Stats */}
      <div className="flex items-center w-full px-4">
        <img
          src={
            profile.profile_image
              ? profile.profile_image.startsWith('http')
                ? profile.profile_image
                : 'http://localhost:8000' + profile.profile_image
              : `https://placehold.co/80x80?text=${profile.username}`
          }
          alt={`${profile.username}'s profile`}
          className="w-20 h-20 rounded-full border-2 border-ink"
        />
        <div className="flex flex-1 justify-evenly ml-4">
          <div className="font-bold text-afflationblue text-lg">{stats.afflations}</div>
          <div className="font-bold text-afflationred text-lg">{stats.followers}</div>
          <div className="font-bold text-afflationgreen text-lg">{stats.following}</div>
        </div>
      </div>

      {/* Bio */}
      <div className="w-full px-4 text-sm">
        {profile.bio ? (
          <div className="text-gray-700">{profile.bio}</div>
        ) : (
          <div className="italic text-gray-400">No bio yet.</div>
        )}
      </div>

      {/* Buttons */}
      <div className="w-full flex space-x-2 px-2 min-h-[36px]">
        {showEditButtons ? (
          <>
            <button className="flex-1 border border-gray-400 rounded-md py-1 text-sm hover:bg-gray-100">Edit profile</button>
            <button className="flex-1 border border-gray-400 rounded-md py-1 text-sm hover:bg-gray-100">Share profile</button>
            <button className="flex-1 border border-gray-400 rounded-md py-1 text-sm hover:bg-gray-100">Email</button>
          </>
        ) : (
          <>
            <div className="flex-1" />
            <div className="flex-1" />
            <div className="flex-1" />
          </>
        )}
      </div>

      {/* Quick Access Strip */}
      <div
        className={`w-full overflow-x-auto px-2 scrollbar-hide overflow-visible relative z-0 ${
          quickItems?.length ? 'h-auto' : 'h-[76px]'
        }`}
      >
        <div className="flex min-w-max overflow-visible relative z-10">
          {quickItems?.map((item, idx) => (
            <Link
              key={idx}
              to={generatePath(item)}
              className="flex flex-col items-center mx-1.5 w-20 flex-shrink-0 relative z-20"
            >
              <div className="w-14 h-14 rounded-md border border-gray-400 bg-white flex items-center justify-center text-xs text-gray-600 text-center px-1 truncate">
                {(item.title || item.label || 'Untitled').slice(0, 6)}
              </div>
              <div className="text-xs mt-1 text-gray-600 truncate">
                {item.title || item.label || 'Untitled'}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showDivider && <div className="w-full border-t border-gray-300" />}
    </div>
  );
}
