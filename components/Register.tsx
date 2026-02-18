
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { emailService } from '../services/email';
import { User } from '../types';

interface RegisterProps {
  onToggleAuth: () => void;
  onBackHome: () => void;
  onSuccess: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onToggleAuth, onBackHome, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const existing = await db.findUserByEmail(email);
      if (existing) {
        setError('This email is already registered.');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      await db.saveUser(newUser);
      db.setCurrentUser(newUser);
      
      // Trigger welcome email in the background
      emailService.sendWelcomeEmail(newUser).catch(console.error);
      
      // Redirect immediately to dashboard
      onSuccess(newUser);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.message.includes("RLS_ERROR") || err.message.includes("TABLE_MISSING")) {
        setError(err.message.includes("RLS_ERROR") 
          ? "Database security (RLS) is blocking the request. Please contact administrator." 
          : "Database system error: Required tables are missing.");
      } else {
        setError(err.message || 'Connection error. Please check your internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <button 
          onClick={onBackHome}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        
        <div className="bg-gray-900 border border-gray-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400">Join the waste management revolution</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  disabled={loading}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  disabled={loading}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-green-900/20 flex items-center justify-center disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-gray-400 text-sm border-t border-gray-800 pt-6">
            Already have an account?{' '}
            <button onClick={onToggleAuth} className="text-green-500 font-bold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
