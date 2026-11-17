import Link from 'next/link';
import { timeAgo, views } from '@/lib/db';

const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };

export function KindTag({ kind }) {
  if (!KIND[kind]) return null;
  return <span className={`tag ${kind}`}>{KIND[kind]}</span>;
}

export default function SeriesCard({ s }) {
  return (
    <Link href={`/series/${s.id}`} className="card">
      <div className="thumb">
        {s.thumbnail && <img src={s.thumbnail} alt="" loading="lazy" />}
        <KindTag kind={s.kind} />
        <span className="badge">{s.episode_count} tập</span>
      </div>
      <h3>{s.title}</h3>
      <p className="meta">
        {views(s.views)} · {timeAgo(s.latest_episode_at)}
      </p>
    </Link>
  );
}
