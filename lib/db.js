// Read-only access to Supabase (public data protected by row-level security).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jfkvukvwqxnamdmwgzao.supabase.co';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_kij6jHOJDMmStGXZU3cFxA_fxu1p4Hx';

async function rest(path, init = {}) {
  try {
    const r = await fetch(`${URL}/rest/v1/${path}`, {
      ...init,
      headers: { apikey: KEY, 'Content-Type': 'application/json', ...(init.headers || {}) },
      next: { revalidate: 300 },
    });
    if (!r.ok) return [];
    const j = await r.json();
    // prefer the cleaned-up title when the row has one
    return Array.isArray(j) ? j.map((x) => (x && x.display_title ? { ...x, title: x.display_title } : x)) : j;
  } catch {
    return [];
  }
}

const S = 'id,channel_id,title,display_title,kind,thumbnail,episode_count,latest_episode_at';
const enc = encodeURIComponent;

export const getChannels = () => rest('channels?select=*&order=sort');
export const getLatestSeries = (limit = 24) =>
  rest(`series?select=${S}&order=latest_episode_at.desc.nullslast&limit=${limit}`);
export const getSeriesByChannel = (id, limit = 12, offset = 0) =>
  rest(`series?select=${S}&channel_id=eq.${enc(id)}&order=latest_episode_at.desc.nullslast&limit=${limit}&offset=${offset}`);
export const getSeries = async (id) =>
  (await rest(`series?select=*,channels(id,title,thumbnail)&id=eq.${enc(id)}&limit=1`))[0] || null;
export const getEpisodes = (id) =>
  rest(`episodes?select=video_id,position,title,thumbnail,published_at&series_id=eq.${enc(id)}&order=position&limit=1000`);
export const getEpisodeAnywhere = async (videoId) =>
  (await rest(`episodes?select=series_id,video_id,title&video_id=eq.${enc(videoId)}&limit=1`))[0] || null;
export const searchSeries = (q) =>
  rest('rpc/search_series', { method: 'POST', body: JSON.stringify({ q }) });

export function timeAgo(iso) {
  if (!iso) return '';
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))} phút trước`;
  if (d < 86400) return `${Math.floor(d / 3600)} giờ trước`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)} ngày trước`;
  if (d < 86400 * 365) return `${Math.floor(d / 86400 / 30)} tháng trước`;
  return `${Math.floor(d / 86400 / 365)} năm trước`;
}
