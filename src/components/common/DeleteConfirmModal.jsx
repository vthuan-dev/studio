import React from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  Store, 
  Home 
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ServiceBadge, StatusBadge } from './Badge';

export default function DeleteConfirmModal() {
  const { 
    isDeleteModalOpen, 
    deleteTargetCustomer, 
    closeDeleteModal, 
    confirmDeleteCustomer 
  } = useStudio();

  if (!isDeleteModalOpen || !deleteTargetCustomer) return null;

  const {
    name,
    phone,
    date,
    time,
    category,
    categoryName,
    status,
    statusText,
    locationType,
    address,
    guestCount,
    services,
    totalAmount,
    depositAmount,
    remainingAmount
  } = deleteTargetCustomer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-[#EFE8DE] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warning Accent */}
        <div className="p-4 bg-[#FFEBEE]/60 border-b border-[#FFCDD2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFCDD2] flex items-center justify-center text-[#C62828] shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#C62828]">
                Xác nhận xóa lịch hẹn
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Hành động này không thể hoàn tác sau khi thực hiện
              </p>
            </div>
          </div>
          <button
            onClick={closeDeleteModal}
            className="p-1 rounded-lg text-[#8C7E74] hover:text-[#2C2420] hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer Summary Card */}
        <div className="p-5 space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EFE8DE] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#2C2420]">
                {name || 'Khách hàng'}
              </h4>
              <div className="flex items-center gap-1.5">
                <ServiceBadge category={category} text={categoryName} size="xs" />
                <StatusBadge status={status} text={statusText} size="xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6C5F57] pt-1 border-t border-[#EFE8DE]/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8D5B4C]" />
                <span>{date} ({time})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8D5B4C]" />
                <span>{guestCount || 1} khách</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                {locationType === 'home' ? (
                  <Home className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                ) : (
                  <Store className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                )}
                <span className="truncate">
                  {locationType === 'home' ? `Tại nhà: ${address || 'Chưa có địa chỉ'}` : 'Tại cửa hàng'}
                </span>
              </div>
            </div>

            {services && services.length > 0 && (
              <div className="text-[11px] text-[#8C7E74] pt-1 border-t border-[#EFE8DE]/60 line-clamp-1">
                Dịch vụ: <span className="font-medium text-[#2C2420]">{services.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Financial Impact */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FFF9C4]/40 border border-[#FFF59D] text-[11px]">
            <span className="text-[#6C5F57]">Số tiền ảnh hưởng:</span>
            <div className="text-right">
              <span className="font-bold text-[#2C2420]">{(totalAmount || 0).toLocaleString('vi-VN')}đ</span>
              {remainingAmount > 0 && (
                <span className="text-[#C62828] ml-2 font-medium">(Nợ: {(remainingAmount || 0).toLocaleString('vi-VN')}đ)</span>
              )}
            </div>
          </div>

          {/* Cloud Sync Warning Alert */}
          <div className="text-[11px] text-[#C62828] bg-[#FFEBEE] p-3 rounded-xl border border-[#FFCDD2] flex items-start gap-2 leading-relaxed">
            <Trash2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Lịch hẹn này sẽ bị <strong>xóa vĩnh viễn</strong> khỏi ứng dụng và cập nhật đồng bộ ngay lập tức lên <strong>MongoDB Atlas Cloud</strong>. Các máy tính khác kết nối sẽ lập tức loại bỏ lịch này.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EFE8DE] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="py-2.5 px-4 rounded-xl font-semibold text-xs text-[#6C5F57] bg-white hover:bg-[#F2ECE1] border border-[#E5DCD0] transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={confirmDeleteCustomer}
            className="py-2.5 px-5 rounded-xl font-semibold text-xs text-white bg-[#C62828] hover:bg-[#B71C1C] shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
