'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GOOGLE_CLIENT_ID } from '@/lib/config';

const G_MARK = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    let tag = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (!tag) {
      tag = document.createElement('script');
      tag.src = GSI_SRC;
      tag.async = true;
      document.head.appendChild(tag);
    }
    tag.addEventListener('load', () => resolve());
    tag.addEventListener('error', () => reject(new Error('gsi')));
    setTimeout(() => (window.google?.accounts?.id ? resolve() : reject(new Error('gsi timeout'))), 8000);
  });
}

async function makeNonce() {
  const raw = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  return { raw, hashed };
}

// Google sign-in. The site asks Google directly for the member's identity, so Google's window
// names anianiworld.com; the result is then verified by Supabase. If Google's script cannot
// load (blocked or offline) the button falls back to the redirect flow.
//   mode:  'signin' | 'signup'   label shown on the button
//   next:  path to open after signing in
//   guard: optional () => string | null, an error message that stops the sign-in
export default function GoogleButton({ mode = 'signin', next = '/account', guard, onError }) {
  const holder = useRef(null);
  const guardRef = useRef(guard);
  guardRef.current = guard;
  const [official, setOfficial] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        await loadGsi();
        const nonce = await makeNonce();
        if (!live || !holder.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: nonce.hashed,
          ux_mode: 'popup',
          callback: async (response) => {
            const stop = guardRef.current?.();
            if (stop) return onError?.(stop);
            const { error } = await supabase().auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: nonce.raw,
            });
            if (error) onError?.('Chưa thể đăng nhập bằng Google. Vui lòng thử lại.');
            else window.location.assign(next);
          },
        });
        window.google.accounts.id.renderButton(holder.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          logo_alignment: 'center',
          text: mode === 'signup' ? 'signup_with' : 'continue_with',
          locale: 'vi',
          // the holder is hidden until Google has drawn the button, so measure its wrapper
          width: Math.max(200, Math.min(400, Math.floor(holder.current.parentElement.offsetWidth))),
        });
        setOfficial(true);
      } catch {
        if (live) setOfficial(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [mode, next, onError]);

  async function redirectFlow() {
    const stop = guardRef.current?.();
    if (stop) return onError?.(stop);
    const { error } = await supabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (error) onError?.('Chưa thể đăng nhập bằng Google. Vui lòng thử lại sau.');
  }

  return (
    <div className="gwrap">
      <div ref={holder} className="gsi" style={official ? undefined : { display: 'none' }} />
      {!official && (
        <button type="button" className="gbtn" onClick={redirectFlow}>
          <img src={G_MARK} alt="" width="20" height="20" />
          <span>{mode === 'signup' ? 'Đăng ký bằng Google' : 'Tiếp tục với Google'}</span>
        </button>
      )}
    </div>
  );
}
