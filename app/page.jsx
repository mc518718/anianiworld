import Link from 'next/link';
import SeriesCard from '@/components/SeriesCard';
import HeroCarousel from '@/components/HeroCarousel';
import { getChannels, getHeroSeries, getLatestSeries, getTopSeries, genresOf, synopsis, views } from '@/lib/db';

export const revalidate = 300;
const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };

export default async function Home() {
  const [channels, latest, top, hero] = await Promise.all([
    getChannels(),
    getLatestSeries(24),
    getTopSeries(10),
    getHeroSeries(4),
  ]);

  if (!latest.length) return <p className="empty">Đang đồng bộ dữ liệu, vui lòng quay lại sau ít phút.</p>;

  const slides = hero.map((s) => ({
    id: s.id,
    title: s.title,
    image: s.backdrop || s.thumbnail,
    poster: s.poster,
    genres: genresOf(s).slice(0, 3),
    meta: [s.year, KIND[s.kind], `${s.episode_count} tập`, views(s.views)].filter(Boolean).join(' · '),
    story: synopsis(s),
  }));

  return (
    <>
      <HeroCarousel slides={slides} />

      <div className="chips">
        {channels.map((c) => (
          <Link key={c.id} href={`/channel/${c.id}`} className="chip">
            {c.thumbnail && <img src={c.thumbnail} alt="" />}
            {c.title}
          </Link>
        ))}
      </div>

      <section className="sec">
        <div className="sec-h">
          <h2>Bảng xếp hạng Top 10</h2>
          <Link href="/browse?sort=hot">Khám phá →</Link>
        </div>
        <ol className="rank">
          {top.map((s, i) => (
            <li key={s.id}>
              <Link href={`/series/${s.id}`} className="rank-item">
                <span className={`no${i < 3 ? ' hot' : ''}`}>{i + 1}</span>
                <div className="thumb poster">
                  {(s.poster || s.thumbnail) && <img src={s.poster || s.thumbnail} alt="" loading="lazy" />}
                </div>
                <div className="info">
                  <h3>{s.title}</h3>
                  <p className="meta">
                    {[s.year, KIND[s.kind], `${s.episode_count} tập`].filter(Boolean).join(' · ')}
                  </p>
                  <p className="meta">{views(s.views)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec">
        <div className="sec-h">
          <h2>Mới cập nhật</h2>
          <Link href="/latest">Xem thêm →</Link>
        </div>
        <div className="grid">
          {latest.map((s) => (
            <SeriesCard key={s.id} s={s} />
          ))}
        </div>
      </section>
    </>
  );
}
