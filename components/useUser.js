'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Current member: undefined while loading, null when signed out.
export function useUser() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return user;
}
