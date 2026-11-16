import Link from 'next/link';
import { notFound } from 'next/navigation';
import SeriesCard from '@/components/SeriesCard';
import { getChannels, getSeriesByChannel } from '@/lib/db';

const PER = 48;

export default async function Channel({ params, searchParams }) {
  const { id } = await params;
  const page = Math.max(1, parseInt((await searchParams).page || '1', 10) || 1);
  const c = (await getChannels()).find((x) => x.id === id);
  if (!c) notFound();
  const list = await getSeriesByChannel(id, PER + 1, (page - 1) * PER);
  const more = list.length > PER;

  return (
    <section className="sec">
      <div className="sec-h">
        <h2>{c.title}</h2>
        <a href={`https://www.youtube.com/channel/${c.id}`} target="_blank" rel="noopener noreferrer">
          Kênh YouTube ↗
        </a>
      </div>
      <div className="grid">
        {list.slice(0, PER).map((s) => (
          <SeriesCard key={s.id} s={s} />
        ))}
      </div>
      <div className="nav" style={{ justifyContent: 'center', marginTop: 12 }}>
        {page > 1 && (
          <Link className="btn ghost" href={`/channel/${id}?page=${page - 1}`}>
            ← Trang trước
          </Link>
        )}
        {more && (
          <Link className="btn ghost" href={`/channel/${id}?page=${page + 1}`}>
            Trang sau →
          </Link>
        )}
      </div>
    </section>
  );
}
