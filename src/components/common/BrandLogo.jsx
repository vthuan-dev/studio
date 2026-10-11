import React from 'react';

export default function BrandLogo({ size = 'lg', layout = 'vertical', className = '' }) {
  const titleSizes = {
    sm: 'text-base tracking-[0.14em]',
    md: 'text-xl tracking-[0.16em]',
    lg: 'text-2xl sm:text-[26px] tracking-[0.18em]'
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[10px] tracking-[0.26em]'
  };

  return (
    <div className={`flex select-none ${layout === 'vertical' ? 'flex-col items-center text-center' : 'flex-row items-center text-left gap-2.5'} ${className}`}>
      {/* Exact Typography matching User Reference Image */}
      <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'}`}>
        <h1 className={`font-brand font-semibold text-[#2C2420] uppercase leading-none tracking-[0.18em] ${titleSizes[size]}`}>
          MEYZI
        </h1>
        <p className={`font-medium text-[#8D5B4C] uppercase mt-1.5 ${subtitleSizes[size]}`}>
          STUDIO MAKEUP & HAIR
        </p>
      </div>
    </div>
  );
}
