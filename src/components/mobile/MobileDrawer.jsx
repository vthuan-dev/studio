import React from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Settings, 
  RotateCcw,
  Monitor,
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Bell,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    resetData, 
    setIsStatsModalOpen, 
    setMobileScreen,
    setViewMode,
    setIsNotificationOpen,
    setIsExportModalOpen,
    setIsInvoiceModalOpen
  } = useStudio();

  if (!isOpen) return null;

  const handleTabClick = (tabId, screen) => {
    setActiveSidebarTab(tabId);
    if (tabId === 'doanh-thu' || tabId === 'tong-quan') {
      setIsStatsModalOpen(true);
    } else if (screen) {
      setMobileScreen(screen);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Content */}
      <div className="relative w-72 max-w-[80%] bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-5 z-10 text-[#2C2420]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EFE8DE]">
          <div className="text-left">
            <h2 className="font-brand text-xl font-bold tracking-[0.15em] text-[#2C2420]">
              MEYZI
            </h2>
            <p className="text-[9px] tracking-[0.2em] text-[#8D5B4C] uppercase font-semibold">
              STUDIO MAKEUP & HAIR
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C7E74]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto text-xs">
          <button
            onClick={() => handleTabClick('lich-khach', 'calendar')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <Calendar className="w-4 h-4 text-[#8D5B4C]" />
            <span>Lịch khách</span>
          </button>

          <button
            onClick={() => handleTabClick('lich-gio', 'hourly')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <Calendar className="w-4 h-4 text-[#8D5B4C]" />
            <span>Lịch theo giờ (05/11)</span>
          </button>

          <button
            onClick={() => handleTabClick('danh-sach', 'list')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <Users className="w-4 h-4 text-[#8D5B4C]" />
            <span>Danh sách khách hàng</span>
          </button>

          <button
            onClick={() => handleTabClick('da-coc', 'list')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
            <span>Khách đã cọc</span>
          </button>

          <button
            onClick={() => handleTabClick('chua-coc', 'list')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <AlertCircle className="w-4 h-4 text-[#C62828]" />
            <span>Khách chưa cọc</span>
          </button>

          <button
            onClick={() => handleTabClick('doanh-thu', null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <TrendingUp className="w-4 h-4 text-[#8D5B4C]" />
            <span>Báo cáo doanh thu</span>
          </button>

          <button
            onClick={() => {
              setIsNotificationOpen(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <Bell className="w-4 h-4 text-[#C62828]" />
            <span>Nhắc lịch & Thông báo (3)</span>
          </button>

          <button
            onClick={() => {
              setIsExportModalOpen(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2E7D32]" />
            <span>Xuất Excel & Sao lưu dữ liệu</span>
          </button>

          <button
            onClick={() => {
              setIsInvoiceModalOpen(true);
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[#2C2420] hover:bg-[#F2ECE1]"
          >
            <FileText className="w-4 h-4 text-[#1565C0]" />
            <span>In Phiếu Thu / Hóa đơn</span>
          </button>

          <div className="pt-2 border-t border-[#EFE8DE]" />

          <button
            onClick={() => {
              setViewMode('desktop');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8]"
          >
            <Monitor className="w-4 h-4" />
            <span>Xem giao diện Desktop</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFE8DE] space-y-2">
          <button
            onClick={() => {
              resetData();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#8D5B4C] bg-[#F5EFE6] rounded-xl border border-[#E5DCD0]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại dữ liệu mẫu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
