
import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import { emailService } from '../services/email';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onBackHome: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onBackHome }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // In a real app, you might want to check if the user exists first in db.
      // For privacy/security, we usually don't reveal if an email exists or not,
      // so we just simulate sending it either way.
      await emailService.sendPasswordReset(email);
      setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-300">
          <button 
            onClick={onBackHome}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="bg-gray-900 border border-gray-800 rounded-[40px] p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <CheckCircle2 className="w-10 h-10 text-green-500 relative z-10" />
            </div>

            <h2 className="text-3xl font-bold mb-4">Check your inbox</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We've sent password reset instructions to <span className="text-white font-bold">{email}</span>.
            </p>

            <button 
              onClick={onBackToLogin}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-all border border-gray-700 hover:border-gray-600"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <button 
          onClick={onBackToLogin}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
        
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
              <KeyRound className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-400">Enter your email to reset your password</p>
          </div>
          
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
                  required
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
