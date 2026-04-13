"use client";
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "max-w-sm w-full bg-white rounded-lg shadow-lg border pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-emerald-200 bg-emerald-50`;
      case 'error':
        return `${baseStyles} border-red-200 bg-red-50`;
      case 'warning':
        return `${baseStyles} border-amber-200 bg-amber-50`;
      case 'info':
      default:
        return `${baseStyles} border-blue-200 bg-blue-50`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-5 ${
              toast.type === 'success' ? 'text-emerald-800' :
              toast.type === 'error' ? 'text-red-800' :
              toast.type === 'warning' ? 'text-amber-800' :
              'text-blue-800'
            }`}>
              {toast.title}
            </p>
            {toast.description && (
              <p className={`mt-1 text-sm leading-5 wrap-break-word ${
                toast.type === 'success' ? 'text-emerald-700' :
                toast.type === 'error' ? 'text-red-700' :
                toast.type === 'warning' ? 'text-amber-700' :
                'text-blue-700'
              }`}>
                {toast.description}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <button
              className="inline-flex rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
              onClick={() => onRemove(toast.id)}
            >
              <span className="sr-only">Dismiss</span>
              <X className={`h-5 w-5 ${
                toast.type === 'success' ? 'text-emerald-500 hover:text-emerald-600' :
                toast.type === 'error' ? 'text-red-500 hover:text-red-600' :
                toast.type === 'warning' ? 'text-amber-500 hover:text-amber-600' :
                'text-blue-500 hover:text-blue-600'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
