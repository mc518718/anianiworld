'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [mode, setMode] = useState('request'); // 'request' → ask for the e-mail, 'update' → opened from the e-mail link
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: sub } = supabase().auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('update');
    });
    if (new URLSearchParams(window.location.search).get('step') === 'update') setMode('update');
    return () => sub.subscription.unsubscribe();
  }, []);

  async function request(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password?step=update`,
    });
    setBusy(false);
    if (err) setError('Không gửi được thư. Vui lòng thử lại sau ít phút.');
    else setMsg('Nếu email này có tài khoản, chúng tôi đã gửi thư hướng dẫn đặt lại mật khẩu.');
  }

  async function update(e) {
    e.preventDefault();
    if (password.length < 8) return setError('Mật khẩu cần ít nhất 8 ký tự.');
    setBusy(true);
    setError('');
    const { error: err } = await supabase().auth.updateUser({ password });
    setBusy(false);
    if (err) setError('Liên kết đã hết hạn. Vui lòng yêu cầu thư đặt lại mật khẩu mới.');
    else setMsg('Đã đổi mật khẩu. Bạn có thể tiếp tục sử dụng tài khoản.');
  }

  return (
    <div className="auth">
      <h1>{mode === 'update' ? 'Đặt mật khẩu mới' : 'Quên mật khẩu'}</h1>
      {msg ? (
        <>
          <p className="auth-sub">{msg}</p>
          <Link className="btn wide" href={mode === 'update' ? '/account' : '/login'}>
            {mode === 'update' ? 'Tới trang cá nhân' : 'Về trang đăng nhập'}
          </Link>
        </>
      ) : mode === 'update' ? (
        <form onSubmit={update}>
          <label>
            Mật khẩu mới (ít nhất 8 ký tự)
            <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="form-err">{error}</p>}
          <button className="btn wide" disabled={busy}>
            Lưu mật khẩu
          </button>
        </form>
      ) : (
        <form onSubmit={request}>
          <p className="auth-sub">Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>
          <label>
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="form-err">{error}</p>}
          <button className="btn wide" disabled={busy}>
            Gửi thư
          </button>
        </form>
      )}
    </div>
  );
}
