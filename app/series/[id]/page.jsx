import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeries, getEpisodes } from '@/lib/db';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = await getSeries(id);
  return s ? { title: s.title, description: (s.description || '').slice(0, 160) } : {};
}

export default async function SeriesPage({ params }) {
  const { id } = await params;
  const [s, eps] = await Promise.all([getSeries(id), getEpisodes(id)]);
  if (!s) notFound();

  return (
    <>
      <div className="head">
        <div className="thumb">{s.thumbnail && <img src={s.thumbnail} alt="" />}</div>
        <div>
          <h1>{s.title}</h1>
          <p className="meta">
            {s.channels && <Link href={`/channel/${s.channels.id}`}>{s.channels.title}</Link>} · {eps.length} tập
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
        <div className="grid">
          {eps.map((e) => (
            <Link key={e.video_id} href={`/watch/${e.video_id}?list=${s.id}`} className="card">
              <div className="thumb">{e.thumbnail && <img src={e.thumbnail} alt="" loading="lazy" />}</div>
              <h3>{e.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
