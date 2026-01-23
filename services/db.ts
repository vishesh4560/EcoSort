
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
          name: user.name,
          email: user.email,
          password: user.password
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase Raw Error:", error);
        
        // Specific check for RLS
        if (error.message?.toLowerCase().includes("row-level security") || error.code === '42501') {
          throw new Error("RLS_ERROR: Row Level Security is blocking the signup. You must disable RLS or add a policy in Supabase.");
        }
        
        // Specific check for missing table
        if (error.message?.toLowerCase().includes("relation") && error.message?.toLowerCase().includes("does not exist")) {
          throw new Error("TABLE_MISSING: The 'users' table has not been created in your Supabase project.");
        }

        throw new Error(error.message || "Could not save user to database.");
      }
      return data;
    } catch (err: any) {
      // Re-throw if it's already one of our custom errors
      if (err.message.includes("RLS_ERROR") || err.message.includes("TABLE_MISSING")) {
        throw err;
      }
      // Otherwise wrap generic errors
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
        if (error.code === 'PGRST116') return null; // Standard 'not found'
        
        if (error.message?.toLowerCase().includes("relation") && error.message?.toLowerCase().includes("does not exist")) {
          throw new Error("TABLE_MISSING: Database tables are not set up.");
        }
        throw new Error(error.message);
      }
      
      if (data) {
        return {
          ...data,
          createdAt: data.created_at
        };
      }
      return null;
    } catch (err: any) {
      if (err.message.includes("TABLE_MISSING")) throw err;
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
      if (error.message?.toLowerCase().includes("column") && error.message?.toLowerCase().includes("user_id")) {
        throw new Error("DB_SCHEMA_ERROR: The 'user_id' column is missing in 'scans' table.");
      }
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
      console.error("Supabase Fetch Scans Error:", error);
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
