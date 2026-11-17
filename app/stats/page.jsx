'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/components/useUser';

const PAGE_VI = {
  home: 'Trang chủ', browse: 'Khám phá', latest: 'Mới cập nhật', series: 'Trang anime', watch: 'Trang xem',
  search: 'Tìm kiếm', channel: 'Kênh', account: 'Tài khoản', auth: 'Đăng nhập / đăng ký', legal: 'Điều khoản', other: 'Khác',
};
const nf = new Intl.NumberFormat('vi-VN');

function Bars({ rows, label }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <ul className="bars">
      {rows.map((r) => (
        <li key={r.key}>
          <span className="bl">{label ? label(r.key) : r.key}</span>
          <span className="bt"><i style={{ width: `${(r.n / max) * 100}%` }} /></span>
          <span className="bn">{nf.format(r.n)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Stats() {
  const user = useUser();
  const router = useRouter();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (user === null) router.replace('/login?next=/stats');
  }, [user, router]);
  useEffect(() => {
    if (!user) return;
    setData(undefined);
    supabase().rpc('site_stats', { p_days: days }).then(({ data: d }) => setData(d ?? null));
  }, [user, days]);

  if (!user || data === undefined) return <p className="empty">Đang tải…</p>;
  if (data === null) return <p className="empty">Trang này chỉ dành cho quản trị viên.</p>;

  const sum = (k) => data.days.reduce((a, d) => a + d[k], 0);
  const maxDay = Math.max(1, ...data.days.map((d) => d.visits));

  return (
    <>
      <div className="sec-h" style={{ marginTop: 22 }}>
        <h1 className="page-title">Thống kê</h1>
      </div>
      <div className="tabs" style={{ marginTop: 0 }}>
        {[7, 30, 90].map((n) => (
          <button key={n} className={days === n ? 'on' : ''} onClick={() => setDays(n)}>
            {n} ngày
          </button>
        ))}
      </div>

      <dl className="kpis">
        <div><dd>{nf.format(sum('visits'))}</dd><dt>Lượt truy cập</dt></div>
        <div><dd>{nf.format(sum('visitors'))}</dd><dt>Khách (theo ngày)</dt></div>
        <div><dd>{nf.format(sum('pageviews'))}</dd><dt>Lượt xem trang</dt></div>
        <div><dd>{nf.format(data.totals.members)}</dd><dt>Thành viên</dt></div>
        <div><dd>{nf.format(data.totals.subscriptions)}</dd><dt>Lượt đăng ký anime</dt></div>
        <div><dd>{nf.format(data.totals.episode_views)}</dd><dt>Lượt xem tập</dt></div>
      </dl>

      <section className="sec">
        <div className="sec-h"><h2>Lượt truy cập mỗi ngày</h2></div>
        <div className="daychart" role="img" aria-label="Lượt truy cập mỗi ngày">
          {data.days.map((d) => (
            <span key={d.day} title={`${d.day}: ${d.visits} lượt truy cập, ${d.visitors} khách`}>
              <i style={{ height: `${(d.visits / maxDay) * 100}%` }} />
            </span>
          ))}
        </div>
        <p className="meta">{data.days[0]?.day} → {data.days[data.days.length - 1]?.day} · cao nhất {nf.format(maxDay)} lượt/ngày</p>
      </section>

      <section className="sec">
        <div className="sec-h"><h2>Nguồn truy cập</h2></div>
        {data.sources.length ? <Bars rows={data.sources} label={(k) => (k === 'direct' ? 'Trực tiếp / không rõ' : k)} /> : <p className="meta">Chưa có dữ liệu.</p>}
      </section>

      <section className="sec">
        <div className="sec-h"><h2>Loại trang được xem</h2></div>
        {data.pages.length ? <Bars rows={data.pages} label={(k) => PAGE_VI[k] || k} /> : <p className="meta">Chưa có dữ liệu.</p>}
      </section>

      <section className="sec">
        <div className="sec-h"><h2>Anime được xem nhiều nhất</h2></div>
        {data.top_series.length ? (
          <Bars rows={data.top_series.map((s) => ({ key: s.title, n: s.views }))} />
        ) : (
          <p className="meta">Chưa có dữ liệu.</p>
        )}
      </section>
    </>
  );
}
