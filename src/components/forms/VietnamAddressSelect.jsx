import React, { useState, useEffect } from 'react';
import { MapPin, Check, RefreshCw, ChevronDown } from 'lucide-react';

// Fallback baseline for 34 provinces/cities after administrative merger (V2)
const INITIAL_PROVINCES = [
  { code: 1, name: "Thành phố Hà Nội" },
  { code: 4, name: "Tỉnh Cao Bằng" },
  { code: 8, name: "Tỉnh Tuyên Quang" },
  { code: 11, name: "Tỉnh Điện Biên" },
  { code: 12, name: "Tỉnh Lai Châu" },
  { code: 14, name: "Tỉnh Sơn La" },
  { code: 15, name: "Tỉnh Lào Cai" },
  { code: 19, name: "Tỉnh Thái Nguyên" },
  { code: 20, name: "Tỉnh Lạng Sơn" },
  { code: 22, name: "Thành phố Quảng Ninh" },
  { code: 24, name: "Thành phố Bắc Ninh" },
  { code: 25, name: "Tỉnh Phú Thọ" },
  { code: 31, name: "Thành phố Hải Phòng" },
  { code: 33, name: "Tỉnh Hưng Yên" },
  { code: 37, name: "Tỉnh Ninh Bình" },
  { code: 38, name: "Tỉnh Thanh Hóa" },
  { code: 40, name: "Tỉnh Nghệ An" },
  { code: 42, name: "Tỉnh Hà Tĩnh" },
  { code: 44, name: "Tỉnh Quảng Trị" },
  { code: 46, name: "Thành phố Huế" },
  { code: 48, name: "Thành phố Đà Nẵng" },
  { code: 51, name: "Tỉnh Quảng Ngãi" },
  { code: 52, name: "Tỉnh Gia Lai" },
  { code: 56, name: "Tỉnh Khánh Hòa" },
  { code: 66, name: "Tỉnh Đắk Lắk" },
  { code: 68, name: "Tỉnh Lâm Đồng" },
  { code: 75, name: "Thành phố Đồng Nai" },
  { code: 79, name: "Thành phố Hồ Chí Minh" },
  { code: 80, name: "Tỉnh Tây Ninh" },
  { code: 82, name: "Tỉnh Đồng Tháp" },
  { code: 86, "name": "Tỉnh Vĩnh Long" },
  { code: 91, name: "Tỉnh An Giang" },
  { code: 92, name: "Thành phố Cần Thơ" },
  { code: 96, name: "Tỉnh Cà Mau" }
];

export default function VietnamAddressSelect({ value = '', onChange }) {
  const [provinces, setProvinces] = useState(INITIAL_PROVINCES);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [wards, setWards] = useState([]);
  const [selectedWardName, setSelectedWardName] = useState('');
  const [streetDetail, setStreetDetail] = useState('');
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(true);

  // 1. Fetch 34 provinces from official API v2 (with instant fallback)
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/v2/p/')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProvinces(data);
          setIsApiConnected(true);
        }
      })
      .catch(() => {
        setIsApiConnected(false);
      });
  }, []);

  // 2. Parse initial/current address to match province and ward
  useEffect(() => {
    if (!value) return;

    // Try finding matching province in text
    const lowerVal = value.toLowerCase();
    const foundProvince = provinces.find(p => {
      const shortName = p.name.replace(/^(Thành phố|Tỉnh)\s+/i, '').toLowerCase();
      return lowerVal.includes(shortName) || lowerVal.includes(p.name.toLowerCase());
    });

    if (foundProvince && String(foundProvince.code) !== String(selectedProvinceCode)) {
      setSelectedProvinceCode(String(foundProvince.code));
    }
  }, [value, provinces]);

  // 3. Load wards when province changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setWards([]);
      setSelectedWardName('');
      return;
    }

    setIsLoadingWards(true);
    fetch(`https://provinces.open-api.vn/api/v2/p/${selectedProvinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.wards)) {
          setWards(data.wards);
        } else {
          setWards([]);
        }
      })
      .catch(() => {
        setWards([]);
      })
      .finally(() => {
        setIsLoadingWards(false);
      });
  }, [selectedProvinceCode]);

  // Helper to reassemble full address
  const assembleAddress = (pCode, wName, street) => {
    const provinceObj = provinces.find(p => String(p.code) === String(pCode));
    const parts = [];
    if (street && street.trim()) parts.push(street.trim());
    if (wName && wName.trim()) parts.push(wName.trim());
    if (provinceObj) parts.push(provinceObj.name);
    return parts.join(', ');
  };

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    setSelectedProvinceCode(code);
    setSelectedWardName('');
    const newFull = assembleAddress(code, '', streetDetail);
    if (newFull) onChange(newFull);
  };

  const handleWardChange = (e) => {
    const wardName = e.target.value;
    setSelectedWardName(wardName);
    const newFull = assembleAddress(selectedProvinceCode, wardName, streetDetail);
    if (newFull) onChange(newFull);
  };

  const handleStreetChange = (e) => {
    const text = e.target.value;
    setStreetDetail(text);
    const newFull = assembleAddress(selectedProvinceCode, selectedWardName, text);
    if (newFull) onChange(newFull);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-[#6C5F57]">
          Địa chỉ khách hàng
        </label>
        <div className="flex items-center gap-1.5 text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-semibold border border-[#C8E6C9]" title="Dữ liệu hành chính chuẩn 34 Tỉnh/Thành sau sáp nhập cấp tỉnh và 2 cấp hành chính">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
          <span>API 34 Tỉnh/Thành (Sau sáp nhập)</span>
        </div>
      </div>

      {/* Row 1: Chọn Tỉnh / Thành phố & Phường / Xã */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-[#8C7E74] mb-1 font-medium">
            Tỉnh / Thành phố ({provinces.length} đơn vị mới)
          </label>
          <div className="relative">
            <select
              value={selectedProvinceCode}
              onChange={handleProvinceChange}
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs font-semibold text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 appearance-none pr-8 cursor-pointer"
            >
              <option value="">-- Chọn Tỉnh / Thành phố --</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D5B4C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-[#8C7E74] mb-1 font-medium">
            Phường / Xã / Khu vực {isLoadingWards ? '(Đang tải...)' : ''}
          </label>
          <div className="relative">
            <select
              value={selectedWardName}
              onChange={handleWardChange}
              disabled={!selectedProvinceCode || isLoadingWards}
              className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs font-medium text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 appearance-none pr-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Chọn Phường / Xã --</option>
              {wards.map((w, idx) => (
                <option key={w.code || idx} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D5B4C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Số nhà, ngõ đường / Thôn xóm */}
      <div>
        <label className="block text-[10px] text-[#8C7E74] mb-1 font-medium">
          Số nhà, ngõ/đường, tòa nhà, thôn xóm (tùy chọn)
        </label>
        <input
          type="text"
          value={streetDetail}
          onChange={handleStreetChange}
          placeholder="VD: Số 24 ngõ 18, Thôn Thượng..."
          className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20 font-medium placeholder-[#A3968A]"
        />
      </div>

      {/* Row 3: Chuỗi địa chỉ hoàn chỉnh tự động (có thể xem & sửa trực tiếp) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] text-[#8C7E74] font-medium">
            Địa chỉ đầy đủ hiển thị trên lịch hẹn
          </label>
          <span className="text-[10px] text-[#A3968A]">Tự động cập nhật hoặc gõ chỉnh sửa</span>
        </div>
        <div className="relative">
          <input
            type="text"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="VD: Thường Tín, Thành phố Hà Nội"
            className="w-full bg-[#FAF7F2] border border-[#EFE8DE] rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
          />
          <MapPin className="w-4 h-4 text-[#8D5B4C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
