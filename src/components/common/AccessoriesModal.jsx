import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Clock, Search, Tag } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function AccessoriesModal() {
  const { isAccessoriesModalOpen, setIsAccessoriesModalOpen, showToast } = useStudio();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAccessoriesModalOpen) return null;

  const items = [
    { id: 1, name: 'Vương miện công chúa đính đá Zircon', code: 'PK-01', total: 4, available: 2, borrowed: 2, deposit: '500.000 đ' },
    { id: 2, name: 'Khăn voan cô dâu thêu viền ren 3 mét', code: 'PK-02', total: 6, available: 5, borrowed: 1, deposit: '300.000 đ' },
    { id: 3, name: 'Bộ cài tóc hoa ngọc trai thủ công', code: 'PK-03', total: 8, available: 6, borrowed: 2, deposit: '200.000 đ' },
    { id: 4, name: 'Bộ trang sức cưới pha lê & ngọc trai cao cấp', code: 'PK-04', total: 5, available: 3, borrowed: 2, deposit: '600.000 đ' },
    { id: 5, name: 'Trâm cài tóc truyền thống cho áo dài ăn hỏi', code: 'PK-05', total: 10, available: 8, borrowed: 2, deposit: '150.000 đ' },
    { id: 6, name: 'Băng đô lụa đính hoa bướm phong cách Hàn Quốc', code: 'PK-06', total: 5, available: 4, borrowed: 1, deposit: '200.000 đ' },
  ];

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#2C2420]">
                Kho Phụ Kiện & Đồ Cưới MEYZI STUDIO
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Quản lý số lượng phụ kiện cô dâu, tình trạng cho mượn & đặt cọc
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAccessoriesModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="my-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D5B4C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm mã phụ kiện, tên vương miện, khăn voan..."
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] text-xs rounded-xl pl-9 pr-4 py-2.5 text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
            />
          </div>
        </div>

        {/* Inventory list */}
        <div className="space-y-2.5 mb-4">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between hover:bg-white transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#2C2420]">{item.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F5EFE6] text-[#8D5B4C] border border-[#E5DCD0]">
                    {item.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#8C7E74] mt-1">
                  <span>Tổng số: <strong>{item.total}</strong></span>
                  <span>•</span>
                  <span className="text-[#2E7D32] font-semibold">Sẵn có: {item.available}</span>
                  <span>•</span>
                  <span className="text-[#C62828] font-semibold">Đang mượn: {item.borrowed}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-[#8C7E74]">Tiền cọc mượn:</div>
                <div className="text-xs font-bold text-[#8D5B4C]">{item.deposit}</div>
                <button
                  onClick={() => showToast(`Đã ghi nhận mượn ${item.name}`)}
                  className="mt-1 px-2.5 py-1 text-[11px] bg-white border border-[#8D5B4C] text-[#8D5B4C] rounded-lg hover:bg-[#8D5B4C] hover:text-white transition-colors"
                >
                  Ghi mượn
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#EFE8DE] flex justify-end">
          <button
            onClick={() => setIsAccessoriesModalOpen(false)}
            className="px-5 py-2 bg-[#8D5B4C] text-white rounded-xl text-xs font-semibold hover:bg-[#744537] transition-colors"
          >
            Đóng kho phụ kiện
          </button>
        </div>
      </div>
    </div>
  );
}
