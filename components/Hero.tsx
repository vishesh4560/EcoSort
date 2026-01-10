
import React from 'react';

interface HeroProps {
  onStartScan: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartScan, onLearnMore }) => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          AI Powered Waste Management
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Smart Waste Segregation <br />
          <span className="text-green-500">for a Cleaner Planet</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload a photo of your waste and let our AI instantly identify, categorize, 
          and provide personalized recycling recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={onStartScan}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl shadow-green-900/30"
          >
            Start Scanning
          </button>
          <button 
            onClick={onLearnMore}
            className="w-full sm:w-auto bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700 px-8 py-4 rounded-xl text-lg font-bold transition-all"
          >
            Learn More
          </button>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
    </section>
  );
};

export default Hero;
