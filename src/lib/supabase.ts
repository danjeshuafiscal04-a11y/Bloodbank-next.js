import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project") &&
      !supabaseAnonKey.includes("your-supabase-anon-key"),
  );
}

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(supabaseUrl!, supabaseAnonKey!);
}

export function tryCreateBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(supabaseUrl!, supabaseAnonKey!);
}
