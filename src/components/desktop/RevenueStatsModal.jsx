import React from 'react';
import { X, TrendingUp, DollarSign, AlertCircle, CheckCircle, PieChart, Users } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function RevenueStatsModal() {
  const { isStatsModalOpen, setIsStatsModalOpen, stats, customers, currentMonth, currentYear } = useStudio();

  if (!isStatsModalOpen) return null;

  // Customers with debt
  const debtors = customers
    .filter(c => c.remainingAmount > 0)
    .sort((a, b) => b.remainingAmount - a.remainingAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C2420]">
              Báo Cáo Doanh Thu & Công Nợ
            </h3>
            <p className="text-[11px] text-[#8C7E74]">
              Tháng {currentMonth}/{currentYear} • MEYZI STUDIO MAKEUP & HAIR
            </p>
          </div>
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE]">
            <div className="text-[10px] uppercase font-bold text-[#8C7E74]">Tổng đơn dự kiến</div>
            <div className="text-base font-bold text-[#2C2420] mt-1">
              {stats.totalRevenueExpected.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[10px] text-[#8D5B4C] mt-1 font-medium">{stats.totalCustomers} lịch hẹn</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
            <div className="text-[10px] uppercase font-bold text-[#2E7D32]">Thực thu (Đã cọc/trả)</div>
            <div className="text-base font-bold text-[#2E7D32] mt-1">
              {stats.totalRevenueCollected.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[10px] text-[#2E7D32] mt-1 font-medium">
              {stats.countDeposited + stats.countPaid} khách đã trả
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2]">
            <div className="text-[10px] uppercase font-bold text-[#C62828]">Tổng tiền còn nợ</div>
            <div className="text-base font-bold text-[#C62828] mt-1">
              {stats.totalDebt.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-[10px] text-[#C62828] mt-1 font-medium">{debtors.length} khách còn nợ</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5EFE6] border border-[#E5DCD0]">
            <div className="text-[10px] uppercase font-bold text-[#8D5B4C]">Khách chưa cọc</div>
            <div className="text-base font-bold text-[#8D5B4C] mt-1">
              {stats.countUnpaid} khách
            </div>
            <div className="text-[10px] text-[#8C7E74] mt-1 font-medium">Cần nhắc cọc</div>
          </div>
        </div>

        {/* Debtors List */}
        <div className="mt-5">
          <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px] mb-2.5">
            Danh sách khách hàng đang còn công nợ ({debtors.length})
          </h4>
          <div className="border border-[#EFE8DE] rounded-2xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto divide-y divide-[#EFE8DE]">
              {debtors.map((c) => (
                <div key={c.id} className="p-3 flex items-center justify-between hover:bg-[#FAF7F2]/60">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <span className="font-semibold text-[#2C2420]">{c.name}</span>
                      <span className="text-[10px] text-[#8C7E74] ml-2">({c.phone})</span>
                      <div className="text-[10px] text-[#8C7E74]">{c.date} • {c.categoryName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#C62828]">
                      Còn nợ: {c.remainingAmount.toLocaleString('vi-VN')} đ
                    </div>
                    <div className="text-[10px] text-[#8C7E74]">
                      Tổng: {c.totalAmount.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#EFE8DE] flex justify-end">
          <button
            onClick={() => setIsStatsModalOpen(false)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
