'use client';
import { useEffect } from 'react';

export default function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  // Optional: Close on Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    /* The z-index 9999 ensures it stays on top of everything */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Modal Card */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Header with Close Button */}
        <div className="relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}