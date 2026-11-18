import Link from 'next/link';
import { KindTag } from '@/components/SeriesCard';
import { getWeeklyUpdates, newEpisodesLabel } from '@/lib/db';

export const revalidate = 300;

const DESCRIPTION =
  'Danh sách anime bản quyền có tập mới trong 7 ngày qua, Vietsub và lồng tiếng, xem miễn phí từ các kênh YouTube chính thức.';

export const metadata = {
  title: 'Anime có tập mới tuần này',
  description: DESCRIPTION,
  alternates: { canonical: '/tap-moi' },
  openGraph: { title: 'Anime có tập mới tuần này', description: DESCRIPTION, url: '/tap-moi' },
};

const WEEKDAY = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

function dayLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${wd}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

export default async function NewEpisodes() {
  const list = await getWeeklyUpdates(7);
  const days = [];
  for (const u of list) {
    const last = days[days.length - 1];
    if (last && last.day === u.day) last.items.push(u);
    else days.push({ day: u.day, items: [u] });
  }
  const episodes = list.reduce((a, u) => a + u.new_count, 0);

  return (
    <>
      <div className="sec-h" style={{ marginTop: 22 }}>
        <h1 className="page-title">Anime có tập mới tuần này</h1>
        <Link href="/latest">Tất cả →</Link>
      </div>
      <p className="meta" style={{ marginTop: -4 }}>
        {list.length
          ? `${list.length} anime · ${episodes} tập mới trong 7 ngày qua · Vietsub & lồng tiếng, bản quyền, miễn phí`
          : 'Chưa có tập mới nào trong 7 ngày qua.'}
      </p>

      {days.map((g) => (
        <section className="sec" key={g.day}>
          <div className="sec-h">
            <h2>{dayLabel(g.day)}</h2>
          </div>
          <div className="grid">
            {g.items.map((u) => (
              <Link
                key={u.id}
                href={`/watch/${u.first_video}?list=${encodeURIComponent(u.id)}`}
                className="card"
              >
                <div className="thumb">
                  {(u.ep_thumbnail || u.thumbnail) && <img src={u.ep_thumbnail || u.thumbnail} alt="" loading="lazy" />}
                  <KindTag kind={u.kind} />
                  <span className="badge new">{newEpisodesLabel(u)}</span>
                </div>
                <h3>{u.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
