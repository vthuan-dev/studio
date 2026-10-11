import React from 'react';
import { X, Printer, Copy, Check, Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import BrandLogo from './BrandLogo';

export default function InvoiceModal() {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, selectedCustomer, showToast } = useStudio();

  if (!isInvoiceModalOpen || !selectedCustomer) return null;

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
    note
  } = selectedCustomer;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `PHIẾU XÁC NHẬN ĐẶT LỊCH - MEYZI STUDIO
Khách hàng: ${name} (${phone})
Địa chỉ: ${address || 'Tại studio'}
Lịch làm: ${time} ngày ${date}
Dịch vụ: ${services?.join(', ')}
Nhân viên: ${staffMakeup} (Makeup), ${staffHair} (Tóc)
---
Tổng tiền: ${totalAmount?.toLocaleString('vi-VN')} đ
Đã cọc: ${depositAmount?.toLocaleString('vi-VN')} đ
Còn lại: ${remainingAmount?.toLocaleString('vi-VN')} đ
Ghi chú: ${note || '-'}`;
    navigator.clipboard.writeText(text);
    showToast('Đã sao chép nội dung phiếu thu!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420] flex flex-col max-h-[90vh] overflow-y-auto print:border-none print:shadow-none print:max-w-none print:p-8">
        {/* Top actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE] print:hidden">
          <span className="font-bold text-xs uppercase text-[#8D5B4C] tracking-wider">
            Phiếu Thu & Hợp Đồng Dịch Vụ
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#8D5B4C] transition-colors"
              title="Sao chép nội dung"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8D5B4C] text-white font-semibold text-xs hover:bg-[#744537] transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="py-6 space-y-5">
          {/* Studio Brand Header */}
          <div className="text-center pb-5 border-b border-[#EFE8DE] flex flex-col items-center">
            <BrandLogo size="md" layout="vertical" />
            <p className="text-[11px] text-[#8C7E74] mt-2 font-medium">
              PHIẾU XÁC NHẬN LỊCH HẸN & TIỀN CỌC
            </p>
          </div>

          {/* Customer & Booking Details */}
          <div className="grid grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DE]">
            <div>
              <span className="text-[10px] text-[#8C7E74] uppercase block font-semibold">Khách hàng</span>
              <span className="font-bold text-sm text-[#2C2420]">{name}</span>
              <div className="text-[11px] text-[#5A4F48] mt-0.5">{phone}</div>
              {address && <div className="text-[11px] text-[#5A4F48]">{address}</div>}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#8C7E74] uppercase block font-semibold">Thời gian hẹn</span>
              <span className="font-bold text-sm text-[#8D5B4C]">{time}</span>
              <div className="text-[11px] text-[#5A4F48] mt-0.5">Ngày {date}</div>
              <div className="text-[10px] text-[#2E7D32] font-semibold mt-0.5 uppercase">
                {categoryName}
              </div>
            </div>
          </div>

          {/* Assigned Staff */}
          <div className="text-xs text-[#5A4F48] flex justify-between px-1">
            <span>Thợ Makeup: <strong>{staffMakeup}</strong></span>
            <span>Thợ Làm tóc: <strong>{staffHair}</strong></span>
          </div>

          {/* Services list table */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D5B4C] block mb-2">
              Dịch vụ thực hiện
            </span>
            <div className="border border-[#EFE8DE] rounded-xl overflow-hidden divide-y divide-[#EFE8DE]">
              {services?.map((svc, i) => (
                <div key={i} className="p-2.5 flex items-center justify-between bg-white text-xs">
                  <span>{svc}</span>
                  <span className="text-[#8D5B4C] font-semibold">✓ Đã bao gồm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#6C5F57]">Tổng chi phí dịch vụ:</span>
              <span className="font-bold text-[#2C2420]">{totalAmount?.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-[#2E7D32] font-semibold">Tiền đã đặt cọc:</span>
              <span className="font-bold text-[#2E7D32]">{depositAmount?.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#EFE8DE] text-sm">
              <span className="font-bold text-[#C62828]">Số tiền còn phải thanh toán:</span>
              <span className="font-bold text-[#C62828]">{remainingAmount?.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          {/* Notes */}
          {note && (
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DE] text-[11px] text-[#5A4F48]">
              <strong>Ghi chú:</strong> {note}
            </div>
          )}

          {/* Signature block */}
          <div className="grid grid-cols-2 text-center pt-8 border-t border-[#EFE8DE] text-xs">
            <div>
              <span className="font-semibold text-[#6C5F57]">Khách hàng</span>
              <p className="text-[10px] text-[#8C7E74] italic mt-0.5">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <span className="font-bold text-[#2C2420]">{name}</span>
            </div>

            <div>
              <span className="font-semibold text-[#6C5F57]">Đại diện MEYZI Studio</span>
              <p className="text-[10px] text-[#8C7E74] italic mt-0.5">(Xác nhận đã nhận cọc)</p>
              <div className="h-16 flex items-center justify-center text-[#8D5B4C] font-serif italic text-sm">
                Tuyết Mai
              </div>
              <span className="font-bold text-[#2C2420]">MEYZI STUDIO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
