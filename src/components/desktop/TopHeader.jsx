import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Bell, 
  BarChart3,
  FileSpreadsheet,
  User,
  LogOut,
  Calendar as CalendarIcon,
  Plus,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { STAFFS } from '../../data/mockData';

export default function TopHeader() {
  const { 
    currentYear, 
    setCurrentYear, 
    currentMonth, 
    setCurrentMonth,
    selectedDate,
    calendarView,
    setCalendarView,
    selectedStaff,
    setSelectedStaff,
    searchTerm,
    setSearchTerm,
    setIsStatsModalOpen,
    setIsNotificationOpen,
    setIsExportModalOpen,
    openAddModal,
    resetData,
    showToast,
    navigatePrev,
    navigateNext,
    navigateToday
  } = useStudio();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const monthPickerRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
        setIsMonthPickerOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthsList = [
    { num: 1, name: 'Tháng 1' },
    { num: 2, name: 'Tháng 2' },
    { num: 3, name: 'Tháng 3' },
    { num: 4, name: 'Tháng 4' },
    { num: 5, name: 'Tháng 5' },
    { num: 6, name: 'Tháng 6' },
    { num: 7, name: 'Tháng 7' },
    { num: 8, name: 'Tháng 8' },
    { num: 9, name: 'Tháng 9' },
    { num: 10, name: 'Tháng 10' },
    { num: 11, name: 'Tháng 11' },
    { num: 12, name: 'Tháng 12' },
  ];

  const handleSelectMonth = (m) => {
    setCurrentMonth(m);
    setIsMonthPickerOpen(false);
    showToast(`Đã chuyển sang Tháng ${m}, ${currentYear}`);
  };

  const getHeaderTitle = () => {
    if (calendarView === 'day') {
      const [y, m, d] = (selectedDate || '2026-11-05').split('-');
      return `Ngày ${d}/${m}/${y}`;
    }
    if (calendarView === 'week') {
      return `Lịch Tuần • Tháng ${currentMonth}, ${currentYear}`;
    }
    return `Tháng ${currentMonth}, ${currentYear}`;
  };

  return (
    <header className="h-20 bg-[#FAF7F2] border-b border-[#EFE8DE] px-8 flex items-center justify-between gap-4 select-none relative z-20">
      {/* Left: Date navigation matching Image 2 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-xl border border-[#E5DCD0]">
          <button 
            onClick={navigatePrev}
            className="p-1.5 hover:bg-white rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
            title={calendarView === 'day' ? 'Ngày hôm trước' : calendarView === 'week' ? 'Tuần trước' : 'Tháng trước'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={navigateNext}
            className="p-1.5 hover:bg-white rounded-lg text-[#6C5F57] hover:text-[#2C2420] transition-colors"
            title={calendarView === 'day' ? 'Ngày tiếp theo' : calendarView === 'week' ? 'Tuần sau' : 'Tháng sau'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={navigateToday}
          className="px-3.5 py-2 text-sm font-medium text-[#6C5F57] bg-[#F5EFE6] hover:bg-[#EFE5D8] rounded-xl border border-[#E5DCD0] transition-colors active:scale-95"
          title="Quay lại ngày hôm nay"
        >
          Hôm nay
        </button>

        {/* Month selector dropdown picker */}
        <div className="relative" ref={monthPickerRef}>
          <button
            onClick={() => setIsMonthPickerOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#F2ECE1] transition-colors"
            title="Bấm để chọn tháng bất kỳ"
          >
            <span className="text-lg font-semibold text-[#2C2420]">
              {getHeaderTitle()}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#8D5B4C] transition-transform ${isMonthPickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Month & Year Dropdown Popup */}
          {isMonthPickerOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EFE8DE] p-4 z-50 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DE] mb-3">
                <span className="font-bold text-[#8D5B4C] uppercase text-[11px]">Chọn tháng & năm</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentYear(y => y - 1)}
                    className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#6C5F57]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs px-1 text-[#2C2420]">{currentYear}</span>
                  <button 
                    onClick={() => setCurrentYear(y => y + 1)}
                    className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#6C5F57]"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-3 gap-2">
                {monthsList.map(m => {
                  const isSelected = currentMonth === m.num;
                  return (
                    <button
                      key={m.num}
                      onClick={() => handleSelectMonth(m.num)}
                      className={`py-2 rounded-xl text-center font-semibold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#8D5B4C] text-white shadow-xs'
                          : 'bg-[#FAF7F2] text-[#5A4F48] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* View Switcher: Tháng | Tuần | Ngày */}
        <div className="flex items-center bg-[#F5EFE6] p-1 rounded-xl border border-[#E5DCD0]">
          <button
            onClick={() => setCalendarView('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              calendarView === 'month'
                ? 'bg-[#8D5B4C] text-white shadow-sm'
                : 'text-[#6C5F57] hover:text-[#2C2420]'
            }`}
            title="Xem theo tháng"
          >
            Tháng
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              calendarView === 'week'
                ? 'bg-[#8D5B4C] text-white shadow-sm'
                : 'text-[#6C5F57] hover:text-[#2C2420]'
            }`}
            title="Xem theo tuần (7 ngày & giờ)"
          >
            Tuần
          </button>
          <button
            onClick={() => setCalendarView('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              calendarView === 'day'
                ? 'bg-[#8D5B4C] text-white shadow-sm'
                : 'text-[#6C5F57] hover:text-[#2C2420]'
            }`}
            title="Xem theo ngày (Timeline từ 06:00)"
          >
            Ngày
          </button>
        </div>

        {/* Staff dropdown filter */}
        <div className="relative">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="appearance-none bg-[#F5EFE6] border border-[#E5DCD0] text-[#2C2420] text-xs font-medium py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 cursor-pointer"
            title="Lọc lịch hẹn theo nhân viên"
          >
            {STAFFS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8D5B4C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative">
          {isSearchOpen ? (
            <div className="flex items-center bg-white rounded-xl border border-[#8D5B4C] px-3 py-1.5 shadow-sm">
              <Search className="w-4 h-4 text-[#8D5B4C] mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên khách, SĐT..."
                autoFocus
                onBlur={() => { if (!searchTerm) setIsSearchOpen(false); }}
                className="w-40 text-xs focus:outline-none text-[#2C2420]"
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl bg-[#F5EFE6] text-[#6C5F57] hover:text-[#2C2420] hover:bg-[#EFE5D8] border border-[#E5DCD0] transition-colors"
              title="Tìm kiếm khách hàng"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Revenue Stats shortcut */}
        <button
          onClick={() => setIsStatsModalOpen(true)}
          className="p-2.5 rounded-xl bg-[#F5EFE6] text-[#6C5F57] hover:text-[#2C2420] hover:bg-[#EFE5D8] border border-[#E5DCD0] transition-colors"
          title="Báo cáo Doanh thu & Công nợ"
        >
          <BarChart3 className="w-4 h-4 text-[#8D5B4C]" />
        </button>

        {/* Export / Backup button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="p-2.5 rounded-xl bg-[#F5EFE6] text-[#6C5F57] hover:text-[#2C2420] hover:bg-[#EFE5D8] border border-[#E5DCD0] transition-colors"
          title="Sao lưu dữ liệu & Xuất file Excel / Phiếu thu"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationOpen(true)}
            className="p-2.5 rounded-xl bg-[#F5EFE6] text-[#6C5F57] hover:text-[#2C2420] hover:bg-[#EFE5D8] border border-[#E5DCD0] transition-colors"
            title="Trung tâm Thông báo & Nhắc lịch hẹn"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-[#C62828] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-2.5 pl-2 border-l border-[#EFE8DE] cursor-pointer group hover:opacity-90"
            title="Hồ sơ tài khoản"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Tuyết Mai"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#8D5B4C]/20 group-hover:ring-[#8D5B4C]/50 transition-all"
            />
            <span className="text-sm font-semibold text-[#2C2420] hidden md:inline">
              Tuyết Mai
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8D5B4C] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown Popup */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EFE8DE] p-4 z-50 animate-fade-in text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-[#EFE8DE]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Tuyết Mai"
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#2C2420]">Tuyết Mai</h4>
                  <p className="text-[11px] text-[#8D5B4C] font-semibold">Chủ Studio / Makeup Artist</p>
                  <p className="text-[10px] text-[#8C7E74]">Chi nhánh Hà Nội</p>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    openAddModal();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#2C2420] hover:bg-[#FAF7F2] font-medium text-left"
                >
                  <Plus className="w-4 h-4 text-[#8D5B4C]" />
                  <span>+ Thêm khách mới</span>
                </button>

                <button
                  onClick={() => {
                    setIsStatsModalOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#2C2420] hover:bg-[#FAF7F2] font-medium text-left"
                >
                  <BarChart3 className="w-4 h-4 text-[#8D5B4C]" />
                  <span>Báo cáo doanh thu & nợ</span>
                </button>

                <button
                  onClick={() => {
                    setIsNotificationOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#2C2420] hover:bg-[#FAF7F2] font-medium text-left"
                >
                  <Bell className="w-4 h-4 text-[#C62828]" />
                  <span>Nhắc lịch hẹn (3 thông báo)</span>
                </button>

                <button
                  onClick={() => {
                    setIsExportModalOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#2C2420] hover:bg-[#FAF7F2] font-medium text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
                  <span>Xuất Excel & Sao lưu</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#EFE8DE]">
                <button
                  onClick={() => {
                    resetData();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#8D5B4C] hover:bg-[#F5EFE6]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu mẫu gốc</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
