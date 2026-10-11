import React from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  ChevronDown, 
  Plus, 
  Home, 
  Users, 
  MoreHorizontal 
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { STAFFS } from '../../data/mockData';

export default function MobileDayTimeView() {
  const { 
    filteredCustomers, 
    setSelectedCustomerId, 
    setMobileScreen,
    selectedStaff,
    setSelectedStaff,
    selectedDate,
    setSelectedDate
  } = useStudio();

  // Horizontal date strip matching Screen 2 in Image 1
  const dateStrip = [
    { dayName: 'T2', dayNum: 3, date: '2026-11-03' },
    { dayName: 'T3', dayNum: 4, date: '2026-11-04' },
    { dayName: 'T4', dayNum: 5, date: '2026-11-05', isActive: true },
    { dayName: 'T5', dayNum: 6, date: '2026-11-06' },
    { dayName: 'T6', dayNum: 7, date: '2026-11-07' },
    { dayName: 'T7', dayNum: 8, date: '2026-11-08' },
    { dayName: 'CN', dayNum: 9, date: '2026-11-09' },
  ];

  const timeSlots = [
    { 
      time: '06:00',
      customer: {
        id: 'cust-1',
        name: 'Hồng Nhung',
        type: 'Cô dâu',
        phone: '0987 654 321',
        service: 'Makeup + Làm tóc',
        status: 'da-coc',
        statusText: 'Đã cọc',
        borderColor: 'border-[#F8D7DA]'
      }
    },
    { 
      time: '07:00',
      customer: {
        id: 'cust-6',
        name: 'Ngọc Anh',
        type: 'Cô dâu',
        phone: '0321 555 666',
        service: 'Makeup + Làm tóc',
        status: 'da-coc',
        statusText: 'Đã cọc',
        borderColor: 'border-[#C3E6CB]'
      }
    },
    { 
      time: '08:00',
      customer: {
        id: 'cust-11',
        name: 'Quỳnh Nga',
        type: 'Tiệc',
        phone: '0976 888 222',
        service: 'Makeup',
        status: 'chua-coc',
        statusText: 'Chưa cọc',
        borderColor: 'border-[#F8D7DA]'
      }
    },
    { 
      time: '09:00',
      customer: {
        id: 'cust-8',
        name: 'Thanh Mai',
        type: 'Tiệc',
        phone: '0367 123 789',
        service: 'Makeup + Làm tóc',
        status: 'chua-coc',
        statusText: 'Chưa cọc',
        borderColor: 'border-[#F8D7DA]'
      }
    },
    { time: '10:00', customer: null },
    { time: '12:00', customer: null },
    { 
      time: '13:00',
      customer: {
        id: 'cust-12',
        name: 'Bảo Ngọc',
        type: 'Ăn hỏi',
        phone: '0389 777 333',
        service: 'Makeup + Làm tóc',
        status: 'da-coc',
        statusText: 'Đã cọc',
        borderColor: 'border-[#E2D9F3]'
      }
    },
    { time: '14:00', customer: null },
    { time: '15:00', customer: null },
  ];

  const handleSelectCustomer = (cust) => {
    if (cust) {
      setSelectedCustomerId(cust.id);
      setMobileScreen('detail');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs relative select-none pb-2">
      {/* Header matching Screen 2 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1 font-bold text-sm"
        >
          <ChevronLeft className="w-5 h-5 text-[#2C2420]" />
          <span>Thứ 5, 05/11/2026</span>
        </button>

        <button className="p-1 hover:bg-[#FAF7F2] rounded-lg">
          <Calendar className="w-5 h-5 text-[#8D5B4C]" />
        </button>
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
            {STAFFS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8D5B4C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Timeline slots matching Screen 2 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-3 items-start">
            <span className="w-11 text-[11px] font-bold text-[#8C7E74] pt-2 flex-shrink-0">
              {slot.time}
            </span>

            <div className="flex-1">
              {slot.customer ? (
                <div
                  onClick={() => handleSelectCustomer(slot.customer)}
                  className={`bg-white p-3 rounded-2xl border ${slot.customer.borderColor} shadow-xs flex items-center justify-between cursor-pointer hover:shadow-sm transition-all`}
                >
                  <div>
                    <div className="font-bold text-xs text-[#2C2420]">
                      {slot.customer.name}{' '}
                      <span className="font-normal text-[#8C7E74]">
                        ({slot.customer.type})
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8C7E74] mt-0.5">
                      {slot.customer.phone}
                    </div>
                    <div className="text-[10px] text-[#5A4F48] font-medium mt-0.5">
                      {slot.customer.service}
                    </div>
                  </div>

                  <div>
                    {slot.customer.status === 'da-coc' ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                        Đã cọc
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                        Chưa cọc
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-6 border-b border-dashed border-[#E5DCD0]" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Plus Button matching Screen 2 */}
      <button
        onClick={() => setMobileScreen('add')}
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
          onClick={() => setMobileScreen('add')}
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
