import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Check, User, MapPin, Store, Home, Users, Minus, Plus } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function MobileAddCustomer() {
  const { setMobileScreen, addCustomer, staffList, selectedDate, showToast } = useStudio();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    locationType: 'studio', // 'studio' | 'home'
    guestCount: 1,
    address: 'Tại cửa hàng',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '08:00',
    category: 'co-dau',
    services: [],
    staffMakeup: staffList[0]?.name || '',
    staffHair: staffList[1]?.name || staffList[0]?.name || '',
    totalAmount: 0,
    depositAmount: 0,
    note: ''
  });

  const remaining = Math.max(0, (Number(formData.totalAmount) || 0) - (Number(formData.depositAmount) || 0));

  const categories = [
    { id: 'co-dau', label: 'Cô dâu' },
    { id: 'an-hoi', label: 'Ăn hỏi' },
    { id: 'tiec', label: 'Tiệc' },
    { id: 'chup-anh', label: 'Chụp ảnh' },
  ];

  const servicesList = [
    { id: 'mu-bride', label: 'Makeup cô dâu', cat: 'co-dau' },
    { id: 'hair', label: 'Làm tóc', cat: null },
    { id: 'photo', label: 'Chụp ảnh', cat: 'chup-anh' },
    { id: 'acc', label: 'Thuê phụ kiện', cat: null },
    { id: 'mu-party', label: 'Makeup tiệc', cat: 'tiec' },
    { id: 'mu-anhoi', label: 'Makeup ăn hỏi', cat: 'an-hoi' },
  ];

  const handleToggle = (svc) => {
    let next = [...formData.services];
    if (next.includes(svc.label)) {
      next = next.filter(s => s !== svc.label);
    } else {
      next.push(svc.label);
      if (svc.cat) {
        setFormData(prev => ({ ...prev, category: svc.cat }));
      }
    }
    setFormData(prev => ({ ...prev, services: next }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      showToast('Vui lòng nhập họ tên khách hàng!', 'error');
      return;
    }

    setIsSubmitting(true);

    const catObj = categories.find(c => c.id === formData.category);
    const categoryName = catObj ? catObj.label : 'Cô dâu';

    addCustomer({
      ...formData,
      guestCount: Math.max(1, Number(formData.guestCount) || 1),
      address: formData.locationType === 'studio' ? 'Tại cửa hàng' : (formData.address || 'Tại nhà khách'),
      categoryName,
      totalAmount: Number(formData.totalAmount) || 0,
      depositAmount: Number(formData.depositAmount) || 0,
      remainingAmount: remaining
    });

    showToast(`Đã thêm lịch hẹn khách ${formData.name}!`, 'success');
    setMobileScreen('calendar');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-6">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10 shadow-xs">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1 font-bold text-sm text-[#2C2420]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Thêm khách mới</span>
        </button>

        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className={`font-bold text-sm text-white px-3 py-1.5 rounded-xl transition-all shadow-xs ${
            isSubmitting ? 'bg-[#8D5B4C]/60 cursor-not-allowed' : 'bg-[#8D5B4C] hover:bg-[#744537]'
          }`}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Thông tin khách hàng */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-3 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">
            Thông tin khách hàng
          </h3>

          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Họ tên khách hàng *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Nguyễn Thị Lan"
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#8D5B4C]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Số điện thoại *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0987 654 321"
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#8D5B4C]"
              />
            </div>

            {/* Số lượng khách */}
            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Số lượng khách</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, guestCount: Math.max(1, (Number(prev.guestCount) || 1) - 1) }))}
                    className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-[#8D5B4C] font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-10 text-center bg-transparent py-1 text-xs font-bold text-[#2C2420] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, guestCount: (Number(prev.guestCount) || 1) + 1 }))}
                    className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-[#8D5B4C] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-semibold text-[#6C5F57]">
                  {formData.guestCount > 1 ? `${formData.guestCount} người` : '1 người'}
                </span>
              </div>
            </div>

            {/* Địa điểm làm việc */}
            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Địa điểm làm việc</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'studio', address: 'Tại cửa hàng' }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border font-semibold text-xs transition-all ${
                    formData.locationType === 'studio'
                      ? 'bg-[#8D5B4C] text-white border-[#8D5B4C] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#6C5F57] border-[#EFE8DE]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Make tại cửa hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, locationType: 'home', address: prev.address === 'Tại cửa hàng' ? '' : prev.address }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border font-semibold text-xs transition-all ${
                    formData.locationType === 'home'
                      ? 'bg-[#8D5B4C] text-white border-[#8D5B4C] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#6C5F57] border-[#EFE8DE]'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Make tại nhà khách</span>
                </button>
              </div>
            </div>

            {/* Điều kiện ô địa chỉ */}
            {formData.locationType === 'home' ? (
              <div>
                <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Địa chỉ nhà khách *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.address === 'Tại cửa hàng' ? '' : formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="VD: Thường Tín, Hà Nội"
                    className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8D5B4C]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EFE8DE] flex items-center gap-2 text-[#8D5B4C] text-[11px]">
                <Store className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Khách đến trực tiếp cửa hàng / studio làm dịch vụ.</span>
              </div>
            )}
          </div>
        </div>

        {/* Phân loại & Ngày giờ làm */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-3 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">Phân loại & Thời gian</h3>

          {/* Phân loại khách */}
          <div>
            <label className="text-[10px] text-[#8C7E74] font-medium block mb-1.5">Loại khách</label>
            <div className="grid grid-cols-4 gap-1.5">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setFormData({ ...formData, category: c.id })}
                  className={`py-1.5 rounded-xl text-center text-[11px] font-semibold transition-all ${
                    formData.category === c.id
                      ? 'bg-[#8D5B4C] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border border-[#EFE8DE] text-[#6C5F57]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Ngày làm</label>
              <div className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1.5 rounded-xl border border-[#EFE8DE]">
                <Calendar className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-transparent text-xs font-semibold focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8C7E74] font-medium block mb-1">Giờ làm</label>
              <div className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1.5 rounded-xl border border-[#EFE8DE]">
                <Clock className="w-4 h-4 text-[#8D5B4C] flex-shrink-0" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-transparent text-xs font-semibold focus:outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">Dịch vụ yêu cầu</h3>
          <div className="grid grid-cols-2 gap-2">
            {servicesList.map((svc) => {
              const isChecked = formData.services.includes(svc.label);
              return (
                <button
                  type="button"
                  key={svc.id}
                  onClick={() => handleToggle(svc)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                    isChecked
                      ? 'bg-[#8D5B4C] text-white border-[#8D5B4C]'
                      : 'bg-[#FAF7F2] border-[#EFE8DE] text-[#5A4F48]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-white text-[#8D5B4C] border-white' : 'border-[#B8AEA4] bg-white'
                  }`}>
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-medium">{svc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phân công nhân viên */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2.5 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">Phân công nhân viên</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-[#8C7E74] font-semibold mb-1">Thợ Makeup</label>
              <select
                value={formData.staffMakeup}
                onChange={(e) => setFormData({ ...formData, staffMakeup: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none"
              >
                <option value="">-- Chọn thợ --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#8C7E74] font-semibold mb-1">Thợ Làm tóc</label>
              <select
                value={formData.staffHair}
                onChange={(e) => setFormData({ ...formData, staffHair: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none"
              >
                <option value="">-- Chọn thợ --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Giá dịch vụ */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2.5 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">Giá dịch vụ & Đặt cọc</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8C7E74]">Tổng tiền (VNĐ) *</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={formData.totalAmount || ''}
                onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-28 text-right font-bold text-xs bg-[#FAF7F2] border border-[#EFE8DE] rounded-lg px-2 py-1 focus:outline-none focus:border-[#8D5B4C]"
              />
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8C7E74]">Đã cọc (VNĐ)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={formData.depositAmount || ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-28 text-right font-bold text-xs text-[#2E7D32] bg-[#FAF7F2] border border-[#EFE8DE] rounded-lg px-2 py-1 focus:outline-none focus:border-[#8D5B4C]"
              />
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EFE8DE]">
            <span className="text-[11px] font-bold text-[#2C2420]">Còn lại</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-[#C62828]">{remaining.toLocaleString('vi-VN')}</span>
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C2420]">Ghi chú</h3>
          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Ghi chú yêu cầu của khách (VD: Tone tự nhiên, có thuê phụ kiện vương miện...)"
            className="w-full text-xs text-[#5A4F48] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DE] leading-relaxed focus:outline-none focus:border-[#8D5B4C]"
          />
        </div>
      </div>
    </div>
  );
}
