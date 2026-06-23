import { useEffect, useState } from 'react';

// Usage: <Toast message="Book added!" type="success" onClose={() => setToast(null)} />
// type: 'success' | 'error' | 'warning'
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 3500);
    return () => clearTimeout(t);
  }, []);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  const icons = { success: '✓', error: '✕', warning: '⚠' };
  const iconStyles = {
    success: 'bg-emerald-100 text-emerald-600',
    error:   'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm
      transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      ${styles[type]}`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${iconStyles[type]}`}>
        {icons[type]}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="text-current opacity-40 hover:opacity-70 ml-1 text-lg leading-none">×</button>
    </div>
  );
}

// Hook for easy use
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = 'success') => setToast({ message, type, key: Date.now() });
  const ToastEl = toast
    ? <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    : null;
  return { show, ToastEl };
}
