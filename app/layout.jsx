import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: { default: 'Anianiworld – Xem anime bản quyền Vietsub miễn phí', template: '%s | Anianiworld' },
  description:
    'Anianiworld tổng hợp anime Nhật Bản có bản quyền, phụ đề và lồng tiếng Việt, phát trực tiếp từ các kênh YouTube chính thức.',
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
            <form action="/search" className="search">
              <input name="q" type="search" placeholder="Tìm anime…" aria-label="Tìm anime" required />
            </form>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="wrap foot">
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
