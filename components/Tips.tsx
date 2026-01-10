
import React from 'react';
import { ShoppingBag, Salad, Package, RotateCcw, Box, ShoppingCart } from 'lucide-react';

const Tips: React.FC = () => {
  const tips = [
    {
      title: 'Bring Reusable Bags',
      description: 'Reduce plastic waste by bringing your own cloth bags to the store.',
      icon: <ShoppingBag className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Compost Food Scraps',
      description: 'Turn your organic waste into nutrient-rich soil for your garden.',
      icon: <Salad className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Choose Minimal Packaging',
      description: 'Buy products with less plastic wrap or in bulk to reduce waste.',
      icon: <Package className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Rinse Before Recycling',
      description: 'Clean containers to prevent contamination in recycling streams.',
      icon: <RotateCcw className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Donate, Don\'t Dump',
      description: 'Give usable items a second life by donating to local charities.',
      icon: <Box className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Buy Recycled Products',
      description: 'Support the circular economy by choosing recycled materials.',
      icon: <ShoppingCart className="w-6 h-6 text-green-500" />
    }
  ];

  return (
    <section id="learn" className="py-24 bg-gray-900/20 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Quick Recycling Tips</h2>
          <p className="text-gray-400">Simple everyday actions that make a big difference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-gray-950 border border-gray-800 p-8 rounded-3xl hover:border-green-500/30 transition-all flex flex-col h-full group">
              <div className="bg-gray-900 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/10 transition-colors">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tips;
