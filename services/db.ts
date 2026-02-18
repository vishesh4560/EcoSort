
import { User, SavedScan } from '../types';
import { supabase } from './supabase';

const SESSION_KEY = 'ecosort_session';

export const db = {
  // User Operations
  saveUser: async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase Save User Error:", error);
        
        if (error.message?.toLowerCase().includes("row-level security") || error.code === '42501') {
          throw new Error("RLS_ERROR: Row Level Security is blocking the signup.");
        }
        
        if (error.message?.toLowerCase().includes("relation") && error.message?.toLowerCase().includes("does not exist")) {
          throw new Error("TABLE_MISSING: The 'users' table has not been created.");
        }

        throw new Error(error.message || "Could not save user.");
      }
      return data;
    } catch (err: any) {
      if (err.message.includes("RLS_ERROR") || err.message.includes("TABLE_MISSING")) {
        throw err;
      }
      throw new Error(err.message || "Database connection failed.");
    }
  },

  findUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        if (error.message?.toLowerCase().includes("relation") && error.message?.toLowerCase().includes("does not exist")) {
          throw new Error("TABLE_MISSING");
        }
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          password: data.password,
          createdAt: data.created_at
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  // Session Operations
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
    const payload = {
      item: scan.item,
      category: scan.category,
      confidence: scan.confidence,
      instructions: scan.instructions,
      user_id: scan.userId 
    };

    const { data, error } = await supabase
      .from('scans')
      .insert([payload])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase Save Scan Error:", error);
      throw new Error(error.message);
    }
    return data;
  },

  getUserScans: async (userId: string): Promise<SavedScan[]> => {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(item => ({
      id: item.id.toString(),
      item: item.item,
      category: item.category,
      confidence: item.confidence,
      instructions: item.instructions,
      userId: item.user_id,
      timestamp: item.created_at
    }));
  }
};
