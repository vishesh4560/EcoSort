
import React, { useEffect, useState } from 'react';
import { Mail, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface ToastData {
  id: number;
  to: string;
  subject: string;
  type: 'success' | 'warning';
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleEmailEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast: ToastData = {
        id: Date.now(),
        to: customEvent.detail.to,
        subject: customEvent.detail.subject,
        type: customEvent.detail.type
      };

      setToasts(prev => [...prev, newToast]);

      // Remove after 6 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 6000);
    };

    window.addEventListener('email-sent', handleEmailEvent);
    return () => window.removeEventListener('email-sent', handleEmailEvent);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white p-4 rounded-2xl shadow-2xl flex items-start pointer-events-auto animate-in slide-in-from-right fade-in duration-300"
        >
          <div className={`p-2 rounded-xl mr-3 ${
            toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
          }`}>
            {toast.type === 'success' ? <Mail className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-0.5 flex items-center">
              Email Sent (Simulation)
              <CheckCircle2 className="w-3 h-3 ml-2 text-green-500" />
            </h4>
            <p className="text-xs text-gray-400 truncate mb-1">To: {toast.to}</p>
            <p className="text-sm text-gray-200 font-medium leading-tight">{toast.subject}</p>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide font-semibold">
              Check Console (F12) for content
            </p>
          </div>

          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
