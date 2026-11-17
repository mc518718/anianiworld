import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeries, getEpisodes, PAGE, views } from '@/lib/db';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = await getSeries(id);
  return s ? { title: s.title, description: (s.description || '').slice(0, 160) } : {};
}

export default async function SeriesPage({ params, searchParams }) {
  const { id } = await params;
  const [s, eps] = await Promise.all([getSeries(id), getEpisodes(id)]);
  if (!s) notFound();
  // some channels list their playlists newest-first; always show episode 1 first
  if (s.reversed) eps.reverse();
  // long shows are split into blocks of 100 episodes
  const pages = Math.ceil(eps.length / PAGE);
  const p = Math.min(Math.max(1, parseInt((await searchParams).p || '1', 10) || 1), Math.max(1, pages));
  const shown = eps.slice((p - 1) * PAGE, p * PAGE);

  return (
    <>
      <div className="head">
        <div className="thumb">{s.thumbnail && <img src={s.thumbnail} alt="" />}</div>
        <div>
          <h1>{s.title}</h1>
          <p className="meta">
            {s.channels && <Link href={`/channel/${s.channels.id}`}>{s.channels.title}</Link>} · {eps.length} tập · {views(s.views)}
          </p>
          {s.description && <p className="desc">{s.description}</p>}
          {eps[0] && (
            <Link className="btn" href={`/watch/${eps[0].video_id}?list=${s.id}`}>
              ▶ Xem ngay
            </Link>
          )}
        </div>
      </div>

      <section className="sec">
        <div className="sec-h">
          <h2>Danh sách tập</h2>
        </div>
        {pages > 1 && (
          <div className="chips" style={{ flexWrap: 'wrap', margin: '0 0 16px' }}>
            {Array.from({ length: pages }, (_, i) => (
              <Link
                key={i}
                href={`/series/${s.id}?p=${i + 1}`}
                className="chip"
                style={{
                  padding: '5px 13px',
                  ...(i + 1 === p ? { background: 'var(--accent)', color: '#14130c', borderColor: 'var(--accent)' } : {}),
                }}
              >
                {i * PAGE + 1}–{Math.min((i + 1) * PAGE, eps.length)}
              </Link>
            ))}
          </div>
        )}
        <div className="grid">
          {shown.map((e) => (
            <Link key={e.video_id} href={`/watch/${e.video_id}?list=${s.id}`} className="card">
              <div className="thumb">{e.thumbnail && <img src={e.thumbnail} alt="" loading="lazy" />}</div>
              <h3>{e.title}</h3>
              <p className="meta">{views(e.views)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
