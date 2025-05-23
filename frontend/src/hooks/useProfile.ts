import { useEffect, useState } from 'react';

type Profile = {
  username: string;
  bio: string;
  profile_image: string | null;
  created_at: string;
};

export function useProfile(username?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const endpoint = username
        ? `http://localhost:8000/api/profiles/${username}/`
        : `http://localhost:8000/api/profiles/me/`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
      });

      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

  return { profile, loading };
}
