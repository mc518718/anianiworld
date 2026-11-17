// Public (read-only) Supabase settings. Safe to ship to the browser: data is protected by row-level security.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jfkvukvwqxnamdmwgzao.supabase.co';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_kij6jHOJDMmStGXZU3cFxA_fxu1p4Hx';

const nf = new Intl.NumberFormat('vi-VN');
export const views = (n) => `${nf.format(n || 0)} lượt xem`;
