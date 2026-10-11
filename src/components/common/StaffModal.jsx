import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Phone, 
  Check, 
  User, 
  Sparkles,
  Scissors,
  Palette,
  Briefcase
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function StaffModal() {
  const { 
    isStaffModalOpen, 
    setIsStaffModalOpen, 
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    customers, 
    setSelectedStaff,
    showToast 
  } = useStudio();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Makeup Artist',
    specialty: 'makeup',
    phone: '',
    note: ''
  });

  if (!isStaffModalOpen) return null;

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: 'Makeup Artist',
      specialty: 'makeup',
      phone: '',
      note: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingId(staff.id);
    setFormData({
      name: staff.name,
      role: staff.role || 'Makeup Artist',
      specialty: staff.specialty || 'makeup',
      phone: staff.phone || '',
      note: staff.note || ''
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập họ tên nhân viên!');
      return;
    }

    if (editingId) {
      updateStaff(editingId, formData);
    } else {
      addStaff(formData);
    }

    handleCloseForm();
  };

  const handleSelectStaff = (staffId, staffName) => {
    setSelectedStaff(staffId);
    setIsStaffModalOpen(false);
    showToast(`Đã lọc danh sách lịch hẹn của thợ: ${staffName}`);
  };

  const getSpecialtyBadge = (specialty) => {
    switch (specialty) {
      case 'makeup':
        return {
          icon: Palette,
          text: 'Chuyên Makeup',
          color: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'hair':
        return {
          icon: Scissors,
          text: 'Chuyên Làm tóc',
          color: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'both':
      default:
        return {
          icon: Sparkles,
          text: 'Makeup & Làm tóc',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#2C2420]">
                Đội Ngũ Nhân Viên MEYZI STUDIO
              </h3>
              <p className="text-[11px] text-[#8C7E74]">
                Quản lý, phân công thợ Makeup Artist & Hair Stylist ({staffList.length} nhân sự)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8D5B4C] hover:bg-[#744537] text-white font-semibold shadow-xs transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Thêm thợ mới</span>
              </button>
            )}
            <button
              onClick={() => setIsStaffModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Add / Edit Form */}
          {isFormOpen && (
            <form 
              onSubmit={handleSubmit}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#8D5B4C]/40 space-y-3 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DE]">
                <h4 className="font-bold text-xs text-[#8D5B4C] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-[11px] text-[#8C7E74] hover:text-[#2C2420]"
                >
                  Đóng form
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Tuyết Mai, Lan Hương..."
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="VD: 0987 654 321"
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                    Chuyên môn chính
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => {
                      const spec = e.target.value;
                      let defaultRole = formData.role;
                      if (spec === 'makeup') defaultRole = 'Makeup Artist';
                      else if (spec === 'hair') defaultRole = 'Làm tóc (Hair Stylist)';
                      else defaultRole = 'Makeup & Làm tóc';

                      setFormData({ 
                        ...formData, 
                        specialty: spec,
                        role: defaultRole
                      });
                    }}
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                  >
                    <option value="makeup">Chuyên Makeup (Trang điểm)</option>
                    <option value="hair">Chuyên Làm tóc (Hair Stylist)</option>
                    <option value="both">Cả hai (Makeup & Làm tóc)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                    Chức danh / Vai trò hiển thị
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="VD: Makeup Artist, Hair Stylist..."
                    className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6C5F57] mb-1">
                  Ghi chú kinh nghiệm / phong cách
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="VD: Phong cách nhẹ nhàng Hàn Quốc, kinh nghiệm 5 năm..."
                  className="w-full bg-white border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-3 py-2 rounded-xl border border-[#EFE8DE] bg-white text-[#6C5F57] hover:bg-[#F2ECE1] font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8D5B4C] hover:bg-[#744537] text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Cập nhật thay đổi' : 'Lưu nhân viên'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Staff Members List */}
          <div className="space-y-3">
            {staffList.length > 0 ? (
              staffList.map((staff) => {
                const badge = getSpecialtyBadge(staff.specialty);
                const BadgeIcon = badge.icon;
                
                // Count appointments assigned to this staff
                const count = customers.filter(
                  c => c.staffMakeup?.includes(staff.name) || c.staffHair?.includes(staff.name)
                ).length;

                return (
                  <div 
                    key={staff.id} 
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#8D5B4C]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#F5EFE6] border border-[#E5DCD0] flex items-center justify-center text-[#8D5B4C] flex-shrink-0 font-bold text-xs mt-0.5">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#2C2420]">{staff.name}</h4>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.text}</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8D5B4C] font-semibold mt-0.5">{staff.role}</p>
                        
                        <div className="text-[10px] text-[#8C7E74] mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          {staff.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#8D5B4C]" />
                              <span>{staff.phone}</span>
                            </span>
                          )}
                          <span>•</span>
                          <span>Đang phụ trách: <strong className="text-[#2C2420]">{count} lịch hẹn</strong></span>
                          {staff.note && (
                            <>
                              <span>•</span>
                              <span className="text-[#6C5F57] italic">{staff.note}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleSelectStaff(staff.id, staff.name)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-[#8D5B4C] text-[#8D5B4C] hover:bg-[#8D5B4C] hover:text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        title="Lọc lịch hẹn của nhân viên này trên lịch"
                      >
                        Xem lịch
                      </button>

                      <button
                        onClick={() => handleOpenEdit(staff)}
                        className="p-1.5 rounded-xl bg-white border border-[#EFE8DE] text-[#6C5F57] hover:text-[#8D5B4C] hover:border-[#8D5B4C] transition-colors"
                        title="Chỉnh sửa thông tin nhân viên"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteStaff(staff.id)}
                        className="p-1.5 rounded-xl bg-white border border-[#EFE8DE] text-[#C62828] hover:bg-[#FFEBEE] hover:border-[#FFCDD2] transition-colors"
                        title="Xóa nhân viên"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#EFE8DE] space-y-2">
                <p className="text-xs text-[#8C7E74]">Chưa có nhân viên nào trong danh sách.</p>
                <button
                  onClick={handleOpenAdd}
                  className="px-3.5 py-1.5 rounded-xl bg-[#8D5B4C] text-white text-xs font-semibold"
                >
                  + Thêm nhân viên đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#EFE8DE] flex justify-between items-center flex-shrink-0">
          <button
            onClick={() => {
              setSelectedStaff('all');
              setIsStaffModalOpen(false);
              showToast('Đã hiển thị lịch của tất cả nhân viên');
            }}
            className="text-xs text-[#8D5B4C] hover:underline font-semibold"
          >
            Xem tất cả nhân viên trên lịch
          </button>
          
          <button
            onClick={() => setIsStaffModalOpen(false)}
            className="px-4 py-2 bg-[#8D5B4C] text-white rounded-xl text-xs font-semibold hover:bg-[#744537] transition-colors shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
