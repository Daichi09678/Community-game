'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#4ECDC4" strokeWidth="1.5" />
            <path d="M6 10L9 13L14 7" stroke="#4ECDC4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#E05C7A" strokeWidth="1.5" />
            <line x1="7" y1="7" x2="13" y2="13" stroke="#E05C7A" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="13" y1="7" x2="7" y2="13" stroke="#E05C7A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L1 17H19L10 2Z" stroke="#C8A96E" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="10" y1="8" x2="10" y2="12" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.75" fill="#C8A96E" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#A855F7" strokeWidth="1.5" />
            <line x1="10" y1="7" x2="10" y2="10" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="13" r="0.75" fill="#A855F7" />
          </svg>
        );
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { border: 'rgba(78,205,196,0.4)', glow: 'rgba(78,205,196,0.15)', text: '#4ECDC4' };
      case 'error':
        return { border: 'rgba(224,92,122,0.4)', glow: 'rgba(224,92,122,0.15)', text: '#E05C7A' };
      case 'warning':
        return { border: 'rgba(200,169,110,0.4)', glow: 'rgba(200,169,110,0.15)', text: '#C8A96E' };
      case 'info':
        return { border: 'rgba(168,85,247,0.4)', glow: 'rgba(168,85,247,0.15)', text: '#A855F7' };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`fixed top-6 right-6 z-[100] transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      } ${isLeaving ? 'scale-95 opacity-0' : ''}`}
    >
      <div
        className="relative overflow-hidden rounded-lg backdrop-blur-xl"
        style={{
          background: 'rgba(11,17,33,0.95)',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${colors.glow}, 0 0 20px ${colors.glow}`,
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3 min-w-[320px]">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: colors.glow }} />
            <div className="relative">{getIcon()}</div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-['Rajdhani',sans-serif] font-semibold text-[#E8E0CC] tracking-wide">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsLeaving(true);
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className="flex-shrink-0 text-[#5A5248] hover:text-[#C8A96E] transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-[3000ms] linear"
          style={{
            width: isVisible ? '100%' : '0%',
            background: `linear-gradient(90deg, ${colors.text}, ${colors.text}88)`,
          }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  useEffect(() => {
    (window as any).showToast = (message: string, type: ToastType) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
    };
    return () => { delete (window as any).showToast; };
  }, []);

  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
      ))}
    </>
  );
}

export const showToast = (message: string, type: ToastType = 'info') => {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast(message, type);
  }
};