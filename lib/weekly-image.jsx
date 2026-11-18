import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { newEpisodesLabel } from '@/lib/db';

const BG = '#0e0f14', PANEL = '#171922', LINE = '#262a36', TEXT = '#f2f1ec', MUTE = '#9a9fad', Y = '#ffcf3f', C = '#ff6b5e', INK = '#14130c';
const KIND = { sub: ['Vietsub', Y], dub: ['Lồng tiếng', C] };
const MAX = 10;

// keep short labels on one line
const nb = (t) => t.replace(/ /g, '\u00a0');
const asset = (p) => readFile(join(process.cwd(), p));
const dm = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

// A 1080×1350 text-only "this week's new episodes" card for social posts (no third-party artwork).
export async function weeklyImage(rows) {
  const [medium, heavy, logo] = await Promise.all([
    asset('assets/fonts/Inter-Medium.otf'),
    asset('assets/fonts/Inter-ExtraBold.otf'),
    asset('public/logo-mark.png'),
  ]);
  // Vietnam time for the date range
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  const from = new Date(now.getTime() - 6 * 86400 * 1000);
  const shown = rows.slice(0, MAX);
  const rest = rows.length - shown.length;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BG, color: TEXT, padding: '56px 60px 48px', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`data:image/png;base64,${logo.toString('base64')}`} width={84} height={88} />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 22 }}>
            <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1 }}>Anime có tập mới</div>
            <div style={{ display: 'flex', fontSize: 30, color: MUTE, marginTop: 6 }}>
              Tuần {dm(from)} – {dm(now)}/{now.getUTCFullYear()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 34, flexGrow: 1 }}>
          {shown.map((u, i) => {
            const k = KIND[u.kind];
            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', height: 92, marginBottom: 10, padding: '0 22px', borderRadius: 18, background: PANEL, border: `2px solid ${LINE}` }}>
                <div style={{ display: 'flex', width: 46, fontSize: 30, fontWeight: 800, color: i < 3 ? Y : MUTE }}>{i + 1}</div>
                <div style={{ display: 'flex', width: 520, overflow: 'hidden' }}>
                  <div style={{ fontSize: 29, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.25, maxWidth: 506 }}>{u.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 346 }}>
                  {k && (
                    <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, color: INK, background: k[1], borderRadius: 8, padding: '4px 10px' }}>{nb(k[0])}</div>
                  )}
                  <div style={{ display: 'flex', fontSize: 25, color: TEXT, marginLeft: 14 }}>{nb(newEpisodesLabel(u))}</div>
                </div>
              </div>
            );
          })}
          {!shown.length && <div style={{ display: 'flex', fontSize: 30, color: MUTE }}>Chưa có tập mới trong tuần này.</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 26, color: MUTE }}>{rest > 0 ? `và ${rest} anime khác · ` : ''}Bản quyền · Miễn phí</div>
            <div style={{ display: 'flex', fontSize: 38, fontWeight: 800, marginTop: 4 }}>
              <span>ani</span>
              <span style={{ color: Y }}>ani</span>
              <span>world.com/tap-moi</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: 'Inter', data: medium, weight: 500, style: 'normal' },
        { name: 'Inter', data: heavy, weight: 800, style: 'normal' },
      ],
    }
  );
}
