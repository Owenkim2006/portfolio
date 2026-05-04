'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'info' | 'success';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (message: string, type: ToastType) => void;

// Module-level event bus — works across all client components without Context
const listeners = new Set<Listener>();
let _id = 0;

export function showToast(message: string, type: ToastType = 'info') {
  listeners.forEach((l) => l(message, type));
}

export function useToast() {
  return { showToast };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler: Listener = (message, type) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(18,18,31,0.95)',
              border: `0.5px solid ${toast.type === 'success' ? 'rgba(29,158,117,0.4)' : 'rgba(127,119,221,0.3)'}`,
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: toast.type === 'success' ? '#1D9E75' : '#9898b0',
              whiteSpace: 'nowrap',
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
