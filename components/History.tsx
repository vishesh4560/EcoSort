
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Trash2, Calendar, FileText, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { SavedScan, User } from '../types';

interface HistoryProps {
  user: User;
  onBackHome: () => void;
}

const History: React.FC<HistoryProps> = ({ user, onBackHome }) => {
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userScans = await db.getUserScans(user.id);
        setScans(userScans);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-[80vh] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={onBackHome}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h2 className="text-4xl font-bold mb-2 text-white">Your Scan History</h2>
            <p className="text-gray-400">Review all your previous waste classification activities.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex items-center space-x-4">
            <div className="bg-green-500/10 p-3 rounded-2xl">
              {loading ? <Loader2 className="w-6 h-6 text-green-500 animate-spin" /> : <Clock className="w-6 h-6 text-green-500" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{loading ? '...' : scans.length}</p>
              <p className="text-gray-400 text-sm">Total Scans</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-gray-400">Retrieving cloud records...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-24 bg-gray-900/30 border border-gray-800 border-dashed rounded-[40px]">
            <div className="bg-gray-800 p-6 rounded-full inline-block mb-6">
              <Trash2 className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No scans yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              You haven't scanned any waste items yet. Go to the dashboard to start scanning!
            </p>
            <button 
              onClick={onBackHome}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Start Your First Scan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scans.map((scan) => (
              <div key={scan.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-colors flex flex-col h-full group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    scan.category === 'Organic' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    scan.category === 'Recyclable' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    scan.category === 'Hazardous' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {scan.category}
                  </div>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(scan.timestamp)}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-500 transition-colors">
                  {scan.item}
                </h3>

                <div className="bg-gray-800/40 p-4 rounded-2xl mb-6 flex-grow">
                  <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                    <FileText className="w-3 h-3 mr-2" />
                    Disposal Instructions
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {scan.instructions}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-600 uppercase font-black tracking-[0.2em]">
                  <span>AI Confidence: {(scan.confidence * 100).toFixed(1)}%</span>
                  <span>ID: {scan.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
