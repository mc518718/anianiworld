import Link from 'next/link';
import SeriesCard, { KindTag } from '@/components/SeriesCard';
import { getChannels, getLatestSeries, getTopSeries, timeAgo, views } from '@/lib/db';

export const revalidate = 300;

export default async function Home() {
  const [channels, latest, top] = await Promise.all([getChannels(), getLatestSeries(25), getTopSeries(10)]);
  const [hero, ...rest] = latest;

  if (!hero) return <p className="empty">Đang đồng bộ dữ liệu, vui lòng quay lại sau ít phút.</p>;

  return (
    <>
      <Link href={`/series/${hero.id}`} className="hero">
        {hero.thumbnail && <img src={hero.thumbnail} alt="" />}
        <div className="txt">
          <span className="kicker">Mới cập nhật</span>
          <h1>{hero.title}</h1>
          <p>
            {hero.episode_count} tập · {timeAgo(hero.latest_episode_at)}
          </p>
        </div>
      </Link>

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
        </div>
        <ol className="rank">
          {top.map((s, i) => (
            <li key={s.id}>
              <Link href={`/series/${s.id}`} className="rank-item">
                <span className={`no${i < 3 ? ' hot' : ''}`}>{i + 1}</span>
                <div className="thumb">
                  {s.thumbnail && <img src={s.thumbnail} alt="" loading="lazy" />}
                  <KindTag kind={s.kind} />
                </div>
                <div className="info">
                  <h3>{s.title}</h3>
                  <p className="meta">
                    {views(s.views)} · {s.episode_count} tập
                  </p>
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
          {rest.map((s) => (
            <SeriesCard key={s.id} s={s} />
          ))}
        </div>
      </section>
    </>
  );
}
