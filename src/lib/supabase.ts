import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project credentials for D'Calabash Hotel
export const DEFAULT_SUPABASE_URL = 'https://pzqwjuksiptwdejaagrd.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cXdqdWtzaXB0d2RlamFhZ3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0NzIsImV4cCI6MjEwODkwNDQ3Mn0._-sTE5yagPQK5M3z85uR4rYOS8M9Ab720lhITCASFm4';

/**
 * Normalizes user-entered Supabase URLs.
 * Automatically strips trailing '/rest/v1/', '/rest/v1', or trailing slashes,
 * converting them to the required base domain (e.g. https://xyz.supabase.co).
 */
export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

// Retrieve credentials from localStorage, Vite env vars, or hard-wired project defaults
const getStoredConfig = () => {
  try {
    const customUrl = localStorage.getItem('dcalabash_supabase_url');
    const customKey = localStorage.getItem('dcalabash_supabase_anon_key');
    const rawUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const rawKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
    return {
      url: normalizeSupabaseUrl(rawUrl),
      key: (rawKey || '').trim(),
    };
  } catch {
    const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
    return {
      url: normalizeSupabaseUrl(rawUrl),
      key: (rawKey || '').trim(),
    };
  }
};

export const getSupabaseConfig = () => getStoredConfig();

export const setSupabaseConfig = (url: string, anonKey: string) => {
  const cleanUrl = normalizeSupabaseUrl(url);
  localStorage.setItem('dcalabash_supabase_url', cleanUrl);
  localStorage.setItem('dcalabash_supabase_anon_key', anonKey.trim());
  supabaseInstance = null; // force re-creation
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('dcalabash_supabase_url');
  localStorage.removeItem('dcalabash_supabase_anon_key');
  supabaseInstance = null;
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = getStoredConfig();
  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredConfig();
  return Boolean(url && key && url.startsWith('http'));
};

/**
 * Tests live connectivity to the configured Supabase instance.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  hasSchema?: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      message: 'Supabase client could not be initialized with current credentials.',
    };
  }

  try {
    // Attempt to query room_categories
    const { data, error } = await client.from('room_categories').select('id, name').limit(1);

    if (error) {
      // If table doesn't exist yet, connection is valid but migration has not run
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          connected: true,
          hasSchema: false,
          message: 'Connected to Supabase project! Note: Tables have not been created yet. Please execute the SQL migration script in your Supabase SQL Editor.',
        };
      }
      return {
        connected: false,
        message: `Connected with error: ${error.message} (code: ${error.code})`,
      };
    }

    return {
      connected: true,
      hasSchema: true,
      message: `Successfully connected to Supabase! Found ${data ? data.length : 0} room records.`,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`,
    };
  }
}

/**
 * Uploads an image File directly to a Supabase Storage bucket.
 * Returns the public URL if successful.
 */
export async function uploadImageToSupabase(
  bucketName: string,
  file: File,
  customPath?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = customPath || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await client.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = client.storage.from(bucketName).getPublicUrl(fileName);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload image' };
  }
}
