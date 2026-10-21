import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Calendar, Clock, DollarSign, Check, Store, Home, Users, Minus, Plus, Trash2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { STAFFS } from '../../data/mockData';
import VietnamAddressSelect from './VietnamAddressSelect';

export default function CustomerModal() {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    editingCustomer,
    addCustomer,
    updateCustomer,
    requestDeleteCustomer,
    staffList,
    setIsStaffModalOpen,
    selectedDate
  } = useStudio();

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const defaultDate = selectedDate || getTodayStr();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    locationType: 'studio', // 'studio' | 'home'
    guestCount: 1,
    address: 'Tại cửa hàng',
    date: defaultDate,
    time: '06:00',
    category: 'co-dau',
    services: ['Makeup cô dâu', 'Làm tóc'],
    staffMakeup: 'Tuyết Mai',
    staffHair: 'Khánh Vy',
    totalAmount: 3200000,
    depositAmount: 1000000,
    note: 'Tone nhẹ nhàng, trong trẻo. Có thuê phụ kiện.'
  });

  useEffect(() => {
    const currentDefDate = selectedDate || getTodayStr();
    if (editingCustomer && !editingCustomer._isNew) {
      const locType = editingCustomer.locationType || (editingCustomer.address && editingCustomer.address !== 'Tại cửa hàng' ? 'home' : 'studio');
      setFormData({
        name: editingCustomer.name || '',
        phone: editingCustomer.phone || '',
        locationType: locType,
        guestCount: editingCustomer.guestCount || 1,
        address: editingCustomer.address || (locType === 'studio' ? 'Tại cửa hàng' : ''),
        date: editingCustomer.date || currentDefDate,
        time: editingCustomer.time || '06:00',
        category: editingCustomer.category || 'co-dau',
        services: editingCustomer.services || ['Makeup cô dâu'],
        staffMakeup: editingCustomer.staffMakeup || 'Tuyết Mai',
        staffHair: editingCustomer.staffHair || 'Khánh Vy',
        totalAmount: editingCustomer.totalAmount || 0,
        depositAmount: editingCustomer.depositAmount || 0,
        note: editingCustomer.note || ''
      });
    } else if (editingCustomer && editingCustomer._isNew) {
      setFormData({
        name: '',
        phone: '',
        locationType: 'studio',
        guestCount: 1,
        address: 'Tại cửa hàng',
        date: editingCustomer.date || currentDefDate,
        time: editingCustomer.time || '06:00',
        category: 'co-dau',
        services: ['Makeup cô dâu', 'Làm tóc'],
        staffMakeup: 'Tuyết Mai',
        staffHair: 'Khánh Vy',
        totalAmount: 3200000,
        depositAmount: 1000000,
        note: 'Tone nhẹ nhàng, trong trẻo. Có thuê phụ kiện.'
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        locationType: 'studio',
        guestCount: 1,
        address: 'Tại cửa hàng',
        date: currentDefDate,
        time: '06:00',
        category: 'co-dau',
        services: ['Makeup cô dâu', 'Làm tóc'],
        staffMakeup: 'Tuyết Mai',
        staffHair: 'Khánh Vy',
        totalAmount: 3200000,
        depositAmount: 1000000,
        note: 'Tone nhẹ nhàng, trong trẻo. Có thuê phụ kiện.'
      });
    }
  }, [editingCustomer, isCustomerModalOpen, selectedDate]);

  if (!isCustomerModalOpen) return null;

  const remaining = Math.max(0, (Number(formData.totalAmount) || 0) - (Number(formData.depositAmount) || 0));

  const serviceOptions = [
    { label: 'Makeup cô dâu', cat: 'co-dau' },
    { label: 'Làm tóc', cat: null },
    { label: 'Chụp ảnh', cat: 'chup-anh' },
    { label: 'Thuê phụ kiện', cat: null },
    { label: 'Makeup ăn hỏi', cat: 'an-hoi' },
    { label: 'Makeup đi tiệc', cat: 'tiec' },
  ];

  const handleToggleService = (service) => {
    let next = [...formData.services];
    if (next.includes(service.label)) {
      next = next.filter(s => s !== service.label);
    } else {
      next.push(service.label);
      if (service.cat) {
        setFormData(prev => ({ ...prev, category: service.cat }));
      }
    }
    setFormData(prev => ({ ...prev, services: next }));
  };

  const getCategoryName = (cat) => {
    switch (cat) {
      case 'co-dau': return 'Cô dâu';
      case 'an-hoi': return 'Ăn hỏi';
      case 'tiec': return 'Tiệc';
      case 'chup-anh': return 'Chụp ảnh';
      default: return 'Khác';
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ tên khách hàng');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      guestCount: Math.max(1, Number(formData.guestCount) || 1),
      address: formData.locationType === 'studio' ? 'Tại cửa hàng' : (formData.address || 'Tại nhà khách'),
      categoryName: getCategoryName(formData.category)
    };

    if (editingCustomer && !editingCustomer._isNew) {
      updateCustomer(editingCustomer.id, payload);
    } else {
      addCustomer(payload);
    }
    setIsCustomerModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DE] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EFE8DE] sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold font-serif text-[#2C2420]">
              {(editingCustomer && !editingCustomer._isNew) ? 'Sửa thông tin khách hàng' : 'Thêm lịch hẹn mới'}
            </h3>
            <p className="text-xs text-[#8C7E74]">MEYZI STUDIO MAKEUP & HAIR</p>
          </div>
          <div className="flex items-center gap-1.5">
            {editingCustomer && !editingCustomer._isNew && (
              <button
                type="button"
                onClick={() => requestDeleteCustomer(editingCustomer)}
                className="p-2 rounded-full hover:bg-[#FFEBEE] text-[#C62828] transition-colors"
                title="Xóa lịch hẹn này"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body matching Screen 3 in Image 1 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-[#2C2420]">
          {/* Thông tin khách hàng */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Thông tin khách hàng
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Họ tên khách hàng *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Hồng Nhung"
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="VD: 0987 654 321"
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                />
              </div>
            </div>

            {/* Mục Số lượng khách */}
            <div>
              <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8D5B4C]" />
                  <span>Số lượng khách</span>
                </span>
                <span className="text-[10px] text-[#8C7E74]">Mặc định: 1 khách</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, guestCount: Math.max(1, (Number(prev.guestCount) || 1) - 1) }))}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-[#8D5B4C] font-bold text-sm transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-12 text-center bg-transparent py-1 text-xs font-bold text-[#2C2420] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, guestCount: (Number(prev.guestCount) || 1) + 1 }))}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-[#8D5B4C] font-bold text-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-semibold text-[#6C5F57]">
                  {formData.guestCount > 1 ? `${formData.guestCount} người (khách/người nhà)` : '1 người'}
                </span>
              </div>
            </div>

            {/* Tùy chọn Địa điểm làm việc (Make tại cửa hàng vs Make tại nhà khách) */}
            <div>
              <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1.5">
                Địa điểm làm việc *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'studio', address: 'Tại cửa hàng' }))}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all ${
                    formData.locationType === 'studio'
                      ? 'bg-[#8D5B4C] text-white border-[#8D5B4C] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#6C5F57] border-[#EFE8DE] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Make tại cửa hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'home', address: prev.address === 'Tại cửa hàng' ? '' : prev.address }))}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all ${
                    formData.locationType === 'home'
                      ? 'bg-[#8D5B4C] text-white border-[#8D5B4C] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#6C5F57] border-[#EFE8DE] hover:bg-[#F5EFE6]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Make tại nhà khách</span>
                </button>
              </div>
            </div>

            {/* Điều kiện địa chỉ: Tại nhà khách -> Hiện chọn địa chỉ; Tại cửa hàng -> Ẩn hoàn toàn */}
            {formData.locationType === 'home' ? (
              <div className="pt-1">
                <VietnamAddressSelect
                  value={formData.address === 'Tại cửa hàng' ? '' : formData.address}
                  onChange={(newAddress) => setFormData({ ...formData, address: newAddress })}
                />
              </div>
            ) : (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DE] flex items-center gap-2 text-[#8D5B4C] text-xs">
                <Store className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-[11px]">Khách làm dịch vụ trực tiếp tại Studio / Cửa hàng (Không cần chọn địa chỉ).</span>
              </div>
            )}
          </div>

          {/* Ngày làm & Giờ */}
          <div className="space-y-3 pt-3 border-t border-[#EFE8DE]">
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Ngày làm
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Ngày làm việc
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Giờ hẹn
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Dịch vụ Checkboxes matching Screen 3 */}
          <div className="space-y-3 pt-3 border-t border-[#EFE8DE]">
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Dịch vụ *
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {serviceOptions.map((svc, i) => {
                const isChecked = formData.services.includes(svc.label);
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleToggleService(svc)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      isChecked
                        ? 'bg-[#8D5B4C] text-white border-[#8D5B4C] font-semibold shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EFE8DE] text-[#5A4F48] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-white text-[#8D5B4C] border-white' : 'border-[#C8B8A6] bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{svc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phân công nhân viên */}
          <div className="space-y-3 pt-3 border-t border-[#EFE8DE]">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
                Phân công nhân viên
              </h4>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(true)}
                className="text-[11px] text-[#8D5B4C] hover:underline font-semibold flex items-center gap-1"
                title="Quản lý danh sách nhân viên (Thêm, Sửa, Xóa)"
              >
                <span>+ Quản lý thợ</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Thợ Makeup
                </label>
                <select
                  value={formData.staffMakeup}
                  onChange={(e) => setFormData({ ...formData, staffMakeup: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium cursor-pointer"
                >
                  <option value="">-- Chưa chọn thợ --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Thợ Làm tóc
                </label>
                <select
                  value={formData.staffHair}
                  onChange={(e) => setFormData({ ...formData, staffHair: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium cursor-pointer"
                >
                  <option value="">-- Chưa chọn thợ --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Giá dịch vụ matching Screen 3 */}
          <div className="space-y-3 pt-3 border-t border-[#EFE8DE]">
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Giá dịch vụ & Tiền cọc
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#6C5F57]">
                  Tổng tiền *
                </label>
                <div className="relative w-44">
                  <input
                    type="number"
                    step="100000"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-right font-bold text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#6C5F57]">
                  Đã cọc
                </label>
                <div className="relative w-44">
                  <input
                    type="number"
                    step="100000"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-right font-bold text-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE8DE]">
                <span className="font-bold text-[#6C5F57]">Còn lại:</span>
                <span className="font-bold text-sm text-[#C62828]">
                  {remaining.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2 pt-3 border-t border-[#EFE8DE]">
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Ghi chú riêng
            </h4>
            <textarea
              rows={3}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="VD: Tone nhẹ nhàng trong trẻo, có thuê phụ kiện..."
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#EFE8DE] flex items-center gap-2.5">
            {editingCustomer && !editingCustomer._isNew && (
              <button
                type="button"
                onClick={() => requestDeleteCustomer(editingCustomer)}
                className="py-3 px-3.5 rounded-xl font-semibold text-xs text-[#C62828] bg-[#FFEBEE] hover:bg-[#FFCDD2] border border-[#FFCDD2] transition-colors flex items-center justify-center gap-1.5"
                title="Xóa lịch hẹn này"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa lịch hẹn</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#6C5F57] bg-[#FAF7F2] hover:bg-[#F2ECE1] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-colors ${
                isSubmitting ? 'bg-[#8D5B4C]/60 cursor-not-allowed' : 'bg-[#8D5B4C] hover:bg-[#744537] shadow-sm'
              }`}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
