"use client";
import React from 'react';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  size = 'md',
  variant = 'default'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl'
  };

  const variantIcons = {
    default: null,
    warning: <AlertTriangle className="h-12 w-12 text-amber-500" />,
    info: <Info className="h-12 w-12 text-blue-500" />,
    success: <CheckCircle className="h-12 w-12 text-green-500" />,
    danger: <AlertCircle className="h-12 w-12 text-red-500" />
  };

  const variantColors = {
    default: 'bg-white',
    warning: 'bg-white',
    info: 'bg-white',
    success: 'bg-white',
    danger: 'bg-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative ${sizeClasses[size]} ${variantColors[variant]} rounded-3xl shadow-2xl p-8 w-full animate-in zoom-in-95 duration-200`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}

        <div className="flex flex-col items-center text-center space-y-4">
          {variantIcons[variant] && (
            <div className="p-4 bg-gray-50 rounded-full">
              {variantIcons[variant]}
            </div>
          )}

          {title && (
            <h2 className="text-2xl font-extrabold text-gray-900">
              {title}
            </h2>
          )}

          {description && (
            <p className="text-gray-500 font-medium leading-relaxed">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isDestructive = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
    >
      <div className="flex space-x-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 h-12 px-6 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`flex-1 h-12 px-6 rounded-xl font-bold text-white transition-all ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30'
              : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
