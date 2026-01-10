
import React from 'react';
import { Apple, RefreshCcw, AlertTriangle, Package, Stethoscope } from 'lucide-react';

const WasteCategories: React.FC = () => {
  const categories = [
    {
      title: 'Organic',
      description: 'Food scraps, yard waste, and biodegradable materials.',
      examples: ['Fruit peels', 'Coffee grounds', 'Grass clippings'],
      color: 'from-green-600 to-green-800',
      icon: <Apple className="w-8 h-8" />
    },
    {
      title: 'Recyclable',
      description: 'Materials that can be processed and made into new products.',
      examples: ['Glass bottles', 'Paper/Cardboard', 'Metal cans'],
      color: 'from-orange-500 to-orange-700',
      icon: <RefreshCcw className="w-8 h-8" />
    },
    {
      title: 'Hazardous',
      description: 'Toxic materials requiring special disposal for safety.',
      examples: ['Batteries', 'Paint', 'Chemical cleaners'],
      color: 'from-red-500 to-red-700',
      icon: <AlertTriangle className="w-8 h-8" />
    },
    {
      title: 'Biomedical',
      description: 'Clinical and anatomical waste from medical facilities.',
      examples: ['Anatomical waste', 'Used syringes', 'Contaminated bandages'],
      color: 'from-pink-600 to-pink-900',
      icon: <Stethoscope className="w-8 h-8" />
    },
    {
      title: 'General',
      description: 'Non-recyclable items that go to landfill disposal.',
      examples: ['Diapers', 'Cigarette butts', 'Certain plastics'],
      color: 'from-blue-600 to-blue-800',
      icon: <Package className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-24 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className={`relative overflow-hidden bg-gradient-to-br ${cat.color} p-6 rounded-3xl transition-transform hover:-translate-y-2 cursor-default group shadow-2xl`}>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                {React.cloneElement(cat.icon as React.ReactElement<{ className?: string }>, { className: 'w-24 h-24' })}
              </div>
              <div className="mb-4 bg-white/10 w-fit p-3 rounded-2xl backdrop-blur-sm">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
              <p className="text-white/80 mb-4 text-xs leading-relaxed">
                {cat.description}
              </p>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1">Examples</p>
                {cat.examples.map((ex, i) => (
                  <div key={i} className="flex items-center text-[10px] font-semibold bg-black/10 px-2 py-1 rounded-lg w-fit">
                    <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WasteCategories;
