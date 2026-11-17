// Read-only access to Supabase (public data protected by row-level security).
import { SUPABASE_URL as URL, SUPABASE_KEY as KEY } from './config';
export { views, timeAgo } from './config';

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

const S = 'id,channel_id,title,display_title,kind,thumbnail,poster,year,genres,episode_count,latest_episode_at,views';
const enc = encodeURIComponent;

export const getChannels = () => rest('channels?select=*&order=sort');
export const getLatestSeries = (limit = 24, offset = 0) =>
  rest(`series?select=${S}&order=latest_episode_at.desc.nullslast&limit=${limit}&offset=${offset}`);
// most-watched on this site; shows nobody has watched yet fall back to the most recently updated
export const getTopSeries = (limit = 10) =>
  rest(`series?select=${S},backdrop,overview,description,alt_title&order=views.desc,latest_episode_at.desc.nullslast&limit=${limit}`);
// shows for the home carousel: most-watched first; between equally-watched shows, ones with artwork win
export const getHeroSeries = (limit = 4) =>
  rest(`series?select=${S},backdrop,overview,description&order=views.desc,has_art.desc,latest_episode_at.desc.nullslast&limit=${limit}`);
// every show on the site is animation, so that genre label says nothing
// The same goes for the "Phim" (film) prefix; a few TV genre names also arrive untranslated.
const GENRE_VI = {
  'Sci-Fi & Fantasy': 'Viễn tưởng & Kỳ ảo',
  'Action & Adventure': 'Hành động & Phiêu lưu',
  'War & Politics': 'Chiến tranh & Chính trị',
  Kids: 'Thiếu nhi',
};
export const genresOf = (s) =>
  (s.genres || [])
    .filter((g) => !/hoạt hình|animation/i.test(g))
    .map((g) => GENRE_VI[g] || g.replace(/^Phim\s+/i, ''));
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

// Story text for a show: the database synopsis when there is one, otherwise the channel's own
// playlist description with schedule lines, hashtags and links removed.
export function synopsis(s) {
  if (s.overview) return s.overview;
  const text = (s.description || '')
    .split('\n')
    .filter((l) => !/(lịch phát sóng|bắt đầu từ|hàng tuần|⏰|📺|https?:\/\/|đăng ký|subscribe|bản quyền|©|^\s*#)/i.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text.length >= 60 ? text : null;
}

// ---------- browse ----------
// Each filter chip covers one or more of the raw genre names stored with a show.
export const GENRES = [
  { slug: 'hanh-dong', label: 'Hành động & Phiêu lưu', raw: ['Action & Adventure', 'Phim Hành Động', 'Phim Phiêu Lưu'] },
  { slug: 'vien-tuong', label: 'Viễn tưởng & Kỳ ảo', raw: ['Sci-Fi & Fantasy', 'Phim Giả Tượng', 'Phim Khoa Học Viễn Tưởng'] },
  { slug: 'hai', label: 'Hài', raw: ['Phim Hài'] },
  { slug: 'chinh-kich', label: 'Chính kịch', raw: ['Phim Chính Kịch'] },
  { slug: 'bi-an', label: 'Bí ẩn', raw: ['Phim Bí Ẩn'] },
  { slug: 'hinh-su', label: 'Hình sự', raw: ['Phim Hình Sự'] },
  { slug: 'gia-dinh', label: 'Thiếu nhi & Gia đình', raw: ['Kids', 'Phim Gia Đình'] },
  { slug: 'chien-tranh', label: 'Chiến tranh & Chính trị', raw: ['War & Politics', 'Phim Chiến Tranh'] },
];
export const SORTS = [
  { slug: 'moi', label: 'Mới cập nhật', order: 'latest_episode_at.desc.nullslast' },
  { slug: 'hot', label: 'Xem nhiều', order: 'views.desc,latest_episode_at.desc.nullslast' },
  { slug: 'diem', label: 'Điểm cao', order: 'rating.desc.nullslast,latest_episode_at.desc.nullslast' },
  { slug: 'nam', label: 'Năm mới nhất', order: 'year.desc.nullslast,latest_episode_at.desc.nullslast' },
];
export const OLD_YEAR = 2018; // shows first released before this year share one chip

// f: { g, kind, status, year, channel, sort } as they appear in the page address
export async function browseSeries(f, limit, offset) {
  const q = [`select=${S},rating,status`];
  const genre = GENRES.find((x) => x.slug === f.g);
  if (genre) q.push(`genres=ov.${enc(`{${genre.raw.map((x) => `"${x}"`).join(',')}}`)}`);
  if (f.kind === 'sub' || f.kind === 'dub') q.push(`kind=eq.${f.kind}`);
  if (f.status === 'ongoing' || f.status === 'ended') q.push(`status=eq.${f.status}`);
  if (f.year === 'cu') q.push(`year=lt.${OLD_YEAR}`);
  else if (/^\d{4}$/.test(f.year || '')) q.push(`year=eq.${f.year}`);
  if (/^UC[\w-]{10,30}$/.test(f.channel || '')) q.push(`channel_id=eq.${f.channel}`);
  const sort = SORTS.find((x) => x.slug === f.sort) || SORTS[0];
  q.push(`order=${sort.order}`, `limit=${limit}`, `offset=${offset}`);
  try {
    const res = await fetch(`${URL}/rest/v1/series?${q.join('&')}`, {
      headers: { apikey: KEY, Prefer: 'count=exact' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return { rows: [], total: 0 };
    const rows = (await res.json()).map((x) => (x.display_title ? { ...x, title: x.display_title } : x));
    const total = parseInt((res.headers.get('content-range') || '').split('/')[1], 10);
    return { rows, total: Number.isFinite(total) ? total : rows.length };
  } catch {
    return { rows: [], total: 0 };
  }
}
