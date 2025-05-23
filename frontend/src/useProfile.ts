import { useEffect, useState } from 'react';

type Profile = {
  username: string;
  bio: string;
  profile_image: string | null;
  created_at: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('http://localhost:8000/api/profiles/me/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
      });
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading };
}
