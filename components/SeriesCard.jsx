import Link from 'next/link';
import { timeAgo } from '@/lib/db';

const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };
const tag = {
  position: 'absolute', left: 6, top: 6, fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
};

export default function SeriesCard({ s }) {
  return (
    <Link href={`/series/${s.id}`} className="card">
      <div className="thumb">
        {s.thumbnail && <img src={s.thumbnail} alt="" loading="lazy" />}
        {KIND[s.kind] && (
          <span style={{ ...tag, background: s.kind === 'dub' ? '#ff6b5e' : '#ffcf3f', color: '#14130c' }}>
            {KIND[s.kind]}
          </span>
        )}
        <span className="badge">{s.episode_count} tập</span>
      </div>
      <h3>{s.title}</h3>
      <p className="meta">{timeAgo(s.latest_episode_at)}</p>
    </Link>
  );
}
