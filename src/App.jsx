import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import Sidebar from './components/desktop/Sidebar';
import TopHeader from './components/desktop/TopHeader';
import CalendarGrid from './components/desktop/CalendarGrid';
import CustomerDetailDrawer from './components/desktop/CustomerDetailDrawer';
import CustomerTable from './components/desktop/CustomerTable';
import MobileAppSimulator from './components/mobile/MobileAppSimulator';
import MobileMonthView from './components/mobile/MobileMonthView';
import MobileDayTimeView from './components/mobile/MobileDayTimeView';
import MobileAddCustomer from './components/mobile/MobileAddCustomer';
import MobileDetailView from './components/mobile/MobileDetailView';
import MobileListView from './components/mobile/MobileListView';
import CustomerModal from './components/forms/CustomerModal';
import PaymentModal from './components/forms/PaymentModal';
import RevenueStatsModal from './components/desktop/RevenueStatsModal';
import NotificationModal from './components/common/NotificationModal';
import ExportBackupModal from './components/common/ExportBackupModal';
import InvoiceModal from './components/common/InvoiceModal';
import StaffModal from './components/common/StaffModal';
import ServicesModal from './components/common/ServicesModal';
import AccessoriesModal from './components/common/AccessoriesModal';
import Toast from './components/common/Toast';

// Native edge-to-edge mobile app for real phones and mobile viewports (< 1024px)
function NativeMobileApp() {
  const { mobileScreen } = useStudio();

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] flex flex-col">
      {mobileScreen === 'calendar' && <MobileMonthView />}
      {mobileScreen === 'hourly' && <MobileDayTimeView />}
      {mobileScreen === 'add' && <MobileAddCustomer />}
      {mobileScreen === 'detail' && <MobileDetailView />}
      {mobileScreen === 'list' && <MobileListView />}
    </div>
  );
}

function StudioApp() {
  const { viewMode, isMobileScreen, toast, showToast } = useStudio();

  return (
    <>
      {viewMode === 'mobile' ? (
        isMobileScreen ? (
          <NativeMobileApp />
        ) : (
          <MobileAppSimulator />
        )
      ) : (
        /* Desktop Web Dashboard (matching Image 2) */
        <div className="min-h-screen flex bg-[#FAF7F2] text-[#2C2420]">
          {/* Left Sidebar matching Image 2 */}
          <Sidebar />

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
            {/* Top Header */}
            <TopHeader />

            {/* Content Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Center Calendar and Table */}
              <main className="flex-1 p-6 overflow-y-auto max-w-[1600px]">
                {/* Calendar View */}
                <CalendarGrid />

                {/* Bottom Customer Table */}
                <CustomerTable />
              </main>

              {/* Right Customer Detail Panel matching Image 2 */}
              <CustomerDetailDrawer />
            </div>
          </div>
        </div>
      )}

      {/* Global Modals (Phase 1, 2, 3, 4) */}
      <CustomerModal />
      <PaymentModal />
      <RevenueStatsModal />
      <NotificationModal />
      <ExportBackupModal />
      <InvoiceModal />
      <StaffModal />
      <ServicesModal />
      <AccessoriesModal />
      <Toast toast={toast} onClose={() => showToast('', 'info')} />
    </>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioApp />
    </StudioProvider>
  );
}
