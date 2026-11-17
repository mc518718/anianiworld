import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KindTag } from '@/components/SeriesCard';
import { getSeries, getEpisodes, PAGE, genresOf, synopsis, views } from '@/lib/db';

const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = await getSeries(id);
  if (!s) return {};
  const story = synopsis(s);
  return {
    title: s.title,
    description: story ? story.slice(0, 160) : undefined,
    openGraph: { title: s.title, description: story ? story.slice(0, 200) : undefined, images: [s.backdrop || s.poster || s.thumbnail].filter(Boolean) },
  };
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
  const story = synopsis(s);
  const facts = [
    ['Năm phát hành', s.year],
    ['Phiên bản', KIND[s.kind]],
    ['Số tập', `${eps.length} tập`],
    ['Lượt xem', views(s.views).replace(' lượt xem', '')],
    ['Tên gốc', s.alt_title && s.alt_title !== s.title ? s.alt_title : null],
  ].filter(([, v]) => v);

  return (
    <>
      <div className="show">
        {(s.backdrop || s.thumbnail) && <img className="show-bg" src={s.backdrop || s.thumbnail} alt="" />}
        <div className="show-in">
          <div className={`show-art${s.poster ? '' : ' wide'}`}>
            {(s.poster || s.thumbnail) && <img src={s.poster || s.thumbnail} alt={`Poster ${s.title}`} />}
            <KindTag kind={s.kind} />
          </div>
          <div className="show-txt">
            <h1>{s.title}</h1>
            {genresOf(s).length > 0 && (
              <div className="genres">
                {genresOf(s).map((g) => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            )}
            <dl className="facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              {s.channels && (
                <div>
                  <dt>Kênh</dt>
                  <dd>
                    <Link href={`/channel/${s.channels.id}`}>{s.channels.title}</Link>
                  </dd>
                </div>
              )}
            </dl>
            {eps[0] && (
              <Link className="btn" href={`/watch/${eps[0].video_id}?list=${s.id}`}>
                ▶ Xem ngay
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="sec-h">
          <h2>Nội dung</h2>
        </div>
        <p className="story">{story || 'Chưa có phần giới thiệu nội dung cho anime này.'}</p>
      </section>

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
