import React from 'react';
import { Sparkles } from 'lucide-react';

export default function BrandLogo({ size = 'lg', layout = 'vertical', className = '' }) {
  const emblemSizes = {
    sm: 'w-8 h-8 rounded-xl text-base',
    md: 'w-10 h-10 rounded-2xl text-lg',
    lg: 'w-12 h-12 rounded-2xl text-xl'
  };

  const titleSizes = {
    sm: 'text-sm tracking-[0.16em]',
    md: 'text-lg tracking-[0.18em]',
    lg: 'text-2xl tracking-[0.2em]'
  };

  const subtitleSizes = {
    sm: 'text-[7.5px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.24em]',
    lg: 'text-[10px] tracking-[0.28em]'
  };

  return (
    <div className={`flex items-center select-none ${layout === 'vertical' ? 'flex-col text-center' : 'flex-row text-left gap-3'} ${className}`}>
      {/* Luxury Monogram Emblem */}
      <div 
        className={`relative flex items-center justify-center font-brand font-bold text-white bg-gradient-to-br from-[#8D5B4C] via-[#744537] to-[#3D1E16] shadow-md shadow-[#8D5B4C]/25 border border-[#D4B996]/50 transition-transform duration-300 hover:scale-105 ${emblemSizes[size]} ${layout === 'vertical' ? 'mb-2.5' : ''}`}
      >
        <span className="font-brand leading-none">M</span>
        <Sparkles className="w-2.5 h-2.5 text-[#F5E5C9] absolute -top-1 -right-1 drop-shadow-xs animate-pulse" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <h1 className={`font-brand font-bold text-[#2C2420] uppercase leading-tight ${titleSizes[size]}`}>
          MEYZI
        </h1>
        <p className={`font-semibold text-[#8D5B4C] uppercase mt-0.5 ${subtitleSizes[size]}`}>
          STUDIO MAKEUP & HAIR
        </p>
      </div>
    </div>
  );
}
