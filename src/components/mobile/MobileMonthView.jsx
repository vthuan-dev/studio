import React, { useState, useMemo } from 'react';
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
  MoreHorizontal,
  Clock,
  Sparkles,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import MobileDrawer from './MobileDrawer';
import BrandLogo from '../common/BrandLogo';

export default function MobileMonthView() {
  const { 
    filteredCustomers, 
    setSelectedCustomerId, 
    selectedDate,
    setSelectedDate, 
    setMobileScreen,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    calendarView,
    setCalendarView,
    setIsStatsModalOpen,
    setIsNotificationOpen,
    navigatePrev,
    navigateNext,
    navigateToday,
    openAddModal,
    syncStatus,
    syncNow,
    lastSyncedAt
  } = useStudio();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Standard Western/Solar Weekdays: Monday (T2) to Sunday (CN)
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Current real-world today string (e.g. "2026-10-12")
  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // Compute 7-column calendar cells with exact day-of-week alignment
  const cells = useMemo(() => {
    const year = currentYear;
    const month = currentMonth; // 1-12

    // First day of current month
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    // ISO/Vietnam standard: Thứ 2 is 0, Chủ nhật is 6
    const startDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Days in current & previous month
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const result = [];

    // 1. Previous month filler days
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 1 ? 12 : month - 1;
      const prevY = month === 1 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const colIdx = startDayIndex - 1 - i;
      result.push({
        day: d,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        date: dateStr,
        isSunday: colIdx === 6
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const colIdx = (startDayIndex + d - 1) % 7;
      result.push({
        day: d,
        month,
        year,
        isCurrentMonth: true,
        date: dateStr,
        isSunday: colIdx === 6
      });
    }

    // 3. Next month filler days to complete the 7-column rows (total 35 or 42 slots)
    const totalSlots = result.length > 35 ? 42 : 35;
    const remaining = totalSlots - result.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 12 ? 1 : month + 1;
      const nextY = month === 12 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const colIdx = (result.length) % 7;
      result.push({
        day: d,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        date: dateStr,
        isSunday: colIdx === 6
      });
    }

    return result;
  }, [currentYear, currentMonth]);

  // Bookings for currently selected date (Lọc trùng tuyệt đối theo ID)
  const selectedDayBookings = useMemo(() => {
    const list = filteredCustomers.filter(item => item.date === selectedDate);
    const map = new Map();
    for (const b of list) {
      if (b && b.id && !map.has(b.id)) {
        map.set(b.id, b);
      }
    }
    return Array.from(map.values());
  }, [filteredCustomers, selectedDate]);

  // Format header for selected day: "Thứ 2, 12/10/2026"
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const dayName = dayNames[dateObj.getDay()];
      return `${dayName}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const getStyleByCategory = (cat) => {
    switch (cat) {
      case 'co-dau': return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
      case 'tiec': return 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]';
      case 'an-hoi': return 'bg-[#F3E5F5] text-[#6A1B9A] border-[#E1BEE7]';
      case 'chup-anh': return 'bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]';
      default: return 'bg-[#F5EFE6] text-[#8D5B4C] border-[#E5DCD0]';
    }
  };

  const getDotColor = (cat) => {
    switch (cat) {
      case 'co-dau': return 'bg-[#2E7D32]';
      case 'tiec': return 'bg-[#C62828]';
      case 'an-hoi': return 'bg-[#6A1B9A]';
      case 'chup-anh': return 'bg-[#1565C0]';
      default: return 'bg-[#8D5B4C]';
    }
  };

  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) {
      setCurrentMonth(cell.month);
      setCurrentYear(cell.year);
    }
    setSelectedDate(cell.date);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-2">
      {/* Top App Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg"
          title="Mở menu"
        >
          <Menu className="w-5 h-5 text-[#2C2420]" />
        </button>

        <BrandLogo size="sm" layout="horizontal" />

        <div className="flex items-center gap-1.5">
          <button 
            onClick={syncNow}
            className="p-1 relative hover:bg-[#FAF7F2] rounded-lg text-[#6C5F57] cursor-pointer"
            title={
              syncStatus === 'syncing'
                ? 'Đang đồng bộ đám mây...'
                : syncStatus === 'error'
                ? 'Lỗi kết nối - Bấm để thử lại'
                : `Đã đồng bộ${lastSyncedAt ? ` (${lastSyncedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})` : ''} - Bấm để đồng bộ ngay`
            }
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 text-[#8D5B4C] animate-spin" />
            ) : syncStatus === 'error' ? (
              <CloudOff className="w-4 h-4 text-red-500" />
            ) : (
              <div className="relative">
                <Cloud className="w-4 h-4 text-[#2E7D32]" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#2E7D32] rounded-full"></span>
              </div>
            )}
          </button>

          <button 
            onClick={() => setIsNotificationOpen(true)}
            className="p-1 relative hover:bg-[#FAF7F2] rounded-lg"
            title="Thông báo & Nhắc lịch"
          >
            <Bell className="w-5 h-5 text-[#2C2420]" />
          </button>
        </div>
      </div>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Title & Month Switcher */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold font-serif text-[#2C2420]">
          Lịch khách
        </h2>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1.5 bg-[#F5EFE6] px-2.5 py-1.5 rounded-xl border border-[#E5DCD0]">
            <button 
              onClick={navigatePrev}
              className="p-0.5 hover:bg-[#FAF7F2] rounded text-[#6C5F57]"
              title="Tháng trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold px-1 text-[#2C2420]">
              Tháng {currentMonth}, {currentYear}
            </span>
            <button 
              onClick={navigateNext}
              className="p-0.5 hover:bg-[#FAF7F2] rounded text-[#6C5F57]"
              title="Tháng sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={navigateToday}
              className="px-2.5 py-1.5 bg-[#F5EFE6] hover:bg-[#EFE8DE] rounded-xl border border-[#E5DCD0] text-[11px] font-semibold text-[#8D5B4C] transition-colors"
              title="Về ngày hôm nay"
            >
              Hôm nay
            </button>
            <button 
              onClick={() => setIsStatsModalOpen(true)}
              className="p-2 bg-[#F5EFE6] rounded-xl border border-[#E5DCD0] text-[#6C5F57] hover:text-[#8D5B4C]"
              title="Thống kê"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* View Switcher: Tháng | Tuần | Ngày */}
        <div className="grid grid-cols-3 gap-1 bg-[#F5EFE6] p-1 rounded-xl mt-3 border border-[#E5DCD0]">
          <button 
            onClick={() => setCalendarView('month')}
            className={`py-1 rounded-lg text-center font-semibold text-xs transition-colors ${
              calendarView === 'month' ? 'bg-[#8D5B4C] text-white shadow-xs' : 'text-[#6C5F57]'
            }`}
          >
            Tháng
          </button>
          <button 
            onClick={() => {
              setCalendarView('week');
              setMobileScreen('hourly');
            }}
            className={`py-1 rounded-lg text-center font-semibold text-xs transition-colors ${
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
            className={`py-1 rounded-lg text-center font-semibold text-xs transition-colors ${
              calendarView === 'day' ? 'bg-[#8D5B4C] text-white shadow-xs' : 'text-[#6C5F57]'
            }`}
          >
            Ngày
          </button>
        </div>
      </div>

      {/* Week Days Header: 7 Columns (T2 -> CN, with CN in Red) */}
      <div className="px-3 pt-1">
        <div className="grid grid-cols-7 text-center py-2 border-b border-[#EFE8DE] bg-white rounded-t-2xl text-[11px] font-bold">
          {weekDays.map((d, i) => (
            <div key={i} className={i === 6 ? 'text-[#D32F2F]' : 'text-[#6C5F57]'}>
              {d}
            </div>
          ))}
        </div>

        {/* Standard 7-Column Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 p-1.5 bg-white rounded-b-2xl border border-t-0 border-[#EFE8DE] shadow-xs">
          {cells.map((c, i) => {
            const isSelected = c.date === selectedDate;
            const isToday = c.date === todayStr;
            const bookings = filteredCustomers.filter(item => item.date === c.date);

            return (
              <div
                key={i}
                onClick={() => handleCellClick(c)}
                className={`min-h-[50px] p-1 rounded-xl flex flex-col items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#8D5B4C] text-white shadow-sm ring-2 ring-[#8D5B4C]'
                    : isToday
                    ? 'bg-[#8D5B4C]/10 text-[#8D5B4C] font-bold ring-1 ring-[#8D5B4C]'
                    : c.isCurrentMonth
                    ? 'hover:bg-[#FAF7F2]'
                    : 'text-[#C8B8A6] opacity-60 hover:bg-[#FAF7F2]/40'
                }`}
              >
                {/* Day Number Header */}
                <span
                  className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-white'
                      : isToday
                      ? 'text-[#8D5B4C]'
                      : c.isSunday && c.isCurrentMonth
                      ? 'text-[#D32F2F]'
                      : c.isCurrentMonth
                      ? 'text-[#2C2420]'
                      : 'text-[#C8B8A6]'
                  }`}
                >
                  {c.day}
                </span>

                {/* Appointment Category Indicator Dots */}
                <div className="flex items-center justify-center gap-0.5 h-2 w-full">
                  {bookings.length > 0 ? (
                    <>
                      {bookings.slice(0, 3).map((b, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : getDotColor(b.category)
                          }`}
                        />
                      ))}
                      {bookings.length > 3 && (
                        <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-white' : 'text-[#8D5B4C]'}`}>
                          +
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="w-1.5 h-1.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Agenda / Danh sách lịch ngày */}
      <div className="mt-3 px-3 pb-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#2C2420]">
              {formattedSelectedDate}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#8D5B4C] font-semibold">
              {selectedDayBookings.length} lịch hẹn
            </span>
          </div>
          <button
            onClick={() => setMobileScreen('add')}
            className="text-[11px] font-semibold text-[#8D5B4C] hover:text-[#744537] flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch</span>
          </button>
        </div>

        {selectedDayBookings.length > 0 ? (
          <div className="space-y-2">
            {selectedDayBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedCustomerId(b.id);
                  setMobileScreen('detail');
                }}
                className="p-3 bg-white rounded-xl border border-[#EFE8DE] shadow-xs hover:border-[#8D5B4C] transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DCD0] text-[10px] font-bold text-[#8D5B4C]">
                      {b.time || 'Chưa đặt giờ'}
                    </span>
                    <span className="font-bold text-xs text-[#2C2420] truncate">
                      {b.name}
                    </span>
                    {b.guestCount > 1 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DCD0] text-[#8D5B4C] font-bold">
                        x{b.guestCount}
                      </span>
                    )}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${getStyleByCategory(b.category)}`}>
                      {b.categoryName}
                    </span>
                    {b.locationType === 'home' ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        Tại nhà
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Tại shop
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#6C5F57] truncate">
                    {b.phone ? `${b.phone} • ` : ''}
                    {b.locationType === 'home' ? (b.address || 'Tại nhà') : 'Tại cửa hàng'}
                  </div>
                  {(b.staffMakeup || b.staffHair) && (
                    <div className="text-[10px] text-[#8C7E74] mt-1 flex items-center gap-1.5">
                      {b.staffMakeup && <span>Makeup: <strong className="text-[#2C2420]">{b.staffMakeup}</strong></span>}
                      {b.staffHair && <span>• Tóc: <strong className="text-[#2C2420]">{b.staffHair}</strong></span>}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end justify-between self-stretch">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    b.status === 'da-thanh-toan' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : b.status === 'da-coc'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {b.statusText || (b.status === 'da-thanh-toan' ? 'Đã xong' : b.status === 'da-coc' ? 'Đã cọc' : 'Chưa cọc')}
                  </span>
                  <span className="text-[11px] font-bold text-[#8D5B4C] mt-2">
                    {(Number(b.totalAmount) || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-xl border border-dashed border-[#E5DCD0] text-center my-2">
            <p className="text-xs text-[#8C7E74] mb-2">Chưa có lịch hẹn nào ngày này</p>
            <button
              onClick={() => setMobileScreen('add')}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#8D5B4C] border border-[#E5DCD0] rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm lịch hẹn ngày này</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Add Button */}
      <div className="p-3 bg-white border-t border-[#EFE8DE]">
        <button
          onClick={() => setMobileScreen('add')}
          className="w-full py-2.5 rounded-xl bg-[#8D5B4C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#744537] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khách</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sticky bottom-0 left-0 right-0 grid grid-cols-5 text-center py-2 px-1 bg-white border-t border-[#EFE8DE] text-[10px] z-20">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="flex flex-col items-center gap-1 text-[#8D5B4C] font-bold"
        >
          <Home className="w-4 h-4" />
          <span>Tổng quan</span>
        </button>

        <button 
          onClick={() => setMobileScreen('hourly')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
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
