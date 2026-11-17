import Link from 'next/link';
import AuthNav from '@/components/AuthNav';
import Tracker from '@/components/Tracker';
import { CONTACT_EMAIL, FACEBOOK_URL, SITE_URL } from '@/lib/config';
import './globals.css';

const DESCRIPTION =
  'Anianiworld tổng hợp anime Nhật Bản có bản quyền, phụ đề và lồng tiếng Việt, phát trực tiếp từ các kênh YouTube chính thức.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Anianiworld – Xem anime bản quyền Vietsub miễn phí', template: '%s | Anianiworld' },
  description: DESCRIPTION,
  applicationName: 'Anianiworld',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Anianiworld',
    locale: 'vi_VN',
    title: 'Anianiworld – Xem anime bản quyền Vietsub miễn phí',
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
  verification: { google: 'eJd2CX0rhjh0qB0AiPiquiOUmvp7IDLDr45kGQu64Is' },
};
export const viewport = { themeColor: '#0e0f14' };

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="top">
          <div className="wrap bar">
            <Link href="/" className="logo">
              ani<span>ani</span>world
            </Link>
            <Link href="/browse" className="navlink">
              Khám phá
            </Link>
            {/* merchandise: no destination yet */}
            <span className="navlink soon" role="link" aria-disabled="true" title="Sắp ra mắt">
              Merch
            </span>
            <form action="/search" className="search">
              <input name="q" type="search" placeholder="Tìm anime…" aria-label="Tìm anime" required />
            </form>
            <AuthNav />
          </div>
        </header>
        <main className="wrap">{children}</main>
        <Tracker />
        <footer className="wrap foot">
          <p className="foot-links">
            <Link href="/terms">Điều khoản dịch vụ</Link>
            <Link href="/privacy">Chính sách quyền riêng tư</Link>
            {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>Liên hệ</a>}
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook</a>
          </p>
          <p>
            Anianiworld chỉ lập chỉ mục và nhúng video từ các kênh YouTube chính thức. Video được phát bằng trình
            phát của YouTube; trang không lưu trữ hay chuyển mã bất kỳ tệp video nào.
          </p>
          <p>Trang sử dụng YouTube API và không liên kết với YouTube hay Google.</p>
          <p>
            Thông tin và hình ảnh phim do TMDB cung cấp. Sản phẩm này sử dụng API của TMDB nhưng không được TMDB xác
            nhận hay chứng nhận.
          </p>
        </footer>
      </body>
    </html>
  );
}
