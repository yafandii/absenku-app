"use client";

import React, { useState } from "react";
import { useDashboard } from "@/presentation/hooks/useDashboard";
import { BrandLogo } from "@/presentation/components/common/BrandLogo";
import { ChangePasswordModal } from "@/presentation/components/common/ChangePasswordModal";
import { ConfirmDialog } from "@/presentation/components/common/ConfirmDialog";
import {
  MenuIcon,
  LogoutIcon,
  CameraIcon,
} from "@/presentation/components/common/icons";
import { Sidebar } from "./components/Sidebar";
import { ClockInCard } from "./components/ClockInCard";
import { AttendanceHistoryCard } from "./components/AttendanceHistoryCard";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { User } from "@/domain/entities/user.entity";

interface DashboardPageProps {
  initialUser: User;
  myHistoryAttendance?: AttendanceEntity[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialUser,
  myHistoryAttendance = [],
}) => {
  const {
    user,
    isSubmitting,
    clockInSuccess,
    attendanceRecord,
    recentAttendances,
    camera,
    handleLogout,
    handleClockIn,
    handleRetake,
  } = useDashboard({
    initialUser,
    initialAttendances: myHistoryAttendance,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isClockInConfirmOpen, setIsClockInConfirmOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-50/70 text-slate-800 flex flex-col md:flex-row font-sans relative">
      <div className="md:hidden w-full fixed top-0 left-0 z-40 px-4 py-2.5 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 flex items-center">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 -ml-1.5 mr-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <BrandLogo size="md" />
      </div>

      <Sidebar
        user={user}
        onLogout={() => setIsLogoutConfirmOpen(true)}
        onChangePassword={() => setIsPasswordModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-12 md:pb-10 pt-20 md:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ClockInCard
                isSubmitting={isSubmitting}
                clockInSuccess={clockInSuccess}
                attendanceRecord={attendanceRecord}
                camera={camera}
                onClockIn={() => setIsClockInConfirmOpen(true)}
                onRetake={handleRetake}
              />
            </div>

            <div className="lg:col-span-5">
              <AttendanceHistoryCard attendances={recentAttendances} />
            </div>
          </div>
        </main>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun Absenku?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        icon={<LogoutIcon className="w-5 h-5" />}
        onConfirm={async () => {
          setIsLogoutConfirmOpen(false);
          await handleLogout();
        }}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClockInConfirmOpen}
        title="Konfirmasi Presensi Masuk"
        message="Pastikan foto wajah dan posisi Anda sudah sesuai untuk mencatat kehadiran hari ini."
        confirmText="Ya, Catat Presensi"
        cancelText="Batal"
        variant="primary"
        isLoading={isSubmitting}
        icon={<CameraIcon className="w-5 h-5" />}
        onConfirm={async () => {
          setIsClockInConfirmOpen(false);
          await handleClockIn();
        }}
        onCancel={() => setIsClockInConfirmOpen(false)}
      />
    </div>
  );
};
