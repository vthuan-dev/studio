import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />,
    error: <AlertCircle className="w-4 h-4 text-[#C62828]" />,
    info: <Info className="w-4 h-4 text-[#1565C0]" />
  };

  const bgStyles = {
    success: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    error: 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
    info: 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]'
  };

  const styleClass = bgStyles[toast.type] || bgStyles.success;
  const icon = icons[toast.type] || icons.success;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all animate-fade-in text-xs font-semibold max-w-sm w-full mx-4 sm:w-auto">
      <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border w-full ${styleClass}`}>
        {icon}
        <span className="flex-1 text-[#2C2420] font-medium">{toast.message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-75">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
