
import React from 'react';

interface ImpactProps {
  onSignUpClick: () => void;
}

const Impact: React.FC<ImpactProps> = ({ onSignUpClick }) => {
  return (
    <section id="impact" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Your Environmental Impact</h2>
          <p className="text-gray-400">Join a global movement dedicated to a cleaner, more sustainable planet.</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/20 rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-3xl font-bold mb-4">Join our eco-conscious community</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
            Together we're exploring a sustainable future, one scan at a time. Join our community and start making a real impact today.
          </p>
          <button 
            onClick={onSignUpClick}
            className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-green-900/20"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Impact;
