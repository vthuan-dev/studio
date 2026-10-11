import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Calendar, Clock, DollarSign, Check } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { STAFFS } from '../../data/mockData';
import VietnamAddressSelect from './VietnamAddressSelect';

export default function CustomerModal() {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    editingCustomer,
    addCustomer,
    updateCustomer
  } = useStudio();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: 'Hà Nội',
    date: '2026-11-05',
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
    if (editingCustomer && !editingCustomer._isNew) {
      setFormData({
        name: editingCustomer.name || '',
        phone: editingCustomer.phone || '',
        address: editingCustomer.address || '',
        date: editingCustomer.date || '2026-11-05',
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
        address: 'Hà Nội',
        date: editingCustomer.date || '2026-11-05',
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
        address: 'Thường Tín, Hà Nội',
        date: '2026-11-05',
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
  }, [editingCustomer, isCustomerModalOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ tên khách hàng');
      return;
    }

    const payload = {
      ...formData,
      categoryName: getCategoryName(formData.category)
    };

    if (editingCustomer && !editingCustomer._isNew) {
      updateCustomer(editingCustomer.id, payload);
    } else {
      addCustomer(payload);
    }
    setIsCustomerModalOpen(false);
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
          <button
            onClick={() => setIsCustomerModalOpen(false)}
            className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body matching Screen 3 in Image 1 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-[#2C2420]">
          {/* Thông tin khách hàng */}
          <div className="space-y-3">
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

            {/* Địa chỉ khách hàng với API 34 Tỉnh/Thành sau sáp nhập */}
            <VietnamAddressSelect
              value={formData.address}
              onChange={(newAddress) => setFormData({ ...formData, address: newAddress })}
            />
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
            <h4 className="font-bold text-[#8D5B4C] uppercase tracking-wider text-[11px]">
              Phân công nhân viên
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Thợ Makeup
                </label>
                <select
                  value={formData.staffMakeup}
                  onChange={(e) => setFormData({ ...formData, staffMakeup: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                >
                  <option value="Tuyết Mai">Tuyết Mai (Makeup)</option>
                  <option value="Lan Hương">Lan Hương (Makeup)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Thợ Làm tóc
                </label>
                <select
                  value={formData.staffHair}
                  onChange={(e) => setFormData({ ...formData, staffHair: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                >
                  <option value="Khánh Vy">Khánh Vy (Làm tóc)</option>
                  <option value="Tuyết Mai">Tuyết Mai (Kiêm tóc)</option>
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
          <div className="pt-4 border-t border-[#EFE8DE] flex gap-3">
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#6C5F57] bg-[#FAF7F2] hover:bg-[#F2ECE1] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#8D5B4C] hover:bg-[#744537] shadow-sm transition-colors"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
