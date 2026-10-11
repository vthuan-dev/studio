import React from 'react';

export function ServiceBadge({ category, text, size = 'sm' }) {
  const styles = {
    'co-dau': 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    'tiec': 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
    'an-hoi': 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]',
    'chup-anh': 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]',
  };

  const styleClass = styles[category] || 'bg-[#F5EFE6] text-[#8D5B4C] border-[#E5DCD0]';
  const sizeClass = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styleClass} ${sizeClass}`}>
      {text || category}
    </span>
  );
}

export function StatusBadge({ status, text, size = 'sm' }) {
  if (status === 'da-coc') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] ${size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
        {text || 'Đã cọc'}
      </span>
    );
  }

  if (status === 'da-thanh-toan') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#E0F2F1] text-[#00796B] border border-[#B2DFDB] ${size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00796B]"></span>
        {text || 'Đã thanh toán'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] ${size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]"></span>
      {text || 'Chưa cọc'}
    </span>
  );
}
