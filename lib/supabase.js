// Browser-side Supabase client: sign-in state, subscriptions and watch history.
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './config';

let client;
export function supabase() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      // implicit flow, so a verification link still works when it is opened on another device
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

export const displayName = (user) =>
  user?.user_metadata?.name || user?.user_metadata?.full_name || (user?.email || '').split('@')[0] || 'Thành viên';

// Only same-site paths are allowed as a post-login destination.
export const safeNext = (v) => (typeof v === 'string' && /^\/(?!\/)/.test(v) ? v : '/account');
