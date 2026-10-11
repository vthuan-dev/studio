import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Home, 
  Calendar, 
  Users, 
  MoreHorizontal 
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import MobileDrawer from './MobileDrawer';
import BrandLogo from '../common/BrandLogo';

export default function MobileMonthView() {
  const { 
    filteredCustomers, 
    setSelectedCustomerId, 
    setSelectedDate, 
    setMobileScreen,
    currentMonth,
    currentYear,
    calendarView,
    setCalendarView,
    setIsStatsModalOpen,
    setIsNotificationOpen
  } = useStudio();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Cells for mobile calendar
  const cells = [
    { day: 27, isCurrent: false, date: '2026-10-27' },
    { day: 2,  isCurrent: true,  date: '2026-11-02' },
    { day: 4,  isCurrent: true,  date: '2026-11-04' },
    { day: 1,  isCurrent: true,  date: '2026-11-01' },
    { day: 3,  isCurrent: true,  date: '2026-11-03' },
    { day: 5,  isCurrent: true,  date: '2026-11-05', isActive: true },
    { day: 7,  isCurrent: true,  date: '2026-11-07' },
    { day: 9,  isCurrent: true,  date: '2026-11-09' },
    { day: 11, isCurrent: true,  date: '2026-11-11' },
    { day: 13, isCurrent: true,  date: '2026-11-13' },
    { day: 15, isCurrent: true,  date: '2026-11-15' },
    { day: 17, isCurrent: true,  date: '2026-11-17' },
    { day: 18, isCurrent: true,  date: '2026-11-18' },
    { day: 20, isCurrent: true,  date: '2026-11-20' },
    { day: 22, isCurrent: true,  date: '2026-11-22' },
    { day: 23, isCurrent: true,  date: '2026-11-23' },
    { day: 24, isCurrent: true,  date: '2026-11-24' },
    { day: 27, isCurrent: true,  date: '2026-11-27' },
  ];

  const getStyleByCategory = (cat) => {
    switch (cat) {
      case 'co-dau': return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
      case 'tiec': return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]';
      case 'an-hoi': return 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]';
      case 'chup-anh': return 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]';
      default: return 'bg-[#F5EFE6] text-[#8D5B4C] border-[#E5DCD0]';
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-2">
      {/* Top App Header matching Screen 1 in Image 1 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg"
          title="Mở menu"
        >
          <Menu className="w-5 h-5 text-[#2C2420]" />
        </button>

        <BrandLogo size="sm" layout="horizontal" />

        <button 
          onClick={() => setIsNotificationOpen(true)}
          className="p-1 relative hover:bg-[#FAF7F2] rounded-lg"
          title="Thông báo & Nhắc lịch"
        >
          <Bell className="w-5 h-5 text-[#2C2420]" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#C62828] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />


      {/* Title & Month Switcher */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold font-serif text-[#2C2420]">
          Lịch khách
        </h2>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1.5 bg-[#F5EFE6] px-2.5 py-1.5 rounded-xl border border-[#E5DCD0]">
            <ChevronLeft className="w-3.5 h-3.5 text-[#6C5F57]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#6C5F57]" />
            <span className="text-xs font-semibold pl-1 text-[#2C2420]">
              Tháng {currentMonth}, {currentYear}
            </span>
          </div>

          <button className="p-2 bg-[#F5EFE6] rounded-xl border border-[#E5DCD0] text-[#6C5F57]">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Switcher: Tháng | Tuần | Ngày */}
        <div className="grid grid-cols-3 gap-1 bg-[#F5EFE6] p-1 rounded-xl mt-3 border border-[#E5DCD0]">
          <button 
            onClick={() => setCalendarView('month')}
            className={`py-1 rounded-lg text-center font-semibold text-xs ${
              calendarView === 'month' ? 'bg-[#8D5B4C] text-white shadow-xs' : 'text-[#6C5F57]'
            }`}
          >
            Tháng
          </button>
          <button 
            onClick={() => setCalendarView('week')}
            className={`py-1 rounded-lg text-center font-semibold text-xs ${
              calendarView === 'week' ? 'bg-[#8D5B4C] text-white shadow-xs' : 'text-[#6C5F57]'
            }`}
          >
            Tuần
          </button>
          <button 
            onClick={() => {
              setCalendarView('day');
              setMobileScreen('hourly');
            }}
            className={`py-1 rounded-lg text-center font-semibold text-xs ${
              calendarView === 'day' ? 'bg-[#8D5B4C] text-white shadow-xs' : 'text-[#6C5F57]'
            }`}
          >
            Ngày
          </button>
        </div>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 text-center py-2 px-2 border-b border-[#EFE8DE] text-[10px] font-bold text-[#8C7E74]">
        {weekDays.map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Mobile Calendar Grid */}
      <div className="grid grid-cols-4 gap-2 p-3 flex-1 overflow-y-auto">
        {cells.map((c, i) => {
          const bookings = filteredCustomers.filter(item => item.date === c.date);
          const first = bookings[0];

          return (
            <div
              key={i}
              onClick={() => {
                setSelectedDate(c.date);
                if (first) {
                  setSelectedCustomerId(first.id);
                  setMobileScreen('detail');
                } else {
                  setMobileScreen('hourly');
                }
              }}
              className={`p-2 rounded-xl border flex flex-col justify-between min-h-[70px] cursor-pointer transition-all ${
                c.isActive
                  ? 'bg-[#8D5B4C]/10 border-[#8D5B4C] ring-1 ring-[#8D5B4C]'
                  : 'bg-white border-[#EFE8DE] hover:border-[#8D5B4C]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${c.isActive ? 'text-[#8D5B4C]' : 'text-[#2C2420]'}`}>
                  {c.day}
                </span>
                {c.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8D5B4C]" />
                )}
              </div>

              {first ? (
                <div className={`mt-1 p-1 rounded-lg border text-[9px] font-medium truncate ${getStyleByCategory(first.category)}`}>
                  <div className="font-bold truncate">{first.name}</div>
                  <div className="text-[8px] opacity-75">{first.categoryName} • {first.time}</div>
                </div>
              ) : (
                <span className="text-[9px] text-[#C8B8A6] italic">Trống</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Add Button */}
      <div className="p-3 bg-white border-t border-[#EFE8DE]">
        <button
          onClick={() => setMobileScreen('add')}
          className="w-full py-2.5 rounded-xl bg-[#8D5B4C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khách</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sticky bottom-0 left-0 right-0 grid grid-cols-5 text-center py-2 px-1 bg-white border-t border-[#EFE8DE] text-[10px] z-20">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <Home className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>

        <button 
          onClick={() => setMobileScreen('calendar')}
          className="flex flex-col items-center gap-1 text-[#8D5B4C] font-bold"
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch khách</span>
        </button>

        <button 
          onClick={() => setMobileScreen('list')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <Users className="w-4 h-4" />
          <span>Khách hàng</span>
        </button>

        <button 
          onClick={() => setMobileScreen('add')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>Thêm</span>
        </button>

        <button 
          onClick={() => setMobileScreen('hourly')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>Khác</span>
        </button>
      </div>
    </div>
  );
}
