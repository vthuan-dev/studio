import React, { useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar, 
  ChevronDown, 
  Plus, 
  Home, 
  Users, 
  MoreHorizontal,
  Clock,
  CalendarDays
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function MobileDayTimeView() {
  const { 
    filteredCustomers, 
    setSelectedCustomerId, 
    setMobileScreen,
    selectedStaff,
    setSelectedStaff,
    allStaffWithAll,
    selectedDate,
    setSelectedDate,
    openAddModal
  } = useStudio();

  // Dynamic header date format: "Thứ 5, 05/11/2026"
  const formattedHeaderDate = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const dayName = days[dateObj.getDay()];
      return `${dayName}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Navigate to previous day
  const handlePrevDay = () => {
    if (!selectedDate) return;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d - 1);
    const prevStr = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`;
    setSelectedDate(prevStr);
  };

  // Navigate to next day
  const handleNextDay = () => {
    if (!selectedDate) return;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    const nextStr = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    setSelectedDate(nextStr);
  };

  // Dynamic 7-day horizontal strip for the week containing selectedDate
  const dateStrip = useMemo(() => {
    if (!selectedDate) return [];
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const cur = new Date(y, m - 1, d);
      const dayOfWeek = cur.getDay(); // 0 is Sun, 1 is Mon...
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(y, m - 1, d + mondayOffset);

      const daysOfWeekNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      const strip = [];
      for (let i = 0; i < 7; i++) {
        const itemDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        const yStr = itemDate.getFullYear();
        const mStr = String(itemDate.getMonth() + 1).padStart(2, '0');
        const dStr = String(itemDate.getDate()).padStart(2, '0');
        const dateKey = `${yStr}-${mStr}-${dStr}`;
        strip.push({
          dayName: daysOfWeekNames[i],
          dayNum: itemDate.getDate(),
          date: dateKey,
          isActive: dateKey === selectedDate
        });
      }
      return strip;
    } catch {
      return [];
    }
  }, [selectedDate]);

  // Customers for this specific date (Đảm bảo lọc trùng ID)
  const dayCustomers = useMemo(() => {
    const list = filteredCustomers.filter(c => c.date === selectedDate);
    const map = new Map();
    for (const item of list) {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    }
    return Array.from(map.values());
  }, [filteredCustomers, selectedDate]);

  // Default timeline hours
  const DEFAULT_HOURS = useMemo(() => [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
  ], []);

  // Compute dynamic time slots
  const timeSlots = useMemo(() => {
    const hoursSet = new Set(DEFAULT_HOURS);
    dayCustomers.forEach(c => {
      if (c.time) {
        const hourPrefix = c.time.split(':')[0].padStart(2, '0') + ':00';
        hoursSet.add(hourPrefix);
      }
    });
    const sortedHours = Array.from(hoursSet).sort();

    return sortedHours.map(hourStr => {
      const hNum = parseInt(hourStr.split(':')[0], 10);
      const customersInHour = dayCustomers.filter(c => {
        if (!c.time) return false;
        return parseInt(c.time.split(':')[0], 10) === hNum;
      });

      return {
        time: hourStr,
        customers: customersInHour
      };
    });
  }, [DEFAULT_HOURS, dayCustomers]);

  const handleSelectCustomer = (cust) => {
    if (cust) {
      setSelectedCustomerId(cust.id);
      setMobileScreen('detail');
    }
  };

  const getBorderColor = (category) => {
    switch (category) {
      case 'co-dau': return 'border-[#F8D7DA]';
      case 'tiec': return 'border-[#FFE2DD]';
      case 'an-hoi': return 'border-[#E2D9F3]';
      case 'chup-anh': return 'border-[#D0E1FD]';
      default: return 'border-[#E5DCD0]';
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs relative select-none pb-2">
      {/* Header with back button & date navigation */}
      <div className="px-3 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setMobileScreen('calendar')}
            className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#2C2420]"
            title="Về lịch tháng"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-[#2C2420]">{formattedHeaderDate}</span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handlePrevDay} 
            className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#8C7E74]"
            title="Ngày trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNextDay} 
            className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#8C7E74]"
            title="Ngày sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileScreen('calendar')}
            className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#8D5B4C] ml-1"
            title="Lịch tháng"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date Strip */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#EFE8DE] bg-white">
        {dateStrip.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDate(item.date)}
            className="flex flex-col items-center gap-1 flex-1 py-1"
          >
            <span className="text-[10px] text-[#8C7E74] font-medium">{item.dayName}</span>
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                item.isActive
                  ? 'bg-[#8D5B4C] text-white shadow-xs'
                  : 'text-[#2C2420] hover:bg-[#FAF7F2]'
              }`}
            >
              {item.dayNum}
            </span>
          </button>
        ))}
      </div>

      {/* Staff Filter Dropdown */}
      <div className="px-4 py-2 border-b border-[#EFE8DE] bg-white">
        <div className="relative">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full appearance-none bg-[#F5EFE6] border border-[#E5DCD0] text-[#2C2420] text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none"
          >
            {allStaffWithAll.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8D5B4C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Timeline slots */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {dayCustomers.length === 0 && (
          <div className="bg-white/80 border border-dashed border-[#E5DCD0] rounded-2xl p-4 text-center my-2">
            <CalendarDays className="w-7 h-7 text-[#8C7E74] mx-auto mb-1.5 opacity-60" />
            <p className="text-xs font-semibold text-[#6C5F57]">Chưa có lịch hẹn nào</p>
            <p className="text-[10px] text-[#8C7E74] mt-0.5">Ngày {selectedDate} chưa có khách hẹn làm.</p>
            <button
              onClick={() => {
                openAddModal({ date: selectedDate, time: '08:00' });
                setMobileScreen('add');
              }}
              className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 bg-[#8D5B4C] text-white rounded-xl text-[11px] font-semibold hover:bg-[#744537] transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lịch hẹn</span>
            </button>
          </div>
        )}

        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-3 items-start">
            <span className="w-11 text-[11px] font-bold text-[#8C7E74] pt-2 flex-shrink-0">
              {slot.time}
            </span>

            <div className="flex-1 space-y-2">
              {slot.customers && slot.customers.length > 0 ? (
                slot.customers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => handleSelectCustomer(cust)}
                    className={`bg-white p-3 rounded-2xl border ${getBorderColor(cust.category)} shadow-xs flex items-center justify-between cursor-pointer hover:shadow-sm transition-all`}
                  >
                    <div>
                      <div className="font-bold text-xs text-[#2C2420] flex items-center gap-1.5 flex-wrap">
                        <span>{cust.name}</span>
                        {cust.guestCount > 1 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DCD0] text-[#8D5B4C] font-bold">
                            x{cust.guestCount}
                          </span>
                        )}
                        <span className="font-normal text-[#8C7E74]">
                          ({cust.categoryName || cust.type || 'Khách'})
                        </span>
                        {cust.locationType === 'home' ? (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                            Tại nhà
                          </span>
                        ) : (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            Tại shop
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#8C7E74] mt-0.5">
                        {cust.phone} {cust.time ? `• ${cust.time}` : ''}
                        {cust.locationType === 'home' && cust.address ? ` • ${cust.address}` : ''}
                      </div>
                      <div className="text-[10px] text-[#5A4F48] font-medium mt-0.5 line-clamp-1">
                        {Array.isArray(cust.services) ? cust.services.join(', ') : (cust.service || 'Makeup')}
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      {cust.status === 'da-coc' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          Đã cọc
                        </span>
                      ) : cust.status === 'da-thanh-toan' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                          Chưa cọc
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => {
                    openAddModal({ date: selectedDate, time: slot.time });
                    setMobileScreen('add');
                  }}
                  className="h-7 border-b border-dashed border-[#E5DCD0] flex items-center justify-end group cursor-pointer hover:border-[#8D5B4C]/60 transition-colors"
                  title={`Thêm lịch hẹn lúc ${slot.time}`}
                >
                  <span className="text-[10px] text-[#B8AEA4] group-hover:text-[#8D5B4C] transition-colors pr-1">
                    + Thêm hẹn
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => {
          openAddModal({ date: selectedDate, time: '08:00' });
          setMobileScreen('add');
        }}
        className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-[#8D5B4C] text-white flex items-center justify-center shadow-lg hover:bg-[#744537] transition-all"
        title="Thêm khách"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

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
          onClick={() => setMobileScreen('hourly')}
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
          onClick={() => {
            openAddModal({ date: selectedDate, time: '08:00' });
            setMobileScreen('add');
          }}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>Thêm</span>
        </button>

        <button 
          onClick={() => setMobileScreen('calendar')}
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>Khác</span>
        </button>
      </div>
    </div>
  );
}
