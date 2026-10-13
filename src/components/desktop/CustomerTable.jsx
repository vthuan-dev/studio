import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronDown,
  DollarSign,
  FileText,
  Users
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ServiceBadge, StatusBadge } from '../common/Badge';
import { SERVICE_CATEGORIES } from '../../data/mockData';

export default function CustomerTable() {
  const {
    filteredCustomers,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    openAddModal,
    openEditModal,
    deleteCustomer,
    requestDeleteCustomer,
    selectedCustomerId,
    setSelectedCustomerId,
    stats,
    highlightedSection,
    activeSidebarTab,
    setIsPaymentModalOpen,
    setIsInvoiceModalOpen,
    showToast
  } = useStudio();

  const [isTableMonthPickerOpen, setIsTableMonthPickerOpen] = useState(false);

  // Dynamic counts for tabs based on current state
  const tabs = [
    { id: 'all', name: 'Tất cả', count: stats.categoryCounts['all'] },
    { id: 'co-dau', name: 'Cô dâu', count: stats.categoryCounts['co-dau'] },
    { id: 'an-hoi', name: 'Ăn hỏi', count: stats.categoryCounts['an-hoi'] },
    { id: 'tiec', name: 'Tiệc', count: stats.categoryCounts['tiec'] },
    { id: 'chup-anh', name: 'Chụp ảnh', count: stats.categoryCounts['chup-anh'] },
  ];

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

  return (
    <div 
      id="customer-table-section" 
      className={`bg-white rounded-2xl border border-[#EFE8DE] shadow-xs p-6 mt-6 transition-all ${
        highlightedSection === 'table' ? 'highlight-pulse ring-2 ring-[#8D5B4C]' : ''
      }`}
    >
      {/* Top Header matching Image 2 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#EFE8DE]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#2C2420]">
              Danh sách khách hàng
            </h2>
            {activeSidebarTab === 'da-coc' && (
              <span className="text-[11px] bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-2 py-0.5 rounded-full font-semibold">
                Đang lọc: Đã cọc ({filteredCustomers.length})
              </span>
            )}
            {activeSidebarTab === 'chua-coc' && (
              <span className="text-[11px] bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] px-2 py-0.5 rounded-full font-semibold">
                Đang lọc: Chưa cọc ({filteredCustomers.length})
              </span>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {tabs.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#8D5B4C] text-white shadow-xs'
                      : 'bg-[#F5EFE6] text-[#6C5F57] hover:bg-[#EFE5D8]'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right filters & Add button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D5B4C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên khách, SĐT..."
              className="bg-[#FAF7F2] border border-[#EFE8DE] text-xs rounded-xl pl-9 pr-3.5 py-2 text-[#2C2420] placeholder-[#A3968A] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 w-48 sm:w-56"
            />
          </div>

          {/* Month indicator interactive dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTableMonthPickerOpen(prev => !prev)}
              className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#EFE8DE] px-3 py-2 rounded-xl text-xs font-semibold text-[#2C2420] transition-colors"
              title="Bấm để chuyển tháng hiển thị"
            >
              <span>Tháng {currentMonth}, {currentYear}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8D5B4C] transition-transform ${isTableMonthPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTableMonthPickerOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EFE8DE] p-3 z-30 animate-fade-in text-xs">
                <div className="font-bold text-[#8D5B4C] text-[11px] uppercase pb-2 mb-2 border-b border-[#EFE8DE]">
                  Chọn tháng xem bảng
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {monthsList.map(m => (
                    <button
                      key={m.num}
                      onClick={() => {
                        setCurrentMonth(m.num);
                        setIsTableMonthPickerOpen(false);
                        showToast(`Đã chuyển danh sách sang Tháng ${m.num}`);
                      }}
                      className={`py-1.5 rounded-lg text-center font-semibold text-[11px] transition-colors ${
                        currentMonth === m.num ? 'bg-[#8D5B4C] text-white' : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#2C2420]'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* + Thêm khách Button matching Image 2 */}
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 bg-[#8D5B4C] hover:bg-[#744537] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khách</span>
          </button>
        </div>
      </div>

      {/* Table Data matching Image 2 */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EFE8DE] text-[#6C5F57] uppercase text-[11px] font-semibold tracking-wider">
              <th className="py-3 px-3 w-12 text-center">STT</th>
              <th className="py-3 px-3">Tên khách</th>
              <th className="py-3 px-3">SĐT</th>
              <th className="py-3 px-3">Ngày làm</th>
              <th className="py-3 px-3">Dịch vụ</th>
              <th className="py-3 px-3 text-right">Tổng tiền</th>
              <th className="py-3 px-3 text-right">Đã cọc</th>
              <th className="py-3 px-3 text-right">Còn lại</th>
              <th className="py-3 px-3 text-center">Trạng thái</th>
              <th className="py-3 px-3">Ghi chú</th>
              <th className="py-3 px-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8DE]/60">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c, idx) => {
                const isSelected = selectedCustomerId === c.id;

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FBF7F2] font-medium' : 'hover:bg-[#FAF7F2]/50'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center text-[#8C7E74]">
                      {c.stt || idx + 1}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[#2C2420]">
                          {c.name}
                        </span>
                        {c.guestCount > 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5DCD0] text-[#8D5B4C] font-bold" title={`${c.guestCount} khách`}>
                            x{c.guestCount}
                          </span>
                        )}
                        {c.locationType === 'home' ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium" title={`Make tại nhà: ${c.address || ''}`}>
                            Tại nhà
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium" title="Make tại shop / studio">
                            Tại shop
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#5A4F48]">
                      {c.phone}
                    </td>

                    <td className="py-3.5 px-3 text-[#5A4F48]">
                      {c.date} <span className="text-[#8D5B4C] font-semibold">{c.time}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <ServiceBadge category={c.category} text={c.categoryName} size="xs" />
                    </td>

                    <td className="py-3.5 px-3 text-right font-semibold text-[#2C2420]">
                      {c.totalAmount?.toLocaleString('vi-VN')}đ
                    </td>

                    <td className="py-3.5 px-3 text-right font-semibold text-[#2E7D32]">
                      {c.depositAmount?.toLocaleString('vi-VN')}đ
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-[#C62828]">
                      {c.remainingAmount > 0 ? `${c.remainingAmount?.toLocaleString('vi-VN')}đ` : '0đ'}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <StatusBadge status={c.status} text={c.statusText} size="xs" />
                    </td>

                    <td className="py-3.5 px-3 text-[#6C5F57] max-w-[160px] truncate" title={c.note}>
                      {c.note || '-'}
                    </td>

                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        {c.remainingAmount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedCustomerId(c.id);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-[#E8F5E9] rounded-lg text-[#2E7D32] transition-colors"
                            title="Thu thêm tiền / Thu nợ"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCustomerId(c.id);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-[#E3F2FD] rounded-lg text-[#1565C0] transition-colors"
                          title="In phiếu thu"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-[#F2ECE1] rounded-lg text-[#6C5F57] hover:text-[#8D5B4C] transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => requestDeleteCustomer(c)}
                          className="p-1.5 hover:bg-[#FFEBEE] rounded-lg text-[#6C5F57] hover:text-[#C62828] transition-colors"
                          title="Xóa khách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-[#8C7E74]">
                    <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E5DCD0] flex items-center justify-center mb-2.5 text-[#8D5B4C] shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-[#2C2420] mb-1">
                      Chưa có khách hàng nào trong danh sách
                    </p>
                    <p className="text-xs text-[#8C7E74] mb-3">
                      Dữ liệu đang trống. Hãy bắt đầu bằng cách thêm lịch hẹn đầu tiên của bạn!
                    </p>
                    <button
                      onClick={() => openAddModal()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8D5B4C] hover:bg-[#744537] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Thêm khách mới</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
