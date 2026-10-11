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
  LogOut
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import BrandLogo from '../common/BrandLogo';

export default function MobileDrawer({ isOpen, onClose }) {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    stats,
    resetData, 
    setIsStatsModalOpen, 
    setIsExportModalOpen,
    setMobileScreen,
    setViewMode,
    showToast,
    logout
  } = useStudio();

  if (!isOpen) return null;

  // Streamlined essential items identical to Desktop Sidebar
  const navItems = [
    { 
      id: 'lich-khach', 
      label: 'Lịch hẹn khách', 
      icon: Calendar,
      screen: 'calendar',
      type: 'screen'
    },
    { 
      id: 'danh-sach', 
      label: 'Danh sách khách', 
      icon: Users,
      screen: 'list',
      badge: stats.totalCustomers,
      type: 'screen'
    },
    { 
      id: 'da-coc', 
      label: 'Khách đã cọc', 
      icon: CheckCircle,
      screen: 'list',
      badge: stats.countDeposited,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      type: 'screen'
    },
    { 
      id: 'chua-coc', 
      label: 'Chưa cọc & Nợ', 
      icon: AlertCircle,
      screen: 'list',
      badge: stats.countUnpaid,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
      type: 'screen'
    },
    { 
      id: 'doanh-thu', 
      label: 'Báo cáo doanh thu', 
      icon: TrendingUp,
      type: 'modal'
    },
    { 
      id: 'cai-dat', 
      label: 'Cài đặt & Sao lưu', 
      icon: Settings,
      type: 'modal'
    },
  ];

  const handleItemClick = (item) => {
    setActiveSidebarTab(item.id);

    if (item.type === 'screen') {
      if (item.screen) {
        setMobileScreen(item.screen);
      }
      if (item.id === 'da-coc') {
        showToast(`Đang lọc: ${stats.countDeposited} khách đã cọc`);
      } else if (item.id === 'chua-coc') {
        showToast(`Đang lọc: ${stats.countUnpaid} khách chưa cọc / nợ`);
      }
    } else if (item.id === 'doanh-thu') {
      setIsStatsModalOpen(true);
    } else if (item.id === 'cai-dat') {
      setIsExportModalOpen(true);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in" 
        onClick={onClose} 
      />

      {/* Drawer Content */}
      <div className="relative w-72 max-w-[85%] bg-[#FAF7F2] h-full shadow-2xl flex flex-col p-5 z-10 text-[#2C2420] animate-fade-in select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#EFE8DE]">
          <BrandLogo size="md" layout="horizontal" />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#8C7E74] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto text-xs">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#A3968A]">
            Điều hướng nhanh
          </div>

          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeSidebarTab === item.id;
            const isModalDivider = idx === 4;

            return (
              <React.Fragment key={item.id}>
                {isModalDivider && (
                  <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-[#A3968A] border-t border-[#EFE8DE]/70 mt-3">
                    Tiện ích hệ thống
                  </div>
                )}
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-[#8D5B4C] text-white shadow-xs font-semibold'
                      : 'text-[#6C5F57] hover:bg-[#F2ECE1] hover:text-[#2C2420]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#8D5B4C]'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span 
                      className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : (item.badgeColor || 'bg-[#EFE8DE] text-[#6C5F57]')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}

          <div className="pt-2 border-t border-[#EFE8DE]/80 mt-3" />

          {/* Switch to Desktop View */}
          <button
            onClick={() => {
              setViewMode('desktop');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8] border border-[#E5DCD0]/70 transition-colors"
          >
            <Monitor className="w-4 h-4 text-[#8D5B4C]" />
            <span>Xem giao diện Desktop</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFE8DE] mt-auto space-y-2">
          <button
            onClick={() => {
              resetData();
              onClose();
            }}
            title="Xóa trắng toàn bộ dữ liệu lịch hẹn để bắt đầu nhập mới"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8] rounded-xl border border-[#E5DCD0] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa trắng dữ liệu (Làm mới)</span>
          </button>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            title="Đăng xuất khỏi tài khoản admin"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#C62828] bg-[#FFEBEE] hover:bg-[#FFCDD2] rounded-xl border border-[#FFCDD2] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất (admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
