'use client';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, safeNext } from '@/lib/supabase';
import GoogleButton from '@/components/GoogleButton';

function RegisterForm() {
  const next = safeNext(useSearchParams().get('next'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Mật khẩu cần ít nhất 8 ký tự.');
    if (password !== again) return setError('Hai mật khẩu không khớp.');
    if (!agree) return setError('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.');
    setBusy(true);
    const { data, error: err } = await supabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() }, emailRedirectTo: `${window.location.origin}${next}` },
    });
    setBusy(false);
    if (err) return setError(/rate|limit/i.test(err.message) ? 'Hệ thống đang gửi quá nhiều thư. Vui lòng thử lại sau ít phút.' : 'Không đăng ký được. Vui lòng kiểm tra lại thông tin.');
    // an address that already has an account comes back without identities
    if (data.user && data.user.identities && data.user.identities.length === 0)
      return setError('Email này đã có tài khoản. Hãy đăng nhập hoặc đặt lại mật khẩu.');
    setSent(true);
  }

  const needAgree = () => (agree ? null : 'Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.');

  if (sent)
    return (
      <div className="auth">
        <h1>Kiểm tra hộp thư của bạn</h1>
        <p className="auth-sub">
          Chúng tôi đã gửi thư xác minh tới <strong>{email}</strong>. Hãy bấm vào liên kết trong thư để hoàn tất đăng ký.
          Nếu không thấy thư, hãy kiểm tra mục thư rác.
        </p>
        <Link className="btn wide" href="/login">
          Về trang đăng nhập
        </Link>
      </div>
    );

  return (
    <div className="auth">
      <h1>Đăng ký</h1>
      <p className="auth-sub">Tạo tài khoản miễn phí để theo dõi anime và nhận thông báo khi có tập mới.</p>
      <form onSubmit={submit}>
        <label>
          Tên hiển thị
          <input type="text" autoComplete="nickname" required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Mật khẩu (ít nhất 8 ký tự)
          <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Nhập lại mật khẩu
          <input type="password" autoComplete="new-password" required value={again} onChange={(e) => setAgain(e.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            Tôi đồng ý với <Link href="/terms" target="_blank">Điều khoản dịch vụ</Link> và{' '}
            <Link href="/privacy" target="_blank">Chính sách quyền riêng tư</Link>.
          </span>
        </label>
        {error && <p className="form-err">{error}</p>}
        <button className="btn wide" disabled={busy}>
          {busy ? 'Đang gửi…' : 'Đăng ký'}
        </button>
      </form>
      <div className="or">hoặc</div>
      <GoogleButton mode="signup" next={next} guard={needAgree} onError={setError} />
      <p className="auth-links">
        <span>
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </span>
      </p>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
