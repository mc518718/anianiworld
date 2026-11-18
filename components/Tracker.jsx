'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/config';

const PAGE = [
  [/^\/$/, 'home'],
  [/^\/browse/, 'browse'],
  [/^\/latest/, 'latest'],
  [/^\/tap-moi/, 'latest'],
  [/^\/series\//, 'series'],
  [/^\/watch\//, 'watch'],
  [/^\/search/, 'search'],
  [/^\/channel\//, 'channel'],
  [/^\/(account|stats)/, 'account'],
  [/^\/(login|register|reset-password)/, 'auth'],
  [/^\/(terms|privacy)/, 'legal'],
];

// Anonymous visit counter: sends only the kind of page and, for the first page of a visit,
// where the visitor came from (a utm_source tag or the referring site). No cookies.
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    let landing = false;
    let source = null;
    try {
      if (!sessionStorage.getItem('aw_visit')) {
        sessionStorage.setItem('aw_visit', '1');
        landing = true;
        const utm = new URLSearchParams(window.location.search).get('utm_source');
        const ref = document.referrer ? new URL(document.referrer).hostname : '';
        source = utm || (ref && ref !== window.location.hostname ? ref : 'direct');
      }
    } catch {}
    const page = (PAGE.find(([re]) => re.test(pathname)) || [null, 'other'])[1];
    fetch(`${SUPABASE_URL}/rest/v1/rpc/track`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_page: page, p_source: source, p_landing: landing }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
