"use client";

import React, { useState } from "react";
import { User } from "@/domain/entities/user.entity";
import { AppSidebar } from "@/presentation/components/layout/AppSidebar";
import { BrandLogo } from "@/presentation/components/common/BrandLogo";
import { ChangePasswordModal } from "@/presentation/components/common/ChangePasswordModal";
import { ConfirmDialog } from "@/presentation/components/common/ConfirmDialog";
import { MenuIcon, LogoutIcon } from "@/presentation/components/common/icons";
import { useUserManagement } from "../../hooks/useUserManagement";
import { UserStatsCards } from "./components/UserStatsCards";
import { UserFilterBar } from "./components/UserFilterBar";
import { UserTable } from "./components/UserTable";
import { UserFormModal } from "./components/UserFormModal";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { useRouter } from "next/navigation";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";

interface UserListPageProps {
  currentUser: User;
  initialUsers: User[];
  divisions: BaseMasterEntity[];
}

export const UserListPage: React.FC<UserListPageProps> = ({
  currentUser,
  initialUsers,
  divisions,
}) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const {
    filteredUsers,
    stats,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    isFormModalOpen,
    editingUser,
    formError,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleCreateUser,
    handleUpdateUser,
    isDeleteConfirmOpen,
    deletingUser,
    isDeleting,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
  } = useUserManagement({ initialUsers, divisions });

  const handleLogout = async () => {
    const authRepo = new AuthRepositoryImpl();
    await authRepo.logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <BrandLogo size="md" />
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
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Manajemen HRD
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Kelola Data Karyawan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Atur akun, profil, divisi, dan status aktif seluruh karyawan
              perusahaan.
            </p>
          </div>

          <UserStatsCards
            totalUsers={stats.totalUsers}
            activeUsers={stats.activeUsers}
            hrdCount={stats.hrdCount}
            totalDivisions={stats.totalDivisions}
          />

          <UserFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            onOpenCreateModal={openCreateModal}
          />

          <UserTable
            users={filteredUsers}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
          />
        </main>
      </div>

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        editingUser={editingUser}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        isLoading={isSubmitting}
        error={formError}
        divisions={divisions}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Hapus Data Karyawan"
        message={`Apakah Anda yakin ingin menghapus akun ${deletingUser?.name || deletingUser?.id}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Karyawan"
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
      />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun ini? Sesi Anda saat ini akan diakhiri."
        confirmText="Ya, Keluar"
        cancelText="Tetap Masuk"
        variant="danger"
        icon={<LogoutIcon className="w-6 h-6 text-rose-600" />}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
