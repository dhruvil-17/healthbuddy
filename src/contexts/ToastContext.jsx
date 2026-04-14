"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ type = 'info', title, description, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, description, duration };

    setToasts(prev => [...prev, newToast]);

    // Note: Auto-dismissal is handled by Toast.jsx component with proper cleanup
  }, []);

  const success = useCallback((title, description) => {
    toast({ type: 'success', title, description });
  }, [toast]);

  const error = useCallback((title, description) => {
    toast({ type: 'error', title, description, duration: 7000 });
  }, [toast]);

  const warning = useCallback((title, description) => {
    toast({ type: 'warning', title, description });
  }, [toast]);

  const info = useCallback((title, description) => {
    toast({ type: 'info', title, description });
  }, [toast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
