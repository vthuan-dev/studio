import React from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  ShoppingBag, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  LayoutDashboard,
  RotateCcw
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import BrandLogo from '../common/BrandLogo';

export default function Sidebar() {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab, 
    resetData, 
    setIsStatsModalOpen,
    setIsNotificationOpen,
    setIsExportModalOpen,
    setIsStaffModalOpen,
    setIsServicesModalOpen,
    setIsAccessoriesModalOpen,
    showToast
  } = useStudio();

  const navItems = [
    { id: 'tong-quan', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'lich-khach', label: 'Lịch khách', icon: Calendar },
    { id: 'danh-sach', label: 'Danh sách khách', icon: Users },
    { id: 'da-coc', label: 'Khách đã cọc', icon: CheckCircle },
    { id: 'chua-coc', label: 'Khách chưa cọc', icon: AlertCircle },
    { id: 'nhan-vien', label: 'Nhân viên', icon: UserCheck },
    { id: 'dich-vu', label: 'Dịch vụ & Bảng giá', icon: Sparkles },
    { id: 'kho-phu-kien', label: 'Kho phụ kiện', icon: ShoppingBag },
    { id: 'doanh-thu', label: 'Doanh thu', icon: TrendingUp },
    { id: 'tin-nhan', label: 'Tin nhắn khách hàng', icon: MessageSquare },
    { id: 'cai-dat', label: 'Cài đặt & Sao lưu', icon: Settings },
  ];

  const handleTabClick = (id) => {
    setActiveSidebarTab(id);

    if (id === 'doanh-thu' || id === 'tong-quan') {
      setIsStatsModalOpen(true);
    } else if (id === 'tin-nhan') {
      setIsNotificationOpen(true);
    } else if (id === 'cai-dat') {
      setIsExportModalOpen(true);
    } else if (id === 'nhan-vien') {
      setIsStaffModalOpen(true);
    } else if (id === 'dich-vu') {
      setIsServicesModalOpen(true);
    } else if (id === 'kho-phu-kien') {
      setIsAccessoriesModalOpen(true);
    } else if (id === 'lich-khach') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đã chuyển sang xem Lịch hẹn');
    } else if (id === 'danh-sach') {
      const el = document.querySelector('table');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      showToast('Đã cuộn đến Danh sách khách hàng');
    } else if (id === 'da-coc') {
      showToast('Đang lọc danh sách: Khách đã cọc');
    } else if (id === 'chua-coc') {
      showToast('Đang lọc danh sách: Khách chưa cọc');
    }
  };


  return (
    <aside className="w-64 bg-[#FAF7F2] border-r border-[#EFE8DE] flex flex-col flex-shrink-0 min-h-screen py-6 px-4">
      {/* Brand Logo matching Image 2 */}
      <div className="pb-7 border-b border-[#EFE8DE]/80 flex justify-center">
        <BrandLogo size="lg" layout="vertical" />
      </div>

      {/* Navigation List */}
      <nav className="mt-6 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#8D5B4C] text-white shadow-sm font-semibold'
                  : 'text-[#6C5F57] hover:bg-[#F2ECE1] hover:text-[#2C2420]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8D5B4C]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Reset mock data button */}
      <div className="pt-4 border-t border-[#EFE8DE] mt-auto">
        <button
          onClick={resetData}
          title="Khôi phục lại dữ liệu gốc như trên ảnh mẫu"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#8D5B4C] bg-[#F5EFE6] hover:bg-[#EFE5D8] rounded-lg transition-colors border border-[#E5DCD0]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại dữ liệu mẫu</span>
        </button>
      </div>
    </aside>
  );
}
