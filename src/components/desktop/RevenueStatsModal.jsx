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
  ArrowUpRight
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function RevenueStatsModal() {
  const { 
    isStatsModalOpen, 
    setIsStatsModalOpen, 
    customers, 
    currentMonth, 
    currentYear,
    setSelectedCustomerId,
    setIsPaymentModalOpen
  } = useStudio();

  // 'month' (theo tháng đang chọn) | 'all' (toàn bộ lịch sử)
  const [timeRange, setTimeRange] = useState('month');

  // Lọc danh sách khách theo thời gian
  const targetPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const activeCustomers = useMemo(() => {
    if (timeRange === 'all') return customers;
    return customers.filter(c => c.date?.startsWith(targetPrefix));
  }, [customers, timeRange, targetPrefix]);

  // Tính toán số liệu thống kê
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
      'co-dau': { name: 'Cô dâu', total: 0, count: 0 },
      'tiec': { name: 'Tiệc', total: 0, count: 0 },
      'an-hoi': { name: 'Ăn hỏi', total: 0, count: 0 },
      'chup-anh': { name: 'Chụp ảnh', total: 0, count: 0 }
    };

    activeCustomers.forEach(c => {
      const cat = c.category || 'tiec';
      if (categoryRevenue[cat]) {
        categoryRevenue[cat].total += (Number(c.totalAmount) || 0);
        categoryRevenue[cat].count += 1;
      }
    });

    const debtors = activeCustomers
      .filter(c => Number(c.remainingAmount) > 0)
      .sort((a, b) => (Number(b.remainingAmount) || 0) - (Number(a.remainingAmount) || 0));

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
      debtors
    };
  }, [activeCustomers]);

  if (!isStatsModalOpen) return null;

  const handleOpenPayment = (customer) => {
    setSelectedCustomerId(customer.id);
    setIsPaymentModalOpen(true);
    setIsStatsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-[#EFE8DE] text-xs text-[#2C2420] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EFE8DE] bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8D5B4C] text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#2C2420]">
                Báo Cáo Doanh Thu & Công Nợ
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                MEYZI STUDIO MAKEUP & HAIR • Số liệu đồng bộ thời gian thực
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white text-[#8C7E74] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Time Filter Tabs */}
        <div className="px-4 sm:px-5 pt-3 pb-1 bg-white border-b border-[#EFE8DE] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DE]">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                timeRange === 'month'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              Tháng {currentMonth}/{currentYear}
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                timeRange === 'all'
                  ? 'bg-[#8D5B4C] text-white shadow-2xs'
                  : 'text-[#6C5F57] hover:text-[#2C2420]'
              }`}
            >
              Toàn bộ thời gian ({customers.length} khách)
            </button>
          </div>

          <div className="text-[11px] text-[#8C7E74] font-medium">
            Đang lọc: <strong className="text-[#8D5B4C]">{computedStats.totalCount} lịch hẹn</strong>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Tổng dự kiến */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE]">
              <div className="text-[10px] uppercase font-bold text-[#8C7E74]">Tổng đơn dự kiến</div>
              <div className="text-base sm:text-lg font-bold text-[#2C2420] mt-1">
                {computedStats.totalExpected.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-[#8D5B4C] mt-1 font-medium">
                {computedStats.totalCount} lịch hẹn
              </div>
            </div>

            {/* Thực thu */}
            <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
              <div className="text-[10px] uppercase font-bold text-[#2E7D32]">Thực thu (Đã nhận)</div>
              <div className="text-base sm:text-lg font-bold text-[#2E7D32] mt-1">
                {computedStats.totalCollected.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-[#2E7D32] mt-1 font-medium">
                {computedStats.countPaid + computedStats.countDeposited} khách đã trả
              </div>
            </div>

            {/* Còn nợ */}
            <div className="p-3.5 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2]">
              <div className="text-[10px] uppercase font-bold text-[#C62828]">Tổng tiền còn nợ</div>
              <div className="text-base sm:text-lg font-bold text-[#C62828] mt-1">
                {computedStats.totalDebt.toLocaleString('vi-VN')} đ
              </div>
              <div className="text-[10px] text-[#C62828] mt-1 font-medium">
                {computedStats.debtors.length} khách chưa thanh toán đủ
              </div>
            </div>

            {/* Chưa cọc */}
            <div className="p-3.5 rounded-2xl bg-[#F5EFE6] border border-[#E5DCD0]">
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
                Tỷ lệ thu tiền {timeRange === 'month' ? `Tháng ${currentMonth}` : 'toàn bộ'}
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
            <div className="flex justify-between text-[10px] text-[#8C7E74] mt-2">
              <span>Đã thu: <strong className="text-[#2E7D32]">{computedStats.totalCollected.toLocaleString('vi-VN')} đ</strong></span>
              <span>Còn nợ: <strong className="text-[#C62828]">{computedStats.totalDebt.toLocaleString('vi-VN')} đ</strong></span>
            </div>
          </div>

          {/* Revenue by Service Category */}
          <div className="p-4 rounded-2xl bg-white border border-[#EFE8DE]">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#8D5B4C] mb-3">
              Doanh thu theo dịch vụ
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(computedStats.categoryRevenue).map(([key, item]) => (
                <div key={key} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DE]">
                  <div className="text-[10px] text-[#8C7E74] font-medium">{item.name} ({item.count})</div>
                  <div className="font-bold text-xs text-[#2C2420] mt-0.5">
                    {item.total.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debtors List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
                Danh sách khách hàng đang còn công nợ ({computedStats.debtors.length})
              </h4>
              {computedStats.debtors.length > 0 && (
                <span className="text-[10px] text-[#C62828] font-semibold">
                  Tổng nợ: {computedStats.totalDebt.toLocaleString('vi-VN')} đ
                </span>
              )}
            </div>

            {computedStats.debtors.length > 0 ? (
              <div className="border border-[#EFE8DE] rounded-2xl overflow-hidden bg-white">
                <div className="max-h-60 overflow-y-auto divide-y divide-[#EFE8DE]">
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
                          {c.date} • {c.categoryName || 'Dịch vụ'} • Thợ: {c.staffMakeup || 'Chưa gán'}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
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
                          className="px-2.5 py-1 rounded-lg bg-[#8D5B4C] text-white font-semibold text-[10px] hover:bg-[#744537] flex items-center gap-1 shadow-2xs"
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
                <div className="font-bold text-xs">Tuyệt vời! Không có khách hàng nào đang nợ tiền.</div>
                <div className="text-[10px] text-[#2E7D32]/80 mt-0.5">
                  Tất cả các lịch hẹn trong khoảng thời gian này đã được thanh toán đủ.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#EFE8DE] bg-[#FAF7F2] flex items-center justify-between">
          <div className="text-[11px] text-[#8C7E74]">
            Tổng doanh thu dự kiến: <strong className="text-[#2C2420]">{computedStats.totalExpected.toLocaleString('vi-VN')} đ</strong>
          </div>
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-[#8D5B4C] hover:bg-[#744537] transition-colors shadow-xs"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
