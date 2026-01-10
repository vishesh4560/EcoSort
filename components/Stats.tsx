
import React from 'react';
import { Target, Trash2, Cloud, Users } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Items Scanned', value: '50K+', icon: <Trash2 className="w-6 h-6 text-green-500" /> },
    { label: 'Accuracy Rate', value: '98%', icon: <Target className="w-6 h-6 text-orange-500" /> },
    { label: 'CO₂ Saved', value: '10T', icon: <Cloud className="w-6 h-6 text-blue-500" /> },
    { label: 'Active Users', value: '12K', icon: <Users className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex items-center space-x-4 hover:border-gray-700 transition-colors">
            <div className="bg-gray-800 p-3 rounded-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
