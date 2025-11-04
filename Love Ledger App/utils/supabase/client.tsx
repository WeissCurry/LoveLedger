// Supabase client configuration
// Works in both Figma Make (development) and Vercel (production)

import { projectId, publicAnonKey } from './info';

export const getSupabaseUrl = () => {
  // Try environment variables first (Vercel production)
  if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_URL) {
    return import.meta.env.VITE_SUPABASE_URL;
  }
  // Fallback to info.tsx (Figma Make development)
  return `https://${projectId}.supabase.co`;
};

export const getSupabaseAnonKey = () => {
  // Try environment variables first (Vercel production)
  if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  // Fallback to info.tsx (Figma Make development)
  return publicAnonKey;
};

export const getSupabaseApiUrl = () => {
  const url = getSupabaseUrl();
  return `${url}/functions/v1/make-server-c17b8718`;
};
