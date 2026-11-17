'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, displayName } from '@/lib/supabase';
import { timeAgo } from '@/lib/config';
import { useUser } from '@/components/useUser';

const STEP = 60;
const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };

export default function Account() {
  const user = useUser();
  const router = useRouter();
  const [tab, setTab] = useState('subs');
  const [subs, setSubs] = useState(null);
  const [history, setHistory] = useState(null);
  const [counts, setCounts] = useState({ subs: 0, history: 0 });
  const [more, setMore] = useState(false);

  useEffect(() => {
    if (user === null) router.replace('/login?next=/account');
  }, [user, router]);

  const loadSubs = useCallback(async () => {
    const { data } = await supabase()
      .from('subscriptions')
      .select('created_at, series(id,title,display_title,poster,thumbnail,kind,episode_count,latest_episode_at)')
      .order('created_at', { ascending: false });
    const rows = (data || []).filter((r) => r.series);
    setSubs(rows);
    setCounts((c) => ({ ...c, subs: rows.length }));
  }, []);

  const loadHistory = useCallback(async (from) => {
    const { data, count } = await supabase()
      .from('watch_history')
      .select('series_id,video_id,series_title,episode_title,thumbnail,watched_at', { count: 'exact' })
      .order('watched_at', { ascending: false })
      .range(from, from + STEP - 1);
    setHistory((h) => (from === 0 ? data || [] : [...(h || []), ...(data || [])]));
    setCounts((c) => ({ ...c, history: count || 0 }));
    setMore((count || 0) > from + STEP);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadSubs();
    loadHistory(0);
  }, [user, loadSubs, loadHistory]);

  async function unsubscribe(id) {
    await supabase().from('subscriptions').delete().eq('series_id', id);
    loadSubs();
  }
  async function clearHistory() {
    if (!window.confirm('Xóa toàn bộ lịch sử xem?')) return;
    await supabase().from('watch_history').delete().eq('user_id', user.id);
    loadHistory(0);
  }
  async function signOut() {
    await supabase().auth.signOut();
    router.replace('/');
  }

  if (!user) return <p className="empty">Đang tải…</p>;
  const name = displayName(user);

  return (
    <>
      <div className="me">
        <div className="me-avatar">{name.slice(0, 1).toUpperCase()}</div>
        <div className="me-id">
          <h1>{name}</h1>
          <p className="meta">{user.email}</p>
        </div>
        <dl className="me-stats">
          <div>
            <dd>{counts.subs}</dd>
            <dt>Đã đăng ký</dt>
          </div>
          <div>
            <dd>{counts.history}</dd>
            <dt>Lịch sử xem</dt>
          </div>
        </dl>
        <button className="btn ghost small" onClick={signOut}>
          Đăng xuất
        </button>
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'subs'} className={tab === 'subs' ? 'on' : ''} onClick={() => setTab('subs')}>
          Anime đã đăng ký
        </button>
        <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>
          Lịch sử xem
        </button>
      </div>

      {tab === 'subs' &&
        (subs === null ? (
          <p className="empty">Đang tải…</p>
        ) : subs.length === 0 ? (
          <p className="empty">
            Bạn chưa đăng ký anime nào. Bấm “+ Đăng ký” ở trang anime để nhận email khi có tập mới.
          </p>
        ) : (
          <div className="pgrid">
            {subs.map(({ series: s }) => (
              <div className="pcard" key={s.id}>
                <Link href={`/series/${s.id}`}>
                  <div className="thumb poster">
                    {(s.poster || s.thumbnail) && <img src={s.poster || s.thumbnail} alt="" loading="lazy" />}
                    {KIND[s.kind] && <span className={`tag ${s.kind}`}>{KIND[s.kind]}</span>}
                  </div>
                  <h3>{s.display_title || s.title}</h3>
                </Link>
                <p className="meta">
                  {s.episode_count} tập · cập nhật {timeAgo(s.latest_episode_at)}
                </p>
                <button className="link" onClick={() => unsubscribe(s.id)}>
                  Hủy đăng ký
                </button>
              </div>
            ))}
          </div>
        ))}

      {tab === 'history' &&
        (history === null ? (
          <p className="empty">Đang tải…</p>
        ) : history.length === 0 ? (
          <p className="empty">Bạn chưa xem tập nào. Lịch sử sẽ được lưu khi bạn xem một tập từ 10 giây trở lên.</p>
        ) : (
          <>
            <ul className="hist">
              {history.map((h) => (
                <li key={`${h.series_id}:${h.video_id}`}>
                  <Link href={`/watch/${h.video_id}?list=${encodeURIComponent(h.series_id)}`} className="ep">
                    <div className="thumb">{h.thumbnail && <img src={h.thumbnail} alt="" loading="lazy" />}</div>
                    <span className="t">
                      {h.series_title}
                      <small>
                        {h.episode_title} · {timeAgo(h.watched_at)}
                      </small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nav" style={{ justifyContent: 'center' }}>
              {more && (
                <button className="btn ghost" onClick={() => loadHistory(history.length)}>
                  Xem thêm
                </button>
              )}
              <button className="btn ghost" onClick={clearHistory}>
                Xóa lịch sử
              </button>
            </div>
          </>
        ))}
    </>
  );
}
