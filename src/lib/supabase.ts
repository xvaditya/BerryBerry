import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://hxtoxawafdboijkaaxhq.supabase.co';
const fallbackSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dG94YXdhZmRib2lqa2FheGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDc0NjQsImV4cCI6MjA5NDU4MzQ2NH0.4eexDd7hhj53yvPTH80tMUlCkgYgizbN9Kv6UrU4wTg';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || fallbackSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || fallbackSupabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[BerryBerry] Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
