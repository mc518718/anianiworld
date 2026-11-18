import { getWeeklyUpdates } from '@/lib/db';
import { weeklyImage } from '@/lib/weekly-image';

export const runtime = 'nodejs';
export const revalidate = 1800;

const DEMO = [
  { id: 'a', title: 'Đám Cưới Đom Đóm', kind: 'sub', new_count: 4, ep_from: 3, ep_to: 6 },
  { id: 'b', title: 'Chuyển Sinh Thành Quý Tộc, Tôi Sử Dụng Kỹ Năng Giám Định Để Tiến Thân Trong Thế Giới', kind: 'sub', new_count: 1, ep_from: 32, ep_to: 32 },
  { id: 'c', title: 'Thám Tử Lừng Danh Conan', kind: 'dub', new_count: 4, ep_from: 1083, ep_to: 1086 },
  { id: 'd', title: 'Một bộ không có số tập', kind: null, new_count: 2, ep_from: null, ep_to: null },
];

export async function GET() {
  // sample rows only for local development, where the database is not reachable
  const rows = process.env.WEEKLY_DEMO ? [...DEMO, ...DEMO, ...DEMO, ...DEMO].map((r, i) => ({ ...r, id: String(i) })) : await getWeeklyUpdates(7);
  return weeklyImage(rows);
}
