
import React from 'react';
import { Leaf, LogOut, History, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onStartScan: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHistoryClick: () => void;
  onLogoClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onStartScan, 
  onLoginClick, 
  onRegisterClick, 
  onHistoryClick,
  onLogoClick,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={onLogoClick}
          >
            <Leaf className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold tracking-tight">EcoSort</span>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
            <button onClick={onLogoClick} className="hover:text-green-500 transition-colors">Home</button>
            <button onClick={onStartScan} className="hover:text-green-500 transition-colors">Scan</button>
            <a href="#about" className="hover:text-green-500 transition-colors">Learn</a>
            {user && (
              <button onClick={onHistoryClick} className="hover:text-green-500 transition-colors flex items-center">
                <History className="w-4 h-4 mr-1" /> History
              </button>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                  <UserIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-300">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onLoginClick}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-green-900/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
