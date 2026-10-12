import React, { useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function CalendarGrid() {
  const { 
    filteredCustomers, 
    selectedCustomerId, 
    setSelectedCustomerId,
    selectedDate, 
    setSelectedDate,
    currentYear,
    currentMonth,
    calendarView,
    highlightedSection,
    openAddModal,
    navigatePrev,
    navigateNext,
    navigateToday
  } = useStudio();

  // Days of week header matching Image 2
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  // Dynamically compute calendar cells for currentMonth & currentYear
  const calendarCells = useMemo(() => {
    const year = currentYear;
    const month = currentMonth; // 1-12

    // First day of this month
    const firstDay = new Date(year, month - 1, 1);
    // getDay(): 0 = Sunday, 1 = Monday ... 6 = Saturday
    // In Vietnam / ISO, Thứ 2 (Monday) is index 0, Sunday is index 6
    const dayOfWeek = firstDay.getDay();
    const startDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Total days in current month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Total days in previous month
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const cells = [];

    // Previous month filler cells
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 1 ? 12 : month - 1;
      const prevY = month === 1 ? year - 1 : year;
      const fullDate = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        isCurrentMonth: false,
        fullDate,
        isSelectedMockDay: false
      });
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Current month cells
    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        isCurrentMonth: true,
        fullDate,
        isToday: fullDate === todayStr
      });
    }

    // Next month filler cells to fill 35 or 42 slots
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 12 ? 1 : month + 1;
      const nextY = month === 12 ? year + 1 : year;
      const fullDate = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        isCurrentMonth: false,
        fullDate,
        isToday: fullDate === todayStr
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Compute 7 days of the week around selectedDate
  const weekDaysData = useMemo(() => {
    const today = new Date();
    const defaultTodayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [y, m, d] = (selectedDate || defaultTodayStr).split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    const dayOfWeek = curr.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(curr);
    monday.setDate(curr.getDate() + diffToMon);

    const days = [];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + i);
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const dateNum = String(dt.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${dateNum}`;
      days.push({
        name: dayNames[i],
        dayNum: dt.getDate(),
        monthNum: dt.getMonth() + 1,
        fullDate,
        isCurrent: fullDate === selectedDate
      });
    }
    return days;
  }, [selectedDate]);

  // Helper to get styling for customer pill
  const getCardStyle = (category, isSelected) => {
    const base = 'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-left block w-full mb-1 cursor-pointer truncate ';
    const border = isSelected ? ' ring-2 ring-[#8D5B4C] shadow-sm font-semibold ' : ' hover:shadow-xs ';

    switch (category) {
      case 'co-dau':
        return base + border + 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]';
      case 'tiec':
        return base + border + 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]';
      case 'an-hoi':
        return base + border + 'bg-[#F3E5F5] text-[#6A1B9A] border border-[#E1BEE7]';
      case 'chup-anh':
        return base + border + 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]';
      default:
        return base + border + 'bg-[#F5EFE6] text-[#8D5B4C] border border-[#E5DCD0]';
    }
  };

  const getDotColor = (category) => {
    switch (category) {
      case 'co-dau': return 'bg-[#2E7D32]';
      case 'tiec': return 'bg-[#C62828]';
      case 'an-hoi': return 'bg-[#6A1B9A]';
      case 'chup-anh': return 'bg-[#1565C0]';
      default: return 'bg-[#8D5B4C]';
    }
  };

  // 1. DAY VIEW: Detailed hourly schedule from 06:00 to 18:00
  if (calendarView === 'day') {
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const dayCustomers = filteredCustomers.filter(c => c.date === selectedDate);

    return (
      <div 
        id="calendar-section" 
        className={`bg-white rounded-2xl border border-[#EFE8DE] p-6 shadow-xs animate-fade-in transition-all ${
          highlightedSection === 'calendar' ? 'highlight-pulse ring-2 ring-[#8D5B4C]' : ''
        }`}
      >
        {/* Day Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-xl border border-[#E5DCD0]">
              <button 
                onClick={navigatePrev}
                className="p-1 hover:bg-white rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
                title="Ngày hôm trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={navigateToday}
                className="px-2 py-1 text-xs font-semibold text-[#8D5B4C] hover:bg-white rounded-lg transition-colors"
                title="Quay lại hôm nay"
              >
                Hôm nay
              </button>
              <button 
                onClick={navigateNext}
                className="p-1 hover:bg-white rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
                title="Ngày tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2C2420] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8D5B4C]" />
                <span>Lịch ngày: {selectedDate}</span>
                <span className="text-xs font-normal text-[#8C7E74]">({dayCustomers.length} lịch hẹn)</span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => openAddModal({ date: selectedDate, time: '07:00' })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8D5B4C] text-white text-xs font-semibold rounded-xl hover:bg-[#744537] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm lịch ngày này</span>
          </button>
        </div>

        {/* Hourly timeline */}
        <div className="space-y-3">
          {hours.map((hour) => {
            const matches = dayCustomers.filter(c => c.time && c.time.startsWith(hour.slice(0, 2)));
            return (
              <div key={hour} className="flex gap-4 items-start py-2.5 border-b border-[#EFE8DE]/60 last:border-0 hover:bg-[#FAF7F2]/40 rounded-xl px-2 transition-colors">
                <div className="w-16 flex items-center gap-1 text-xs font-bold text-[#8D5B4C] pt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{hour}</span>
                </div>
                <div className="flex-1 space-y-2">
                  {matches.length > 0 ? (
                    matches.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedCustomerId === c.id ? 'ring-2 ring-[#8D5B4C] bg-[#FAF7F2]' : 'hover:bg-white shadow-xs'
                        } ${getCardStyle(c.category, false)}`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold text-xs flex items-center gap-2 text-[#2C2420]">
                              <span>{c.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#FAF7F2] text-[#8D5B4C] border border-[#E5DCD0]">
                                {c.categoryName}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5A4F48] mt-0.5">
                              {c.phone} • Thợ makeup: <strong>{c.staffMakeup || 'Tuyết Mai'}</strong> • {c.services?.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border uppercase bg-white/80">
                            {c.statusText}
                          </span>
                          <div className="text-xs font-bold mt-1 text-[#2C2420]">
                            {c.totalAmount.toLocaleString('vi-VN')}đ
                          </div>
                          {c.remainingAmount > 0 && (
                            <div className="text-[10px] font-semibold text-[#C62828]">
                              Nợ: {c.remainingAmount.toLocaleString('vi-VN')}đ
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <button
                      onClick={() => openAddModal({ date: selectedDate, time: hour })}
                      className="w-full h-9 flex items-center justify-center gap-1.5 text-xs text-[#B8AEA4] hover:text-[#8D5B4C] hover:bg-[#FAF7F2] rounded-xl border border-dashed border-[#E5DCD0] transition-colors"
                      title="Bấm để lên lịch vào khung giờ này"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Trống lịch • Bấm để thêm hẹn lúc {hour}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. WEEK VIEW: Full 7-day schedule with columns and hours
  if (calendarView === 'week') {
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    return (
      <div 
        id="calendar-section" 
        className={`bg-white rounded-2xl border border-[#EFE8DE] shadow-xs overflow-hidden flex flex-col animate-fade-in transition-all ${
          highlightedSection === 'calendar' ? 'highlight-pulse ring-2 ring-[#8D5B4C]' : ''
        }`}
      >
        {/* Top Week Nav Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-[#EFE8DE] bg-[#FAF7F2]/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5DCD0]">
              <button 
                onClick={navigatePrev}
                className="p-1.5 hover:bg-[#FAF7F2] rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
                title="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={navigateToday}
                className="px-2.5 py-1 text-xs font-semibold text-[#8D5B4C] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                title="Quay lại tuần này"
              >
                Tuần này
              </button>
              <button 
                onClick={navigateNext}
                className="p-1.5 hover:bg-[#FAF7F2] rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
                title="Tuần sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#2C2420]">
                Tuần: {weekDaysData[0].dayNum}/{weekDaysData[0].monthNum} – {weekDaysData[6].dayNum}/{weekDaysData[6].monthNum}/{currentYear}
              </h2>
              <p className="text-[11px] text-[#8C7E74]">Lịch trình 7 ngày trong tuần</p>
            </div>
          </div>

          <button
            onClick={() => openAddModal({ date: selectedDate, time: '08:00' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8D5B4C] text-white text-xs font-semibold rounded-xl hover:bg-[#744537] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm lịch hẹn</span>
          </button>
        </div>

        {/* 7 Columns Header */}
        <div className="grid grid-cols-8 border-b border-[#EFE8DE] bg-[#FAF7F2] text-center text-xs font-semibold">
          <div className="py-3 text-[#8D5B4C] border-r border-[#EFE8DE] flex items-center justify-center">
            Giờ
          </div>
          {weekDaysData.map((d, i) => {
            const isSelected = selectedDate === d.fullDate;
            return (
              <div
                key={i}
                onClick={() => setSelectedDate(d.fullDate)}
                className={`py-2.5 px-1 border-r border-[#EFE8DE] last:border-r-0 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#8D5B4C] text-white' : 'text-[#5A4F48] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="text-[11px]">{d.name}</div>
                <div className="text-xs font-bold mt-0.5">{d.dayNum}/{d.monthNum}</div>
              </div>
            );
          })}
        </div>

        {/* Week Body Grid */}
        <div className="divide-y divide-[#EFE8DE]/70 overflow-y-auto max-h-[600px]">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 min-h-[58px]">
              {/* Hour Label */}
              <div className="p-2 text-xs font-semibold text-[#8D5B4C] bg-[#FAF7F2]/40 border-r border-[#EFE8DE] flex items-center justify-center">
                {hour}
              </div>

              {/* 7 Days slots */}
              {weekDaysData.map((d, i) => {
                const matches = filteredCustomers.filter(
                  c => c.date === d.fullDate && c.time && c.time.startsWith(hour.slice(0, 2))
                );

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`p-1.5 border-r border-[#EFE8DE] last:border-r-0 relative transition-colors ${
                      selectedDate === d.fullDate ? 'bg-[#FAF7F2]/30' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    {matches.length > 0 ? (
                      matches.map(c => {
                        const isSelected = selectedCustomerId === c.id;
                        return (
                          <div
                            key={c.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomerId(c.id);
                              setSelectedDate(c.date);
                            }}
                            className={getCardStyle(c.category, isSelected)}
                            title={`${c.name} - ${c.time} (${c.categoryName})`}
                          >
                            <div className="font-semibold truncate leading-tight flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotColor(c.category)}`} />
                              <span className="truncate">{c.name}</span>
                              {c.guestCount > 1 && (
                                <span className="text-[9px] px-1 rounded bg-black/10 font-bold flex-shrink-0">
                                  x{c.guestCount}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] opacity-80 pl-2.5 truncate">
                              {c.time} • {c.categoryName} {c.locationType === 'home' ? '(Tại nhà)' : ''}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <button
                        onClick={() => openAddModal({ date: d.fullDate, time: hour })}
                        className="w-full h-full min-h-[36px] flex items-center justify-center text-transparent hover:text-[#8D5B4C] hover:bg-[#FAF7F2] rounded-lg transition-colors group"
                        title={`Thêm lịch lúc ${hour} ngày ${d.dayNum}/${d.monthNum}`}
                      >
                        <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. MONTH GRID: Default month view matching Image 2
  return (
    <div 
      id="calendar-section" 
      className={`bg-white rounded-2xl border border-[#EFE8DE] shadow-xs overflow-hidden flex flex-col animate-fade-in transition-all ${
        highlightedSection === 'calendar' ? 'highlight-pulse ring-2 ring-[#8D5B4C]' : ''
      }`}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-[#EFE8DE] bg-[#FAF7F2]/60 text-center">
        {weekDays.map((w, idx) => (
          <div 
            key={idx} 
            className={`py-3 text-xs font-semibold border-r border-[#EFE8DE] last:border-r-0 ${
              idx === 6 ? 'text-[#D32F2F]' : 'text-[#6C5F57]'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {calendarCells.map((cell, idx) => {
          const isSelectedDay = selectedDate === cell.fullDate;
          const bookings = filteredCustomers.filter(c => c.date === cell.fullDate);

          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(cell.fullDate)}
              onDoubleClick={() => {
                setSelectedDate(cell.fullDate);
                setCalendarView('day');
              }}
              className={`min-h-[108px] p-2 border-b border-r border-[#EFE8DE] transition-colors relative flex flex-col group ${
                idx % 7 === 6 ? 'border-r-0' : ''
              } ${
                cell.isCurrentMonth ? 'bg-white' : 'bg-[#FAF7F2]/40'
              } ${
                isSelectedDay ? 'bg-[#FDFCFA]' : 'hover:bg-[#FCFAF7]'
              }`}
            >
              {/* Date Number Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`inline-flex items-center justify-center text-xs font-semibold transition-all ${
                    cell.isToday
                      ? 'w-6 h-6 rounded-full bg-[#8D5B4C] text-white shadow-xs'
                      : isSelectedDay
                      ? 'w-6 h-6 rounded-full bg-[#E5DCD0] text-[#2C2420]'
                      : cell.isCurrentMonth
                      ? (idx % 7 === 6 ? 'text-[#D32F2F] pl-1 font-semibold' : 'text-[#2C2420] pl-1')
                      : 'text-[#B8AEA4] pl-1'
                  }`}
                >
                  {cell.day}
                </span>

                <div className="flex items-center gap-1">
                  {bookings.length > 0 && (
                    <>
                      <span className="text-[10px] text-[#A3968A] font-medium pr-0.5">
                        {bookings.length} lịch
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(cell.fullDate);
                          openAddModal({ date: cell.fullDate, time: '08:00' });
                        }}
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[#8D5B4C] hover:bg-[#8D5B4C] hover:text-white transition-all opacity-0 group-hover:opacity-100 bg-[#F5EFE6]"
                        title={`Thêm lịch ngày ${cell.day}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bookings inside cell OR Prominent + button when day is empty */}
              {bookings.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(cell.fullDate);
                      openAddModal({ date: cell.fullDate, time: '08:00' });
                    }}
                    className="w-full h-full min-h-[58px] rounded-xl border border-dashed border-[#D9C8B5] hover:border-[#8D5B4C] bg-[#FAF7F2]/50 hover:bg-[#8D5B4C]/10 flex flex-col items-center justify-center gap-1.5 text-[#8D5B4C] opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 cursor-pointer group/add"
                    title={`Bấm để lên lịch hẹn cho ngày ${cell.day}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-[#E5DCD0] flex items-center justify-center transition-all group-hover/add:bg-[#8D5B4C] group-hover/add:border-[#8D5B4C]">
                      <Plus className="w-4 h-4 text-[#8D5B4C] group-hover/add:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8D5B4C]">
                      + Thêm lịch
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                  {bookings.map((booking) => {
                    const isSelected = selectedCustomerId === booking.id;

                    return (
                      <button
                        key={booking.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(booking.id);
                          setSelectedDate(booking.date);
                        }}
                        className={getCardStyle(booking.category, isSelected)}
                        title={`${booking.name} (${booking.categoryName}) - ${booking.time}`}
                      >
                        <div className="flex items-center gap-1.5 leading-tight">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotColor(booking.category)}`} />
                          <span className="font-semibold truncate">{booking.name}</span>
                          {booking.guestCount > 1 && (
                            <span className="text-[9px] px-1 rounded bg-black/10 font-bold flex-shrink-0">
                              x{booking.guestCount}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] opacity-80 pl-3 truncate">
                          {booking.categoryName} | {booking.time} {booking.locationType === 'home' ? '• Tại nhà' : '• Tại shop'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
