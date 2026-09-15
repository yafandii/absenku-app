import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/presentation/hooks/useDashboard";
import { BrandLogo } from "@/presentation/components/common/BrandLogo";
import {
  CameraIcon,
  MonitorIcon,
  UsersIcon,
  LogoutIcon,
  KeyIcon,
  CloseIcon,
} from "@/presentation/components/common/icons";

export interface AppSidebarProps {
  user: UserProfile;
  onLogout: () => void;
  onChangePassword: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  onLogout,
  onChangePassword,
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const isHrd = user.role?.toUpperCase() === "HRD";

  const isAttendanceActive =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isEmployeesActive =
    pathname === "/employees" || pathname.startsWith("/employees/");
  const isMonitorActive =
    pathname === "/live-monitor" || pathname.startsWith("/live-monitor/");

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 h-screen bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between select-none flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          <div className="px-2 pt-1 flex items-center justify-between">
            <BrandLogo size="md" />
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 -mr-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup menu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
                Menu Pribadi
              </p>

              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isAttendanceActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <CameraIcon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isAttendanceActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>Presensi Saya</span>
                </Link>
              </nav>
            </div>

            {isHrd && (
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
                  Pengelolaan Tim
                </p>

                <nav className="space-y-1">
                  <Link
                    href="/employees"
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isEmployeesActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <UsersIcon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isEmployeesActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>Kelola Karyawan</span>
                  </Link>

                  <Link
                    href="/live-monitor"
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isMonitorActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <MonitorIcon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isMonitorActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>Monitoring Presensi</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              onChangePassword();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <KeyIcon className="w-4 h-4 text-slate-400" />
            <span>Ganti Password</span>
          </button>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                suppressHydrationWarning
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p
                    suppressHydrationWarning
                    className="text-xs font-bold text-slate-900 truncate"
                  >
                    {user?.name || "Karyawan"}
                  </p>
                  {isHrd && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      HRD
                    </span>
                  )}
                </div>
                <p
                  suppressHydrationWarning
                  className="text-[11px] text-slate-400 truncate"
                >
                  {user?.division?.name || (user?.id ? `NIK: ${user.id}` : "")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Keluar dari akun"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex-shrink-0"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
