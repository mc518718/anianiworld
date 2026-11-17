import SeriesCard from '@/components/SeriesCard';
import { searchSeries } from '@/lib/db';

export const metadata = { title: 'Tìm kiếm', alternates: { canonical: '/search' }, robots: { index: false } };

export default async function Search({ searchParams }) {
  const q = ((await searchParams).q || '').toString().trim().slice(0, 80);
  const res = q ? await searchSeries(q) : [];
  return (
    <section className="sec">
      <div className="sec-h">
        <h2>{q ? `Kết quả cho “${q}”` : 'Tìm kiếm'}</h2>
      </div>
      {res.length ? (
        <div className="grid">
          {res.map((s) => (
            <SeriesCard key={s.id} s={s} />
          ))}
        </div>
      ) : (
        <p className="empty">{q ? 'Không tìm thấy anime nào phù hợp.' : 'Nhập tên anime để tìm kiếm.'}</p>
      )}
    </section>
  );
}
