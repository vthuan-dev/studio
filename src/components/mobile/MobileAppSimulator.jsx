import React, { useState } from 'react';
import { Monitor, Smartphone, Layers, Eye } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import MobileMonthView from './MobileMonthView';
import MobileDayTimeView from './MobileDayTimeView';
import MobileAddCustomer from './MobileAddCustomer';
import MobileDetailView from './MobileDetailView';

export default function MobileAppSimulator() {
  const { setViewMode, mobileScreen, setMobileScreen } = useStudio();
  const [showcaseMode, setShowcaseMode] = useState('all'); // 'all' (4 phones like Image 1) or 'single' (interactive single phone)

  return (
    <div className="min-h-screen bg-[#F3EDE2] p-4 sm:p-8 flex flex-col items-center">
      {/* Top Banner Toolbar */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E5DCD0] shadow-sm">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#2C2420]">
            MEYZI STUDIO — Giao Diện Mobile App
          </h2>
          <p className="text-xs text-[#8C7E74]">
            Sao chép chính xác 4 màn hình từ <strong>Ảnh 1</strong> (Lịch tháng, Lịch theo giờ, Thêm khách, Chi tiết khách)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch Mode: 4 phones side-by-side vs Single phone interactive */}
          <div className="flex bg-[#F5EFE6] p-1 rounded-xl border border-[#E5DCD0]">
            <button
              onClick={() => setShowcaseMode('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                showcaseMode === 'all'
                  ? 'bg-[#8D5B4C] text-white shadow-xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xem cả 4 màn hình (Ảnh 1)</span>
            </button>
            <button
              onClick={() => setShowcaseMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                showcaseMode === 'single'
                  ? 'bg-[#8D5B4C] text-white shadow-xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>1 Điện thoại tương tác</span>
            </button>
          </div>

          {/* Back to Desktop Dashboard */}
          <button
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C2420] text-white hover:bg-[#433732] shadow-sm transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Về Web Desktop (Ảnh 2)</span>
          </button>
        </div>
      </div>

      {/* Render Mode: 4 Phones Showcase (matching Image 1) */}
      {showcaseMode === 'all' ? (
        <div className="w-full max-w-7xl overflow-x-auto pb-8">
          <div className="flex gap-6 justify-center min-w-[1300px] px-4">
            {/* Phone 1: Month Calendar */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider mb-2">
                Màn 1: Lịch tháng
              </span>
              <PhoneFrame>
                <MobileMonthView />
              </PhoneFrame>
            </div>

            {/* Phone 2: Day Hourly Timeline */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider mb-2">
                Màn 2: Lịch theo giờ
              </span>
              <PhoneFrame>
                <MobileDayTimeView />
              </PhoneFrame>
            </div>

            {/* Phone 3: Add Customer Form */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider mb-2">
                Màn 3: Thêm khách
              </span>
              <PhoneFrame>
                <MobileAddCustomer />
              </PhoneFrame>
            </div>

            {/* Phone 4: Customer Details */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider mb-2">
                Màn 4: Chi tiết khách & Tiền cọc
              </span>
              <PhoneFrame>
                <MobileDetailView />
              </PhoneFrame>
            </div>
          </div>
        </div>
      ) : (
        /* Single Interactive Phone Frame */
        <div className="flex flex-col items-center">
          {/* Sub Navigation to switch screens */}
          <div className="flex items-center gap-2 mb-4 bg-white px-3 py-1.5 rounded-full border border-[#E5DCD0] shadow-xs text-xs font-semibold">
            <button
              onClick={() => setMobileScreen('calendar')}
              className={`px-3 py-1 rounded-full ${mobileScreen === 'calendar' ? 'bg-[#8D5B4C] text-white' : 'text-[#6C5F57]'}`}
            >
              1. Lịch tháng
            </button>
            <button
              onClick={() => setMobileScreen('hourly')}
              className={`px-3 py-1 rounded-full ${mobileScreen === 'hourly' ? 'bg-[#8D5B4C] text-white' : 'text-[#6C5F57]'}`}
            >
              2. Lịch giờ
            </button>
            <button
              onClick={() => setMobileScreen('add')}
              className={`px-3 py-1 rounded-full ${mobileScreen === 'add' ? 'bg-[#8D5B4C] text-white' : 'text-[#6C5F57]'}`}
            >
              3. Thêm khách
            </button>
            <button
              onClick={() => setMobileScreen('detail')}
              className={`px-3 py-1 rounded-full ${mobileScreen === 'detail' ? 'bg-[#8D5B4C] text-white' : 'text-[#6C5F57]'}`}
            >
              4. Chi tiết khách
            </button>
          </div>

          <PhoneFrame>
            {mobileScreen === 'calendar' && <MobileMonthView />}
            {mobileScreen === 'hourly' && <MobileDayTimeView />}
            {mobileScreen === 'add' && <MobileAddCustomer />}
            {mobileScreen === 'detail' && <MobileDetailView />}
          </PhoneFrame>
        </div>
      )}
    </div>
  );
}

// Realistic iPhone Device Frame
function PhoneFrame({ children }) {
  return (
    <div className="relative w-[340px] h-[690px] bg-black rounded-[46px] p-3 shadow-2xl ring-1 ring-black/20 flex flex-col">
      {/* Outer bezel & Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-end pr-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] mr-1" />
      </div>

      {/* Screen container */}
      <div className="relative w-full h-full bg-[#FAF7F2] rounded-[38px] overflow-hidden flex flex-col border border-white/20">
        {/* iOS Status bar */}
        <div className="h-9 px-6 flex items-center justify-between text-[11px] font-semibold text-[#2C2420] z-20 pt-1">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        {/* Inner App Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>

        {/* iOS Home indicator bar */}
        <div className="h-4 flex items-center justify-center bg-white">
          <div className="w-28 h-1 bg-[#2C2420]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
