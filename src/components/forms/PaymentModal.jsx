import React, { useState } from 'react';
import { X, CreditCard, CheckCheck, PlusCircle } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedCustomer,
    recordPayment,
    settleFullPayment
  } = useStudio();

  const [paymentAmount, setPaymentAmount] = useState(500000);
  const [paymentNote, setPaymentNote] = useState('Thu thêm đợt 2');

  if (!isPaymentModalOpen || !selectedCustomer) return null;

  const { id, name, remainingAmount, totalAmount, depositAmount } = selectedCustomer;

  const handlePayPartial = (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;
    recordPayment(id, Number(paymentAmount), paymentNote);
    setIsPaymentModalOpen(false);
  };

  const handlePayAll = () => {
    settleFullPayment(id);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div>
            <h3 className="text-base font-bold font-serif text-[#2C2420]">
              Quản lý Tiền Cọc & Công Nợ
            </h3>
            <p className="text-[11px] text-[#8C7E74]">Khách hàng: <strong>{name}</strong></p>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DE] my-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6C5F57]">Tổng giá trị đơn:</span>
            <span className="font-bold">{totalAmount?.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6C5F57]">Đã thanh toán / Đã cọc:</span>
            <span className="font-bold text-[#2E7D32]">{depositAmount?.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#EFE8DE]">
            <span className="font-bold text-[#6C5F57]">Số tiền còn nợ:</span>
            <span className="font-bold text-sm text-[#C62828]">{remainingAmount?.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        {/* Forms */}
        <form onSubmit={handlePayPartial} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
              Số tiền thu thêm (VNĐ)
            </label>
            <input
              type="number"
              step="50000"
              max={remainingAmount}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-sm font-bold text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
              Ghi chú thu tiền
            </label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="VD: Cọc bổ sung, Khách ck qua Momo..."
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
            />
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Xác nhận thu thêm {Number(paymentAmount || 0).toLocaleString('vi-VN')} đ</span>
            </button>

            {remainingAmount > 0 && (
              <button
                type="button"
                onClick={handlePayAll}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#C8E6C9] flex items-center justify-center gap-1.5 transition-colors border border-[#C8E6C9]"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Thanh toán toàn bộ phần còn lại ({remainingAmount?.toLocaleString('vi-VN')} đ)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
