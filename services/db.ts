
import { User, SavedScan } from '../types';
import { supabase } from './supabase';

const SESSION_KEY = 'ecosort_session';

export const db = {
  // User Operations
  saveUser: async (user: User) => {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  // Session Operations (Keep local for fast UI state)
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Scan Operations
  saveScan: async (scan: Omit<SavedScan, 'id' | 'timestamp'>) => {
    const newScan = {
      ...scan,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('scans')
      .insert([newScan])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getUserScans: async (userId: string): Promise<SavedScan[]> => {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
