import React, { useState, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  PieChart, 
  Users, 
  CreditCard,
  Calendar,
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Award,
  Scissors,
  Sparkles,
  Download
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function RevenueStatsModal() {
  const { 
    isStatsModalOpen, 
    setIsStatsModalOpen, 
    customers, 
    staffList,
    currentMonth, 
    currentYear,
    setSelectedCustomerId,
    setIsPaymentModalOpen,
    exportToCSV
  } = useStudio();

  // Tab chế độ xem: 'month' (Chi tiết tháng) | 'year-chart' (Biểu đồ 12 tháng) | 'staff' (Doanh số theo thợ) | 'all' (Toàn thời gian)
  const [activeTab, setActiveTab] = useState('month');

  // Tháng và Năm đang chọn để xem báo cáo
  const [selectedYear, setSelectedYear] = useState(currentYear || 2026);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth || 10);

  // Danh sách 12 tháng trong năm được chọn
  const yearMonthlyData = useMemo(() => {
    const list = [];
    let maxRevenue = 1;

    for (let m = 1; m <= 12; m++) {
      const prefix = `${selectedYear}-${String(m).padStart(2, '0')}`;
      const monthCustomers = customers.filter(c => c.date?.startsWith(prefix));
      
      const expected = monthCustomers.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0);
      const collected = monthCustomers.reduce((sum, c) => sum + (Number(c.depositAmount) || 0), 0);
      const debt = monthCustomers.reduce((sum, c) => sum + (Number(c.remainingAmount) || 0), 0);
      const count = monthCustomers.length;

      if (expected > maxRevenue) maxRevenue = expected;

      list.push({
        month: m,
        monthName: `Tháng ${m}`,
        expected,
        collected,
        debt,
        count
      });
    }

    return { list, maxRevenue };
  }, [customers, selectedYear]);

  // Lọc danh sách khách theo chế độ xem
  const activeCustomers = useMemo(() => {
    if (activeTab === 'all') return customers;
    if (activeTab === 'year-chart') {
      return customers.filter(c => c.date?.startsWith(String(selectedYear)));
    }
    // activeTab === 'month' hoặc 'staff' -> lọc theo selectedMonth & selectedYear
    const targetPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    return customers.filter(c => c.date?.startsWith(targetPrefix));
  }, [customers, activeTab, selectedMonth, selectedYear]);

  // Tính toán số liệu thống kê chi tiết cho tập khách đang lọc
  const computedStats = useMemo(() => {
    const totalCount = activeCustomers.length;
    const totalExpected = activeCustomers.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0);
    const totalCollected = activeCustomers.reduce((sum, c) => sum + (Number(c.depositAmount) || 0), 0);
    const totalDebt = activeCustomers.reduce((sum, c) => sum + (Number(c.remainingAmount) || 0), 0);

    const countDeposited = activeCustomers.filter(c => c.status === 'da-coc').length;
    const countPaid = activeCustomers.filter(c => c.status === 'da-thanh-toan').length;
    const countUnpaid = activeCustomers.filter(c => c.status === 'chua-coc').length;

    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    // Phân bổ doanh thu theo gói dịch vụ
    const categoryRevenue = {
      'co-dau': { name: 'Cô dâu', total: 0, count: 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      'tiec': { name: 'Tiệc', total: 0, count: 0, color: 'text-rose-700 bg-rose-50 border-rose-200' },
      'an-hoi': { name: 'Ăn hỏi', total: 0, count: 0, color: 'text-purple-700 bg-purple-50 border-purple-200' },
      'chup-anh': { name: 'Chụp ảnh', total: 0, count: 0, color: 'text-sky-700 bg-sky-50 border-sky-200' }
    };

    activeCustomers.forEach(c => {
      const cat = c.category || 'tiec';
      if (categoryRevenue[cat]) {
        categoryRevenue[cat].total += (Number(c.totalAmount) || 0);
        categoryRevenue[cat].count += 1;
      }
    });

    // Danh sách khách nợ
    const debtors = activeCustomers
      .filter(c => Number(c.remainingAmount) > 0)
      .sort((a, b) => (Number(b.remainingAmount) || 0) - (Number(a.remainingAmount) || 0));

    // Thống kê theo nhân viên / thợ (Makeup & Hair)
    const staffMap = new Map();
    (staffList || []).forEach(s => {
      staffMap.set(s.name, {
        name: s.name,
        role: s.role,
        makeupCount: 0,
        hairCount: 0,
        totalCustomers: 0,
        totalRevenueContribution: 0
      });
    });

    activeCustomers.forEach(c => {
      const amount = Number(c.totalAmount) || 0;
      if (c.staffMakeup) {
        if (!staffMap.has(c.staffMakeup)) {
          staffMap.set(c.staffMakeup, {
            name: c.staffMakeup,
            role: 'Makeup Artist',
            makeupCount: 0,
            hairCount: 0,
            totalCustomers: 0,
            totalRevenueContribution: 0
          });
        }
        const s = staffMap.get(c.staffMakeup);
        s.makeupCount += 1;
        s.totalCustomers += 1;
        s.totalRevenueContribution += amount;
      }

      if (c.staffHair) {
        if (!staffMap.has(c.staffHair)) {
          staffMap.set(c.staffHair, {
            name: c.staffHair,
            role: 'Hair Stylist',
            makeupCount: 0,
            hairCount: 0,
            totalCustomers: 0,
            totalRevenueContribution: 0
          });
        }
        const s = staffMap.get(c.staffHair);
        s.hairCount += 1;
        if (!c.staffMakeup || c.staffMakeup !== c.staffHair) {
          s.totalCustomers += 1;
        }
        s.totalRevenueContribution += amount;
      }
    });

    const staffPerformance = Array.from(staffMap.values())
      .filter(s => s.totalCustomers > 0)
      .sort((a, b) => b.totalRevenueContribution - a.totalRevenueContribution);

    return {
      totalCount,
      totalExpected,
      totalCollected,
      totalDebt,
      countDeposited,
      countPaid,
      countUnpaid,
      collectionRate,
      categoryRevenue,
      debtors,
      staffPerformance
    };
  }, [activeCustomers, staffList]);

  if (!isStatsModalOpen) return null;

  const handleOpenPayment = (customer) => {
    setSelectedCustomerId(customer.id);
    setIsPaymentModalOpen(true);
    setIsStatsModalOpen(false);
  };

  const handleSelectMonthFromChart = (m) => {
    setSelectedMonth(m);
    setActiveTab('month');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-[#EFE8DE] text-xs text-[#2C2420] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EFE8DE] bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8D5B4C] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#2C2420] flex items-center gap-2">
                Báo Cáo Doanh Thu Theo Tháng
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Live Sync
                </span>
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                MEYZI STUDIO • Thống kê tự động đa chiều theo từng tháng và nhân viên
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5DCD0] bg-white hover:bg-[#FAF7F2] text-[#8D5B4C] font-semibold text-[11px] transition-colors shadow-2xs"
              title="Xuất file Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Excel</span>
            </button>

            <button
              onClick={() => setIsStatsModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white text-[#8C7E74] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Month Picker Row */}
        <div className="px-3 sm:px-5 py-2.5 bg-white border-b border-[#EFE8DE] flex items-center justify-between gap-2 flex-wrap">
          
          {/* Main 4 Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DE] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('month')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'month'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tháng {selectedMonth}/{selectedYear}</span>
            </button>

            <button
              onClick={() => setActiveTab('year-chart')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'year-chart'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>12 Tháng Năm {selectedYear}</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'staff'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Năng suất thợ</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Toàn thời gian</span>
            </button>
          </div>

          {/* Quick Month Selector Buttons */}
          {activeTab !== 'all' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (selectedMonth === 1) {
                    setSelectedMonth(12);
                    setSelectedYear(y => y - 1);
                  } else {
                    setSelectedMonth(m => m - 1);
                  }
                }}
                className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#8C7E74]"
                title="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="font-bold text-xs text-[#2C2420] px-2 py-1 bg-[#FAF7F2] rounded-lg border border-[#EFE8DE]">
                Tháng {selectedMonth}/{selectedYear}
              </div>

              <button
                onClick={() => {
                  if (selectedMonth === 12) {
                    setSelectedMonth(1);
                    setSelectedYear(y => y + 1);
                  } else {
                    setSelectedMonth(m => m + 1);
                  }
                }}
                className="p-1 hover:bg-[#FAF7F2] rounded-lg text-[#8C7E74]"
                title="Tháng sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1 & 4: Month Detail / All-Time View */}
          {(activeTab === 'month' || activeTab === 'all') && (
            <>
              {/* 4 Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* Tổng dự kiến */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8C7E74]">Tổng đơn dự kiến</div>
                  <div className="text-base sm:text-lg font-bold text-[#2C2420] mt-1">
                    {computedStats.totalExpected.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[10px] text-[#8D5B4C] mt-1 font-medium">
                    {computedStats.totalCount} lịch hẹn {activeTab === 'month' ? `trong T${selectedMonth}` : 'toàn bộ'}
                  </div>
                </div>

                {/* Thực thu */}
                <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#2E7D32]">Thực thu (Đã nhận)</div>
                  <div className="text-base sm:text-lg font-bold text-[#2E7D32] mt-1">
                    {computedStats.totalCollected.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[10px] text-[#2E7D32] mt-1 font-medium">
                    {computedStats.countPaid + computedStats.countDeposited} khách đã trả tiền
                  </div>
                </div>

                {/* Còn nợ */}
                <div className="p-3.5 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#C62828]">Tổng tiền còn nợ</div>
                  <div className="text-base sm:text-lg font-bold text-[#C62828] mt-1">
                    {computedStats.totalDebt.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[10px] text-[#C62828] mt-1 font-medium">
                    {computedStats.debtors.length} khách chưa thanh toán đủ
                  </div>
                </div>

                {/* Chưa cọc */}
                <div className="p-3.5 rounded-2xl bg-[#F5EFE6] border border-[#E5DCD0] shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-[#8D5B4C]">Chưa cọc đồng nào</div>
                  <div className="text-base sm:text-lg font-bold text-[#8D5B4C] mt-1">
                    {computedStats.countUnpaid} khách
                  </div>
                  <div className="text-[10px] text-[#8C7E74] mt-1 font-medium">Cần nhắc thanh toán</div>
                </div>
              </div>

              {/* Progress Bar Tỷ lệ thu hồi */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#2C2420]">
                    Tiến độ thu tiền ({activeTab === 'month' ? `Tháng ${selectedMonth}/${selectedYear}` : 'Toàn bộ thời gian'})
                  </span>
                  <span className="font-bold text-xs text-[#2E7D32]">
                    {computedStats.collectionRate}% thực thu
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EFE8DE] overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, computedStats.collectionRate)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8C7E74] mt-2 font-medium">
                  <span>Đã thu: <strong className="text-[#2E7D32]">{computedStats.totalCollected.toLocaleString('vi-VN')} đ</strong></span>
                  <span>Còn thiếu: <strong className="text-[#C62828]">{computedStats.totalDebt.toLocaleString('vi-VN')} đ</strong></span>
                </div>
              </div>

              {/* Phân bổ theo Gói Dịch Vụ */}
              <div className="p-4 rounded-2xl bg-white border border-[#EFE8DE]">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#8D5B4C] mb-3">
                  Cơ cấu doanh thu theo dịch vụ {activeTab === 'month' ? `(Tháng ${selectedMonth})` : ''}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(computedStats.categoryRevenue).map(([key, item]) => (
                    <div key={key} className={`p-3 rounded-xl border ${item.color}`}>
                      <div className="text-[11px] font-semibold">{item.name} ({item.count} lịch)</div>
                      <div className="font-bold text-sm mt-1">
                        {item.total.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danh sách Khách Còn Nợ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
                    Khách hàng đang còn công nợ {activeTab === 'month' ? `Tháng ${selectedMonth}` : ''} ({computedStats.debtors.length})
                  </h4>
                  {computedStats.debtors.length > 0 && (
                    <span className="text-[10px] text-[#C62828] font-bold">
                      Tổng nợ: {computedStats.totalDebt.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>

                {computedStats.debtors.length > 0 ? (
                  <div className="border border-[#EFE8DE] rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div className="max-h-56 overflow-y-auto divide-y divide-[#EFE8DE]">
                      {computedStats.debtors.map((c) => (
                        <div 
                          key={c.id} 
                          className="p-3 sm:p-3.5 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#2C2420]">{c.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#8C7E74] border border-[#EFE8DE]">
                                {c.phone || 'Chưa có SĐT'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#8C7E74] mt-0.5">
                              {c.date} • {c.categoryName || 'Dịch vụ'} • Thợ Makeup: <strong>{c.staffMakeup || 'Chưa gán'}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <div className="text-right">
                              <div className="font-bold text-xs text-[#C62828]">
                                Nợ: {Number(c.remainingAmount).toLocaleString('vi-VN')} đ
                              </div>
                              <div className="text-[10px] text-[#8C7E74]">
                                Tổng: {Number(c.totalAmount).toLocaleString('vi-VN')} đ
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenPayment(c)}
                              className="px-2.5 py-1.5 rounded-xl bg-[#8D5B4C] text-white font-bold text-[10px] hover:bg-[#744537] flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                              title="Thu thêm tiền / tất toán công nợ"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Thu nợ</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-[#E8F5E9]/50 border border-[#C8E6C9] text-[#2E7D32]">
                    <CheckCircle className="w-6 h-6 mx-auto mb-1 text-[#2E7D32]" />
                    <div className="font-bold text-xs">Tuyệt vời! Không có khách nào nợ tiền trong khoảng thời gian này.</div>
                    <div className="text-[10px] text-[#2E7D32]/80 mt-0.5">
                      Toàn bộ các lịch hẹn đã được thanh toán đầy đủ 100%.
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: 12-Month Year Bar Chart View */}
          {activeTab === 'year-chart' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C2420]">
                      Biểu đồ cột so sánh Doanh thu 12 Tháng Năm {selectedYear}
                    </h4>
                    <p className="text-[11px] text-[#8C7E74]">
                      Bấm vào bất kỳ cột tháng nào bên dưới để xem báo cáo chi tiết của tháng đó
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#8C7E74] uppercase font-bold">Tổng cả năm</div>
                    <div className="text-sm sm:text-base font-bold text-[#8D5B4C]">
                      {yearMonthlyData.list.reduce((sum, m) => sum + m.expected, 0).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>

                {/* 12 Columns Visual Bar Chart */}
                <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-1 border-b border-[#EFE8DE] bg-white rounded-xl p-3">
                  {yearMonthlyData.list.map((m) => {
                    const heightPercent = Math.max(8, Math.round((m.expected / yearMonthlyData.maxRevenue) * 100));
                    const isSelected = m.month === selectedMonth;
                    const hasData = m.expected > 0;

                    return (
                      <div
                        key={m.month}
                        onClick={() => handleSelectMonthFromChart(m.month)}
                        className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                        title={`Tháng ${m.month}: ${m.expected.toLocaleString('vi-VN')}đ (${m.count} khách)`}
                      >
                        {/* Hover Tooltip Amount */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-[#8D5B4C] mb-1 whitespace-nowrap">
                          {(m.expected / 1000000).toFixed(1)}Tr
                        </div>

                        {/* Bar Pillar */}
                        <div 
                          className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 relative ${
                            isSelected
                              ? 'bg-[#8D5B4C] ring-2 ring-[#8D5B4C]/40 shadow-xs'
                              : hasData
                              ? 'bg-[#8D5B4C]/40 group-hover:bg-[#8D5B4C]/70'
                              : 'bg-[#EFE8DE] hover:bg-[#E5DCD0]'
                          }`}
                          style={{ height: `${hasData ? heightPercent : 6}%` }}
                        >
                          {isSelected && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#8D5B4C] rounded-full" />
                          )}
                        </div>

                        {/* Month Label */}
                        <span className={`text-[10px] mt-2 font-bold transition-colors ${
                          isSelected ? 'text-[#8D5B4C] underline' : 'text-[#8C7E74] group-hover:text-[#2C2420]'
                        }`}>
                          T{m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 12-Month Table Breakdown */}
              <div className="border border-[#EFE8DE] rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="p-3 bg-[#FAF7F2] border-b border-[#EFE8DE] font-bold text-xs text-[#2C2420] flex items-center justify-between">
                  <span>Bảng tổng hợp chi tiết 12 tháng năm {selectedYear}</span>
                  <span className="text-[11px] font-normal text-[#8C7E74]">Bấm vào dòng để xem chi tiết</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-[#EFE8DE]">
                  {yearMonthlyData.list.map((m) => (
                    <div 
                      key={m.month}
                      onClick={() => handleSelectMonthFromChart(m.month)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        m.month === selectedMonth ? 'bg-[#8D5B4C]/10 font-bold' : 'hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          m.expected > 0 ? 'bg-[#8D5B4C] text-white' : 'bg-[#FAF7F2] text-[#8C7E74]'
                        }`}>
                          T{m.month}
                        </span>
                        <div>
                          <div className="text-xs text-[#2C2420] font-semibold">{m.monthName}</div>
                          <div className="text-[10px] text-[#8C7E74]">{m.count} lịch hẹn</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="font-bold text-xs text-[#2C2420]">
                            {m.expected.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="text-[10px] text-[#2E7D32]">
                            Thu: {m.collected.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#8C7E74]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Staff Productivity & Revenue View */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#2C2420]">
                    Bảng Xếp Hạng & Năng Suất Thợ (Tháng {selectedMonth}/{selectedYear})
                  </h4>
                  <p className="text-[11px] text-[#8C7E74]">
                    Thống kê số lượng khách makeup/làm tóc và tổng doanh thu mang về
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#8D5B4C]/20 text-[#8D5B4C] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {computedStats.staffPerformance.length > 0 ? (
                <div className="border border-[#EFE8DE] rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-[#EFE8DE]">
                  {computedStats.staffPerformance.map((s, idx) => (
                    <div key={s.name} className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                          idx === 0 
                            ? 'bg-amber-400 text-white shadow-2xs' 
                            : idx === 1 
                            ? 'bg-gray-300 text-gray-800' 
                            : 'bg-[#FAF7F2] text-[#8C7E74] border border-[#EFE8DE]'
                        }`}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#2C2420] flex items-center gap-1.5">
                            {s.name}
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C7E74] border border-[#EFE8DE]">
                              {s.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8C7E74] mt-0.5 flex items-center gap-2">
                            <span>Makeup: <strong>{s.makeupCount} ca</strong></span>
                            <span>•</span>
                            <span>Làm tóc: <strong>{s.hairCount} ca</strong></span>
                            <span>•</span>
                            <span>Tổng phục vụ: <strong className="text-[#8D5B4C]">{s.totalCustomers} khách</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-[#8C7E74] uppercase font-bold">Doanh số liên quan</div>
                        <div className="font-bold text-xs sm:text-sm text-[#2E7D32]">
                          {s.totalRevenueContribution.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] text-[#8C7E74]">
                  <Users className="w-8 h-8 mx-auto mb-2 text-[#8D5B4C]/60" />
                  <div className="font-bold text-xs text-[#2C2420]">Chưa có số liệu thợ cho Tháng {selectedMonth}/{selectedYear}</div>
                  <div className="text-[10px] mt-1">Hãy phân công thợ vào các lịch hẹn của tháng này để hệ thống tính toán năng suất.</div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[#EFE8DE] bg-[#FAF7F2] flex items-center justify-between">
          <div className="text-[11px] text-[#8C7E74]">
            {activeTab === 'month' ? `Doanh thu Tháng ${selectedMonth}/${selectedYear}: ` : 'Tổng doanh thu dự kiến: '}
            <strong className="text-[#2C2420]">{computedStats.totalExpected.toLocaleString('vi-VN')} đ</strong>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStatsModalOpen(false)}
              className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-[#8D5B4C] hover:bg-[#744537] transition-colors shadow-xs"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
