'use client';
import Link from 'next/link';
import { useUser } from './useUser';
import { displayName } from '@/lib/supabase';

export default function AuthNav() {
  const user = useUser();
  if (user === undefined) return <span className="authnav" aria-hidden="true" />;
  if (!user)
    return (
      <Link href="/login" className="authnav login">
        Đăng nhập
      </Link>
    );
  return (
    <Link href="/account" className="authnav avatar" aria-label="Trang cá nhân" title={displayName(user)}>
      {displayName(user).slice(0, 1).toUpperCase()}
    </Link>
  );
}
