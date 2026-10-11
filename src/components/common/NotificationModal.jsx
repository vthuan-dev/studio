import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  MessageSquare, 
  DollarSign, 
  Copy, 
  Check, 
  Send 
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function NotificationModal() {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    customers, 
    setSelectedCustomerId, 
    setIsPaymentModalOpen,
    showToast 
  } = useStudio();

  const [copiedId, setCopiedId] = useState(null);

  if (!isNotificationOpen) return null;

  // Alerts logic:
  // 1. Un-deposited customers
  const unDeposited = customers.filter(c => c.status === 'chua-coc');
  // 2. Customers with remaining debt
  const withDebt = customers.filter(c => c.remainingAmount > 0 && c.status === 'da-coc');
  // 3. Upcoming schedule (first 3)
  const upcoming = [...customers].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);

  const generateReminderText = (cust) => {
    return `Chào chị ${cust.name}, MEYZI STUDIO MAKEUP xin gửi thông tin lịch hẹn của chị:
- Ngày làm: ${cust.date} vào lúc ${cust.time}
- Dịch vụ: ${cust.services?.join(', ')}
- Tổng chi phí: ${cust.totalAmount?.toLocaleString('vi-VN')}đ
- Đã cọc: ${cust.depositAmount?.toLocaleString('vi-VN')}đ
- Còn lại: ${cust.remainingAmount?.toLocaleString('vi-VN')}đ
Yêu cầu: ${cust.note || 'Đến đúng giờ'}. Studio rất hân hạnh được phục vụ chị!`;
  };

  const handleCopy = (cust) => {
    const text = generateReminderText(cust);
    navigator.clipboard.writeText(text);
    setCopiedId(cust.id);
    showToast(`Đã sao chép tin nhắn nhắc lịch cho ${cust.name}!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenPayment = (cust) => {
    setSelectedCustomerId(cust.id);
    setIsNotificationOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#C62828]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#2C2420]">
                Trung Tâm Thông Báo & Nhắc Lịch Tự Động
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Hạn chế bỏ sót khách và chống nhầm lẫn khi thu tiền
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs / Sections */}
        <div className="flex-1 space-y-5 py-4 overflow-y-auto">
          {/* Section 1: Cảnh báo khách chưa cọc (Dễ bị huỷ/bỏ sót) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-[#C62828] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cần nhắc đặt cọc ({unDeposited.length} khách)</span>
              </span>
              <span className="text-[10px] text-[#8C7E74]">Tránh bùng lịch</span>
            </div>

            <div className="space-y-2">
              {unDeposited.map(c => (
                <div key={c.id} className="p-3 rounded-2xl bg-[#FFF8F8] border border-[#FFCDD2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold text-xs text-[#2C2420]">{c.name}</div>
                      <div className="text-[10px] text-[#8C7E74]">{c.phone} • Ngày: {c.date} ({c.time})</div>
                      <div className="text-[10px] text-[#C62828] font-semibold mt-0.5">
                        Chưa cọc: {c.totalAmount?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(c)}
                      className="p-2 rounded-xl bg-white border border-[#FFCDD2] text-[#C62828] hover:bg-[#FFEBEE] transition-colors"
                      title="Sao chép tin nhắn nhắc cọc"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2 rounded-xl bg-white border border-[#FFCDD2] text-[#8D5B4C] hover:bg-[#FAF7F2] transition-colors"
                      title="Gọi điện"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleOpenPayment(c)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#8D5B4C] text-white text-[11px] font-semibold hover:bg-[#744537] transition-colors"
                    >
                      Thu cọc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Cảnh báo công nợ cần thu khi khách đến */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Nhắc thu công nợ ngày làm ({withDebt.length} khách)</span>
              </span>
              <span className="text-[10px] text-[#8C7E74]">Hạn chế quên thu tiền</span>
            </div>

            <div className="space-y-2">
              {withDebt.slice(0, 4).map(c => (
                <div key={c.id} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-bold text-xs text-[#2C2420]">{c.name}</div>
                      <div className="text-[10px] text-[#8C7E74]">{c.phone} • {c.date} ({c.time})</div>
                      <div className="text-[10px] text-[#C62828] font-bold mt-0.5">
                        Còn nợ: {c.remainingAmount?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(c)}
                      className="p-2 rounded-xl bg-white border border-[#E5DCD0] text-[#8D5B4C] hover:bg-[#FAF7F2]"
                      title="Sao chép mẫu nhắc nợ"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenPayment(c)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2E7D32] text-white text-[11px] font-semibold hover:bg-[#1B5E20] transition-colors"
                    >
                      Thu đủ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#EFE8DE] flex justify-end">
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] transition-colors"
          >
            Đã xem xong
          </button>
        </div>
      </div>
    </div>
  );
}
