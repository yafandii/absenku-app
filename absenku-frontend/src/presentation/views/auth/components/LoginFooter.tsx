import React from "react";
import { ShieldSecurityIcon } from "@/presentation/components/common/icons";

export const LoginFooter: React.FC = () => {
  return (
    <>
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldSecurityIcon className="w-3.5 h-3.5 text-indigo-600" />
          Keamanan Data Terenkripsi
        </p>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 tracking-wide font-medium">
        Absenku &bull; Enterprise Workforce Attendance
      </p>
    </>
  );
};
