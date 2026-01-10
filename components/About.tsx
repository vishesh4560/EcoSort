
import React from 'react';
import { Globe, ShieldCheck, Zap, Recycle } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "Global Preservation",
      text: "By ensuring waste is directed to the correct streams, we prevent thousands of tons of recyclable materials from ending up in oceans and forests."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      title: "Landfill Reduction",
      text: "Our AI helps you identify compostable organic matter, significantly reducing the methane emissions produced by organic waste in landfills."
    },
    {
      icon: <Zap className="w-6 h-6 text-green-500" />,
      title: "Energy Conservation",
      text: "Recycling materials like aluminum and glass uses up to 95% less energy than manufacturing from raw resources. We help you make that happen."
    },
    {
      icon: <Recycle className="w-6 h-6 text-green-500" />,
      title: "Circular Economy",
      text: "We bridge the gap between waste and reuse, guiding users toward a lifestyle where every item has a second purpose, fostering a sustainable future."
    }
  ];

  return (
    <section id="about" className="py-24 bg-gray-950 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Why EcoSort Matters for <br />
              <span className="text-green-500">Our Shared Future</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Every year, millions of tons of recyclable waste are mismanaged due to confusion about local disposal rules. EcoSort solves this by providing instant, AI-driven clarity. 
            </p>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="bg-green-500/10 p-2 rounded-lg mr-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-300">EcoSort users reduce their personal carbon footprint by an average of 15% through improved sorting accuracy.</p>
              </div>
              <div className="flex items-start p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="bg-green-500/10 p-2 rounded-lg mr-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-300">Proper segregation prevents toxic hazardous waste from leaching into our groundwater systems.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-gray-900/30 border border-gray-800 rounded-3xl hover:border-green-500/20 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
