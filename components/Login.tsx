
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface LoginProps {
  onToggleAuth: () => void;
  onBackHome: () => void;
  onSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onToggleAuth, onBackHome, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const user = await db.findUserByEmail(email);
      if (user && user.password === password) {
        db.setCurrentUser(user);
        onSuccess(user);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
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
        
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Log in to your EcoSort account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-400">Password</label>
                <a href="#" className="text-xs text-green-500 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          
          <p className="mt-10 text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
            Don't have an account?{' '}
            <button onClick={onToggleAuth} className="text-green-500 font-bold hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
