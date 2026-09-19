const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/**
 * Fetches from the live API, falling back to static seed-mirroring data
 * if the backend isn't reachable (e.g. during frontend-only development).
 */
export async function fetchWithFallback(path, fallbackData) {
  try {
    return await request(path);
  } catch (err) {
    console.warn(`API unavailable for ${path}, using fallback data.`, err.message);
    return fallbackData;
  }
}

export async function submitContactForm(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
