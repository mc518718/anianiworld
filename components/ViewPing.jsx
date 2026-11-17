'use client';
import { useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_KEY } from '@/lib/config';

// Counts one view after the visitor has stayed on the episode for a few seconds.
export default function ViewPing({ seriesId, videoId }) {
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`${SUPABASE_URL}/rest/v1/rpc/record_view`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_series: seriesId, p_video: videoId }),
        keepalive: true,
      }).catch(() => {});
    }, 10000);
    return () => clearTimeout(t);
  }, [seriesId, videoId]);
  return null;
}
