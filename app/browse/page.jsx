import Link from 'next/link';
import { KindTag } from '@/components/SeriesCard';
import { browseSeries, getChannels, GENRES, SORTS, OLD_YEAR } from '@/lib/db';

export const metadata = {
  title: 'Khám phá anime',
  description: 'Lọc anime theo thể loại, phiên bản Vietsub hoặc lồng tiếng, năm phát hành, trạng thái và kênh.',
};

const PER = 48;
const KEYS = ['g', 'kind', 'status', 'year', 'channel', 'sort'];
const KIND = { sub: 'Vietsub', dub: 'Lồng tiếng' };

export default async function Browse({ searchParams }) {
  const sp = await searchParams;
  const f = Object.fromEntries(KEYS.map((k) => [k, typeof sp[k] === 'string' ? sp[k] : '']));
  const page = Math.min(500, Math.max(1, parseInt(sp.page || '1', 10) || 1));
  const [channels, { rows, total }] = await Promise.all([getChannels(), browseSeries(f, PER, (page - 1) * PER)]);

  // address for the same filters with some of them changed (changing a filter goes back to page 1)
  const href = (change, keepPage = false) => {
    const next = { ...f, ...change };
    const qs = KEYS.filter((k) => next[k]).map((k) => `${k}=${encodeURIComponent(next[k])}`);
    if (keepPage && change.page > 1) qs.push(`page=${change.page}`);
    return `/browse${qs.length ? `?${qs.join('&')}` : ''}`;
  };
  const Chip = ({ k, v, children }) => (
    <Link href={href({ [k]: v })} className={`fchip${f[k] === v ? ' on' : ''}`} aria-current={f[k] === v ? 'true' : undefined}>
      {children}
    </Link>
  );

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear - OLD_YEAR + 1 }, (_, i) => String(thisYear - i));
  const active = KEYS.some((k) => k !== 'sort' && f[k]);
  const pages = Math.ceil(total / PER);

  return (
    <>
      <div className="sec-h" style={{ marginTop: 22 }}>
        <h1 className="page-title">Khám phá</h1>
        {active && <Link href={href({ g: '', kind: '', status: '', year: '', channel: '' })}>Xóa bộ lọc</Link>}
      </div>

      <div className="filters">
        <div className="frow">
          <span className="flabel">Thể loại</span>
          <div className="fchips">
            <Chip k="g" v="">Tất cả</Chip>
            {GENRES.map((g) => (
              <Chip key={g.slug} k="g" v={g.slug}>{g.label}</Chip>
            ))}
          </div>
        </div>
        <div className="frow">
          <span className="flabel">Phiên bản</span>
          <div className="fchips">
            <Chip k="kind" v="">Tất cả</Chip>
            <Chip k="kind" v="sub">Vietsub</Chip>
            <Chip k="kind" v="dub">Lồng tiếng</Chip>
          </div>
        </div>
        <div className="frow">
          <span className="flabel">Trạng thái</span>
          <div className="fchips">
            <Chip k="status" v="">Tất cả</Chip>
            <Chip k="status" v="ongoing">Đang phát hành</Chip>
            <Chip k="status" v="ended">Đã hoàn thành</Chip>
          </div>
        </div>
        <div className="frow">
          <span className="flabel">Năm</span>
          <div className="fchips">
            <Chip k="year" v="">Tất cả</Chip>
            {years.map((y) => (
              <Chip key={y} k="year" v={y}>{y}</Chip>
            ))}
            <Chip k="year" v="cu">Trước {OLD_YEAR}</Chip>
          </div>
        </div>
        <div className="frow">
          <span className="flabel">Kênh</span>
          <div className="fchips">
            <Chip k="channel" v="">Tất cả</Chip>
            {channels.map((c) => (
              <Chip key={c.id} k="channel" v={c.id}>{c.title}</Chip>
            ))}
          </div>
        </div>
        <div className="frow">
          <span className="flabel">Sắp xếp</span>
          <div className="fchips">
            {SORTS.map((s, i) => (
              <Link key={s.slug} href={href({ sort: i === 0 ? '' : s.slug })} className={`fchip${(f.sort || SORTS[0].slug) === s.slug ? ' on' : ''}`}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="meta" style={{ margin: '18px 0 14px' }}>{total} anime</p>

      {rows.length ? (
        <div className="pgrid">
          {rows.map((s) => (
            <Link href={`/series/${s.id}`} className="pcard" key={s.id}>
              <div className="thumb poster">
                {(s.poster || s.thumbnail) && <img src={s.poster || s.thumbnail} alt="" loading="lazy" />}
                <KindTag kind={s.kind} />
                <span className="badge">{s.episode_count} tập</span>
              </div>
              <h3>{s.title}</h3>
              <p className="meta">
                {[s.rating ? `★ ${Number(s.rating).toFixed(1)}` : null, s.year, s.status === 'ongoing' ? 'Đang phát hành' : null]
                  .filter(Boolean)
                  .join(' · ') || KIND[s.kind] || ''}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty">Không có anime nào khớp với bộ lọc. Hãy thử bỏ bớt điều kiện.</p>
      )}

      {pages > 1 && (
        <div className="nav" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
          {page > 1 && (
            <Link className="btn ghost" href={href({ page: page - 1 }, true)}>
              ← Trang trước
            </Link>
          )}
          <span className="meta">
            Trang {page} / {pages}
          </span>
          {page < pages && (
            <Link className="btn ghost" href={href({ page: page + 1 }, true)}>
              Trang sau →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
