import { createClient } from '@supabase/supabase-js';

// Fallbacks prevent build-time crash when NEXT_PUBLIC_* vars aren't baked in yet.
// Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel
// project settings so they're available at both build time and runtime.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
);
