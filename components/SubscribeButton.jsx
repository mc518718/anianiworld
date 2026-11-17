'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './useUser';
import { supabase } from '@/lib/supabase';

// Follow a show: members get an e-mail when it has a new episode.
export default function SubscribeButton({ seriesId }) {
  const user = useUser();
  const router = useRouter();
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setOn(false);
      return;
    }
    let live = true;
    supabase()
      .from('subscriptions')
      .select('series_id')
      .eq('series_id', seriesId)
      .maybeSingle()
      .then(({ data }) => live && setOn(!!data));
    return () => {
      live = false;
    };
  }, [user, seriesId]);

  async function toggle() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setBusy(true);
    setError('');
    const q = supabase().from('subscriptions');
    const { error: err } = on
      ? await q.delete().eq('series_id', seriesId)
      : await q.insert({ user_id: user.id, series_id: seriesId });
    if (err) setError('Không thực hiện được, vui lòng thử lại.');
    else setOn(!on);
    setBusy(false);
  }

  return (
    <>
      <button className={`btn ghost sub${on ? ' on' : ''}`} onClick={toggle} disabled={busy || user === undefined} aria-pressed={on}>
        {on ? '✓ Đã đăng ký' : '+ Đăng ký'}
      </button>
      {error && <span className="form-err inline">{error}</span>}
    </>
  );
}
