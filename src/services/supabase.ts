import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function normalizeEnvValue(value?: string) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

function normalizeSupabaseUrl(value?: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co")) return false;
    return url.origin;
  } catch {
    return false;
  }
}

const normalizedSupabaseUrl = normalizeSupabaseUrl(normalizeEnvValue(supabaseUrl));
const normalizedSupabaseAnonKey = normalizeEnvValue(supabaseAnonKey);

export const isSupabaseConfigured = Boolean(normalizedSupabaseUrl && normalizedSupabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(normalizedSupabaseUrl as string, normalizedSupabaseAnonKey as string)
  : null;

export const adminEmail = normalizeEnvValue(import.meta.env.VITE_ADMIN_EMAIL);
