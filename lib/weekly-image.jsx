import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { newEpisodesLabel } from '@/lib/db';

const BG = '#0e0f14', PANEL = '#171922', LINE = '#262a36', TEXT = '#f2f1ec', MUTE = '#9a9fad', Y = '#ffcf3f', C = '#ff6b5e', INK = '#14130c';
const KIND = { sub: ['Vietsub', Y], dub: ['Lồng tiếng', C] };
const COLS = 4, MAX = 8;
const PW = 226, PH = 388, GAP = 18;

const asset = (p) => readFile(join(process.cwd(), p));
const dm = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
// keep short labels on one line
const nb = (t) => t.replace(/ /g, '\u00a0');

// Download a picture and inline it, so one slow or missing image cannot break the whole card.
async function inline(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000), next: { revalidate: 86400 } });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/^image\/(jpeg|png)/.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 3_000_000) return null;
    return `data:${type.split(';')[0]};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

// A 1080×1350 "this week's new episodes" card for social posts: eight shows with their posters.
export async function weeklyImage(rows) {
  // shows with a poster first, otherwise keep the newest-first order
  const ordered = [...rows.filter((r) => r.poster), ...rows.filter((r) => !r.poster)];
  const shown = ordered.slice(0, MAX);
  const rest = rows.length - shown.length;

  const [medium, heavy, logo, ...pics] = await Promise.all([
    asset('assets/fonts/Inter-Medium.otf'),
    asset('assets/fonts/Inter-ExtraBold.otf'),
    asset('public/logo-mark.png'),
    ...shown.map(async (u) => (await inline(u.poster)) || (await inline(u.ep_thumbnail || u.thumbnail))),
  ]);
  // Vietnam time for the date range
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  const from = new Date(now.getTime() - 6 * 86400 * 1000);

  const lines = [];
  for (let i = 0; i < shown.length; i += COLS) lines.push(shown.slice(i, i + COLS).map((u, j) => ({ u, pic: pics[i + j] })));

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

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, flexGrow: 1 }}>
          {lines.map((line, li) => (
            <div key={li} style={{ display: 'flex', marginBottom: 30 }}>
              {line.map(({ u, pic }, ci) => {
                const k = KIND[u.kind];
                return (
                  <div key={u.id} style={{ display: 'flex', flexDirection: 'column', width: PW, marginLeft: ci ? GAP : 0 }}>
                    <div style={{ display: 'flex', position: 'relative', width: PW, height: PH, borderRadius: 16, overflow: 'hidden', background: PANEL, border: `2px solid ${LINE}` }}>
                      {pic ? (
                        <img src={pic} width={PW} height={PH} style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 16, fontSize: 24, fontWeight: 800, color: MUTE, textAlign: 'center' }}>{u.title}</div>
                      )}
                      {k && (
                        <div style={{ display: 'flex', position: 'absolute', left: 10, top: 10, fontSize: 18, fontWeight: 800, color: INK, background: k[1], borderRadius: 7, padding: '3px 9px' }}>{nb(k[0])}</div>
                      )}
                      <div style={{ display: 'flex', position: 'absolute', right: 10, bottom: 10, fontSize: 20, fontWeight: 800, color: TEXT, background: 'rgba(0,0,0,0.82)', borderRadius: 7, padding: '4px 10px' }}>{nb(newEpisodesLabel(u))}</div>
                    </div>
                    <div style={{ display: 'block', lineClamp: 2, height: 62, marginTop: 10, fontSize: 22, fontWeight: 800, lineHeight: 1.3, overflow: 'hidden' }}>{u.title}</div>
                  </div>
                );
              })}
            </div>
          ))}
          {!shown.length && <div style={{ display: 'flex', fontSize: 30, color: MUTE }}>Chưa có tập mới trong tuần này.</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 26, color: MUTE }}>{rest > 0 ? `và ${rest} anime khác · ` : ''}Bản quyền · Miễn phí</div>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 800, marginTop: 4 }}>
            <span>ani</span>
            <span style={{ color: Y }}>ani</span>
            <span>world.com/tap-moi</span>
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
