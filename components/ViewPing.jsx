'use client';
import { useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/config';
import { supabase } from '@/lib/supabase';

// After the visitor has stayed on an episode for a few seconds: count one view,
// and for signed-in members add the episode to their watch history.
export default function ViewPing({ seriesId, videoId }) {
  useEffect(() => {
    const t = setTimeout(async () => {
      fetch(`${SUPABASE_URL}/rest/v1/rpc/record_view`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_series: seriesId, p_video: videoId }),
        keepalive: true,
      }).catch(() => {});
      try {
        const sb = supabase();
        const { data } = await sb.auth.getSession();
        if (data.session) await sb.rpc('record_watch', { p_series: seriesId, p_video: videoId });
      } catch {}
    }, 10000);
    return () => clearTimeout(t);
  }, [seriesId, videoId]);
  return null;
}
