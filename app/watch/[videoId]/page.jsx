import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeries, getEpisodes, getEpisodeAnywhere, PAGE } from '@/lib/db';

async function load(params, searchParams) {
  const { videoId } = await params;
  let { list } = await searchParams;
  if (!/^[\w-]{6,20}$/.test(videoId)) return null;
  if (!list) list = (await getEpisodeAnywhere(videoId))?.series_id;
  if (!list) return null;
  const [s, eps] = await Promise.all([getSeries(list), getEpisodes(list)]);
  if (s?.reversed) eps.reverse();
  const i = eps.findIndex((e) => e.video_id === videoId);
  if (!s || i < 0) return null;
  return { s, eps, i };
}

export async function generateMetadata({ params, searchParams }) {
  const d = await load(params, searchParams);
  return d ? { title: `${d.s.title} – ${d.eps[d.i].title}` } : {};
}

export default async function Watch({ params, searchParams }) {
  const d = await load(params, searchParams);
  if (!d) notFound();
  const { s, eps, i } = d;
  const ep = eps[i];
  const prev = eps[i - 1];
  const next = eps[i + 1];
  const href = (e) => `/watch/${e.video_id}?list=${s.id}`;
  // for long shows the side list only shows the block of 100 around the current episode
  const block = Math.floor(i / PAGE);
  const side = eps.length > PAGE ? eps.slice(block * PAGE, (block + 1) * PAGE) : eps;

  return (
    <div className="watch">
      <div>
        <div className="player">
          <iframe
            src={`https://www.youtube.com/embed/${ep.video_id}?rel=0&hl=vi`}
            title={ep.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <h1>
          {s.title} – {ep.title}
        </h1>
        <p className="meta">
          <Link href={`/series/${s.id}`}>{s.title}</Link>
          {s.channels && <> · {s.channels.title}</>}
        </p>
        <div className="nav">
          {prev && (
            <Link className="btn ghost" href={href(prev)}>
              ← Tập trước
            </Link>
          )}
          {next && (
            <Link className="btn" href={href(next)}>
              Tập tiếp theo →
            </Link>
          )}
        </div>
      </div>

      <aside className="list">
        <h2>
          Danh sách tập ({eps.length})
          {eps.length > PAGE && (
            <Link
              href={`/series/${s.id}?p=${block + 1}`}
              style={{ float: 'right', color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}
            >
              Tất cả →
            </Link>
          )}
        </h2>
        <ol>
          {side.map((e) => (
            <li key={e.video_id}>
              <Link href={href(e)} className={`ep${e.video_id === ep.video_id ? ' on' : ''}`}>
                <div className="thumb">{e.thumbnail && <img src={e.thumbnail} alt="" loading="lazy" />}</div>
                <span className="t">{e.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
