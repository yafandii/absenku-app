"use client";

import React, { useState } from "react";
import { User } from "@/domain/entities/user.entity";
import { AppSidebar } from "@/presentation/components/layout/AppSidebar";
import { BrandLogo } from "@/presentation/components/common/BrandLogo";
import { ChangePasswordModal } from "@/presentation/components/common/ChangePasswordModal";
import { ConfirmDialog } from "@/presentation/components/common/ConfirmDialog";
import { MenuIcon, LogoutIcon } from "@/presentation/components/common/icons";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { useRouter } from "next/navigation";
import { MonitorAttendanceItem } from "./types";
import { useLiveMonitor } from "./hooks/useLiveMonitor";
import { MonitorStatsCards } from "./components/MonitorStatsCards";
import { MonitorFilterBar } from "./components/MonitorFilterBar";
import { MonitorTable } from "./components/MonitorTable";
import { AttendanceDetailModal } from "./components/AttendanceDetailModal";

interface LiveMonitorPageProps {
  currentUser: User;
  initialData?: MonitorAttendanceItem[];
  divisions?: { id: string; name: string }[];
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({
  currentUser,
  initialData = [],
  divisions = [],
}) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const {
    filteredItems,
    stats,
    searchQuery,
    setSearchQuery,
    divisionFilter,
    setDivisionFilter,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    selectedDetail,
    isDetailModalOpen,
    openDetail,
    closeDetail,
    handleDownloadAll,
    handleDownloadSingle,
  } = useLiveMonitor({ initialData, divisions });

  const handleLogout = async () => {
    const authRepo = new AuthRepositoryImpl();
    await authRepo.logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="md:hidden w-full fixed top-0 left-0 z-40 px-4 py-2.5 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Buka menu navigasi"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <BrandLogo size="md" className="flex-shrink-0" />
      </div>

      <AppSidebar
        user={currentUser}
        onLogout={() => setIsLogoutConfirmOpen(true)}
        onChangePassword={() => setIsPasswordModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-12 md:pb-10 pt-20 md:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Manajemen HRD
                </p>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Monitor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Monitoring Presensi Karyawan
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Pantau kehadiran real-time seluruh tim, cek bukti foto, dan
                unduh laporan presensi.
              </p>
            </div>
          </div>

          <MonitorStatsCards stats={stats} />

          <MonitorFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            divisionFilter={divisionFilter}
            onDivisionFilterChange={setDivisionFilter}
            divisions={divisions}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            totalResults={filteredItems.length}
            onDownload={handleDownloadAll}
          />

          <MonitorTable
            items={filteredItems}
            onOpenDetail={openDetail}
          />
        </main>
      </div>

      <AttendanceDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetail}
        item={selectedDetail}
        onDownloadSingle={handleDownloadSingle}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Keluar Akun"
        message="Apakah Anda yakin ingin keluar dari sistem Absenku?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        icon={<LogoutIcon className="w-5 h-5 text-rose-600" />}
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
};
