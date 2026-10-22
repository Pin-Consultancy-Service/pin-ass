"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}: BaseModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-full md:w-[400px]',
    md: 'w-full md:w-[600px]',
    lg: 'w-full md:w-[800px]',
    xl: 'w-full md:w-[1000px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`${sizeClasses[size]} relative rounded-2xl shadow-2xl max-h-[90vh] md:max-h-[90vh] overflow-hidden flex flex-col animate-fadeInUp`}
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--rule)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--rule)' }}
        >
          <h2 className="text-xl font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: 'var(--ink-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end gap-3 p-6 border-t"
            style={{ borderColor: 'var(--rule)', backgroundColor: 'var(--surface)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
