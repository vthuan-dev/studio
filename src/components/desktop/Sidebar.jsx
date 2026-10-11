import React from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Settings, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import BrandLogo from '../common/BrandLogo';

export default function Sidebar() {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    triggerHighlight,
    stats,
    resetData, 
    setIsStatsModalOpen,
    setIsExportModalOpen,
    setIsStaffModalOpen,
    staffList,
    showToast
  } = useStudio();

  // Optimized essential items specifically tailored for single-page dashboard
  const navItems = [
    { 
      id: 'lich-khach', 
      label: 'Lịch hẹn khách', 
      icon: Calendar,
      section: 'calendar',
      type: 'scroll'
    },
    { 
      id: 'danh-sach', 
      label: 'Danh sách khách', 
      icon: Users,
      section: 'table',
      badge: stats.totalCustomers,
      type: 'scroll'
    },
    { 
      id: 'da-coc', 
      label: 'Khách đã cọc', 
      icon: CheckCircle,
      section: 'table',
      badge: stats.countDeposited,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      type: 'scroll'
    },
    { 
      id: 'chua-coc', 
      label: 'Chưa cọc & Nợ', 
      icon: AlertCircle,
      section: 'table',
      badge: stats.countUnpaid,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
      type: 'scroll'
    },
    { 
      id: 'nhan-su', 
      label: 'Đội ngũ nhân sự', 
      icon: UserCheck,
      badge: staffList?.length || 0,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      type: 'modal'
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

  const handleTabClick = (item) => {
    setActiveSidebarTab(item.id);

    if (item.type === 'scroll') {
      if (item.section === 'calendar') {
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        const calEl = document.getElementById('calendar-section');
        if (calEl) calEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        triggerHighlight('calendar');
        showToast('Đã cuộn đến Lịch hẹn');
      } else if (item.section === 'table') {
        const tableEl = document.getElementById('customer-table-section');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        triggerHighlight('table');
        if (item.id === 'da-coc') {
          showToast(`Đang lọc: ${stats.countDeposited} khách đã cọc`);
        } else if (item.id === 'chua-coc') {
          showToast(`Đang lọc: ${stats.countUnpaid} khách chưa cọc / nợ`);
        } else {
          showToast('Đã cuộn đến Danh sách khách hàng');
        }
      }
    } else if (item.id === 'nhan-su') {
      setIsStaffModalOpen(true);
    } else if (item.id === 'doanh-thu') {
      setIsStatsModalOpen(true);
    } else if (item.id === 'cai-dat') {
      setIsExportModalOpen(true);
    }
  };

  return (
    <aside className="w-64 bg-[#FAF7F2] border-r border-[#EFE8DE] flex flex-col flex-shrink-0 h-full overflow-y-auto py-6 px-3.5 select-none">
      {/* Brand Logo */}
      <div className="pb-7 border-b border-[#EFE8DE]/80 flex justify-center">
        <BrandLogo size="lg" layout="vertical" />
      </div>

      {/* Navigation List */}
      <nav className="mt-6 flex-1 space-y-1.5">
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
                onClick={() => handleTabClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-[#8D5B4C] text-white shadow-xs font-semibold'
                    : 'text-[#6C5F57] hover:bg-[#F2ECE1] hover:text-[#2C2420]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
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
      </nav>

      {/* Reset/Clear data button */}
      <div className="pt-4 border-t border-[#EFE8DE] mt-auto">
        <button
          onClick={resetData}
          title="Xóa trắng toàn bộ dữ liệu lịch hẹn để bắt đầu nhập mới"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8] rounded-xl transition-colors border border-[#E5DCD0]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa trắng dữ liệu (Làm mới)</span>
        </button>
      </div>
    </aside>
  );
}
