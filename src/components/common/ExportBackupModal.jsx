import React, { useRef } from 'react';
import { X, FileSpreadsheet, Download, Upload, ShieldCheck, Database, FileText } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function ExportBackupModal() {
  const { 
    isExportModalOpen, 
    setIsExportModalOpen, 
    customers, 
    exportToCSV, 
    exportBackupJSON, 
    importBackupJSON,
    setIsInvoiceModalOpen,
    showToast 
  } = useStudio();

  const fileInputRef = useRef(null);

  if (!isExportModalOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      importBackupJSON(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#EFE8DE] p-6 text-xs text-[#2C2420]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DE]">
          <div>
            <h3 className="text-base font-bold font-serif text-[#2C2420]">
              Sao Lưu & Xuất Báo Cáo Dữ Liệu
            </h3>
            <p className="text-[11px] text-[#8C7E74]">
              MEYZI STUDIO — Đồng bộ dữ liệu & xuất file kế toán
            </p>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7E74]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action cards */}
        <div className="py-5 space-y-3.5">
          {/* Card 1: Xuất Excel CSV */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C2420]">Xuất Danh Sách Excel / CSV</h4>
                <p className="text-[10px] text-[#8C7E74]">
                  Báo cáo khách hàng, công nợ, doanh thu chuẩn UTF-8 tiếng Việt
                </p>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2E7D32] text-white font-semibold text-xs hover:bg-[#1B5E20] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file Excel</span>
            </button>
          </div>

          {/* Card 2: In Hóa Đơn / Phiếu Thu */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C2420]">Phiếu Thu & Hóa Đơn Makeup</h4>
                <p className="text-[10px] text-[#8C7E74]">
                  In hoặc chụp phiếu thu gửi khách để xác nhận cọc rõ ràng
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsExportModalOpen(false);
                setIsInvoiceModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1565C0] text-white font-semibold text-xs hover:bg-[#0D47A1] transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xem Phiếu Thu</span>
            </button>
          </div>

          {/* Card 3: Sao lưu JSON (Đồng bộ đa thiết bị) */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#8D5B4C] flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C2420]">Tải Bản Sao Lưu (Backup JSON)</h4>
                <p className="text-[10px] text-[#8C7E74]">
                  Lưu trữ toàn bộ dữ liệu lịch hẹn & khách để chuyển sang máy khác
                </p>
              </div>
            </div>

            <button
              onClick={exportBackupJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8D5B4C] text-white font-semibold text-xs hover:bg-[#744537] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sao lưu</span>
            </button>
          </div>

          {/* Card 4: Khôi phục dữ liệu */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C2420]">Khôi Phục & Đồng Bộ Dữ Liệu</h4>
                <p className="text-[10px] text-[#8C7E74]">
                  Chọn file backup .json từ điện thoại hoặc máy khác để nạp vào
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#8D5B4C] text-[#8D5B4C] font-semibold text-xs hover:bg-[#F2ECE1] transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nạp file</span>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] flex items-center gap-2.5 text-[11px] text-[#2E7D32]">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>
            Dữ liệu của bạn được tự động lưu trữ trên trình duyệt và không bao giờ bị mất khi tải lại trang!
          </span>
        </div>
      </div>
    </div>
  );
}
