const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999';

export async function httpClient(path, options = {}) {
  const response = await fetch(`${API_URL}/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) throw new Error(`API lỗi ${response.status}: ${path}`);
  return response.status === 204 ? null : response.json();
}
