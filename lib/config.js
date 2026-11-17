// Public (read-only) Supabase settings. Safe to ship to the browser: data is protected by row-level security.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jfkvukvwqxnamdmwgzao.supabase.co';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_kij6jHOJDMmStGXZU3cFxA_fxu1p4Hx';

const nf = new Intl.NumberFormat('vi-VN');
export const views = (n) => `${nf.format(n || 0)} lượt xem`;

export function timeAgo(iso) {
  if (!iso) return '';
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))} phút trước`;
  if (d < 86400) return `${Math.floor(d / 3600)} giờ trước`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)} ngày trước`;
  if (d < 86400 * 365) return `${Math.floor(d / 86400 / 30)} tháng trước`;
  return `${Math.floor(d / 86400 / 365)} năm trước`;
}

// Address shown on the Terms and Privacy pages.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'anianiworld2026@gmail.com';

// Google sign-in (OAuth client ID is public by design).
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '828952955355-rc4g6e06a5t7pr1qc75f0n3o9qil01d3.apps.googleusercontent.com';

export const SITE_URL = 'https://anianiworld.com';
export const FACEBOOK_URL = 'https://www.facebook.com/anianiworld';
