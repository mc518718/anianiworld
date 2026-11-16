import Link from 'next/link';
export default function NotFound() {
  return (
    <p className="empty">
      Không tìm thấy trang này. <Link href="/" style={{ color: 'var(--accent)' }}>Về trang chủ</Link>
    </p>
  );
}
