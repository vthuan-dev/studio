import React, { useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import initialCustomersJson from '../data/customers.json';
import initialStaffJson from '../data/staff.json';
import { STAFFS, SERVICE_CATEGORIES } from '../data/mockData';
import { StudioContext, defaultStudioContext } from './studioContextInstance';
import { fetchCloudData, saveCloudData } from '../utils/cloudSync';

const STORAGE_KEY = 'meyzi_studio_customers_v3';
const STAFF_STORAGE_KEY = 'meyzi_studio_staff_v1';
const UPDATED_AT_KEY = 'meyzi_studio_updated_at';

export function StudioProvider({ children }) {
  // Toast feedback state (available globally within provider)
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  // Multi-device Cloud Sync State
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const localUpdatedAtRef = useRef(Number(localStorage.getItem(UPDATED_AT_KEY) || 0));
  const isApplyingCloudUpdateRef = useRef(false);
  const hasMountedRef = useRef(false);

  // Staff list with JSON and localStorage persistence (CRUD enabled)
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STAFF_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load staff from localStorage', e);
    }
    return Array.isArray(initialStaffJson) && initialStaffJson.length > 0
      ? initialStaffJson
      : STAFFS.filter(s => s.id !== 'all');
  });

  // Customers list with JSON and localStorage persistence
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load localStorage', e);
    }
    return Array.isArray(initialCustomersJson) ? initialCustomersJson : [];
  });

  // User Profile with localStorage persistence
  const PROFILE_STORAGE_KEY = 'meyzi_studio_profile_v1';
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Tuyết Mai',
      role: 'Chủ Studio / Makeup Artist',
      branch: 'Chi nhánh Hà Nội'
    };
  });

  // Function to pull latest data from Cloud Storage
  const performCloudFetch = useCallback(async (isManual = false) => {
    if (isManual) setSyncStatus('syncing');
    try {
      const res = await fetchCloudData();
      if (res.success && res.data) {
        const cloudTime = res.data.updatedAt || 0;
        const localTime = localUpdatedAtRef.current;
        const cloudCustomers = Array.isArray(res.data.customers) ? res.data.customers : [];
        const cloudStaff = Array.isArray(res.data.staffList) && res.data.staffList.length > 0 ? res.data.staffList : null;
        const cloudProfile = res.data.userProfile || null;

        // Condition 1: Cloud is newer OR local is empty but cloud has data
        if (cloudTime > localTime || (customers.length === 0 && cloudCustomers.length > 0)) {
          isApplyingCloudUpdateRef.current = true;
          setCustomers(cloudCustomers);
          if (cloudStaff) setStaffList(cloudStaff);
          if (cloudProfile) setUserProfile(cloudProfile);
          localUpdatedAtRef.current = cloudTime;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudCustomers));
          if (cloudStaff) localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(cloudStaff));
          if (cloudProfile) localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(cloudProfile));
          localStorage.setItem(UPDATED_AT_KEY, String(cloudTime));
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          if (isManual) {
            showToast(`Đã đồng bộ thành công ${cloudCustomers.length} lịch hẹn từ đám mây!`, 'success');
          }
        } 
        // Condition 2: Local is newer than cloud (e.g. offline edits), push local to cloud
        else if (localTime > cloudTime && (customers.length > 0 || localTime > 1)) {
          setSyncStatus('syncing');
          await saveCloudData({ customers, staffList, userProfile, updatedAt: localTime });
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          if (isManual) {
            showToast('Đã tải dữ liệu mới nhất lên đám mây!', 'success');
          }
        } 
        else {
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
          if (isManual) {
            showToast('Dữ liệu đã ở trạng thái mới nhất!', 'info');
          }
        }
      } else {
        if (isManual) {
          setSyncStatus('error');
          showToast('Không thể kết nối máy chủ đám mây. Vui lòng thử lại!', 'warning');
        }
      }
    } catch (err) {
      console.error('[StudioContext] Sync error:', err);
      if (isManual) setSyncStatus('error');
    }
  }, [customers, staffList, userProfile, showToast]);

  // Periodic and Event-Driven Sync
  useEffect(() => {
    // Initial fetch on mount
    performCloudFetch(false);

    // Auto-sync when user returns to tab or window gains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performCloudFetch(false);
      }
    };
    const handleFocus = () => {
      performCloudFetch(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Polling every 15 seconds when user is actively viewing tab
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        performCloudFetch(false);
      }
    }, 15000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [performCloudFetch]);

  // Save to localStorage AND push to Cloud + local Vite API
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (isApplyingCloudUpdateRef.current) {
      isApplyingCloudUpdateRef.current = false;
      return;
    }

    const newTimestamp = Date.now();
    localUpdatedAtRef.current = newTimestamp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    localStorage.setItem(UPDATED_AT_KEY, String(newTimestamp));

    setSyncStatus('syncing');
    const timer = setTimeout(async () => {
      try {
        const res = await saveCloudData({ customers, staffList, userProfile, updatedAt: newTimestamp });
        if (res.success) {
          setSyncStatus('synced');
          setLastSyncedAt(new Date());
        } else {
          setSyncStatus('error');
        }
      } catch {
        setSyncStatus('error');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [customers, staffList, userProfile]);

  const syncNow = useCallback(() => {
    performCloudFetch(true);
  }, [performCloudFetch]);



  // Authentication state (tk: admin, mk: 10102020)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('meyzi_studio_auth_v1') === 'true';
    } catch {
      return false;
    }
  });

  const login = (username, password) => {
    if (username?.trim() === 'admin' && password === '10102020') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('meyzi_studio_auth_v1', 'true');
      } catch (e) {
        console.error('Failed to save auth to localStorage', e);
      }
      showToast('Đăng nhập thành công! Chào mừng Quản trị viên.', 'success');
      return { success: true };
    }
    return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('meyzi_studio_auth_v1');
    } catch (e) {
      console.error('Failed to clear auth from localStorage', e);
    }
    showToast('Đã đăng xuất khỏi hệ thống.', 'info');
  };

  // View settings & responsive detection
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'desktop' | 'mobile'
  const [mobileScreen, setMobileScreen] = useState('calendar'); // 'calendar' | 'hourly' | 'add' | 'detail' | 'list'

  const effectiveViewMode = useMemo(() => {
    if (viewMode === 'desktop') return 'desktop';
    if (viewMode === 'mobile') return 'mobile';
    return isMobileScreen ? 'mobile' : 'desktop';
  }, [viewMode, isMobileScreen]);
  
  // Navigation & filters
  const [activeSidebarTab, setActiveSidebarTab] = useState('lich-khach');
  const [calendarView, setCalendarView] = useState('month'); // 'month' | 'week' | 'day'
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic initialization from real date
  const initialDateObj = useMemo(() => new Date(), []);
  const initialYear = initialDateObj.getFullYear();
  const initialMonth = initialDateObj.getMonth() + 1;
  const initialDayStr = String(initialDateObj.getDate()).padStart(2, '0');
  const initialDateStr = `${initialYear}-${String(initialMonth).padStart(2, '0')}-${initialDayStr}`;

  // Current calendar month & selected date
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth); // 1-12
  const [selectedDate, setSelectedDate] = useState(initialDateStr);

  // Selected customer for side panel / detail view
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Modals & Popups
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isAccessoriesModalOpen, setIsAccessoriesModalOpen] = useState(false);

  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    showToast('Đã cập nhật thông tin chủ studio!', 'success');
  };

  // Section highlight pulse animation (UX attention feedback)
  const [highlightedSection, setHighlightedSection] = useState(null); // 'calendar' | 'table'

  const triggerHighlight = (section) => {
    setHighlightedSection(section);
    setTimeout(() => {
      setHighlightedSection(null);
    }, 1800);
  };

  // Smart Navigation helpers for Header and Views
  const navigatePrev = () => {
    if (calendarView === 'month') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(y => y - 1);
      } else {
        setCurrentMonth(m => m - 1);
      }
      showToast(`Đã chuyển sang Tháng ${currentMonth === 1 ? 12 : currentMonth - 1}`);
    } else if (calendarView === 'week') {
      const [y, m, d] = (selectedDate || '2026-11-05').split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() - 7);
      const newY = dt.getFullYear();
      const newM = dt.getMonth() + 1;
      const newD = String(dt.getDate()).padStart(2, '0');
      const newDate = `${newY}-${String(newM).padStart(2, '0')}-${newD}`;
      setSelectedDate(newDate);
      setCurrentYear(newY);
      setCurrentMonth(newM);
      showToast(`Đã lùi 1 tuần (${newD}/${newM}/${newY})`);
    } else if (calendarView === 'day') {
      const [y, m, d] = (selectedDate || '2026-11-05').split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() - 1);
      const newY = dt.getFullYear();
      const newM = dt.getMonth() + 1;
      const newD = String(dt.getDate()).padStart(2, '0');
      const newDate = `${newY}-${String(newM).padStart(2, '0')}-${newD}`;
      setSelectedDate(newDate);
      setCurrentYear(newY);
      setCurrentMonth(newM);
      showToast(`Đã lùi 1 ngày (${newD}/${newM}/${newY})`);
    }
  };

  const navigateNext = () => {
    if (calendarView === 'month') {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(y => y + 1);
      } else {
        setCurrentMonth(m => m + 1);
      }
      showToast(`Đã chuyển sang Tháng ${currentMonth === 12 ? 1 : currentMonth + 1}`);
    } else if (calendarView === 'week') {
      const [y, m, d] = (selectedDate || '2026-11-05').split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + 7);
      const newY = dt.getFullYear();
      const newM = dt.getMonth() + 1;
      const newD = String(dt.getDate()).padStart(2, '0');
      const newDate = `${newY}-${String(newM).padStart(2, '0')}-${newD}`;
      setSelectedDate(newDate);
      setCurrentYear(newY);
      setCurrentMonth(newM);
      showToast(`Đã tiến 1 tuần (${newD}/${newM}/${newY})`);
    } else if (calendarView === 'day') {
      const [y, m, d] = (selectedDate || '2026-11-05').split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + 1);
      const newY = dt.getFullYear();
      const newM = dt.getMonth() + 1;
      const newD = String(dt.getDate()).padStart(2, '0');
      const newDate = `${newY}-${String(newM).padStart(2, '0')}-${newD}`;
      setSelectedDate(newDate);
      setCurrentYear(newY);
      setCurrentMonth(newM);
      showToast(`Đã tiến 1 ngày (${newD}/${newM}/${newY})`);
    }
  };

  const navigateToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = String(today.getDate()).padStart(2, '0');
    const dStr = `${y}-${String(m).padStart(2, '0')}-${d}`;
    setCurrentYear(y);
    setCurrentMonth(m);
    setSelectedDate(dStr);
    showToast(`Đã quay về hôm nay (${d}/${String(m).padStart(2, '0')}/${y})`);
  };

  // Selected customer object
  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0] || null;
  }, [customers, selectedCustomerId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenueExpected = customers.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0);
    const totalRevenueCollected = customers.reduce((sum, c) => sum + (Number(c.depositAmount) || 0), 0);
    const totalDebt = customers.reduce((sum, c) => sum + (Number(c.remainingAmount) || 0), 0);

    const countDeposited = customers.filter(c => c.status === 'da-coc').length;
    const countPaid = customers.filter(c => c.status === 'da-thanh-toan').length;
    const countUnpaid = customers.filter(c => c.status === 'chua-coc').length;

    // Category counts
    const categoryCounts = {
      'all': customers.length,
      'co-dau': customers.filter(c => c.category === 'co-dau').length,
      'an-hoi': customers.filter(c => c.category === 'an-hoi').length,
      'tiec': customers.filter(c => c.category === 'tiec').length,
      'chup-anh': customers.filter(c => c.category === 'chup-anh').length,
    };

    return {
      totalCustomers,
      totalRevenueExpected,
      totalRevenueCollected,
      totalDebt,
      countDeposited,
      countPaid,
      countUnpaid,
      categoryCounts
    };
  }, [customers]);

  // Filtered customers for the Table & Calendar
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Sidebar filter
      if (activeSidebarTab === 'da-coc' && customer.status !== 'da-coc') return false;
      if (activeSidebarTab === 'chua-coc' && customer.status !== 'chua-coc') return false;

      // Staff filter
      if (selectedStaff !== 'all') {
        const staffObj = staffList.find(s => s.id === selectedStaff);
        if (staffObj && !customer.staffMakeup?.includes(staffObj.name) && !customer.staffHair?.includes(staffObj.name)) {
          return false;
        }
      }

      // Category tab filter
      if (selectedCategory !== 'all' && customer.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = customer.name?.toLowerCase().includes(term);
        const matchesPhone = customer.phone?.includes(term);
        const matchesNote = customer.note?.toLowerCase().includes(term);
        const matchesCategory = customer.categoryName?.toLowerCase().includes(term);
        if (!matchesName && !matchesPhone && !matchesNote && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [customers, activeSidebarTab, selectedStaff, selectedCategory, searchTerm, staffList]);

  // Actions
  const addCustomer = (customerData) => {
    const totalAmount = Number(customerData.totalAmount) || 0;
    const depositAmount = Number(customerData.depositAmount) || 0;
    const remainingAmount = Math.max(0, totalAmount - depositAmount);

    let status = 'chua-coc';
    let statusText = 'Chưa cọc';
    if (depositAmount >= totalAmount && totalAmount > 0) {
      status = 'da-thanh-toan';
      statusText = 'Đã thanh toán';
    } else if (depositAmount > 0) {
      status = 'da-coc';
      statusText = 'Đã cọc';
    }

    const newCustomer = {
      ...customerData,
      id: 'cust-' + Date.now(),
      stt: customers.length + 1,
      totalAmount,
      depositAmount,
      remainingAmount,
      status,
      statusText,
      paymentHistory: depositAmount > 0 ? [
        {
          date: new Date().toLocaleDateString('vi-VN'),
          amount: depositAmount,
          type: 'Đặt cọc'
        }
      ] : []
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setSelectedCustomerId(newCustomer.id);
  };

  const updateCustomer = (id, customerData) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const totalAmount = Number(customerData.totalAmount) || c.totalAmount;
        const depositAmount = Number(customerData.depositAmount) || c.depositAmount;
        const remainingAmount = Math.max(0, totalAmount - depositAmount);

        let status = 'chua-coc';
        let statusText = 'Chưa cọc';
        if (depositAmount >= totalAmount && totalAmount > 0) {
          status = 'da-thanh-toan';
          statusText = 'Đã thanh toán';
        } else if (depositAmount > 0) {
          status = 'da-coc';
          statusText = 'Đã cọc';
        }

        return {
          ...c,
          ...customerData,
          totalAmount,
          depositAmount,
          remainingAmount,
          status,
          statusText
        };
      }
      return c;
    }));
  };

  const deleteCustomer = (id) => {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      if (selectedCustomerId === id) {
        const remaining = customers.filter(c => c.id !== id);
        setSelectedCustomerId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const recordPayment = (id, additionalAmount, note = 'Thu thêm') => {
    const amount = Number(additionalAmount);
    if (!amount || amount <= 0) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newDeposit = c.depositAmount + amount;
        const newRemaining = Math.max(0, c.totalAmount - newDeposit);

        let newStatus = c.status;
        let newStatusText = c.statusText;
        if (newRemaining === 0) {
          newStatus = 'da-thanh-toan';
          newStatusText = 'Đã thanh toán';
        } else if (newDeposit > 0) {
          newStatus = 'da-coc';
          newStatusText = 'Đã cọc';
        }

        const newHistory = [
          ...(c.paymentHistory || []),
          {
            date: new Date().toLocaleDateString('vi-VN'),
            amount: amount,
            type: note
          }
        ];

        return {
          ...c,
          depositAmount: newDeposit,
          remainingAmount: newRemaining,
          status: newStatus,
          statusText: newStatusText,
          paymentHistory: newHistory
        };
      }
      return c;
    }));
    showToast(`Đã thu thêm ${amount.toLocaleString('vi-VN')}đ thành công!`);
  };

  const settleFullPayment = (id) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const remaining = c.remainingAmount;
        if (remaining <= 0) return c;

        const newHistory = [
          ...(c.paymentHistory || []),
          {
            date: new Date().toLocaleDateString('vi-VN'),
            amount: remaining,
            type: 'Thanh toán đủ'
          }
        ];

        return {
          ...c,
          depositAmount: c.totalAmount,
          remainingAmount: 0,
          status: 'da-thanh-toan',
          statusText: 'Đã thanh toán',
          paymentHistory: newHistory
        };
      }
      return c;
    }));
    showToast('Đã tất toán toàn bộ công nợ thành công!');
  };

  // Phase 4: Export to CSV (Excel with UTF-8 BOM)
  const exportToCSV = () => {
    const headers = ['STT', 'Họ tên', 'Số điện thoại', 'Địa chỉ', 'Ngày làm', 'Giờ làm', 'Dịch vụ', 'Thợ Makeup', 'Thợ Tóc', 'Tổng tiền (VNĐ)', 'Đã cọc (VNĐ)', 'Còn lại (VNĐ)', 'Trạng thái', 'Ghi chú'];
    const rows = customers.map((c, i) => [
      i + 1,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.address || ''}"`,
      `"${c.date}"`,
      `"${c.time}"`,
      `"${c.services?.join(', ') || ''}"`,
      `"${c.staffMakeup || ''}"`,
      `"${c.staffHair || ''}"`,
      c.totalAmount || 0,
      c.depositAmount || 0,
      c.remainingAmount || 0,
      `"${c.statusText}"`,
      `"${c.note ? c.note.replace(/"/g, '""') : ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MEYZI_STUDIO_Bao_Cao_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file báo cáo Excel (CSV) thành công!');
  };

  // Phase 4: Backup to JSON
  const exportBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `MEYZI_STUDIO_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showToast('Đã tải bản sao lưu (JSON) thành công!');
  };

  // Phase 4: Import / Restore from JSON
  const importBackupJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          isApplyingCloudUpdateRef.current = false;
          setCustomers(parsed);
          const newTimestamp = Date.now();
          localUpdatedAtRef.current = newTimestamp;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          localStorage.setItem(UPDATED_AT_KEY, String(newTimestamp));
          saveCloudData({ customers: parsed, staffList, userProfile, updatedAt: newTimestamp }).catch(() => {});
          showToast(`Đã đồng bộ thành công ${parsed.length} khách hàng!`);
          setIsExportModalOpen(false);
        } else {
          alert('File sao lưu không đúng định dạng!');
        }
      } catch (err) {
        alert('Không thể đọc file JSON!');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa trắng toàn bộ dữ liệu lịch hẹn để bắt đầu nhập mới?')) {
      isApplyingCloudUpdateRef.current = false;
      setCustomers([]);
      setSelectedCustomerId(null);
      const newTimestamp = Date.now();
      localUpdatedAtRef.current = newTimestamp;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(UPDATED_AT_KEY, String(newTimestamp));
      } catch (e) {}
      saveCloudData({ customers: [], staffList, userProfile, updatedAt: newTimestamp }).catch(() => {});
      showToast('Đã xóa trắng toàn bộ dữ liệu. Bạn có thể bắt đầu tạo lịch mới!', 'info');
    }
  };

  // Staff CRUD Operations
  const allStaffWithAll = useMemo(() => [
    { id: 'all', name: 'Tất cả nhân viên', role: 'all' },
    ...staffList
  ], [staffList]);

  const addStaff = (staffData) => {
    const newStaff = {
      id: 'staff-' + Date.now(),
      name: staffData.name.trim(),
      role: staffData.role?.trim() || 'Makeup Artist',
      specialty: staffData.specialty || 'makeup',
      phone: staffData.phone?.trim() || '',
      note: staffData.note?.trim() || '',
      active: true
    };
    setStaffList(prev => [...prev, newStaff]);
    showToast(`Đã thêm nhân viên "${newStaff.name}" thành công!`);
    return newStaff;
  };

  const updateStaff = (id, staffData) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...staffData,
          name: staffData.name ? staffData.name.trim() : s.name,
          role: staffData.role ? staffData.role.trim() : s.role,
        };
      }
      return s;
    }));
    showToast(`Đã cập nhật thông tin nhân viên "${staffData.name || ''}"!`);
  };

  const deleteStaff = (id) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên "${target.name}"?`)) {
      setStaffList(prev => prev.filter(s => s.id !== id));
      if (selectedStaff === id) {
        setSelectedStaff('all');
      }
      showToast(`Đã xóa nhân viên "${target.name}" thành công!`);
    }
  };

  const openAddModal = (prefill = null) => {
    setEditingCustomer(prefill ? { ...prefill, _isNew: true } : null);
    setIsCustomerModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  return (
    <StudioContext.Provider
      value={{
        customers,
        filteredCustomers,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedCustomer,
        currentYear,
        setCurrentYear,
        currentMonth,
        setCurrentMonth,
        selectedDate,
        setSelectedDate,
        calendarView,
        setCalendarView,
        selectedStaff,
        setSelectedStaff,
        selectedCategory,
        setSelectedCategory,
        activeSidebarTab,
        setActiveSidebarTab,
        searchTerm,
        setSearchTerm,
        viewMode: effectiveViewMode,
        rawViewMode: viewMode,
        setViewMode,
        isMobileScreen,
        mobileScreen,
        setMobileScreen,
        stats,
        toast,
        showToast,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        editingCustomer,
        openAddModal,
        openEditModal,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isStatsModalOpen,
        setIsStatsModalOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        isStaffModalOpen,
        setIsStaffModalOpen,
        isServicesModalOpen,
        setIsServicesModalOpen,
        isAccessoriesModalOpen,
        setIsAccessoriesModalOpen,
        navigatePrev,
        navigateNext,
        navigateToday,
        highlightedSection,
        triggerHighlight,
        exportToCSV,
        exportBackupJSON,
        importBackupJSON,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        recordPayment,
        settleFullPayment,
        resetData,
        userProfile,
        updateUserProfile,
        staffList,
        allStaffWithAll,
        addStaff,
        updateStaff,
        deleteStaff,
        isAuthenticated,
        login,
        logout,
        syncStatus,
        lastSyncedAt,
        syncNow
      }}
    >
      {children}
    </StudioContext.Provider>
  );

}

export function useStudio() {
  const context = useContext(StudioContext);
  return context || defaultStudioContext;
}
