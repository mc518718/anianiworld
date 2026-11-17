// Read-only access to Supabase (public data protected by row-level security).
import { SUPABASE_URL as URL, SUPABASE_KEY as KEY } from './config';
export { views } from './config';

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

const S = 'id,channel_id,title,display_title,kind,thumbnail,episode_count,latest_episode_at,views';
const enc = encodeURIComponent;

export const getChannels = () => rest('channels?select=*&order=sort');
export const getLatestSeries = (limit = 24, offset = 0) =>
  rest(`series?select=${S}&order=latest_episode_at.desc.nullslast&limit=${limit}&offset=${offset}`);
// most-watched on this site; shows nobody has watched yet fall back to the most recently updated
export const getTopSeries = (limit = 10) =>
  rest(`series?select=${S}&order=views.desc,latest_episode_at.desc.nullslast&limit=${limit}`);
export const getSeriesByChannel = (id, limit = 12, offset = 0) =>
  rest(`series?select=${S}&channel_id=eq.${enc(id)}&order=latest_episode_at.desc.nullslast&limit=${limit}&offset=${offset}`);
export const getSeries = async (id) =>
  (await rest(`series?select=*,channels(id,title,thumbnail)&id=eq.${enc(id)}&limit=1`))[0] || null;
// The API returns at most 1000 rows per request, so long-running shows are read in pages.
async function paged(path) {
  const all = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const page = await rest(`${path}&limit=1000&offset=${offset}`);
    all.push(...page);
    if (page.length < 1000) break;
  }
  return all;
}
// episodes of a show, each with the number of times it was watched through this site
export async function getEpisodes(id) {
  const [eps, counts] = await Promise.all([
    paged(`episodes?select=video_id,position,title,display_title,thumbnail,published_at&series_id=eq.${enc(id)}&order=position`),
    paged(`episode_views?select=video_id,views&series_id=eq.${enc(id)}&order=video_id`),
  ]);
  const byVideo = new Map(counts.map((c) => [c.video_id, c.views]));
  return eps.map((e) => ({ ...e, views: byVideo.get(e.video_id) || 0 }));
}
export const PAGE = 100;
export const getEpisodeAnywhere = async (videoId) =>
  (await rest(`episodes?select=series_id,video_id,title,display_title&video_id=eq.${enc(videoId)}&limit=1`))[0] || null;
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
