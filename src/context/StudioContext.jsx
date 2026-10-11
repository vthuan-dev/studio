import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import initialCustomersJson from '../data/customers.json';
import { STAFFS, SERVICE_CATEGORIES } from '../data/mockData';

const StudioContext = createContext();

const STORAGE_KEY = 'meyzi_studio_customers_v1';

export function StudioProvider({ children }) {
  // Customers list with JSON and localStorage persistence
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load localStorage', e);
    }
    return initialCustomersJson;
  });

  // On mount: fetch latest customers from JSON file via local API
  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      })
      .catch(() => {});
  }, []);

  // Save to localStorage AND write directly to JSON file on disk
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      // Persist directly to src/data/customers.json via local Vite API
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customers)
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }, [customers]);


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
  
  // Current calendar month (November 2026 as in mockup)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 1-12
  const [selectedDate, setSelectedDate] = useState('2026-11-05'); // Day highlighted in mockup

  // Selected customer for side panel / detail view (Default: Hồng Nhung - cust-1)
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust-1');

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

  // Toast feedback
  const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });

  // Section highlight pulse animation (UX attention feedback)
  const [highlightedSection, setHighlightedSection] = useState(null); // 'calendar' | 'table'

  const triggerHighlight = (section) => {
    setHighlightedSection(section);
    setTimeout(() => {
      setHighlightedSection(null);
    }, 1800);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
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
    setCurrentYear(2026);
    setCurrentMonth(11);
    setSelectedDate('2026-11-05');
    showToast('Đã quay về hôm nay (05/11/2026)');
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
        const staffObj = STAFFS.find(s => s.id === selectedStaff);
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
  }, [customers, activeSidebarTab, selectedStaff, selectedCategory, searchTerm]);

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
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
        if (remaining.length > 0) {
          setSelectedCustomerId(remaining[0].id);
        }
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
          setCustomers(parsed);
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
    if (confirm('Khôi phục dữ liệu gốc mẫu từ file JSON?')) {
      setCustomers(initialCustomersJson);
      setSelectedCustomerId('cust-1');
      setCurrentYear(2026);
      setCurrentMonth(11);
      setSelectedDate('2026-11-05');
      showToast('Đã đặt lại dữ liệu mẫu gốc!');
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
        resetData
      }}
    >
      {children}
    </StudioContext.Provider>
  );

}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
