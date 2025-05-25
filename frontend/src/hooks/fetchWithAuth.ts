// src/hooks/fetchWithAuth.ts
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${access}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry && refresh) {
    // Try refreshing the token
    const refreshRes = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const tokens = await refreshRes.json();
      localStorage.setItem('access', tokens.access);

      // Retry the original request with the new access token
      return fetchWithAuth(url, options, false);
    } else {
      // Refresh failed → clear storage and force logout
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
  }

  return response;
}
