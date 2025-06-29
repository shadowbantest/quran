import React, { useState, createContext, useContext } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}
interface ToastContextType {
  toasts: Toast[];
  toast: (props: {
    title: string;
    description?: string;
    type?: ToastType;
  }) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const ToastProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = ({
    title,
    description,
    type = 'success'
  }: {
    title: string;
    description?: string;
    type?: ToastType;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, {
      id,
      title,
      description,
      type
    }]);
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  return <ToastContext.Provider value={{
    toasts,
    toast,
    removeToast
  }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => <div key={toast.id} className={`flex items-start p-4 rounded-lg shadow-lg transition-all transform translate-x-0 max-w-md ${toast.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : toast.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}`}>
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : toast.type === 'info' ? <Info className="w-5 h-5" /> : <Check className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>)}
      </div>
    </ToastContext.Provider>;
};
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};