'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface Toast {
  type: 'success' | 'error';
  message: string;
}

interface AdminToastProps {
  toast: Toast | null;
  onDismiss: () => void;
}

export function AdminToast({ toast, onDismiss }: AdminToastProps) {
  useEffect(() => {
    if (!toast) return;
    if (toast.type === 'success') {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-4 right-4 z-[200] animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
          isSuccess
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}
        role="alert"
      >
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
        )}
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="shrink-0 p-0.5 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
