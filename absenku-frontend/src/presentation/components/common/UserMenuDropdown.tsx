import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "@/presentation/hooks/useDashboard";
import { KeyIcon, LogoutIcon } from "@/presentation/components/common/icons";

interface UserMenuDropdownProps {
  user: UserProfile;
  onLogout: () => void;
  onChangePassword: () => void;
}

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  user,
  onLogout,
  onChangePassword,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHrd = user.role?.toLowerCase() === "hrd";
  const initial = (user.name || "U").charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-950/10 cursor-pointer select-none hover:ring-2 hover:ring-indigo-400/50 transition-all"
        title={user.name || "Akun Saya"}
        aria-expanded={isOpen}
      >
        <span>{initial}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2.5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user.name || "Karyawan"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400">
                NIK: {user.id || "-"}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  isHrd
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isHrd ? "HRD" : "Karyawan"}
              </span>
            </div>
          </div>

          <div className="p-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onChangePassword();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
            >
              <KeyIcon className="w-4 h-4 text-slate-400" />
              <span>Ganti Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
            >
              <LogoutIcon className="w-4 h-4 text-rose-500" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
