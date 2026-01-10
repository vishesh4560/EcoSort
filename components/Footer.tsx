
import React from 'react';
import { Leaf, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold tracking-tight text-white">EcoSort</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Revolutionizing waste management with AI. Our mission is to make recycling accessible, 
              accurate, and impactful for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Scan Waste</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Impact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">Recycling Guide</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">AI Technology</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Sustainability Tips</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Partnerships</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Stay updated with the latest in green tech.</p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-green-500 transition-colors"
              />
              <button className="bg-green-600 hover:bg-green-500 p-2 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-gray-900 flex flex-col md:row justify-between items-center text-gray-500 text-xs">
          <p>© 2024 EcoSort. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
