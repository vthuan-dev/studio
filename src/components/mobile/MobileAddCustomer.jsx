import React, { useState } from 'react';
import { ChevronLeft, Camera, Calendar, Clock, Check } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function MobileAddCustomer() {
  const { setMobileScreen, addCustomer } = useStudio();

  const [formData, setFormData] = useState({
    name: 'Hồng Nhung',
    phone: '0987 654 321',
    address: 'Thường Tín, Hà Nội',
    date: '2026-11-05',
    time: '06:00',
    category: 'co-dau',
    services: ['Makeup cô dâu', 'Làm tóc'],
    staffMakeup: 'Tuyết Mai',
    staffHair: 'Khánh Vy',
    totalAmount: 3200000,
    depositAmount: 1000000,
    note: 'Tone nhẹ nhàng, trong trẻo. Có thuê phụ kiện',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const remaining = Math.max(0, formData.totalAmount - formData.depositAmount);

  const servicesList = [
    { id: 'mu-bride', label: 'Makeup cô dâu', cat: 'co-dau' },
    { id: 'hair', label: 'Làm tóc', cat: null },
    { id: 'photo', label: 'Chụp ảnh', cat: 'chup-anh' },
    { id: 'acc', label: 'Thuê phụ kiện', cat: null },
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

  const handleSave = () => {
    if (!formData.name) return;
    addCustomer({
      ...formData,
      categoryName: formData.category === 'co-dau' ? 'Cô dâu' : 'Tiệc'
    });
    setMobileScreen('detail');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAF7F2] text-[#2C2420] text-xs select-none pb-6">
      {/* Header matching Screen 3 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#EFE8DE] bg-white sticky top-0 z-10">
        <button 
          onClick={() => setMobileScreen('calendar')}
          className="p-1 hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1 font-bold text-sm text-[#2C2420]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Thêm khách</span>
        </button>

        <button 
          onClick={handleSave}
          className="font-bold text-sm text-[#8D5B4C] hover:underline"
        >
          Lưu
        </button>
      </div>

      {/* Form Content matching Screen 3 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Thông tin khách hàng */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-3">
          <h3 className="font-bold text-xs text-[#2C2420]">
            Thông tin khách hàng
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#F5EFE6] border border-[#E5DCD0] flex items-center justify-center text-[#8C7E74]">
              <Camera className="w-6 h-6 text-[#8D5B4C]" />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <label className="text-[10px] text-[#8C7E74] font-medium block">Họ tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8C7E74] font-medium block">Số điện thoại *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ngày làm */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Ngày làm</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#EFE8DE]">
              <Calendar className="w-4 h-4 text-[#8D5B4C]" />
              <input
                type="text"
                value="05/11/2026"
                readOnly
                className="bg-transparent text-xs font-semibold focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#EFE8DE]">
              <Clock className="w-4 h-4 text-[#8D5B4C]" />
              <input
                type="text"
                value="06:00"
                readOnly
                className="bg-transparent text-xs font-semibold focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Dịch vụ *</h3>
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
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Phân công nhân viên</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#EFE8DE]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Tuyết Mai"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-[11px] font-bold">Tuyết Mai</div>
                <div className="text-[9px] text-[#8C7E74]">Makeup</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#EFE8DE]">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                alt="Khánh Vy"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-[11px] font-bold">Khánh Vy</div>
                <div className="text-[9px] text-[#8C7E74]">Làm tóc</div>
              </div>
            </div>
          </div>
        </div>

        {/* Giá dịch vụ */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2.5">
          <h3 className="font-bold text-xs text-[#2C2420]">Giá dịch vụ</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8C7E74]">Tổng tiền *</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">3.200.000</span>
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8C7E74]">Đã cọc</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-[#2E7D32]">1.000.000</span>
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#EFE8DE]">
            <span className="text-[11px] font-bold text-[#2C2420]">Còn lại</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs text-[#C62828]">2.200.000</span>
              <span className="text-[10px] text-[#8C7E74]">đ</span>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div className="bg-white p-4 rounded-2xl border border-[#EFE8DE] space-y-2">
          <h3 className="font-bold text-xs text-[#2C2420]">Ghi chú</h3>
          <p className="text-[11px] text-[#5A4F48] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DE] leading-relaxed">
            {formData.note}
          </p>
        </div>
      </div>
    </div>
  );
}
