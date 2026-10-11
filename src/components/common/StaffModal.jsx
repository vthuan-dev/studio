import React from 'react';
import { X, UserCheck, Calendar, Phone, Award, User } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { STAFFS } from '../../data/mockData';

export default function StaffModal() {
  const { 
    isStaffModalOpen, 
    setIsStaffModalOpen, 
    customers, 
    setSelectedStaff,
    showToast 
  } = useStudio();

  if (!isStaffModalOpen) return null;

  const staffMembers = STAFFS.filter(s => s.id !== 'all');

  const handleSelectStaff = (staffId, staffName) => {
    setSelectedStaff(staffId);
    setIsStaffModalOpen(false);
    showToast(`Đã lọc danh sách lịch hẹn của ${staffName}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#2C2420]">
                Đội Ngũ Nhân Viên MEYZI STUDIO
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Phân công lịch làm, Makeup Artist & Hair Stylist
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStaffModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {staffMembers.map(staff => {
            const count = customers.filter(
              c => c.staffMakeup?.includes(staff.name) || c.staffHair?.includes(staff.name)
            ).length;

            return (
              <div 
                key={staff.id} 
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between hover:border-[#8D5B4C]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] border border-[#E5DCD0] flex items-center justify-center text-[#8D5B4C] flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2C2420]">{staff.name}</h4>
                    <p className="text-[11px] text-[#8D5B4C] font-semibold">{staff.role}</p>
                    <div className="text-[10px] text-[#8C7E74] mt-0.5 flex items-center gap-2">
                      <span>Đang phụ trách: <strong>{count} lịch hẹn</strong></span>
                      <span>•</span>
                      <span className="text-[#2E7D32] font-semibold">Đang sẵn sàng</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectStaff(staff.id, staff.name)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#8D5B4C] text-[#8D5B4C] hover:bg-[#8D5B4C] hover:text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Xem lịch làm
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#EFE8DE] flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedStaff('all');
              setIsStaffModalOpen(false);
              showToast('Đã hiển thị lịch của tất cả nhân viên');
            }}
            className="text-xs text-[#8D5B4C] hover:underline font-semibold"
          >
            Xem tất cả nhân viên
          </button>
          <button
            onClick={() => setIsStaffModalOpen(false)}
            className="px-4 py-2 bg-[#8D5B4C] text-white rounded-xl text-xs font-semibold hover:bg-[#744537] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
