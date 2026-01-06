import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getUserId(): string {
  let userId = localStorage.getItem('slidesmith_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('slidesmith_user_id', userId);
  }
  return userId;
}
