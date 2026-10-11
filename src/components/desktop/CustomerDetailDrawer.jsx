import React from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CreditCard, 
  Edit3, 
  Trash2, 
  CheckCheck,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ServiceBadge, StatusBadge } from '../common/Badge';

export default function CustomerDetailDrawer() {
  const { 
    selectedCustomer, 
    openEditModal, 
    deleteCustomer, 
    setIsPaymentModalOpen,
    settleFullPayment,
    setIsInvoiceModalOpen
  } = useStudio();

  if (!selectedCustomer) {
    return (
      <div className="w-80 bg-white border-l border-[#EFE8DE] p-6 flex flex-col items-center justify-center text-center text-[#8C7E74]">
        <User className="w-12 h-12 text-[#D9C8B5] mb-2" />
        <p className="text-sm">Chọn một khách hàng để xem chi tiết</p>
      </div>
    );
  }

  const {
    id,
    name,
    phone,
    address,
    date,
    time,
    category,
    categoryName,
    services,
    staffMakeup,
    staffHair,
    totalAmount,
    depositAmount,
    remainingAmount,
    status,
    statusText,
    note,
    avatar,
    paymentHistory
  } = selectedCustomer;

  return (
    <aside className="w-84 bg-white border-l border-[#EFE8DE] flex flex-col flex-shrink-0 h-full overflow-y-auto p-5 text-[#2C2420]">
      {/* Header matching Image 2 */}
      <div className="flex items-start justify-between pb-3 border-b border-[#EFE8DE]">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#2C2420] leading-snug">
            {name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <ServiceBadge category={category} text={categoryName} size="xs" />
            <StatusBadge status={status} text={statusText} size="xs" />
          </div>
        </div>
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8D5B4C]/20 shadow-xs"
        />
      </div>

      {/* Info list with clean icons */}
      <div className="py-4 space-y-3 text-xs border-b border-[#EFE8DE]">
        <div className="flex items-center gap-2.5 text-[#5A4F48]">
          <Phone className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
          <a href={`tel:${phone}`} className="hover:text-[#8D5B4C] font-medium">
            {phone}
          </a>
        </div>

        {address && (
          <div className="flex items-center gap-2.5 text-[#5A4F48]">
            <MapPin className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
            <span>{address}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 text-[#5A4F48]">
          <Calendar className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
          <span>
            {date} • <strong className="font-semibold">Giờ: {time}</strong>
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-[#5A4F48]">
          <User className="w-4 h-4 text-[#8D5B4C] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {staffMakeup && <div>{staffMakeup} (Makeup)</div>}
            {staffHair && <div>{staffHair} (Làm tóc)</div>}
          </div>
        </div>
      </div>

      {/* Dịch vụ section matching Image 2 */}
      <div className="py-4 border-b border-[#EFE8DE]">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8D5B4C] mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dịch vụ</span>
        </div>
        <ul className="space-y-1.5 text-xs text-[#4A3F38]">
          {services?.map((svc, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#8D5B4C] font-bold">•</span>
              <span>{svc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Thanh toán section matching Image 2 */}
      <div className="py-4 border-b border-[#EFE8DE]">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8D5B4C] mb-2.5">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Thanh toán</span>
          </div>
          {remainingAmount > 0 && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-[11px] text-[#8D5B4C] hover:underline font-semibold"
            >
              + Thu thêm
            </button>
          )}
        </div>

        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE8DE] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6C5F57]">Tổng tiền:</span>
            <span className="font-bold text-[#2C2420]">
              {totalAmount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6C5F57]">Đã cọc:</span>
            <span className="font-bold text-[#2E7D32]">
              {depositAmount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#EFE8DE]">
            <span className="text-[#6C5F57] font-semibold">Còn lại:</span>
            <span className="font-bold text-[#C62828] text-sm">
              {remainingAmount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Quick payment settlement buttons */}
        {remainingAmount > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8] rounded-xl border border-[#E5DCD0] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thu thêm</span>
            </button>
            <button
              onClick={() => settleFullPayment(id)}
              className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] rounded-xl shadow-xs transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Thanh toán đủ</span>
            </button>
          </div>
        )}
      </div>

      {/* Ghi chú section matching Image 2 */}
      <div className="py-4 border-b border-[#EFE8DE]">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8D5B4C] mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Ghi chú</span>
        </div>
        <p className="text-xs text-[#5A4F48] bg-[#FAF7F2] p-3 rounded-xl border border-[#EFE8DE] leading-relaxed">
          {note || 'Chưa có ghi chú đặc biệt.'}
        </p>
      </div>

      {/* Lịch sử thanh toán */}
      {paymentHistory && paymentHistory.length > 0 && (
        <div className="py-4 border-b border-[#EFE8DE]">
          <h4 className="text-[11px] font-bold text-[#8D5B4C] uppercase tracking-wider mb-2">
            Lịch sử thanh toán
          </h4>
          <div className="space-y-1.5 text-xs">
            {paymentHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-1 px-2 rounded-lg bg-[#FAF7F2] text-[11px]">
                <span className="text-[#6C5F57]">{h.date}</span>
                <span className="font-semibold text-[#2E7D32]">
                  {h.amount?.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#EFE8DE]">
                  {h.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons matching Image 2 */}
      <div className="pt-5 mt-auto flex items-center gap-2">
        <button
          onClick={() => openEditModal(selectedCustomer)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] shadow-xs transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Sửa</span>
        </button>

        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="p-2.5 rounded-xl text-xs font-semibold text-[#1565C0] bg-[#E3F2FD] hover:bg-[#BBDEFB] border border-[#BBDEFB] transition-colors"
          title="In phiếu thu / Hóa đơn"
        >
          <FileText className="w-4 h-4" />
        </button>

        <button
          onClick={() => deleteCustomer(id)}
          className="p-2.5 rounded-xl text-xs font-semibold text-[#C62828] bg-[#FFEBEE] hover:bg-[#FFCDD2] border border-[#FFCDD2] transition-colors"
          title="Xóa khách hàng"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
