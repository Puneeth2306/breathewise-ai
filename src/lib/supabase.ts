import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Determine if real Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your_supabase')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Local Storage Fallback Store for full offline / demo capability
 */
export const LocalStorageStore = {
  getUserProfile: () => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('breathewise_user_profile');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserProfile: (profile: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('breathewise_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Error writing to local storage', e);
    }
  },

  getImpactActivities: () => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('breathewise_impact_activities');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveImpactActivity: (activity: any) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = LocalStorageStore.getImpactActivities();
      const updated = [activity, ...existing];
      localStorage.setItem('breathewise_impact_activities', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving activity', e);
    }
  },

  getChatHistory: () => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('breathewise_chat_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveChatHistory: (messages: any[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('breathewise_chat_history', JSON.stringify(messages.slice(-30)));
    } catch (e) {
      console.error('Error saving chat', e);
    }
  },
};
