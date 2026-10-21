import React, { useState } from 'react';
import { Search, ChevronLeft, Plus, Home, Calendar, Users, MoreHorizontal, Phone, Cloud, RefreshCw } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ServiceBadge, StatusBadge } from '../common/Badge';

export default function MobileListView() {
  const { 
    filteredCustomers, 
    setSelectedCustomerId, 
    setMobileScreen,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    stats,
    openAddModal,
    syncNow,
    syncStatus
  } = useStudio();

  const tabs = [
    { id: 'all', name: 'Tất cả', count: stats.categoryCounts['all'] },
    { id: 'co-dau', name: 'Cô dâu', count: stats.categoryCounts['co-dau'] },
    { id: 'an-hoi', name: 'Ăn hỏi', count: stats.categoryCounts['an-hoi'] },
    { id: 'tiec', name: 'Tiệc', count: stats.categoryCounts['tiec'] },
    { id: 'chup-anh', name: 'Chụp ảnh', count: stats.categoryCounts['chup-anh'] },
  ];

  const handleSelect = (id) => {
    setSelectedCustomerId(id);
    setMobileScreen('detail');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-2">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1 font-bold text-sm text-[#2C2420]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Danh sách khách</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={syncNow}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
              syncStatus === 'syncing'
                ? 'bg-[#F5EFE6] text-[#8D5B4C] border-[#8D5B4C]/40 animate-pulse'
                : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9]'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 text-[#8D5B4C] animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-[#2E7D32]" />
            )}
            <span>{syncStatus === 'syncing' ? 'Đang tải...' : 'Đồng bộ'}</span>
          </button>

          <button 
            onClick={() => setMobileScreen('add')}
            className="p-1.5 px-2.5 rounded-xl bg-[#8D5B4C] text-white flex items-center gap-1 text-[11px] font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="p-3 bg-white border-b border-[#EFE8DE] space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8D5B4C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên khách, số điện thoại..."
            className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-[#8D5B4C] text-white'
                  : 'bg-[#F5EFE6] text-[#6C5F57]'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className="bg-white p-3.5 rounded-2xl border border-[#EFE8DE] shadow-xs flex items-center justify-between cursor-pointer hover:border-[#8D5B4C]/40 transition-all"
            >
              <div>
                <div className="font-bold text-xs text-[#2C2420] flex items-center gap-1.5 flex-wrap">
                  {c.name}
                  {c.guestCount > 1 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DCD0] text-[#8D5B4C] font-bold">
                      x{c.guestCount}
                    </span>
                  )}
                  <ServiceBadge category={c.category} text={c.categoryName} size="xs" />
                  {c.locationType === 'home' ? (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Tại nhà
                    </span>
                  ) : (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Tại shop
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#8C7E74] mt-0.5">
                  {c.phone} • {c.date} ({c.time})
                </div>
                <div className="text-[10px] text-[#5A4F48] mt-0.5 line-clamp-1">
                  {c.services?.join(', ')}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <StatusBadge status={c.status} text={c.statusText} size="xs" />
                <div className="text-xs font-bold text-[#2C2420]">
                  {c.totalAmount?.toLocaleString('vi-VN')}đ
                </div>
                {c.remainingAmount > 0 && (
                  <div className="text-[10px] font-semibold text-[#C62828]">
                    Nợ: {c.remainingAmount?.toLocaleString('vi-VN')}đ
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-[#8C7E74]">
            Không tìm thấy khách hàng nào.
          </div>
        )}
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
          className="flex flex-col items-center gap-1 text-[#8C7E74]"
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch khách</span>
        </button>

        <button 
          onClick={() => setMobileScreen('list')}
          className="flex flex-col items-center gap-1 text-[#8D5B4C] font-bold"
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
