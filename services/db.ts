
import { User, SavedScan } from '../types';

const USERS_KEY = 'ecosort_users';
const SCANS_KEY = 'ecosort_scans';
const SESSION_KEY = 'ecosort_session';

export const db = {
  // User Operations
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByEmail: (email: string): User | undefined => {
    return db.getUsers().find(u => u.email === email);
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
  saveScan: (scan: Omit<SavedScan, 'id' | 'timestamp'>) => {
    const scans = db.getScans();
    const newScan: SavedScan = {
      ...scan,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    scans.unshift(newScan);
    localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
    return newScan;
  },

  getScans: (): SavedScan[] => {
    const data = localStorage.getItem(SCANS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserScans: (userId: string): SavedScan[] => {
    return db.getScans().filter(s => s.userId === userId);
  }
};
