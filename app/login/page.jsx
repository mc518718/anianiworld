'use client';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, safeNext } from '@/lib/supabase';
import { useUser } from '@/components/useUser';

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const user = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setError(
        /confirm/i.test(err.message)
          ? 'Email chưa được xác minh. Vui lòng mở thư xác minh chúng tôi đã gửi cho bạn.'
          : 'Email hoặc mật khẩu không đúng.'
      );
      setBusy(false);
    }
  }

  async function google() {
    setError('');
    const { error: err } = await supabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (err) setError('Chưa thể đăng nhập bằng Google. Vui lòng thử lại sau.');
  }

  return (
    <div className="auth">
      <h1>Đăng nhập</h1>
      <p className="auth-sub">Đăng ký theo dõi anime và lưu lịch sử xem của bạn.</p>
      <button type="button" className="btn ghost wide" onClick={google}>
        Tiếp tục với Google
      </button>
      <div className="or">hoặc</div>
      <form onSubmit={submit}>
        <label>
          Email
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Mật khẩu
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="form-err">{error}</p>}
        <button className="btn wide" disabled={busy}>
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
      <p className="auth-links">
        <Link href="/reset-password">Quên mật khẩu?</Link>
        <span>
          Chưa có tài khoản? <Link href={`/register${next !== '/account' ? `?next=${encodeURIComponent(next)}` : ''}`}>Đăng ký</Link>
        </span>
      </p>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
