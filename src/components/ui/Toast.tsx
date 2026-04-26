'use client';
import { createContext, useContext, useState } from 'react';

// 1. Create the Context
const ToastContext = createContext<any>(null);

// 2. Create the Provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-xl z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

// 3. Create the Hook so you can import it easily
export const useToast = () => useContext(ToastContext);