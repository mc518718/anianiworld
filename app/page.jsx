import Link from 'next/link';
import SeriesCard from '@/components/SeriesCard';
import { getChannels, getLatestSeries, getSeriesByChannel, timeAgo } from '@/lib/db';

export const revalidate = 300;

export default async function Home() {
  const [channels, latest] = await Promise.all([getChannels(), getLatestSeries(13)]);
  const rows = await Promise.all(channels.map((c) => getSeriesByChannel(c.id, 8)));
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
          <h2>Anime mới cập nhật</h2>
        </div>
        <div className="grid">
          {rest.map((s) => (
            <SeriesCard key={s.id} s={s} />
          ))}
        </div>
      </section>

      {channels.map((c, i) =>
        rows[i].length ? (
          <section className="sec" key={c.id}>
            <div className="sec-h">
              <h2>{c.title}</h2>
              <Link href={`/channel/${c.id}`}>Xem tất cả →</Link>
            </div>
            <div className="grid">
              {rows[i].map((s) => (
                <SeriesCard key={s.id} s={s} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </>
  );
}
