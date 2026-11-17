import Link from 'next/link';
import SeriesCard from '@/components/SeriesCard';
import { getLatestSeries } from '@/lib/db';

const PER = 48;
export const metadata = { alternates: { canonical: '/latest' }, title: 'Mới cập nhật' };

export default async function Latest({ searchParams }) {
  const page = Math.min(200, Math.max(1, parseInt((await searchParams).page || '1', 10) || 1));
  const list = await getLatestSeries(PER + 1, (page - 1) * PER);
  const more = list.length > PER;

  return (
    <section className="sec">
      <div className="sec-h">
        <h2>Mới cập nhật</h2>
      </div>
      {list.length ? (
        <div className="grid">
          {list.slice(0, PER).map((s) => (
            <SeriesCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <p className="empty">Không còn anime nào.</p>
      )}
      <div className="nav" style={{ justifyContent: 'center', marginTop: 12 }}>
        {page > 1 && (
          <Link className="btn ghost" href={`/latest?page=${page - 1}`}>
            ← Trang trước
          </Link>
        )}
        {more && (
          <Link className="btn ghost" href={`/latest?page=${page + 1}`}>
            Trang sau →
          </Link>
        )}
      </div>
    </section>
  );
}
