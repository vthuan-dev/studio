import React from 'react';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  CheckCheck, 
  PlusCircle 
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function MobileDetailView() {
  const { 
    selectedCustomer, 
    setMobileScreen, 
    openEditModal, 
    recordPayment, 
    settleFullPayment,
    setIsPaymentModalOpen 
  } = useStudio();

  if (!selectedCustomer) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-[#8C7E74]">Không có dữ liệu khách hàng</p>
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="mt-3 text-xs text-[#8D5B4C] font-semibold underline"
        >
          Quay lại lịch
        </button>
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
    categoryName,
    services,
    staffMakeup,
    staffHair,
    totalAmount,
    depositAmount,
    remainingAmount,
    statusText,
    note,
    paymentHistory
  } = selectedCustomer;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-6">
      {/* Header matching Screen 4 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1 font-bold text-sm text-[#2C2420]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Chi tiết khách</span>
        </button>

        <button 
          onClick={() => openEditModal(selectedCustomer)}
          className="font-bold text-sm text-[#8D5B4C] hover:underline"
        >
          Sửa
        </button>
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Customer Header Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2C2420]">{name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                {categoryName}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                {statusText}
              </span>
            </div>
          </div>

          {/* Quick Call & SMS Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phone}`}
              className="w-8 h-8 rounded-full border border-[#E5DCD0] bg-[#FAF7F2] flex items-center justify-center text-[#8D5B4C] hover:bg-[#8D5B4C] hover:text-white transition-colors"
              title="Gọi điện"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={`sms:${phone}`}
              className="w-8 h-8 rounded-full border border-[#E5DCD0] bg-[#FAF7F2] flex items-center justify-center text-[#8D5B4C] hover:bg-[#8D5B4C] hover:text-white transition-colors"
              title="Nhắn tin"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact info list */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2.5 text-xs text-[#5A4F48]">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
            <span className="font-semibold">{phone}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
            <span>{address}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
            <span>Ngày: {date} • Giờ: {time}</span>
          </div>

          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-[#8D5B4C] flex-shrink-0 mt-0.5" />
            <div>
              <div>{staffMakeup || 'Chưa phân công'} (Makeup)</div>
              <div>{staffHair || 'Chưa phân công'} (Làm tóc)</div>
            </div>
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#2C2420]">Dịch vụ</h3>
            <button 
              onClick={() => openEditModal(selectedCustomer)}
              className="text-[11px] font-semibold text-[#8D5B4C] hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm dịch vụ</span>
            </button>
          </div>
          <ul className="space-y-1 text-xs text-[#5A4F48] pl-1">
            {services && services.length > 0 ? (
              services.map((s, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-[#8D5B4C] font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-[11px] text-[#8C7E74] italic">Chưa chọn dịch vụ</li>
            )}
          </ul>
        </div>

        {/* Thanh toán */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Thanh toán</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8C7E74]">Tổng tiền</span>
              <span className="font-bold text-[#2C2420]">{(totalAmount || 0).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8C7E74]">Đã cọc</span>
              <span className="font-bold text-[#2E7D32]">{(depositAmount || 0).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#EFE8DE]">
              <span className="text-[#8C7E74] font-semibold">Còn lại</span>
              <span className="font-bold text-[#C62828] text-sm">{(remainingAmount || 0).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-1.5">
          <h3 className="font-bold text-xs text-[#2C2420]">Ghi chú</h3>
          <p className="text-xs text-[#5A4F48] leading-relaxed">
            {note || 'Chưa có ghi chú.'}
          </p>
        </div>

        {/* Actions: Thu thêm / Thanh toán đủ */}
        {remainingAmount > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-[#8D5B4C] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#8D5B4C] transition-colors"
            >
              Thu thêm
            </button>
            <button
              onClick={() => settleFullPayment(id)}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs text-white bg-[#8D5B4C] hover:bg-[#744537] shadow-xs transition-colors"
            >
              Thanh toán đủ
            </button>
          </div>
        )}

        {/* Lịch sử thanh toán */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Lịch sử thanh toán</h3>
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="space-y-1.5">
              {paymentHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DE]">
                  <span className="text-[#8C7E74]">{item.date}</span>
                  <span className="font-bold text-[#2E7D32]">{(item.amount || 0).toLocaleString('vi-VN')}đ</span>
                  <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-medium">
                    {item.type || 'Thanh toán'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#8C7E74] italic">Chưa có giao dịch thanh toán nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
