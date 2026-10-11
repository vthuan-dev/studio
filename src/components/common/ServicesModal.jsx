import React from 'react';
import { X, Sparkles, Check, Plus, Clock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function ServicesModal() {
  const { 
    isServicesModalOpen, 
    setIsServicesModalOpen, 
    openAddModal, 
    setSelectedCategory,
    showToast 
  } = useStudio();

  if (!isServicesModalOpen) return null;

  const servicesList = [
    {
      id: 'co-dau',
      name: 'Gói Makeup & Tóc Cô Dâu Ngày Cưới',
      price: '3.200.000 đ',
      duration: '120 - 150 phút',
      category: 'co-dau',
      categoryName: 'Cô dâu',
      features: ['Tone kem nền cao cấp chống trôi 18h', 'Thiết kế kiểu tóc cô dâu độc quyền', 'Bộ trang sức & cài tóc cao cấp', 'Dặm phấn lại trước giờ đón dâu']
    },
    {
      id: 'an-hoi',
      name: 'Gói Makeup Ăn Hỏi / Lễ Vu Quy',
      price: '1.800.000 đ',
      duration: '90 - 120 phút',
      category: 'an-hoi',
      categoryName: 'Ăn hỏi',
      features: ['Tone nhẹ nhàng, đằm thắm', 'Bới tóc hoặc tết tóc truyền thống', 'Phụ kiện trâm cài áo dài']
    },
    {
      id: 'tiec',
      name: 'Gói Makeup Dạ Tiệc & Sự Kiện',
      price: '800.000 đ',
      duration: '60 - 75 phút',
      category: 'tiec',
      categoryName: 'Tiệc',
      features: ['Đánh khối tạo nét sắc sảo, quyến rũ', 'Tạo kiểu uốn xoăn sóng bồng bềnh', 'Dán mi gân mảnh tự nhiên']
    },
    {
      id: 'chup-anh',
      name: 'Gói Makeup Chụp Ảnh Kỷ Yếu / Lookbook',
      price: '1.200.000 đ',
      duration: '90 phút',
      category: 'chup-anh',
      categoryName: 'Chụp ảnh',
      features: ['Tối ưu ánh sáng studio & ngoại cảnh', 'Thay đổi 2 kiểu tóc đi kèm', 'Hỗ trợ dặm phấn trong buổi chụp']
    }
  ];

  const handleBookService = (svc) => {
    setIsServicesModalOpen(false);
    openAddModal({
      category: svc.category,
      services: [svc.name, 'Làm tóc'],
      totalAmount: parseInt(svc.price.replace(/\D/g, '')),
      depositAmount: Math.round(parseInt(svc.price.replace(/\D/g, '')) * 0.3)
    });
    showToast(`Đã chọn ${svc.name}`);
  };

  const handleFilterCategory = (cat) => {
    setSelectedCategory(cat);
    setIsServicesModalOpen(false);
    showToast(`Đã lọc danh sách theo nhóm: ${cat}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] text-[#8D5B4C] flex items-center justify-center border border-[#E5DCD0]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#2C2420]">
                Bảng Giá & Dịch Vụ MEYZI STUDIO
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Bảng giá niêm yết chính hãng, hỗ trợ đặt lịch trực tiếp
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsServicesModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {servicesList.map(svc => (
            <div 
              key={svc.id}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] hover:border-[#8D5B4C]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#EFE8DE]">
                <div>
                  <h4 className="font-bold text-sm text-[#2C2420]">{svc.name}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-[#8C7E74] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8D5B4C]" />
                      <span>{svc.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#8D5B4C] font-semibold">{svc.categoryName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#8D5B4C]">{svc.price}</span>
                  </div>
                  <button
                    onClick={() => handleBookService(svc)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#8D5B4C] text-white rounded-xl text-xs font-semibold hover:bg-[#744537] transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lên lịch</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-[11px] text-[#5A4F48]">
                {svc.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#EFE8DE] flex justify-end">
          <button
            onClick={() => setIsServicesModalOpen(false)}
            className="px-5 py-2 bg-[#8D5B4C] text-white rounded-xl text-xs font-semibold hover:bg-[#744537] transition-colors"
          >
            Đóng bảng giá
          </button>
        </div>
      </div>
    </div>
  );
}
